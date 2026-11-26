import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

/**
 * Host half of the DeepSeek Status Monitor bundle.
 *
 * The status page (Flashcat-hosted) exposes a public JSON endpoint used by
 * the page itself. Browsers cannot read it directly because it sends no CORS
 * headers, so the Host polls it, normalizes the snapshot, and serves that
 * snapshot to the floating Client widget over the authenticated GUI origin.
 */

const API_PATH = '/deepseek-status/api'
const ACCOUNT_PATH = '/deepseek-status/account'
const USAGE_PATH = '/deepseek-status/usage'
const STATUS_URL =
  'https://status.deepseek.com/api/status-page/6410630422455/summary/active'
const PAGE_URL = 'https://status.deepseek.com/'
const DEEPSEEK_BALANCE_URL = 'https://api.deepseek.com/user/balance'
const POLL_MS = 10 * 60_000
const INCIDENT_POLL_MS = 60_000
const FAILURE_RETRY_MS = 2 * 60_000
const REQUEST_TIMEOUT_MS = 15_000
const STALE_HEALTHY_MS = 20 * 60_000
const STALE_INCIDENT_MS = 5 * 60_000
const MIN_FORCED_REFRESH_MS = 2_000

const PLUGIN_VERSION = '1.1.0'
const ENABLE_ALT_BALANCE_PROVIDERS = false
const ACCOUNT_TTL_MS = 60_000
const USAGE_TTL_MS = 60_000
const USAGE_READ_BATCH = 500
const USAGE_CACHE_VERSION = 1
const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
const USAGE_CACHE_PATH = join(
  DSH_HOME,
  'storages',
  'deepseek-status',
  'usage-cache.v1.json',
)
const PEAK_HOURS = [[9, 12], [14, 18]]
const HOLIDAYS_2026 = new Set([
  '2026-01-01', '2026-01-02', '2026-01-03',
  '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19',
  '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23',
  '2026-04-04', '2026-04-05', '2026-04-06',
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
  '2026-06-19', '2026-06-20', '2026-06-21',
  '2026-09-25', '2026-09-26', '2026-09-27',
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05',
  '2026-10-06', '2026-10-07',
])
const PRICES = {
  CNY: {
    'deepseek-flash': { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
    'deepseek-v4-flash': { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
    'deepseek-v4-flash-vision-exp': { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
    'deepseek-v4-pro': { hit: [0.15, 0.3], miss: [4.5, 9], out: [13.5, 27] },
  },
  USD: {
    'deepseek-flash': { hit: [0.003, 0.006], miss: [0.15, 0.3], out: [0.6, 1.2] },
    'deepseek-v4-flash': { hit: [0.003, 0.006], miss: [0.15, 0.3], out: [0.6, 1.2] },
    'deepseek-v4-flash-vision-exp': { hit: [0.003, 0.006], miss: [0.15, 0.3], out: [0.6, 1.2] },
    'deepseek-v4-pro': { hit: [0.022, 0.044], miss: [0.66, 1.32], out: [1.98, 3.96] },
  },
}

const STATUS_SEVERITY = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  full_outage: 4,
}

const ACTIVE_CHANGE_STATUSES = new Set(['investigating', 'identified', 'monitoring', 'scheduled', 'ongoing', 'in_progress'])
const FINISHED_CHANGE_STATUSES = new Set(['resolved', 'completed', 'cancelled'])

export const inject = ['webServer']

export function apply(ctx) {
  let snapshot = emptySnapshot()
  let refreshInFlight = null
  let activeController = null
  let lastAttempt = 0

  const getSnapshot = () => {
    const now = Date.now()
    const ageMs = snapshot.fetchedAt ? Math.max(0, now - snapshot.fetchedAt) : null
    const staleAfter = isUrgent(snapshot) ? STALE_INCIDENT_MS : STALE_HEALTHY_MS
    return {
      ...snapshot,
      ageMs,
      stale: snapshot.stale || (ageMs !== null && ageMs > staleAfter),
    }
  }

  const refresh = (force = false) => {
    if (refreshInFlight) return refreshInFlight
    if (!force && Date.now() - lastAttempt < 5_000) {
      return Promise.resolve(getSnapshot())
    }

    lastAttempt = Date.now()
    const controller = new AbortController()
    activeController = controller
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    const operation = (async () => {
      try {
        const response = await fetch(STATUS_URL, {
          signal: controller.signal,
          headers: {
            accept: 'application/json',
            'user-agent': 'dsh-deepseek-status/1.0',
          },
        })
        if (!response.ok) throw upstreamError(`http-${response.status}`)
        const payload = await response.json()
        const normalized = normalizeStatusPayload(payload)
        const fetchedAt = Date.now()
        snapshot = {
          ...normalized,
          fetchedAt,
          checkedAt: fetchedAt,
          stale: false,
          upstreamOk: true,
          error: null,
        }
      } catch (error) {
        snapshot = {
          ...snapshot,
          checkedAt: Date.now(),
          stale: !snapshot.fetchedAt,
          upstreamOk: false,
          error: describeFailure(error, timedOut),
        }
      } finally {
        clearTimeout(timeout)
        if (activeController === controller) activeController = null
        refreshInFlight = null
      }
      return getSnapshot()
    })()

    refreshInFlight = operation
    return operation
  }

  const handler = async (req, res) => {
    const connection = ctx.get('connection')
    if (connection) {
      const rejection = connection.requestRejection({ headers: req.headers })
      if (rejection) {
        sendJson(res, rejection, { ok: false, error: 'unauthorized' })
        return
      }
    }

    const url = new URL(req.url || API_PATH, 'http://deepseek-status.local')
    if (url.pathname !== API_PATH) {
      sendJson(res, 404, { ok: false, error: 'not-found' })
      return
    }
    if (req.method !== 'GET') {
      sendJson(res, 405, { ok: false, error: 'method-not-allowed' }, { allow: 'GET' })
      return
    }

    if (url.searchParams.get('refresh') === '1') {
      const tooSoon = Date.now() - lastAttempt < MIN_FORCED_REFRESH_MS && snapshot.fetchedAt
      if (!tooSoon) await refresh(true)
    } else if (!snapshot.fetchedAt && !refreshInFlight) {
      // First client can arrive before the initial poll settles; kick it off
      // without holding the request open.
      void refresh(false)
    }

    sendJson(res, 200, { ok: true, ...getSnapshot() })
  }

  ctx.effect(
    () => ctx.webServer.register({ kind: 'exact', path: API_PATH, handler }),
    'deepseek-status: authenticated snapshot API',
  )

  const accountSnapshot = createAccountSnapshot(ctx)
  const usageLedger = createUsageLedger(ctx)

  const accountHandler = async (req, res) => {
    const connection = ctx.get('connection')
    if (connection) {
      const rejection = connection.requestRejection({ headers: req.headers })
      if (rejection) {
        sendJson(res, rejection, { ok: false, error: 'unauthorized' })
        return
      }
    }
    const url = new URL(req.url || ACCOUNT_PATH, 'http://deepseek-status.local')
    if (url.pathname !== ACCOUNT_PATH) {
      sendJson(res, 404, { ok: false, error: 'not-found' })
      return
    }
    if (req.method !== 'GET') {
      sendJson(res, 405, { ok: false, error: 'method-not-allowed' }, { allow: 'GET' })
      return
    }
    const locale = url.searchParams.get('locale') || 'zh-CN'
    const timezoneOffsetSeconds = Number(url.searchParams.get('tz')) || 480
    const force = url.searchParams.get('refresh') === '1'
    sendJson(res, 200, await accountSnapshot.read({ locale, timezoneOffsetSeconds, force }))
  }

  const usageHandler = async (req, res) => {
    const connection = ctx.get('connection')
    if (connection) {
      const rejection = connection.requestRejection({ headers: req.headers })
      if (rejection) {
        sendJson(res, rejection, { ok: false, error: 'unauthorized' })
        return
      }
    }
    const url = new URL(req.url || USAGE_PATH, 'http://deepseek-status.local')
    if (url.pathname !== USAGE_PATH) {
      sendJson(res, 404, { ok: false, error: 'not-found' })
      return
    }
    if (req.method !== 'GET') {
      sendJson(res, 405, { ok: false, error: 'method-not-allowed' }, { allow: 'GET' })
      return
    }
    const currency = url.searchParams.get('currency') === 'USD' ? 'USD' : 'CNY'
    const force = url.searchParams.get('refresh') === '1'
    sendJson(res, 200, await usageLedger.read({ currency, force }))
  }

  ctx.effect(
    () => ctx.webServer.register({ kind: 'exact', path: ACCOUNT_PATH, handler: accountHandler }),
    'deepseek-status: account snapshot API',
  )
  ctx.effect(
    () => ctx.webServer.register({ kind: 'exact', path: USAGE_PATH, handler: usageHandler }),
    'deepseek-status: session usage API',
  )

  ctx.effect(() => {
    let stopped = false
    let timer = null

    const loop = async () => {
      await refresh(false)
      if (stopped) return
      const delay = !snapshot.upstreamOk
        ? FAILURE_RETRY_MS
        : isUrgent(snapshot)
          ? INCIDENT_POLL_MS
          : POLL_MS
      timer = setTimeout(loop, delay)
    }

    void loop()
    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
      activeController?.abort()
    }
  }, 'deepseek-status: upstream poller')
}

async function readApiKeyBalance(credentials) {
  let credential
  try {
    credential = await credentials.resolve('DEEPSEEK_API_KEY')
  } catch {
    return null
  }
  const key = typeof credential === 'string' ? credential : credential?.value
  if (!key) return null
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8_000)
  try {
    const response = await fetch(DEEPSEEK_BALANCE_URL, {
      headers: { accept: 'application/json', authorization: `Bearer ${key}` },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`http-${response.status}`)
    const data = await response.json()
    const infos = Array.isArray(data?.balance_infos) ? data.balance_infos : []
    const usable = infos.filter((info) => info && Number.isFinite(Number(info.total_balance)))
    if (!usable.length) throw new Error('balance-unavailable')
    const chosen =
      usable.find((info) => String(info.currency).toUpperCase() === 'CNY' && Number(info.total_balance) > 0) ||
      usable.find((info) => Number(info.total_balance) > 0) ||
      usable.find((info) => String(info.currency).toUpperCase() === 'CNY') ||
      usable[0]
    const currency = String(chosen.currency).toUpperCase() === 'USD' ? 'USD' : 'CNY'
    const totalMicros = decimalMicros(chosen.total_balance)
    const rechargeMicros = decimalMicros(chosen.topped_up_balance)
    const bonusMicros = decimalMicros(chosen.granted_balance)
    return {
      source: 'deepseek-api',
      signedIn: true,
      currency,
      balance: { totalMicros, rechargeMicros, bonusMicros },
      fetchedAt: Date.now(),
    }
  } finally {
    clearTimeout(timer)
  }
}

async function resolveCredential(credentials, names) {
  if (!credentials || typeof credentials.resolve !== 'function') return null
  for (const name of names) {
    try {
      const credential = await credentials.resolve(name)
      const key = typeof credential === 'string' ? credential : credential?.value
      if (key) return key
    } catch {
      // Try the next alias.
    }
  }
  return null
}

async function fetchJson(url, headers, timeoutMs = 8_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { headers, signal: controller.signal })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function readKimiBalance(credentials) {
  const key = await resolveCredential(credentials, ['MOONSHOT_API_KEY', 'KIMI_API_KEY'])
  if (!key) return null
  const configured = process.env.MOONSHOT_BASE_URL
  const bases = [
    configured,
    'https://api.moonshot.cn/v1',
    'https://api.moonshot.ai/v1',
  ].filter(Boolean)
  for (const base of new Set(bases)) {
    const normalized = String(base).replace(/\/+$/, '')
    const url = normalized.endsWith('/v1')
      ? `${normalized}/users/me/balance`
      : `${normalized}/v1/users/me/balance`
    const data = await fetchJson(url, {
      accept: 'application/json',
      authorization: `Bearer ${key}`,
    })
    if (!data || data.code !== 0 || !data.data) continue
    const available = Number(data.data.available_balance)
    if (!Number.isFinite(available)) continue
    const cash = Number(data.data.cash_balance)
    const voucher = Number(data.data.voucher_balance)
    const currency = normalized.includes('moonshot.cn') ? 'CNY' : 'USD'
    return {
      source: 'kimi',
      signedIn: true,
      currency,
      balance: {
        totalMicros: decimalMicros(available),
        rechargeMicros: Number.isFinite(cash) ? decimalMicros(cash) : 0,
        bonusMicros: Number.isFinite(voucher) ? decimalMicros(voucher) : 0,
      },
      fetchedAt: Date.now(),
    }
  }
  return null
}

function providerNumber(value, keys) {
  if (!value || typeof value !== 'object') return null
  for (const key of keys) {
    const candidate = value[key]
    if (candidate !== null && candidate !== undefined && String(candidate).trim() !== '') {
      const number = Number(candidate)
      if (Number.isFinite(number)) return number
    }
  }
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      const number = providerNumber(child, keys)
      if (number !== null) return number
    }
  }
  return null
}

async function readZhipuBalance(credentials) {
  const key = await resolveCredential(credentials, ['ZHIPU_API_KEY', 'GLM_API_KEY', 'ZHIPUAI_API_KEY'])
  if (!key) return null
  const hosts = [
    { origin: 'https://open.bigmodel.cn', currency: 'CNY', modes: ['raw', 'bearer'] },
    { origin: 'https://api.z.ai', currency: 'USD', modes: ['bearer'] },
  ]
  for (const host of hosts) {
    for (const mode of host.modes) {
      const data = await fetchJson(`${host.origin}/api/biz/account/query-customer-account-report`, {
        accept: 'application/json',
        authorization: mode === 'bearer' ? `Bearer ${key}` : key,
      })
      if (!data || data.success === false) continue
      const code = Number(data.code)
      if (Number.isFinite(code) && code !== 0 && code !== 200) continue
      const payload = data.data && typeof data.data === 'object' ? data.data : data
      const available = providerNumber(payload, ['availableBalance', 'available_balance', 'balance', 'totalBalance', 'total_balance'])
      if (available === null) continue
      const recharge = providerNumber(payload, ['rechargeAmount', 'recharge_amount', 'cashBalance', 'cash_balance', 'toppedUpBalance', 'topped_up_balance'])
      const bonus = providerNumber(payload, ['giveAmount', 'giftBalance', 'gift_balance', 'grantedBalance', 'granted_balance'])
      const currency = String(payload.currency || host.currency).toUpperCase() === 'USD' ? 'USD' : 'CNY'
      return {
        source: 'zhipu',
        signedIn: true,
        currency,
        balance: {
          totalMicros: decimalMicros(available),
          rechargeMicros: recharge === null ? 0 : decimalMicros(recharge),
          bonusMicros: bonus === null ? 0 : decimalMicros(bonus),
        },
        fetchedAt: Date.now(),
      }
    }
  }
  return null
}

function createAccountSnapshot(ctx) {
  let cache = null
  let inFlight = null
  let lastError = null

  const payload = (stale) => {
    const now = Date.now()
    if (!cache) {
      return {
        ok: true,
        available: true,
        signedIn: false,
        source: null,
        currency: 'CNY',
        balance: null,
        period: currentPeriod(now),
        fetchedAt: 0,
        stale: false,
        error: lastError,
      }
    }
    return {
      ok: true,
      available: true,
      signedIn: cache.signedIn,
      source: cache.source || null,
      currency: cache.currency || 'CNY',
      balance: cache.balance,
      period: currentPeriod(now),
      fetchedAt: cache.fetchedAt,
      stale: Boolean(stale),
      error: lastError,
    }
  }

  const read = async ({ locale, timezoneOffsetSeconds, force }) => {
    const now = Date.now()
    const fresh = cache && now - cache.fetchedAt < ACCOUNT_TTL_MS
    if (!force && fresh && !lastError) return payload(false)
    if (inFlight) return inFlight

    const account = ctx.get('deepseekAccount')
    const credentials = ctx.get('credentials')
    if ((!account || typeof account.getBalance !== 'function') && (!credentials || typeof credentials.resolve !== 'function')) {
      return { ok: true, available: false, signedIn: false, source: null, balance: null, currency: 'CNY', period: currentPeriod(now), fetchedAt: 0, stale: false, error: 'unavailable' }
    }

    inFlight = (async () => {
      try {
        if (credentials && typeof credentials.resolve === 'function') {
          try {
            const apiBalance = await readApiKeyBalance(credentials)
            if (apiBalance) {
              cache = apiBalance
              lastError = null
              return payload(false)
            }
          } catch {
            // Fall through to the DSH account.
          }
        }

        if (account && typeof account.getBalance === 'function') {
          try {
            const detail = await account.getBalance({
              version: PLUGIN_VERSION,
              locale: typeof locale === 'string' && locale ? locale.slice(0, 32) : 'zh-CN',
              timezoneOffsetSeconds: Math.round(clamp(Number(timezoneOffsetSeconds) || 480, -86_400, 86_400)),
            })
            if (detail && detail.status === 'ready') {
              const wallets = Array.isArray(detail.value) ? detail.value : []
              const bonuses = Array.isArray(detail.bonusWallets) ? detail.bonusWallets : []
              const selected = selectWallet(wallets, bonuses)
              cache = {
                source: 'deepseek-account',
                signedIn: true,
                currency: selected.currency,
                balance: {
                  totalMicros: selected.rechargeMicros + selected.bonusMicros,
                  rechargeMicros: selected.rechargeMicros,
                  bonusMicros: selected.bonusMicros,
                },
                fetchedAt: Date.now(),
              }
              lastError = null
              return payload(false)
            }
          } catch {
            // Fall through to Kimi / Zhipu.
          }
        }

        if (ENABLE_ALT_BALANCE_PROVIDERS && credentials && typeof credentials.resolve === 'function') {
          // Reserved for the future multi-provider balance selector. Kimi and
          // Zhipu adapters stay implemented but disabled in the v1.1 build.
          const kimi = await readKimiBalance(credentials)
          if (kimi) {
            cache = kimi
            lastError = null
            return payload(false)
          }
          const zhipu = await readZhipuBalance(credentials)
          if (zhipu) {
            cache = zhipu
            lastError = null
            return payload(false)
          }
        }

        lastError = 'balance'
        return payload(Boolean(cache))
      } catch {
        lastError = 'balance'
        return payload(Boolean(cache))
      } finally {
        inFlight = null
      }
    })()
    return inFlight
  }

  return { read }
}

function createUsageLedger(ctx) {
  let cache = emptyUsageCache()
  let loaded = false
  let loadPromise = null
  let scanPromise = null
  let scanning = false
  let progress = { done: 0, total: 0 }
  let error = null

  const ensureLoaded = async () => {
    if (loaded) return
    if (loadPromise) return loadPromise
    loadPromise = (async () => {
      try {
        const raw = await readFile(USAGE_CACHE_PATH, 'utf8')
        const parsed = JSON.parse(raw)
        if (parsed && parsed.version === USAGE_CACHE_VERSION && parsed.sessions && typeof parsed.sessions === 'object') {
          cache = {
            version: USAGE_CACHE_VERSION,
            savedAt: Number(parsed.savedAt) || 0,
            sessions: parsed.sessions,
          }
        }
      } catch {
        // A missing, corrupt, or stale cache simply rebuilds.
      } finally {
        loaded = true
        loadPromise = null
      }
    })()
    return loadPromise
  }

  const saveCache = async () => {
    try {
      await mkdir(dirname(USAGE_CACHE_PATH), { recursive: true })
      const temporary = `${USAGE_CACHE_PATH}.${process.pid}.tmp`
      await writeFile(temporary, JSON.stringify(cache), 'utf8')
      await rename(temporary, USAGE_CACHE_PATH)
    } catch {
      // The in-memory index still serves this process.
    }
  }

  const startScan = () => {
    if (scanPromise) return scanPromise
    scanning = true
    progress = { done: 0, total: 0 }
    error = null
    scanPromise = (async () => {
      try {
        const persistence = ctx.get('sessionPersistence')
        if (!persistence || typeof persistence.list !== 'function' || typeof persistence.open !== 'function') {
          error = 'unavailable'
          return
        }
        const snapshots = await persistence.list()
        progress = { done: 0, total: snapshots.length }
        const next = {}
        for (const snapshot of snapshots) {
          const id = String(snapshot?.header?.id || '')
          if (!id) {
            progress.done += 1
            continue
          }
          const previous = cache.sessions?.[id]
          const revision = String(snapshot.revision ?? '')
          const entry = previous && typeof previous === 'object'
            ? {
                revision: String(previous.revision || ''),
                eventCount: Math.max(0, Number(previous.eventCount) || 0),
                days: previous.days && typeof previous.days === 'object' ? previous.days : {},
                meta: previous.meta && typeof previous.meta === 'object' ? previous.meta : null,
              }
            : { revision: '', eventCount: 0, days: {}, meta: null }
          entry.meta = {
            parentSession: snapshot.header?.parentSession ? String(snapshot.header.parentSession) : null,
            origin: snapshot.header?.origin === 'subagent' ? 'subagent' : null,
            delegationDepth: Number(snapshot.header?.delegationDepth) || 0,
          }
          const knownCount = Number.isFinite(Number(snapshot.eventCount)) ? Number(snapshot.eventCount) : null
          if (knownCount !== null && entry.eventCount > knownCount) {
            entry.eventCount = 0
            entry.days = {}
          }
          const unchanged = entry.revision === revision && (knownCount === null || entry.eventCount >= knownCount)
          if (!unchanged) {
            await readSessionDelta(persistence, snapshot, entry)
          }
          entry.revision = revision
          next[id] = entry
          progress.done += 1
          if (progress.done % 4 === 0) await yieldToHost()
        }
        cache = { version: USAGE_CACHE_VERSION, savedAt: Date.now(), sessions: next }
        await saveCache()
      } catch {
        error = 'usage'
      } finally {
        scanning = false
        scanPromise = null
      }
    })()
    return scanPromise
  }

  const read = async ({ currency, force }) => {
    await ensureLoaded()
    const now = Date.now()
    const stale = !cache.savedAt || now - cache.savedAt > USAGE_TTL_MS
    if ((force || stale || !cache.savedAt) && !scanning) {
      void startScan()
    }
    const snapshot = await buildUsageSnapshot(ctx, cache, currency)
    return {
      ok: true,
      ...snapshot,
      fetchedAt: cache.savedAt || 0,
      building: scanning && !cache.savedAt,
      refreshing: scanning,
      progress,
      error,
    }
  }

  return { read }
}

async function readSessionDelta(persistence, snapshot, entry) {
  const id = snapshot.header.id
  let handle = null
  try {
    handle = await persistence.open(id, 'read')
    const inherited = Number(handle.inheritedEventCount) || 0
    const knownCount = Number.isFinite(Number(snapshot.eventCount)) ? Number(snapshot.eventCount) : null
    let offset = entry.eventCount
    if (knownCount !== null && offset > knownCount) {
      offset = 0
      entry.days = {}
    }
    while (true) {
      const result = await handle.read(offset, USAGE_READ_BATCH)
      const events = Array.isArray(result?.events) ? result.events : []
      if (!events.length) break
      for (const event of events) {
        if (Number(event.seq) < inherited) continue
        foldUsageEvent(entry, event)
      }
      const last = events[events.length - 1]
      offset = Number(last?.seq) + 1
      await yieldToHost()
    }
    entry.eventCount = offset
  } catch {
    // A single unreadable session must not invalidate the whole index.
  } finally {
    if (handle) {
      try {
        await handle.close()
      } catch {
        // Best-effort handle cleanup.
      }
    }
  }
}

function foldUsageEvent(entry, event) {
  if (!event || event.type !== 'assistant/message') return
  const data = event.data
  if (!data || typeof data !== 'object') return
  const usage = data.usage
  if (!usage || typeof usage !== 'object') return
  const input = usageNumber(usage.inputTokens)
  const cacheRead = usageNumber(usage.cacheReadTokens)
  const output = usageNumber(usage.outputTokens)
  if (!input && !cacheRead && !output) return
  const day = beijingDayKey(event.time)
  const period = isPeakAt(event.time) ? 'peak' : 'offpeak'
  const model = typeof data.message?.source?.model === 'string' && data.message.source.model
    ? data.message.source.model.trim().toLowerCase()
    : 'unknown'
  entry.days[day] ??= {}
  entry.days[day][period] ??= {}
  const bucket = entry.days[day][period][model] ?? { i: 0, c: 0, o: 0 }
  bucket.i += input
  bucket.c += cacheRead
  bucket.o += output
  entry.days[day][period][model] = bucket
}

async function buildUsageSnapshot(ctx, cache, currency) {
  const todayKey = beijingDayKey(Date.now())
  const sessions = cache.sessions && typeof cache.sessions === 'object' ? cache.sessions : {}
  const meta = new Map()
  for (const [id, entry] of Object.entries(sessions)) {
    meta.set(id, entry?.meta && typeof entry.meta === 'object' ? entry.meta : {})
  }

  const rootOf = (id) => {
    let current = id
    const seen = new Set()
    while (!seen.has(current)) {
      seen.add(current)
      const item = meta.get(current)
      if (!item) break
      const isSubagent = item.origin === 'subagent' || Number(item.delegationDepth) > 0
      const parent = item.parentSession ? String(item.parentSession) : ''
      if (!isSubagent || !parent || !meta.has(parent)) break
      current = parent
    }
    return current
  }

  const totals = new Map()
  for (const [id, entry] of Object.entries(sessions)) {
    const item = meta.get(id) || {}
    const root = item.origin === 'subagent' || Number(item.delegationDepth) > 0 ? rootOf(id) : id
    const current = totals.get(root) || { totalMicros: 0, todayMicros: 0, partial: false }
    const all = tokenCost(entry, currency)
    const today = tokenCost(entry, currency, todayKey)
    current.totalMicros += all.micros
    current.todayMicros += today.micros
    current.partial = current.partial || all.partial || today.partial
    totals.set(root, current)
  }

  const rank = (key) =>
    [...totals.entries()]
      .map(([id, value]) => ({
        id,
        title: null,
        amountMicros: Math.max(0, Math.round(value[key])),
        partial: Boolean(value.partial),
      }))
      .filter((item) => item.amountMicros > 0)
      .sort((left, right) => right.amountMicros - left.amountMicros || left.id.localeCompare(right.id))
      .slice(0, 3)

  const today = rank('todayMicros')
  const total = rank('totalMicros')
  const ids = [...new Set([...today, ...total].map((item) => item.id))]
  const titles = await readTitles(ctx, ids)
  for (const item of [...today, ...total]) {
    const title = titles.get(item.id)
    if (title) item.title = title
  }
  return { currency, estimated: true, today, total }
}

async function readTitles(ctx, ids) {
  const titles = new Map()
  if (!ids.length) return titles
  try {
    const query = ctx.get('sessionQuery')
    if (!query || typeof query.readTitleSnapshots !== 'function') return titles
    const values = await query.readTitleSnapshots(ids)
    for (const result of Array.isArray(values) ? values : []) {
      if (result?.status !== 'fulfilled') continue
      const title = result.value?.title?.title
      if (typeof title === 'string' && title.trim()) titles.set(result.sessionId, title.trim().slice(0, 120))
    }
  } catch {
    // Titles are presentation-only.
  }
  return titles
}

function tokenCost(entry, currency, onlyDay = null) {
  const prices = PRICES[currency] || PRICES.CNY
  let micros = 0
  let partial = false
  const days = entry?.days && typeof entry.days === 'object' ? entry.days : {}
  for (const [day, periods] of Object.entries(days)) {
    if (onlyDay && day !== onlyDay) continue
    for (const [period, models] of Object.entries(periods || {})) {
      const peakIndex = period === 'peak' ? 1 : 0
      for (const [model, bucket] of Object.entries(models || {})) {
        const price = prices[model]
        if (!price) {
          partial = true
          continue
        }
        const input = usageNumber(bucket?.i)
        const cacheRead = usageNumber(bucket?.c)
        const output = usageNumber(bucket?.o)
        micros += input * price.miss[peakIndex]
        micros += cacheRead * price.hit[peakIndex]
        micros += output * price.out[peakIndex]
      }
    }
  }
  return { micros: Math.round(micros), partial }
}

function selectWallet(normal, bonus) {
  const currencies = []
  for (const wallet of [...normal, ...bonus]) {
    if (wallet && (wallet.currency === 'CNY' || wallet.currency === 'USD') && !currencies.includes(wallet.currency)) {
      currencies.push(wallet.currency)
    }
  }
  const currency = currencies.includes('CNY') ? 'CNY' : currencies.includes('USD') ? 'USD' : 'CNY'
  const sum = (wallets) => wallets
    .filter((wallet) => wallet?.currency === currency)
    .reduce((total, wallet) => total + decimalMicros(wallet.balance), 0)
  return {
    currency,
    rechargeMicros: Math.max(0, sum(normal)),
    bonusMicros: Math.max(0, sum(bonus)),
  }
}

function decimalMicros(value) {
  const text = String(value ?? '').trim()
  const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d+))?$/i.exec(text)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  const integer = match[2] || '0'
  const fraction = match[3] ?? match[4] ?? ''
  const exponent = Number(match[5]) || 0
  const digits = `${integer}${fraction}`.replace(/^0+/, '') || '0'
  if (digits === '0') return 0
  const scale = fraction.length - exponent
  let micros
  if (scale <= 6) {
    micros = BigInt(digits) * 10n ** BigInt(6 - scale)
  } else {
    micros = BigInt(digits) / 10n ** BigInt(scale - 6)
  }
  const result = Number(micros) * sign
  return Number.isSafeInteger(result) ? result : sign * Number.MAX_SAFE_INTEGER
}

function emptyUsageCache() {
  return { version: USAGE_CACHE_VERSION, savedAt: 0, sessions: {} }
}

function currentPeriod(now = Date.now()) {
  return isPeakAt(now) ? 'peak' : 'offpeak'
}

function isPeakAt(time) {
  const n = Number(time)
  if (!Number.isFinite(n)) return false
  const date = new Date(n + 8 * 3600_000)
  const day = date.getUTCDay()
  if (day === 0 || day === 6) return false
  const key = date.toISOString().slice(0, 10)
  if (HOLIDAYS_2026.has(key)) return false
  const hour = date.getUTCHours()
  return PEAK_HOURS.some(([start, end]) => hour >= start && hour < end)
}

function beijingDayKey(time) {
  const n = Number(time)
  const safe = Number.isFinite(n) ? n : Date.now()
  return new Date(safe + 8 * 3600_000).toISOString().slice(0, 10)
}

function usageNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function yieldToHost() {
  return new Promise((resolve) => setImmediate(resolve))
}

function emptySnapshot() {
  return {
    status: 'unknown',
    counts: { operational: 0, maintenance: 0, degraded: 0, partial_outage: 0, full_outage: 0 },
    total: 0,
    components: [],
    groups: [],
    activeChanges: [],
    page: { name: 'DeepSeek', url: PAGE_URL },
    fetchedAt: 0,
    checkedAt: 0,
    stale: true,
    upstreamOk: false,
    error: null,
  }
}

function normalizeStatusPayload(payload) {
  const data = payload?.data
  const page = data?.page
  if (!page || !Array.isArray(page.components)) throw upstreamError('invalid-payload')

  const now = Date.now()
  const sections = Array.isArray(page.sections)
    ? page.sections
        .filter((section) => section && typeof section.section_id === 'string')
        .sort((left, right) => number(left.order_id) - number(right.order_id))
    : []
  const sectionById = new Map(sections.map((section) => [section.section_id, section]))
  const activeChanges = normalizeActiveChanges(data?.active_changes, now)

  const pageComponents = page.components
    .filter((component) => component && typeof component.component_id === 'string')
    .map((component) => {
      const section = component.section_id ? sectionById.get(component.section_id) : undefined
      return {
        id: component.component_id,
        name: string(component.name) || component.component_id,
        description: string(component.description),
        sectionId: string(component.section_id) || null,
        sectionName: section ? string(section.name) : null,
        order: number(component.order_id),
        status: componentStatus(component.component_id, activeChanges),
      }
    })

  // Include a component that is affected but absent from the page catalog so
  // an incident can never be silently hidden by a stale component list.
  const known = new Set(pageComponents.map((component) => component.id))
  for (const change of activeChanges) {
    for (const affected of change.affected) {
      if (!affected.id || known.has(affected.id)) continue
      known.add(affected.id)
      const section = affected.sectionId ? sectionById.get(affected.sectionId) : undefined
      pageComponents.push({
        id: affected.id,
        name: affected.name || affected.id,
        description: '',
        sectionId: affected.sectionId || null,
        sectionName: section ? string(section.name) : null,
        order: 0,
        status: componentStatus(affected.id, activeChanges),
      })
    }
  }

  const counts = {
    operational: 0,
    maintenance: 0,
    degraded: 0,
    partial_outage: 0,
    full_outage: 0,
  }
  for (const component of pageComponents) {
    counts[component.status] = (counts[component.status] || 0) + 1
  }

  const status = overallStatus(activeChanges, counts)

  const standalone = pageComponents
    .filter((component) => !component.sectionId)
    .sort(compareComponents)
  const groups = []
  if (standalone.length) {
    groups.push({ id: 'standalone', kind: 'standalone', name: null, components: standalone })
  }
  for (const section of sections) {
    const members = pageComponents
      .filter((component) => component.sectionId === section.section_id)
      .sort(compareComponents)
    if (members.length) {
      groups.push({
        id: `section:${section.section_id}`,
        kind: 'section',
        name: string(section.name),
        components: members,
      })
    }
  }
  const groupedIds = new Set(groups.flatMap((group) => group.components.map((component) => component.id)))
  const ungrouped = pageComponents.filter((component) => !groupedIds.has(component.id)).sort(compareComponents)
  if (ungrouped.length) {
    groups.push({ id: 'other', kind: 'standalone', name: null, components: ungrouped })
  }

  return {
    status,
    counts,
    total: pageComponents.length,
    components: [...pageComponents].sort(compareComponents),
    groups,
    activeChanges,
    page: {
      name: string(page.name) || 'DeepSeek',
      url: PAGE_URL,
    },
  }
}

function normalizeActiveChanges(rawChanges, now) {
  const changes = []
  const seen = new Set()
  for (const raw of Array.isArray(rawChanges) ? rawChanges : []) {
    if (!raw || raw.change_id === undefined || raw.change_id === null) continue
    const id = String(raw.change_id)
    if (!id || seen.has(id)) continue

    const status = string(raw.status)
    if (FINISHED_CHANGE_STATUSES.has(status)) continue
    const startedAt = toMilliseconds(raw.start_at_seconds) || now
    if (status === 'scheduled' && startedAt > now) continue
    if (!ACTIVE_CHANGE_STATUSES.has(status) && !status) continue

    const updates = Array.isArray(raw.updates) ? raw.updates : []
    let latestUpdate = null
    for (const update of updates) {
      if (!update) continue
      const at = toMilliseconds(update.at_seconds)
      if (!latestUpdate || at > latestUpdate.at) latestUpdate = { at, update }
    }

    const affectedSource =
      Array.isArray(raw.affected_components) && raw.affected_components.length
        ? raw.affected_components
        : Array.isArray(latestUpdate?.update?.component_changes)
          ? latestUpdate.update.component_changes
          : []
    const affected = []
    const affectedSeen = new Set()
    for (const item of affectedSource) {
      const componentId = string(item?.component_id)
      if (!componentId || affectedSeen.has(componentId)) continue
      affectedSeen.add(componentId)
      affected.push({
        id: componentId,
        name: string(item.name) || componentId,
        sectionId: string(item.section_id) || null,
        status: normalizeStatus(item.status),
      })
    }

    seen.add(id)
    changes.push({
      id,
      type: raw.type === 'maintenance' ? 'maintenance' : 'incident',
      title: string(raw.title) || (raw.type === 'maintenance' ? 'Scheduled maintenance' : 'Service incident'),
      status: status || 'investigating',
      startedAt,
      updatedAt: Math.max(startedAt, latestUpdate?.at || 0),
      affected,
      affectedCount: affected.length,
    })
  }
  return changes.sort((left, right) => right.startedAt - left.startedAt)
}

function componentStatus(componentId, activeChanges) {
  let status = 'operational'
  for (const change of activeChanges) {
    for (const affected of change.affected) {
      if (affected.id !== componentId) continue
      if (change.type === 'maintenance') {
        if (affected.status === 'maintenance') status = worstStatus(status, 'maintenance')
        continue
      }
      if (affected.status === 'degraded' || affected.status === 'partial_outage' || affected.status === 'full_outage') {
        status = worstStatus(status, affected.status)
      }
    }
  }
  return status
}

function isUrgent(snapshot) {
  if (snapshot.status === 'degraded' || snapshot.status === 'partial_outage' || snapshot.status === 'full_outage') {
    return true
  }
  return Array.isArray(snapshot.activeChanges) && snapshot.activeChanges.some((change) => change.type === 'incident')
}

function overallStatus(activeChanges, counts) {  const incidents = activeChanges.filter((change) => change.type === 'incident')
  const maintenance = activeChanges.filter((change) => change.type === 'maintenance')
  let worst = 'operational'

  for (const change of activeChanges) {
    for (const affected of change.affected) {
      if (change.type === 'maintenance') {
        if (affected.status === 'maintenance') worst = worstStatus(worst, 'maintenance')
      } else if (
        affected.status === 'degraded' ||
        affected.status === 'partial_outage' ||
        affected.status === 'full_outage'
      ) {
        worst = worstStatus(worst, affected.status)
      }
    }
  }

  // Mirrors the status page: an open incident with no affected components still
  // means something is being investigated, so do not present it as healthy.
  if (incidents.length && (worst === 'operational' || worst === 'maintenance')) return 'partial_outage'
  if (!incidents.length && maintenance.length && worst === 'operational') return 'maintenance'
  if (worst === 'operational' && counts.full_outage) return 'full_outage'
  if (worst === 'operational' && counts.partial_outage) return 'partial_outage'
  if (worst === 'operational' && counts.degraded) return 'degraded'
  return worst
}

function normalizeStatus(value) {
  if (value === 'under_maintenance' || value === 'maintenance') return 'maintenance'
  if (value === 'full_outage' || value === 'partial_outage' || value === 'degraded' || value === 'operational') {
    return value
  }
  return 'operational'
}

function worstStatus(left, right) {
  return (STATUS_SEVERITY[right] || 0) > (STATUS_SEVERITY[left] || 0) ? right : left
}

function compareComponents(left, right) {
  return left.order - right.order || left.name.localeCompare(right.name)
}

function describeFailure(error, timedOut) {
  if (timedOut) return 'timeout'
  const message = string(error?.message)
  if (message.startsWith('http-') || message === 'invalid-payload') return message
  return 'network'
}

function upstreamError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

function string(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function number(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function toMilliseconds(seconds) {
  const value = Number(seconds)
  return Number.isFinite(value) && value > 0 ? Math.round(value * 1000) : 0
}

function sendJson(res, status, value, extraHeaders = {}) {
  if (res.headersSent) return
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
    ...extraHeaders,
  })
  res.end(body)
}
