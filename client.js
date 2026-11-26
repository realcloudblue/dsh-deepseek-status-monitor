window.__ModuleLoader__.load({
  id: 'dsh-deepseek-status-monitor',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'deepseek-status'
    const API_PATH = '/deepseek-status/api'
    const ACCOUNT_PATH = '/deepseek-status/account'
    const USAGE_PATH = '/deepseek-status/usage'
    const PAGE_URL = 'https://status.deepseek.com/'
    const POSITION_KEY = 'deepseek-status.position.v1'
    const PRIVACY_KEY = 'deepseek-status.privacy.v1'

    const DICT_EN = {
      'panel.title': 'DeepSeek Status',
      'panel.subtitle': 'status.deepseek.com',
      'pill.brand': 'DeepSeek',
      'status.operational': 'Operational',
      'status.operationalDesc': 'All systems are operating normally.',
      'status.degraded': 'Degraded performance',
      'status.degradedDesc': 'Some services are experiencing degraded performance.',
      'status.partial_outage': 'Partial outage',
      'status.partial_outageDesc': 'Some services are experiencing issues.',
      'status.full_outage': 'Major outage',
      'status.full_outageDesc': 'Critical services are down.',
      'status.maintenance': 'Under maintenance',
      'status.maintenanceDesc': 'Scheduled maintenance is in progress.',
      'status.unknown': 'Status unavailable',
      'status.unknownDesc': 'The latest status could not be checked.',
      'status.checking': 'Checking status…',
      'status.checkingDesc': 'Contacting status.deepseek.com.',
      'short.operational': 'Normal',
      'short.degraded': 'Degraded',
      'short.partial_outage': 'Partial outage',
      'short.full_outage': 'Outage',
      'short.maintenance': 'Maintenance',
      'short.unknown': 'Unknown',
      'short.checking': 'Checking',
      'meta.services': 'services',
      'meta.updated': 'Updated',
      'meta.checked': 'Checked',
      'meta.started': 'Started',
      'meta.normal': 'normal',
      'action.refresh': 'Refresh status',
      'action.expand': 'Open DeepSeek status',
      'action.collapse': 'Collapse status panel',
      'action.drag': 'Drag to move',
      'action.view': 'View status page',
      'action.retry': 'Retry',
      'section.active': 'Active events',
      'section.services': 'Service components',
      'section.api': 'API services',
      'section.other': 'Other services',
      'incident.affectedOne': '1 service affected',
      'incident.affectedMany': 'services affected',
      'incident.noComponents': 'No affected components listed',
      'change.investigating': 'Investigating',
      'change.identified': 'Identified',
      'change.monitoring': 'Monitoring',
      'change.scheduled': 'Scheduled',
      'change.ongoing': 'In progress',
      'change.in_progress': 'In progress',
      'change.completed': 'Completed',
      'change.resolved': 'Resolved',
      'component.operational': 'Normal',
      'component.degraded': 'Degraded',
      'component.partial_outage': 'Partial',
      'component.full_outage': 'Down',
      'component.maintenance': 'Maintenance',
      'component.unknown': 'Unknown',
      'stale.title': 'Live status unavailable',
      'stale.body': 'Showing the last successful check.',
      'error.load': 'Could not load service status.',
      'error.connect': 'The status service is unreachable right now.',
      'auto': 'Auto 10 min',
      'autoIncident': 'Auto 1 min',
      'autoHint': 'Every 10 min when healthy, every min during an incident; failed checks retry after 2 min.',
      'debug.title': 'Flash test',
      'debug.expand': 'Expand',
      'debug.collapse': 'Collapse',
      'debug.degraded': 'Degraded',
      'debug.partial': 'Partial',
      'debug.outage': 'Outage',
      'debug.recovered': 'Recovered',
      'account.balance': 'Balance',
      'account.total': 'Total',
      'account.recharge': 'Recharge',
      'account.bonus': 'Bonus',
      'account.notSignedIn': 'Not signed in',
      'account.unavailable': 'Unavailable',
      'account.balanceTitle': 'DeepSeek account balance',
      'account.apiTitle': 'DeepSeek API key balance',
      'account.kimiTitle': 'Kimi balance',
      'account.zhipuTitle': 'Zhipu GLM balance',
      'account.sourceApi': 'DS API',
      'account.sourceAccount': 'DS Account',
      'account.sourceKimi': 'Kimi',
      'account.sourceZhipu': 'GLM',
      'period.offpeak': '谷',
      'period.peak': '峰',
      'period.offpeakTitle': 'Off-peak pricing period',
      'period.peakTitle': 'Peak pricing period',
      'privacy.hide': 'Hide amounts',
      'privacy.show': 'Show amounts',
      'usage.title': 'Session spend',
      'usage.today': 'Today',
      'usage.total': 'All time',
      'usage.estimated': 'Estimated',
      'usage.note': 'Amounts are estimated locally for reference only · Actual billing is on the DeepSeek platform',
      'usage.help': 'Calculated from local session token usage with DeepSeek public peak/off-peak prices. Actual billing may differ.',
      'usage.empty': 'No session spend recorded yet.',
      'usage.building': 'Building the local spend index…',
      'usage.error': 'Session spend is temporarily unavailable.',
      'usage.untitled': 'Untitled session',
      'usage.partial': 'Partially unpriced',
      'usage.updated': 'Updated',
      'usage.privacy': '••••',
      'footer.source': 'Source',
      'time.justNow': 'just now',
    }

    const DICT_ZH = {
      'panel.title': 'DeepSeek 服务状态',
      'panel.subtitle': 'status.deepseek.com',
      'pill.brand': 'DeepSeek',
      'status.operational': '运行正常',
      'status.operationalDesc': '所有服务运行正常。',
      'status.degraded': '性能下降',
      'status.degradedDesc': '部分服务性能下降。',
      'status.partial_outage': '部分中断',
      'status.partial_outageDesc': '部分服务出现异常。',
      'status.full_outage': '严重故障',
      'status.full_outageDesc': '关键服务不可用。',
      'status.maintenance': '维护中',
      'status.maintenanceDesc': '计划维护正在进行。',
      'status.unknown': '状态不可用',
      'status.unknownDesc': '暂时无法获取最新状态。',
      'status.checking': '正在检测…',
      'status.checkingDesc': '正在连接 status.deepseek.com。',
      'short.operational': '正常',
      'short.degraded': '降级',
      'short.partial_outage': '部分中断',
      'short.full_outage': '中断',
      'short.maintenance': '维护',
      'short.unknown': '未知',
      'short.checking': '检测中',
      'meta.services': '项服务',
      'meta.updated': '更新于',
      'meta.checked': '检查于',
      'meta.started': '开始于',
      'meta.normal': '正常',
      'action.refresh': '刷新状态',
      'action.expand': '打开 DeepSeek 服务状态',
      'action.collapse': '收起状态面板',
      'action.drag': '拖动调整位置',
      'action.view': '查看状态页',
      'action.retry': '重试',
      'section.active': '进行中的事件',
      'section.services': '服务组件',
      'section.api': 'API 服务',
      'section.other': '其他服务',
      'incident.affectedOne': '1 项服务受影响',
      'incident.affectedMany': '项服务受影响',
      'incident.noComponents': '未列出受影响服务',
      'change.investigating': '排查中',
      'change.identified': '已定位',
      'change.monitoring': '监控中',
      'change.scheduled': '已计划',
      'change.ongoing': '进行中',
      'change.in_progress': '进行中',
      'change.completed': '已完成',
      'change.resolved': '已恢复',
      'component.operational': '正常',
      'component.degraded': '降级',
      'component.partial_outage': '部分中断',
      'component.full_outage': '中断',
      'component.maintenance': '维护',
      'component.unknown': '未知',
      'stale.title': '实时状态暂不可用',
      'stale.body': '显示最近一次成功获取的数据。',
      'error.load': '无法加载服务状态。',
      'error.connect': '当前无法连接状态服务。',
      'auto': '自动 10 分钟',
      'autoIncident': '自动 1 分钟',
      'autoHint': '正常每 10 分钟、故障期间每分钟刷新；失败后 2 分钟重试。',
      'debug.title': '闪屏测试',
      'debug.expand': '展开',
      'debug.collapse': '收起',
      'debug.degraded': '降级',
      'debug.partial': '部分中断',
      'debug.outage': '中断',
      'debug.recovered': '恢复',
      'account.balance': '余额',
      'account.total': '总余额',
      'account.recharge': '充值余额',
      'account.bonus': '赠金',
      'account.notSignedIn': '未登录',
      'account.unavailable': '不可用',
      'account.balanceTitle': 'DeepSeek 账户余额',
      'account.apiTitle': 'DeepSeek API Key 余额',
      'account.kimiTitle': 'Kimi 余额',
      'account.zhipuTitle': '智谱 GLM 余额',
      'account.sourceApi': 'DS API',
      'account.sourceAccount': 'DS 账户',
      'account.sourceKimi': 'Kimi',
      'account.sourceZhipu': '智谱',
      'period.offpeak': '谷',
      'period.peak': '峰',
      'period.offpeakTitle': '谷时计费时段',
      'period.peakTitle': '峰时计费时段',
      'privacy.hide': '隐藏金额',
      'privacy.show': '显示金额',
      'usage.title': '会话消耗',
      'usage.today': '今日消耗',
      'usage.total': '累计消耗',
      'usage.estimated': '估算',
      'usage.note': '金额为本地估算，仅供参考 · 实际以平台账单为准',
      'usage.help': '按本地会话 token 用量与 DeepSeek 公开峰谷单价估算，实际扣费可能有差异。',
      'usage.empty': '暂无会话消耗记录。',
      'usage.building': '正在建立本地消费索引…',
      'usage.error': '暂时无法统计会话消耗。',
      'usage.untitled': '未命名会话',
      'usage.partial': '部分未计价',
      'usage.updated': '更新于',
      'usage.privacy': '••••',
      'footer.source': '数据来源',
      'time.justNow': '刚刚',
    }

    const STATUS_META = {
      operational: {
        tone: 'success',
        icon: 'check',
        full: 'status.operational',
        desc: 'status.operationalDesc',
        short: 'short.operational',
      },
      degraded: {
        tone: 'warn',
        icon: 'alert',
        full: 'status.degraded',
        desc: 'status.degradedDesc',
        short: 'short.degraded',
      },
      partial_outage: {
        tone: 'partial',
        icon: 'alert',
        full: 'status.partial_outage',
        desc: 'status.partial_outageDesc',
        short: 'short.partial_outage',
      },
      full_outage: {
        tone: 'error',
        icon: 'alert',
        full: 'status.full_outage',
        desc: 'status.full_outageDesc',
        short: 'short.full_outage',
      },
      maintenance: {
        tone: 'brand',
        icon: 'wrench',
        full: 'status.maintenance',
        desc: 'status.maintenanceDesc',
        short: 'short.maintenance',
      },
      unknown: {
        tone: 'idle',
        icon: 'question',
        full: 'status.unknown',
        desc: 'status.unknownDesc',
        short: 'short.unknown',
      },
      checking: {
        tone: 'idle',
        icon: 'pulse',
        full: 'status.checking',
        desc: 'status.checkingDesc',
        short: 'short.checking',
      },
    }

    const COMPONENT_META = {
      operational: { tone: 'success', key: 'component.operational' },
      degraded: { tone: 'warn', key: 'component.degraded' },
      partial_outage: { tone: 'partial', key: 'component.partial_outage' },
      full_outage: { tone: 'error', key: 'component.full_outage' },
      maintenance: { tone: 'brand', key: 'component.maintenance' },
      unknown: { tone: 'idle', key: 'component.unknown' },
    }

    const ABNORMAL_STATUSES = new Set(['degraded', 'partial_outage', 'full_outage'])

    const CHANGE_LABELS = {
      investigating: 'change.investigating',
      identified: 'change.identified',
      monitoring: 'change.monitoring',
      scheduled: 'change.scheduled',
      ongoing: 'change.ongoing',
      in_progress: 'change.in_progress',
      completed: 'change.completed',
      resolved: 'change.resolved',
    }

    const ICON_PATHS = {
      pulse: [{ d: 'M3 12h4l2.3-6 4.2 12 2.5-6H21' }],
      check: [
        { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
        { d: 'm8.4 12.2 2.4 2.4 4.9-5.3' },
      ],
      alert: [
        { d: 'M12 3 22 20H2L12 3Z' },
        { d: 'M12 9v5M12 17.4v.1' },
      ],
      wrench: [
        {
          d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z',
        },
      ],
      question: [
        { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
        { d: 'M9.4 9a2.6 2.6 0 1 1 4.2 2.1c-.9.7-1.6 1.2-1.6 2.6' },
        { d: 'M12 17.3v.1' },
      ],
      refresh: [
        { d: 'M20 11a8 8 0 1 0-2.4 6' },
        { d: 'M20 5v6h-6' },
      ],
      chevron: [{ d: 'm6 9 6 6 6-6' }],
      close: [{ d: 'M6 6l12 12M18 6 6 18' }],
      external: [
        { d: 'M14 4h6v6' },
        { d: 'M20 4l-9 9' },
        { d: 'M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6' },
      ],
      clock: [
        { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
        { d: 'M12 7.2v5.1l3.1 1.9' },
      ],
      eye: [
        { d: 'M2.5 12s3.6-6.2 9.5-6.2S21.5 12 21.5 12s-3.6 6.2-9.5 6.2S2.5 12 2.5 12Z' },
        { d: 'M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z' },
      ],
      eyeOff: [
        { d: 'M2.5 12s3.6-6.2 9.5-6.2S21.5 12 21.5 12s-3.6 6.2-9.5 6.2S2.5 12 2.5 12Z' },
        { d: 'M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z' },
        { d: 'm3 3 18 18' },
      ],
    }

    const CSS = `
      .ds-monitor {
        --ds-tone: var(--dsw-alias-state-idle-primary);
        position: fixed;
        top: calc(114px + env(safe-area-inset-top, 0px));
        right: calc(56px + env(safe-area-inset-right, 0px));
        z-index: 70;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        max-width: calc(100vw - 20px);
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        pointer-events: auto;
        -webkit-app-region: no-drag;
      }
      .ds-monitor, .ds-monitor * { box-sizing: border-box; }
      .ds-monitor > * { pointer-events: auto; }
      .ds-monitor button { font: inherit; }
      .ds-tone-success { --ds-tone: var(--dsw-alias-state-success-primary); }
      .ds-tone-warn { --ds-tone: var(--dsw-alias-state-warn-primary); }
      .ds-tone-partial {
        --ds-tone: var(--dsw-alias-state-warn-primary);
        --ds-tone: color-mix(in srgb, var(--dsw-alias-state-error-primary) 48%, var(--dsw-alias-state-warn-primary));
      }
      .ds-tone-error { --ds-tone: var(--dsw-alias-state-error-primary); }
      .ds-tone-brand { --ds-tone: var(--dsw-alias-brand-primary); }
      .ds-tone-idle { --ds-tone: var(--dsw-alias-state-idle-primary); }

      .ds-pill {
        display: flex;
        align-items: center;
        gap: 5px;
        min-width: 252px;
        max-width: calc(100vw - 16px);
        height: 43px;
        padding: 5px 5px 5px 5px;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 28%, var(--dsw-alias-border-l1));
        border-radius: 999px;
        background: var(--dsw-alias-bg-overlay);
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 8%, transparent) 0%, transparent 44%),
          radial-gradient(120% 140% at 12% 0%, color-mix(in srgb, var(--ds-tone) 10%, transparent), transparent 58%),
          color-mix(in srgb, var(--dsw-alias-bg-overlay) 12%, transparent);
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent),
          inset 0 0 18px color-mix(in srgb, var(--dsw-alias-bg-overlay) 8%, transparent),
          0 1px 1px color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent),
          0 14px 30px -22px color-mix(in srgb, var(--dsw-alias-label-primary) 65%, transparent);
        backdrop-filter: blur(10px) saturate(1.45);
        cursor: grab;
        color: inherit;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
      }
      .ds-pill-main {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
        flex: 1;
        height: 100%;
        padding: 0 2px 0 0;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: grab;
      }
      .ds-pill-main:focus-visible {
        outline: 2px solid var(--ds-tone);
        outline-offset: 2px;
        border-radius: 999px;
      }
      .ds-pill-account {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        padding-left: 7px;
        border-left: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 82%, transparent);
        white-space: nowrap;
      }
      .ds-period {
        display: inline-grid;
        place-items: center;
        min-width: 16px;
        height: 16px;
        padding: 0 3px;
        border: 1px solid color-mix(in srgb, currentColor 26%, transparent);
        border-radius: 5px;
        font-size: 9px;
        font-weight: 740;
        line-height: 1;
      }
      .ds-period.is-offpeak { color: var(--dsw-alias-state-success-primary); }
      .ds-period.is-peak { color: var(--dsw-alias-state-error-primary); }
      .ds-balance {
        overflow: hidden;
        min-width: 0;
        color: var(--dsw-alias-label-primary);
        font-size: 12.2px;
        font-weight: 680;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.01em;
        line-height: 1.1;
        text-overflow: ellipsis;
      }
      .ds-balance-source {
        color: var(--dsw-alias-label-secondary);
        font-size: 8px;
        font-weight: 640;
        line-height: 1;
        opacity: 0.9;
      }
      .ds-balance.is-muted {
        color: var(--dsw-alias-label-secondary);
        font-size: 10px;
        font-weight: 560;
      }
      .ds-balance.is-masked {
        letter-spacing: 0.08em;
        color: var(--dsw-alias-label-secondary);
      }
      .ds-eye {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
      }
      .ds-eye:hover { color: var(--dsw-alias-label-primary); background: color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent); }
      .ds-eye:disabled { cursor: default; opacity: 0.45; }
      .ds-eye:focus-visible {
        outline: 2px solid var(--ds-tone);
        outline-offset: 1px;
      }
      .ds-amount {
        display: inline-flex;
        align-items: baseline;
        gap: 0;
        min-width: 0;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        white-space: nowrap;
      }
      .ds-amount-static { display: inline-block; }
      .ds-reel {
        display: inline-block;
        height: 1.18em;
        overflow: hidden;
        vertical-align: -0.16em;
      }
      .ds-reel-track {
        display: flex;
        flex-direction: column;
        transition: transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .ds-reel-digit {
        height: 1.18em;
        line-height: 1.18em;
        text-align: center;
      }
      .ds-pill:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--ds-tone) 48%, var(--dsw-alias-border-l1));
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 12%, transparent) 0%, transparent 44%),
          radial-gradient(120% 140% at 12% 0%, color-mix(in srgb, var(--ds-tone) 14%, transparent), transparent 58%),
          color-mix(in srgb, var(--dsw-alias-bg-overlay) 18%, transparent);
      }
      .ds-pill:active { transform: translateY(0); }
      .ds-pill.is-dragging, .ds-pill.is-dragging:hover {
        cursor: grabbing;
        transform: none;
        transition: none;
      }
      .ds-pill:focus-visible {
        outline: 2px solid var(--ds-tone);
        outline-offset: 2px;
      }
      .ds-mark {
        display: grid;
        place-items: center;
        width: 31px;
        height: 31px;
        flex: 0 0 auto;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 24%, transparent);
        border-radius: 10px;
        color: var(--ds-tone);
        background:
          linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent), transparent 52%),
          color-mix(in srgb, var(--ds-tone) 8%, transparent);
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent),
          0 6px 14px -12px color-mix(in srgb, var(--ds-tone) 45%, transparent);
      }
      .ds-pulse-trace {
        stroke-dasharray: 0.22 1;
        stroke-dashoffset: 0;
        animation: ds-pulse-trace 2.4s linear infinite;
      }
      .ds-pill-copy {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        line-height: 1.05;
        text-align: left;
      }
      .ds-pill-brand {
        color: var(--dsw-alias-label-secondary);
        font-size: 8.5px;
        font-weight: 740;
        letter-spacing: 0.12em;
        line-height: 1;
        text-transform: uppercase;
      }
      .ds-pill-status {
        display: flex;
        align-items: center;
        gap: 5px;
        overflow: hidden;
        color: color-mix(in srgb, var(--ds-tone) 44%, var(--dsw-alias-label-primary));
        font-size: 12.3px;
        font-weight: 660;
        line-height: 1.15;
        white-space: nowrap;
      }
      .ds-dot {
        position: relative;
        width: 6px;
        height: 6px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: var(--ds-tone);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-tone) 13%, transparent);
      }
      .ds-monitor.is-alert .ds-pill .ds-dot { animation: ds-beacon 2s ease-out infinite; }
      .ds-pill-warn {
        display: grid;
        place-items: center;
        color: var(--dsw-alias-state-warn-primary);
      }
      .ds-chevron {
        color: var(--dsw-alias-label-secondary);
        transition: transform 160ms ease;
      }
      .ds-chevron.is-open { transform: rotate(180deg); }

      .ds-flash {
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        background:
          radial-gradient(130% 100% at 50% 45%, color-mix(in srgb, var(--ds-tone) 26%, transparent) 0%, color-mix(in srgb, var(--ds-tone) 15%, transparent) 48%, color-mix(in srgb, var(--ds-tone) 5%, transparent) 100%);
        box-shadow: inset 0 0 180px color-mix(in srgb, var(--ds-tone) 30%, transparent);
        will-change: opacity;
        animation: ds-flash 1500ms ease-in-out both;
      }

      .ds-panel {
        display: flex;
        flex-direction: column;
        width: min(346px, calc(100vw - 20px));
        max-height: min(calc(100vh - 120px), 860px);
        max-height: min(calc(100dvh - 120px), 860px);
        overflow: hidden;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 16px;
        background: var(--dsw-alias-bg-overlay);
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 6%, transparent) 0%, transparent 34%),
          radial-gradient(120% 65% at 0% 0%, color-mix(in srgb, var(--ds-tone) 4%, transparent), transparent 55%),
          linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 14%, transparent), color-mix(in srgb, var(--dsw-alias-bg-overlay) 6%, transparent));
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 15%, transparent),
          inset 0 0 28px color-mix(in srgb, var(--dsw-alias-bg-overlay) 4%, transparent),
          0 2px 5px color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent),
          0 34px 80px -36px color-mix(in srgb, var(--dsw-alias-label-primary) 72%, transparent);
        backdrop-filter: blur(8px) saturate(1.45);
        transform-origin: top right;
        animation: ds-pop 170ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .ds-head {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 12px 12px 10px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        background:
          radial-gradient(280px 80px at 0% 0%, color-mix(in srgb, var(--ds-tone) 8%, transparent), transparent 70%),
          transparent;
        flex: 0 0 auto;
      }
      .ds-head-mark {
        display: grid;
        place-items: center;
        width: 31px;
        height: 31px;
        flex: 0 0 auto;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, var(--dsw-alias-border-l1));
        border-radius: 10px;
        color: var(--dsw-alias-brand-primary);
        background:
          linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent), transparent 52%),
          color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent),
          0 6px 14px -12px color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, transparent);
      }
      .ds-head-copy { min-width: 0; }
      .ds-head-title {
        margin: 0;
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 13px;
        font-weight: 670;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-head-sub {
        display: block;
        margin-top: 2px;
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-head-actions {
        display: flex;
        align-items: center;
        gap: 1px;
        margin-left: auto;
      }
      .ds-icon-btn {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        padding: 0;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
        transition: color 130ms ease, background 130ms ease;
      }
      .ds-icon-btn:hover {
        color: var(--dsw-alias-label-primary);
        background: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
      }
      .ds-icon-btn:disabled { cursor: progress; opacity: 0.7; }
      .ds-icon-btn:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .ds-spin { animation: ds-spin 900ms linear infinite; }

      .ds-body {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 11px;
        min-height: 0;
        overflow: auto;
        padding: 11px 12px 8px;
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--dsw-alias-label-primary) 18%, transparent) transparent;
      }
      .ds-overall {
        padding: 11px;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 28%, var(--dsw-alias-border-l1));
        border-radius: 12px;
        background:
          linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 3%, transparent), transparent 48%),
          radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--ds-tone) 3%, transparent), transparent 62%),
          color-mix(in srgb, var(--dsw-alias-bg-overlay) 2%, transparent);
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 13%, transparent),
          0 8px 20px -20px color-mix(in srgb, var(--dsw-alias-label-primary) 55%, transparent);
      }
      .ds-overall-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ds-overall-icon {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        flex: 0 0 auto;
        border-radius: 8px;
        color: var(--ds-tone);
        background: color-mix(in srgb, var(--ds-tone) 6%, transparent);
      }
      .ds-overall-title {
        min-width: 0;
        font-size: 14px;
        font-weight: 680;
        letter-spacing: -0.01em;
        line-height: 1.25;
      }
      .ds-overall-desc {
        margin: 7px 0 0 35px;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.8px;
        line-height: 1.45;
      }
      .ds-overall-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 5px;
        margin: 8px 0 0 35px;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.8px;
        font-variant-numeric: tabular-nums;
        line-height: 1.3;
      }
      .ds-meta-dot {
        width: 2px;
        height: 2px;
        border-radius: 999px;
        background: currentColor;
        opacity: 0.55;
      }

      .ds-stale {
        display: flex;
        align-items: flex-start;
        gap: 7px;
        padding: 8px 9px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, var(--dsw-alias-border-l1));
        border-radius: 9px;
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 2%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
        color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 55%, var(--dsw-alias-label-primary));
      }
      .ds-stale svg { margin-top: 1px; }
      .ds-stale strong {
        display: block;
        font-size: 10.5px;
        font-weight: 670;
      }
      .ds-stale span {
        display: block;
        margin-top: 1px;
        font-size: 9.7px;
        line-height: 1.4;
        opacity: 0.85;
      }

      .ds-section { min-width: 0; }
      .ds-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 2px 6px;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.3px;
        font-weight: 720;
        letter-spacing: 0.08em;
        line-height: 1.2;
        text-transform: uppercase;
      }
      .ds-section-count {
        display: inline-flex;
        min-width: 17px;
        height: 16px;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        color: var(--dsw-alias-label-secondary);
        font-size: 9px;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0;
      }
      .ds-changes { display: flex; flex-direction: column; gap: 6px; }
      .ds-change {
        padding: 8px 9px;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 25%, var(--dsw-alias-border-l1));
        border-left: 2px solid var(--ds-tone);
        border-radius: 8px;
        background: color-mix(in srgb, var(--ds-tone) 2%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 9%, transparent);
      }
      .ds-change-top {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .ds-change-top > svg { color: var(--ds-tone); }
      .ds-change-badge {
        display: inline-flex;
        align-items: center;
        height: 17px;
        padding: 0 6px;
        border-radius: 4px;
        color: color-mix(in srgb, var(--ds-tone) 62%, var(--dsw-alias-label-primary));
        background: color-mix(in srgb, var(--ds-tone) 13%, transparent);
        font-size: 9px;
        font-weight: 670;
        letter-spacing: 0.01em;
        line-height: 1;
        white-space: nowrap;
      }
      .ds-change-time {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        margin-left: auto;
        color: var(--dsw-alias-label-secondary);
        font-size: 9px;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .ds-change-title {
        margin: 5px 0 0;
        color: var(--dsw-alias-label-primary);
        font-size: 11.3px;
        font-weight: 600;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .ds-change-affected {
        margin: 3px 0 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.3px;
        line-height: 1.35;
      }

      .ds-groups { display: flex; flex-direction: column; gap: 7px; }
      .ds-group {
        overflow: hidden;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: color-mix(in srgb, var(--dsw-alias-bg-overlay) 2%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 11%, transparent);
      }
      .ds-group-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
        background: color-mix(in srgb, var(--dsw-alias-bg-overlay) 3%, transparent);
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        font-weight: 660;
      }
      .ds-group-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-group-count {
        flex: 0 0 auto;
        font-size: 9px;
        font-variant-numeric: tabular-nums;
        opacity: 0.8;
      }
      .ds-component {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 6px 8px;
        border-top: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 70%, transparent);
        background: transparent;
      }
      .ds-group-head + .ds-component { border-top: 0; }
      .ds-component:hover { background: color-mix(in srgb, var(--dsw-alias-label-primary) 4%, transparent); }
      .ds-component .ds-dot {
        width: 6px;
        height: 6px;
        box-shadow: 0 0 0 2.5px color-mix(in srgb, var(--ds-tone) 12%, transparent);
      }
      .ds-component-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 10.6px;
        line-height: 1.3;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-component-status {
        flex: 0 0 auto;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.2px;
        line-height: 1.2;
        white-space: nowrap;
      }
      .ds-component.is-issue { background: color-mix(in srgb, var(--ds-tone) 5%, transparent); }
      .ds-component.is-issue .ds-component-status {
        color: color-mix(in srgb, var(--ds-tone) 60%, var(--dsw-alias-label-primary));
        font-weight: 640;
      }

      .ds-usage {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .ds-usage-note {
        display: flex;
        align-items: flex-start;
        gap: 5px;
        color: var(--dsw-alias-label-secondary);
        font-size: 8.7px;
        line-height: 1.35;
      }
      .ds-usage-note svg { margin-top: 1px; opacity: 0.8; }
      .ds-usage-card {
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 80%, transparent);
        border-radius: 9px;
        background: color-mix(in srgb, var(--dsw-alias-bg-overlay) 2%, transparent);
      }
      .ds-usage-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 78%, transparent);
        background: color-mix(in srgb, var(--dsw-alias-bg-overlay) 3%, transparent);
        color: var(--dsw-alias-label-secondary);
        font-size: 9.3px;
        font-weight: 660;
      }
      .ds-usage-head strong {
        color: var(--dsw-alias-label-primary);
        font-size: 9.8px;
        font-weight: 720;
      }
      .ds-usage-top {
        font-size: 8.4px;
        font-weight: 680;
        letter-spacing: 0.04em;
        font-variant-numeric: tabular-nums;
      }
      .ds-usage-row {
        display: grid;
        grid-template-columns: 17px minmax(0, 1fr) auto;
        align-items: center;
        gap: 6px;
        padding: 5px 8px;
        border-top: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 52%, transparent);
      }
      .ds-usage-row:first-of-type { border-top: 0; }
      .ds-usage-rank {
        display: grid;
        place-items: center;
        width: 16px;
        height: 16px;
        border-radius: 5px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--ds-rank-tone) 20%, transparent), color-mix(in srgb, var(--ds-rank-tone) 8%, transparent));
        color: var(--ds-rank-tone);
        font-size: 9px;
        font-weight: 720;
        line-height: 1;
      }
      .ds-usage-title {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 10.4px;
        line-height: 1.3;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-usage-amount {
        color: var(--dsw-alias-label-primary);
        font-size: 10.4px;
        font-weight: 640;
        font-variant-numeric: tabular-nums;
        line-height: 1.25;
        white-space: nowrap;
      }
      .ds-usage-partial {
        margin-left: 3px;
        color: var(--dsw-alias-state-warn-primary);
        font-size: 8.2px;
        font-weight: 560;
      }
      .ds-usage-empty {
        padding: 8px;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.4px;
        line-height: 1.4;
      }
      .ds-usage-building {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        color: var(--dsw-alias-label-secondary);
        font-size: 9.4px;
        line-height: 1.4;
      }
      .ds-usage-progress {
        margin-left: auto;
        font-variant-numeric: tabular-nums;
        opacity: 0.75;
      }
      .ds-usage-error {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        color: var(--dsw-alias-state-warn-primary);
        font-size: 9.4px;
        line-height: 1.4;
      }
      .ds-usage-error button {
        margin-left: auto;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--dsw-alias-brand-primary);
        font-size: 9.2px;
        font-weight: 620;
        cursor: pointer;
      }
      .ds-usage-error button:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
        border-radius: 3px;
      }
      .ds-usage-meta {
        padding: 0 2px;
        color: var(--dsw-alias-label-secondary);
        font-size: 8.5px;
        line-height: 1.3;
        text-align: right;
        opacity: 0.8;
      }

      .ds-tools {
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 8px 9px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 80%, transparent);
        border-radius: 9px;
        background:
          linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 4%, transparent), transparent 58%),
          color-mix(in srgb, var(--dsw-alias-bg-overlay) 2%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 9%, transparent);
      }
      .ds-tools-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
      }
      .ds-tools-toggle:hover .ds-tools-title { color: var(--dsw-alias-label-primary); }
      .ds-tools-toggle:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
        border-radius: 3px;
      }
      .ds-tools-title {
        color: var(--dsw-alias-label-secondary);
        font-size: 9.3px;
        font-weight: 720;
        letter-spacing: 0.08em;
        line-height: 1.2;
        text-transform: uppercase;
      }
      .ds-tools-hint {
        margin-left: auto;
        color: var(--dsw-alias-label-secondary);
        font-size: 8.8px;
        line-height: 1.2;
        opacity: 0.8;
      }
      .ds-tools-chevron {
        color: var(--dsw-alias-label-secondary);
        transition: transform 150ms ease;
      }
      .ds-tools-chevron.is-open { transform: rotate(180deg); }
      .ds-tools-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 5px;
      }
      .ds-test-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 6px;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 28%, var(--dsw-alias-border-l1));
        border-radius: 5px;
        background: color-mix(in srgb, var(--ds-tone) 4%, transparent);
        color: color-mix(in srgb, var(--ds-tone) 48%, var(--dsw-alias-label-primary));
        font-size: 9.4px;
        font-weight: 580;
        line-height: 1.1;
        cursor: pointer;
        transition: background 130ms ease, border-color 130ms ease;
      }
      .ds-test-chip:hover {
        border-color: color-mix(in srgb, var(--ds-tone) 48%, var(--dsw-alias-border-l1));
        background: color-mix(in srgb, var(--ds-tone) 6%, transparent);
      }
      .ds-test-chip:focus-visible {
        outline: 2px solid var(--ds-tone);
        outline-offset: 1px;
      }
      .ds-test-chip .ds-dot {
        width: 5px;
        height: 5px;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--ds-tone) 12%, transparent);
      }

      .ds-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        padding: 25px 12px 28px;
        text-align: center;
      }
      .ds-state-icon {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        margin-bottom: 2px;
        border: 1px solid color-mix(in srgb, var(--ds-tone) 28%, var(--dsw-alias-border-l1));
        border-radius: 12px;
        color: var(--ds-tone);
        background: color-mix(in srgb, var(--ds-tone) 3%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
      }
      .ds-state strong {
        color: var(--dsw-alias-label-primary);
        font-size: 12.3px;
        font-weight: 650;
      }
      .ds-state p {
        max-width: 240px;
        margin: 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 10.5px;
        line-height: 1.5;
      }
      .ds-state .ds-icon-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        width: auto;
        height: 29px;
        margin-top: 4px;
        padding: 0 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        color: var(--dsw-alias-label-primary);
        font-size: 10.5px;
        font-weight: 600;
      }
      .ds-loading-beacon {
        width: 34px;
        height: 34px;
        margin-bottom: 3px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 25%, var(--dsw-alias-border-l1));
        border-radius: 999px;
        background:
          radial-gradient(circle at center, color-mix(in srgb, var(--dsw-alias-brand-primary) 25%, transparent) 0 20%, transparent 21%),
          conic-gradient(from 0deg, transparent 0 40%, color-mix(in srgb, var(--dsw-alias-brand-primary) 65%, transparent) 42% 58%, transparent 60%);
        animation: ds-spin 1.3s linear infinite;
      }

      .ds-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        border-top: 1px solid var(--dsw-alias-border-l1);
        background: color-mix(in srgb, var(--dsw-alias-bg-overlay) 2%, transparent);
        color: var(--dsw-alias-label-secondary);
        font-size: 9.2px;
        flex: 0 0 auto;
      }
      .ds-foot-left {
        display: flex;
        align-items: center;
        gap: 5px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ds-foot a {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex: 0 0 auto;
        color: var(--dsw-alias-brand-primary);
        font-size: 9.2px;
        font-weight: 620;
        text-decoration: none;
      }
      .ds-foot a:hover { text-decoration: underline; }
      .ds-foot a:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
        border-radius: 3px;
      }

      @keyframes ds-pulse-trace {
        from { stroke-dashoffset: 0; }
        to { stroke-dashoffset: -1.22; }
      }
      @keyframes ds-flash {
        0% { opacity: 0; }
        8% { opacity: 1; }
        20% { opacity: 0.06; }
        34% { opacity: 1; }
        46% { opacity: 0.06; }
        60% { opacity: 1; }
        72% { opacity: 0.04; }
        100% { opacity: 0; }
      }
      @keyframes ds-pop {
        from { opacity: 0; transform: translateY(-5px) scale(0.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes ds-spin { to { transform: rotate(360deg); } }
      @keyframes ds-beacon {
        0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-tone) 13%, transparent); }
        50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--ds-tone) 4%, transparent); }
      }
      @media (max-width: 520px) {
        .ds-monitor {
          top: calc(114px + env(safe-area-inset-top, 0px));
          right: calc(8px + env(safe-area-inset-right, 0px));
        }
        .ds-pill { min-width: 0; height: 40px; max-width: calc(100vw - 16px); }
        .ds-pill-brand { display: none; }
        .ds-pill-copy { min-width: 0; }
        .ds-balance { font-size: 11px; }
        .ds-pill-account { padding-left: 5px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .ds-monitor *, .ds-monitor *::before, .ds-monitor *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .ds-pulse-trace {
          animation: none !important;
          stroke-dasharray: none !important;
          stroke-dashoffset: 0 !important;
        }
        .ds-flash { display: none !important; }
      }
    `

    function Icon({ name, size = 16, className, strokeWidth = 1.8 }) {
      const paths = ICON_PATHS[name] || []
      const children =
        name === 'pulse' && paths[0]
          ? [
              h('path', { key: 'pulse-base', d: paths[0].d, opacity: 0.32 }),
              h('path', {
                key: 'pulse-trace',
                d: paths[0].d,
                pathLength: 1,
                className: 'ds-pulse-trace',
              }),
            ]
          : paths.map((path, index) => h('path', { key: index, d: path.d }))
      return h(
        'svg',
        {
          className,
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block', flex: '0 0 auto' },
        },
        children,
      )
    }

    function statusMeta(status) {
      return STATUS_META[status] || STATUS_META.unknown
    }

    function componentMeta(status) {
      return COMPONENT_META[status] || COMPONENT_META.unknown
    }

    function formatTime(timestamp, locale) {
      if (!timestamp) return ''
      try {
        return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(timestamp)
      } catch {
        return new Date(timestamp).toLocaleTimeString()
      }
    }

    function relativeTime(timestamp, locale, justNowLabel) {
      const diff = timestamp - Date.now()
      const absolute = Math.abs(diff)
      if (absolute < 60_000) return justNowLabel
      const units = [
        ['day', 86_400_000],
        ['hour', 3_600_000],
        ['minute', 60_000],
      ]
      try {
        const formatter = new Intl.RelativeTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
          numeric: 'auto',
          style: 'short',
        })
        for (const [unit, size] of units) {
          if (absolute >= size) return formatter.format(Math.round(diff / size), unit)
        }
      } catch {
        return formatTime(timestamp, locale)
      }
      return formatTime(timestamp, locale)
    }

    const CJK_RE = /[\u3400-\u9FFF]/

    function splitBilingual(value) {
      const text = String(value || '').trim()
      const match = /^(.*?)[（(]([^）)]+)[）)]\s*$/.exec(text)
      if (!match) return { primary: text, secondary: '' }
      if (!CJK_RE.test(match[1]) && !CJK_RE.test(match[2])) {
        return { primary: text, secondary: '' }
      }
      return { primary: match[1].trim(), secondary: match[2].trim() }
    }

    function displayComponentName(name, locale) {
      const { primary, secondary } = splitBilingual(name)
      if (!secondary) return name
      if (locale === 'zh') return primary.replace(/^DeepSeek\s+/i, '') || name
      if (/^DeepSeek\s+/i.test(primary)) {
        const base = primary.replace(/^DeepSeek\s+/i, '').replace(/服务$/, '').trim()
        return base ? `${base} Service` : secondary
      }
      if (secondary === 'Chatservice') return 'Chat service'
      return secondary || name
    }

    function displayGroupName(group, t, locale) {
      if (!group || group.kind === 'standalone') return t('section.api')
      return displayComponentName(group.name, locale) || t('section.other')
    }

    function displayChangeTitle(title, locale) {
      const { primary, secondary } = splitBilingual(title)
      if (!secondary) return title
      return locale === 'zh' ? primary : secondary
    }

    function changeTone(change) {
      if (change.type === 'maintenance') return 'brand'
      if (change.status === 'monitoring' || change.status === 'identified') return 'warn'
      return 'error'
    }

    function isUrgentFeed(data) {
      if (!data) return false
      if (data.status === 'degraded' || data.status === 'partial_outage' || data.status === 'full_outage') {
        return true
      }
      return Array.isArray(data.activeChanges) && data.activeChanges.some((change) => change.type === 'incident')
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max)
    }

    function readStoredPosition() {
      try {
        const raw = window.localStorage.getItem(POSITION_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || !Number.isFinite(parsed.right) || !Number.isFinite(parsed.top)) return null
        return {
          right: Math.max(0, Math.round(parsed.right)),
          top: Math.max(0, Math.round(parsed.top)),
        }
      } catch {
        return null
      }
    }

    function storePosition(position) {
      try {
        window.localStorage.setItem(POSITION_KEY, JSON.stringify(position))
      } catch {
        // Position persistence is a convenience; dragging still works without it.
      }
    }

    function useLocaleSnapshot(ctx) {
      const [snapshot, setSnapshot] = React.useState(() => ctx.locale.getLocale())
      React.useEffect(
        () =>
          ctx.locale.subscribe(() => {
            setSnapshot(ctx.locale.getLocale())
          }),
        [ctx],
      )
      return snapshot
    }

    function useStatusFeed() {
      const [state, setState] = React.useState({
        data: null,
        error: null,
        initialLoading: true,
        refreshing: false,
      })
      const latest = React.useRef(null)
      const inFlight = React.useRef(false)
      const controllerRef = React.useRef(null)
      const stopped = React.useRef(true)

      const load = React.useCallback((force, manual) => {
        if (inFlight.current) return Promise.resolve()
        inFlight.current = true
        if (manual) setState((current) => ({ ...current, refreshing: true, error: null }))
        const controller = new AbortController()
        controllerRef.current = controller
        const request = (async () => {
          try {
            const response = await fetch(force ? `${API_PATH}?refresh=1` : API_PATH, {
              headers: { accept: 'application/json' },
              cache: 'no-store',
              signal: controller.signal,
            })
            if (!response.ok) throw new Error(`http-${response.status}`)
            const payload = await response.json()
            if (!payload || payload.ok !== true || !payload.status) throw new Error('invalid-payload')
            if (stopped.current) return
            latest.current = payload
            setState({
              data: payload,
              error: null,
              initialLoading: false,
              refreshing: false,
            })
          } catch (error) {
            if (stopped.current || error?.name === 'AbortError') return
            setState((current) => ({
              ...current,
              error: 'connect',
              initialLoading: false,
              refreshing: false,
            }))
          } finally {
            inFlight.current = false
            if (controllerRef.current === controller) controllerRef.current = null
          }
        })()
        return request
      }, [])

      React.useEffect(() => {
        stopped.current = false
        let timer = null
        let active = true

        const loop = async () => {
          await load(false, false)
          if (!active || stopped.current) return
          const data = latest.current
          const delay = data?.fetchedAt
            ? isUrgentFeed(data)
              ? 60_000
              : 120_000
            : data?.error
              ? 30_000
              : 3_000
          timer = setTimeout(loop, delay)
        }

        void loop()
        const onVisibility = () => {
          if (active && document.visibilityState === 'visible') void load(false, false)
        }
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
          active = false
          stopped.current = true
          if (timer) clearTimeout(timer)
          controllerRef.current?.abort()
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, [load])

      const refresh = React.useCallback(() => load(true, true), [load])

      return {
        ...state,
        refresh,
      }
    }

    function readStoredPrivacy() {
      try {
        return window.localStorage.getItem(PRIVACY_KEY) === '1'
      } catch {
        return false
      }
    }

    function storePrivacy(value) {
      try {
        window.localStorage.setItem(PRIVACY_KEY, value ? '1' : '0')
      } catch {
        // Privacy still applies for this mount.
      }
    }

    function formatMicros(value, currency = 'CNY') {
      const micros = Math.max(0, Math.round(Number(value) || 0))
      const symbol = currency === 'USD' ? '$' : '¥'
      if (micros === 0) return `${symbol}0.00`
      if (micros < 10_000) return `<${symbol}0.01`
      const cents = Math.floor(micros / 10_000)
      const whole = Math.floor(cents / 100)
      const fraction = String(cents % 100).padStart(2, '0')
      return `${symbol}${whole.toLocaleString('en-US')}.${fraction}`
    }

    function useAccountFeed(locale) {
      const [state, setState] = React.useState({
        data: null,
        error: null,
        initialLoading: true,
        refreshing: false,
      })
      const inFlight = React.useRef(false)
      const stopped = React.useRef(true)
      const controllerRef = React.useRef(null)
      const lastOk = React.useRef(false)

      const load = React.useCallback(
        (force, manual) => {
          if (inFlight.current) return Promise.resolve()
          inFlight.current = true
          if (manual) setState((current) => ({ ...current, refreshing: true, error: null }))
          const controller = new AbortController()
          controllerRef.current = controller
          const timezoneOffset = -new Date().getTimezoneOffset() * 60
          const language = locale === 'zh' ? 'zh-CN' : locale || navigator.language || 'zh-CN'
          const query = new URLSearchParams({
            locale: language,
            tz: String(timezoneOffset),
          })
          if (force) query.set('refresh', '1')
          return (async () => {
            try {
              const response = await fetch(`${ACCOUNT_PATH}?${query.toString()}`, {
                headers: { accept: 'application/json' },
                cache: 'no-store',
                signal: controller.signal,
              })
              if (!response.ok) throw new Error(`http-${response.status}`)
              const payload = await response.json()
              if (!payload || payload.ok !== true) throw new Error('invalid-payload')
              if (stopped.current) return
              lastOk.current = true
              setState({ data: payload, error: null, initialLoading: false, refreshing: false })
            } catch (error) {
              if (stopped.current || error?.name === 'AbortError') return
              lastOk.current = false
              setState((current) => ({
                ...current,
                error: 'connect',
                initialLoading: false,
                refreshing: false,
              }))
            } finally {
              inFlight.current = false
              if (controllerRef.current === controller) controllerRef.current = null
            }
          })()
        },
        [locale],
      )

      React.useEffect(() => {
        stopped.current = false
        let active = true
        let timer = null
        const loop = async () => {
          await load(false, false)
          if (!active || stopped.current) return
          timer = window.setTimeout(loop, lastOk.current ? 60_000 : 5_000)
        }
        void loop()
        const onVisibility = () => {
          if (active && document.visibilityState === 'visible') void load(false, false)
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          active = false
          stopped.current = true
          if (timer) window.clearTimeout(timer)
          controllerRef.current?.abort()
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, [load])

      const refresh = React.useCallback(() => load(true, true), [load])
      return { ...state, refresh }
    }

    function useUsageFeed(enabled, currency) {
      const [state, setState] = React.useState({
        data: null,
        error: null,
        loading: false,
      })
      const inFlight = React.useRef(false)
      const latest = React.useRef(null)
      const controllerRef = React.useRef(null)
      const stopped = React.useRef(true)
      const lastOk = React.useRef(false)

      const load = React.useCallback(
        (force) => {
          if (!enabled || inFlight.current) return Promise.resolve()
          inFlight.current = true
          setState((current) => ({ ...current, loading: true }))
          const controller = new AbortController()
          controllerRef.current = controller
          const query = new URLSearchParams({ currency: currency === 'USD' ? 'USD' : 'CNY' })
          if (force) query.set('refresh', '1')
          return (async () => {
            try {
              const response = await fetch(`${USAGE_PATH}?${query.toString()}`, {
                headers: { accept: 'application/json' },
                cache: 'no-store',
                signal: controller.signal,
              })
              if (!response.ok) throw new Error(`http-${response.status}`)
              const payload = await response.json()
              if (!payload || payload.ok !== true) throw new Error('invalid-payload')
              if (stopped.current) return
              latest.current = payload
              lastOk.current = true
              setState({ data: payload, error: null, loading: false })
            } catch (error) {
              if (stopped.current || error?.name === 'AbortError') return
              lastOk.current = false
              setState((current) => ({ ...current, error: 'connect', loading: false }))
            } finally {
              inFlight.current = false
              if (controllerRef.current === controller) controllerRef.current = null
            }
          })()
        },
        [enabled, currency],
      )

      React.useEffect(() => {
        if (!enabled) {
          controllerRef.current?.abort()
          return undefined
        }
        stopped.current = false
        let active = true
        let timer = null
        const loop = async () => {
          await load(false)
          if (!active || stopped.current) return
          const data = latest.current
          const delay = data?.building || data?.refreshing ? 1_800 : lastOk.current ? 60_000 : 5_000
          timer = window.setTimeout(loop, delay)
        }
        void loop()
        const onVisibility = () => {
          if (active && document.visibilityState === 'visible') void load(false)
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          active = false
          stopped.current = true
          if (timer) window.clearTimeout(timer)
          controllerRef.current?.abort()
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, [enabled, load])

      const refresh = React.useCallback(() => load(true), [load])
      return { ...state, refresh }
    }

    function RollingAmount({ text, className = '' }) {
      const chars = Array.from(String(text || ''))
      return h(
        'span',
        { className: `ds-amount ${className}`.trim() },
        chars.map((char, index) => {
          if (!/\d/.test(char)) {
            return h('span', { key: index, className: 'ds-amount-static' }, char)
          }
          const digit = Number(char)
          return h(
            'span',
            { key: index, className: 'ds-reel' },
            h(
              'span',
              {
                className: 'ds-reel-track',
                style: { transform: `translateY(-${digit * 1.18}em)` },
              },
              Array.from({ length: 10 }, (_, value) =>
                h('span', { key: value, className: 'ds-reel-digit' }, String(value)),
              ),
            ),
          )
        }),
      )
    }

    const USAGE_RANK_TONES = ['#b45309', '#d97706', '#f59e0b']

    function UsageCard({ t, title, rows, locale, privacy, currency }) {
      return h(
        'div',
        { className: 'ds-usage-card' },
        h(
          'div',
          { className: 'ds-usage-head' },
          h('strong', null, title),
          h('span', { className: 'ds-usage-top' }, 'TOP3'),
        ),
        rows.length
          ? rows.map((row, index) =>
              h(
                'div',
                {
                  className: 'ds-usage-row',
                  key: row.id,
                  style: { '--ds-rank-tone': USAGE_RANK_TONES[index] || USAGE_RANK_TONES[2] },
                },
                h('span', { className: 'ds-usage-rank' }, index + 1),
                h(
                  'span',
                  {
                    className: 'ds-usage-title',
                    title: row.title || t('usage.untitled'),
                  },
                  row.title || t('usage.untitled'),
                ),
                h(
                  'span',
                  { className: 'ds-usage-amount' },
                  privacy ? t('usage.privacy') : formatMicros(row.amountMicros, currency),
                  row.partial
                    ? h('span', { className: 'ds-usage-partial' }, t('usage.partial'))
                    : null,
                ),
              ),
            )
          : h('div', { className: 'ds-usage-empty' }, t('usage.empty')),
      )
    }

    function UsageSection({ t, locale, data, error, privacy, onRefresh }) {
      const building = Boolean(data?.building || data?.refreshing)
      const hasAny = Boolean(data?.today?.length || data?.total?.length)
      const updated = data?.fetchedAt ? formatTime(data.fetchedAt, locale) : ''
      return h(
        'div',
        { className: 'ds-section ds-usage' },
        h(
          'div',
          { className: 'ds-section-head' },
          h('span', null, t('usage.title')),
          h('span', { className: 'ds-section-count' }, t('usage.estimated')),
        ),
        h(
          'div',
          { className: 'ds-usage-note', title: t('usage.help') },
          h(Icon, { name: 'question', size: 11 }),
          h('span', null, t('usage.note')),
        ),
        building && !hasAny
          ? h(
              'div',
              { className: 'ds-usage-building' },
              h('span', { className: 'ds-loading-beacon', 'aria-hidden': 'true' }),
              h('span', null, t('usage.building')),
              data?.progress?.total
                ? h(
                    'span',
                    { className: 'ds-usage-progress' },
                    `${data.progress.done}/${data.progress.total}`,
                  )
                : null,
            )
          : null,
        error && !hasAny
          ? h(
              'div',
              { className: 'ds-usage-error' },
              h(Icon, { name: 'alert', size: 12 }),
              h('span', null, t('usage.error')),
              h('button', { type: 'button', onClick: onRefresh }, t('action.retry')),
            )
          : null,
        hasAny
          ? h(
              React.Fragment,
              null,
              h(UsageCard, {
                t,
                title: t('usage.today'),
                rows: data.today || [],
                locale,
                privacy,
                currency: data.currency,
              }),
              h(UsageCard, {
                t,
                title: t('usage.total'),
                rows: data.total || [],
                locale,
                privacy,
                currency: data.currency,
              }),
            )
          : null,
        !building && !error && !hasAny
          ? h(
              'div',
              { className: 'ds-usage-card' },
              h('div', { className: 'ds-usage-empty' }, t('usage.empty')),
            )
          : null,
        updated
          ? h('div', { className: 'ds-usage-meta' }, `${t('usage.updated')} ${updated}`)
          : null,
      )
    }

    function StatusPill({
      t,
      locale,
      data,
      status,
      stale,
      open,
      dragging,
      account,
      privacy,
      onTogglePrivacy,
      onToggle,
      buttonRef,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
    }) {
      const meta = statusMeta(status)
      const statusLabel = t(meta.short)
      const fullLabel = t(meta.full)
      const updated = data?.fetchedAt ? `${t('meta.updated')} ${formatTime(data.fetchedAt, locale)}` : ''
      const title = [fullLabel, updated, stale ? t('stale.title') : '', t('action.drag')]
        .filter(Boolean)
        .join(' · ')
      const actionLabel = open ? t('action.collapse') : t('action.expand')
      const accountData = account?.data
      const balance = accountData?.balance
      const available = accountData?.available !== false
      const signedIn = accountData?.signedIn
      const hasBalance = Number.isFinite(balance?.totalMicros)
      const currency = accountData?.currency || 'CNY'
      const period = accountData?.period
      const source = ['deepseek-api', 'deepseek-account', 'kimi', 'zhipu'].includes(accountData?.source)
        ? accountData.source
        : 'deepseek-account'
      const sourceLabel =
        source === 'kimi'
          ? t('account.sourceKimi')
          : source === 'zhipu'
            ? t('account.sourceZhipu')
            : source === 'deepseek-api'
              ? t('account.sourceApi')
              : t('account.sourceAccount')
      const balanceTitle =
        source === 'kimi'
          ? t('account.kimiTitle')
          : source === 'zhipu'
            ? t('account.zhipuTitle')
            : source === 'deepseek-api'
              ? t('account.apiTitle')
              : t('account.balanceTitle')
      const accountUnavailable = account?.error || accountData?.error
      const balanceText = privacy && hasBalance ? t('usage.privacy') : hasBalance ? formatMicros(balance.totalMicros, currency) : ''
      const balanceDetail = hasBalance
        ? `${balanceTitle} · ${t('account.total')} ${formatMicros(balance.totalMicros, currency)} · ${t('account.recharge')} ${formatMicros(balance.rechargeMicros, currency)} · ${t('account.bonus')} ${formatMicros(balance.bonusMicros, currency)}`
        : ''
      let accountText = ''
      if (!available) accountText = t('account.unavailable')
      else if (signedIn === false) accountText = t('account.notSignedIn')
      else if (hasBalance) accountText = balanceText
      else if (accountUnavailable) accountText = t('account.unavailable')
      else accountText = '—'
      const accountMuted = !hasBalance

      return h(
        'div',
        {
          className: `ds-pill${dragging ? ' is-dragging' : ''}`,
          onClick: onToggle,
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel,
          onLostPointerCapture,
        },
        h(
          'button',
          {
            ref: buttonRef,
            type: 'button',
            className: 'ds-pill-main',
            title,
            draggable: false,
            'aria-expanded': open,
            'aria-controls': 'deepseek-status-panel',
            'aria-label': [
              actionLabel,
              statusLabel,
              hasBalance && !privacy ? `${t('account.balance')} ${formatMicros(balance.totalMicros, currency)} ${sourceLabel}` : '',
              hasBalance && privacy ? t('privacy.hide') : '',
            ]
              .filter(Boolean)
              .join(' · '),
          },
          h('span', { className: 'ds-mark', 'aria-hidden': 'true' }, h(Icon, { name: 'pulse', size: 16, strokeWidth: 2 })),
          h(
            'span',
            { className: 'ds-pill-copy' },
            h('span', { className: 'ds-pill-brand' }, t('pill.brand')),
            h(
              'span',
              { className: 'ds-pill-status', 'aria-live': 'polite' },
              h('span', { className: 'ds-dot', 'aria-hidden': 'true' }),
              statusLabel,
            ),
          ),
          h(
            'span',
            {
              className: 'ds-pill-account',
              title: hasBalance ? (privacy ? t('privacy.hide') : balanceDetail) : balanceTitle,
            },
            period
              ? h(
                  'span',
                  {
                    className: `ds-period is-${period}`,
                    title: period === 'peak' ? t('period.peakTitle') : t('period.offpeakTitle'),
                  },
                  t(period === 'peak' ? 'period.peak' : 'period.offpeak'),
                )
              : null,
            hasBalance && !accountMuted ? (
              privacy
                ? h('span', { className: 'ds-balance is-masked' }, t('usage.privacy'))
                : h(RollingAmount, { text: formatMicros(balance.totalMicros, currency), className: 'ds-balance' })
            ) : h(
                'span',
                { className: 'ds-balance is-muted' },
                account.initialLoading && !accountUnavailable ? '—' : accountText,
              ),
            hasBalance
              ? h('span', { className: 'ds-balance-source', title: balanceTitle }, sourceLabel)
              : null,
          ),
          stale ? h('span', { className: 'ds-pill-warn', title: t('stale.title') }, h(Icon, { name: 'alert', size: 12 })) : null,
          h(Icon, {
            name: 'chevron',
            size: 14,
            className: `ds-chevron${open ? ' is-open' : ''}`,
          }),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'ds-eye',
            disabled: !hasBalance,
            title: privacy ? t('privacy.show') : t('privacy.hide'),
            'aria-label': privacy ? t('privacy.show') : t('privacy.hide'),
            'aria-pressed': privacy,
            onPointerDown: (event) => event.stopPropagation(),
            onClick: (event) => {
              event.stopPropagation()
              onTogglePrivacy()
            },
          },
          h(Icon, { name: privacy ? 'eyeOff' : 'eye', size: 14 }),
        ),
      )
    }

    function Overall({ t, data, status, locale }) {
      const meta = statusMeta(status)
      return h(
        'div',
        { className: 'ds-overall' },
        h(
          'div',
          { className: 'ds-overall-head' },
          h('span', { className: 'ds-overall-icon' }, h(Icon, { name: meta.icon, size: 17 })),
          h('span', { className: 'ds-overall-title' }, t(meta.full)),
        ),
        h('p', { className: 'ds-overall-desc' }, t(meta.desc)),
        h(
          'div',
          { className: 'ds-overall-meta' },
          h('span', null, `${data.counts?.operational ?? 0}/${data.total ?? 0} ${t('meta.normal')}`),
          h('span', { className: 'ds-meta-dot', 'aria-hidden': 'true' }),
          h('span', null, `${t('meta.updated')} ${formatTime(data.fetchedAt, locale)}`),
        ),
      )
    }

    function ActiveChange({ t, change, locale }) {
      const tone = changeTone(change)
      const statusKey = CHANGE_LABELS[change.status]
      const label = statusKey ? t(statusKey) : change.status
      const affects =
        change.affectedCount === 1
          ? t('incident.affectedOne')
          : `${change.affectedCount} ${t('incident.affectedMany')}`
      return h(
        'div',
        { className: `ds-change ds-tone-${tone}` },
        h(
          'div',
          { className: 'ds-change-top' },
          h(Icon, { name: change.type === 'maintenance' ? 'wrench' : 'alert', size: 12 }),
          h('span', { className: 'ds-change-badge' }, label),
          h(
            'span',
            { className: 'ds-change-time', title: formatTime(change.startedAt, locale) },
            h(Icon, { name: 'clock', size: 10 }),
            `${t('meta.started')} ${relativeTime(change.startedAt, locale, t('time.justNow'))}`,
          ),
        ),
        h('p', { className: 'ds-change-title' }, displayChangeTitle(change.title, locale)),
        h(
          'p',
          { className: 'ds-change-affected' },
          change.affectedCount ? affects : t('incident.noComponents'),
        ),
      )
    }

    function ComponentRow({ t, component, locale }) {
      const meta = componentMeta(component.status)
      return h(
        'div',
        {
          className: `ds-component ds-tone-${meta.tone}${component.status === 'operational' ? '' : ' is-issue'}`,
          title: component.name,
        },
        h('span', { className: 'ds-dot', 'aria-hidden': 'true' }),
        h('span', { className: 'ds-component-name' }, displayComponentName(component.name, locale)),
        h('span', { className: 'ds-component-status' }, t(meta.key)),
      )
    }

    function ComponentGroups({ t, data, locale }) {
      return h(
        'div',
        { className: 'ds-section' },
        h(
          'div',
          { className: 'ds-section-head' },
          h('span', null, t('section.services')),
          h('span', { className: 'ds-section-count' }, data.total || 0),
        ),
        h(
          'div',
          { className: 'ds-groups' },
          (data.groups || []).map((group) => {
            const normal = group.components.filter((component) => component.status === 'operational').length
            return h(
              'div',
              { className: 'ds-group', key: group.id },
              h(
                'div',
                { className: 'ds-group-head' },
                h('span', { className: 'ds-group-name' }, displayGroupName(group, t, locale)),
                h('span', { className: 'ds-group-count' }, `${normal}/${group.components.length} ${t('meta.normal')}`),
              ),
              group.components.map((component) =>
                h(ComponentRow, { key: component.id, t, component, locale }),
              ),
            )
          }),
        ),
      )
    }

    function StatusTools({ t, onPlayBurst }) {
      const [open, setOpen] = React.useState(false)
      const previews = [
        { tone: 'warn', label: 'debug.degraded' },
        { tone: 'partial', label: 'debug.partial' },
        { tone: 'error', label: 'debug.outage' },
        { tone: 'success', label: 'debug.recovered' },
      ]
      return h(
        'div',
        { className: `ds-tools${open ? ' is-open' : ''}` },
        h(
          'button',
          {
            type: 'button',
            className: 'ds-tools-toggle',
            'aria-expanded': open,
            'aria-controls': 'ds-flash-tools',
            onClick: () => setOpen((current) => !current),
          },
          h('span', { className: 'ds-tools-title' }, t('debug.title')),
          h('span', { className: 'ds-tools-hint' }, open ? t('debug.collapse') : t('debug.expand')),
          h(Icon, {
            name: 'chevron',
            size: 12,
            className: `ds-tools-chevron${open ? ' is-open' : ''}`,
          }),
        ),
        open
          ? h(
              'div',
              { className: 'ds-tools-actions', id: 'ds-flash-tools' },
              previews.map((preview) =>
                h(
                  'button',
                  {
                    key: preview.tone,
                    type: 'button',
                    className: `ds-test-chip ds-tone-${preview.tone}`,
                    title: t(preview.label),
                    onClick: () => onPlayBurst(preview.tone),
                  },
                  h('span', { className: 'ds-dot', 'aria-hidden': 'true' }),
                  t(preview.label),
                ),
              ),
            )
          : null,
      )
    }

    function Panel({ t, locale, data, error, status, stale, refreshing, usage, privacy, onRefresh, onClose, onPlayBurst }) {
      const hasData = Boolean(data?.fetchedAt)
      const loading = !hasData && !error
      const failed = !hasData && Boolean(error)
      const meta = statusMeta(status)
      const panelTone = failed ? 'error' : meta.tone
      const autoLabel = isUrgentFeed(data) ? t('autoIncident') : t('auto')
      const footerTitle = [
        t('autoHint'),
        data?.checkedAt ? `${t('meta.checked')} ${formatTime(data.checkedAt, locale)}` : '',
      ]
        .filter(Boolean)
        .join(' · ')

      return h(
        'section',
        {
          className: `ds-panel ds-tone-${panelTone}`,
          id: 'deepseek-status-panel',
          role: 'region',
          'aria-label': t('panel.title'),
          'aria-busy': refreshing,
        },
        h(
          'header',
          { className: 'ds-head' },
          h('span', { className: 'ds-head-mark' }, h(Icon, { name: 'pulse', size: 17, strokeWidth: 2 })),
          h(
            'div',
            { className: 'ds-head-copy' },
            h('h2', { className: 'ds-head-title' }, t('panel.title')),
            h('span', { className: 'ds-head-sub' }, t('panel.subtitle')),
          ),
          h(
            'div',
            { className: 'ds-head-actions' },
            h(
              'button',
              {
                type: 'button',
                className: 'ds-icon-btn',
                onClick: onRefresh,
                disabled: refreshing,
                title: t('action.refresh'),
                'aria-label': t('action.refresh'),
              },
              h(Icon, { name: 'refresh', size: 15, className: refreshing ? 'ds-spin' : undefined }),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'ds-icon-btn',
                onClick: onClose,
                title: t('action.collapse'),
                'aria-label': t('action.collapse'),
              },
              h(Icon, { name: 'close', size: 15 }),
            ),
          ),
        ),
        h(
          'div',
          { className: 'ds-body' },
          loading
            ? h(
                'div',
                { className: 'ds-state', role: 'status' },
                h('span', { className: 'ds-loading-beacon', 'aria-hidden': 'true' }),
                h('strong', null, t('status.checking')),
                h('p', null, t('status.checkingDesc')),
              )
            : failed
              ? h(
                  'div',
                  { className: 'ds-state', role: 'alert' },
                  h(
                    'span',
                    { className: 'ds-state-icon' },
                    h(Icon, { name: 'alert', size: 19 }),
                  ),
                  h('strong', null, t('error.load')),
                  h('p', null, t('error.connect')),
                  h(
                    'button',
                    { type: 'button', className: 'ds-icon-btn', onClick: onRefresh },
                    h(Icon, { name: 'refresh', size: 13 }),
                    t('action.retry'),
                  ),
                )
              : h(
                  React.Fragment,
                  null,
                  stale
                    ? h(
                        'div',
                        { className: 'ds-stale', role: 'status' },
                        h(Icon, { name: 'alert', size: 13 }),
                        h(
                          'div',
                          null,
                          h('strong', null, t('stale.title')),
                          h(
                            'span',
                            null,
                            `${t('stale.body')}${data?.checkedAt ? ` · ${t('meta.checked')} ${formatTime(data.checkedAt, locale)}` : ''}`,
                          ),
                        ),
                      )
                    : null,
                  h(Overall, { t, data, status, locale }),
                  data.activeChanges?.length
                    ? h(
                        'div',
                        { className: 'ds-section' },
                        h(
                          'div',
                          { className: 'ds-section-head' },
                          h('span', null, t('section.active')),
                          h('span', { className: 'ds-section-count' }, data.activeChanges.length),
                        ),
                        h(
                          'div',
                          { className: 'ds-changes' },
                          data.activeChanges.map((change) =>
                            h(ActiveChange, {
                              key: change.id,
                              t,
                              change,
                              locale,
                            }),
                          ),
                        ),
                      )
                    : null,
                  h(ComponentGroups, { t, data, locale }),
                ),
          h(UsageSection, {
            t,
            locale,
            data: usage?.data || null,
            error: usage?.error || null,
            privacy,
            onRefresh,
          }),
          h(StatusTools, { t, onPlayBurst }),
        ),
        h(
          'footer',
          { className: 'ds-foot' },
          h(
            'span',
            { className: 'ds-foot-left', title: footerTitle },
            h(Icon, { name: 'refresh', size: 10 }),
            autoLabel,
          ),
          h(
            'a',
            { href: data?.page?.url || PAGE_URL, target: '_blank', rel: 'noreferrer noopener' },
            t('action.view'),
            h(Icon, { name: 'external', size: 10 }),
          ),
        ),
      )
    }

    function Monitor({ t, locale }) {
      const feed = useStatusFeed()
      const account = useAccountFeed(locale)
      const [open, setOpen] = React.useState(false)
      const [position, setPosition] = React.useState(readStoredPosition)
      const [dragging, setDragging] = React.useState(false)
      const [burst, setBurst] = React.useState(null)
      const [privacy, setPrivacy] = React.useState(readStoredPrivacy)
      const currency = account.data?.currency || 'CNY'
      const usage = useUsageFeed(open, 'CNY')
      const rootRef = React.useRef(null)
      const buttonRef = React.useRef(null)
      const positionRef = React.useRef(position)
      const dragRef = React.useRef(null)
      const suppressClick = React.useRef(false)
      const lastStatus = React.useRef({ status: null, fetchedAt: 0 })

      const updatePosition = React.useCallback((next) => {
        positionRef.current = next
        setPosition(next)
      }, [])

      const clampToViewport = React.useCallback(() => {
        const node = rootRef.current
        const current = positionRef.current
        if (!node || !current) return
        const rect = node.getBoundingClientRect()
        const maxRight = Math.max(8, window.innerWidth - rect.width - 8)
        const maxTop = Math.max(8, window.innerHeight - rect.height - 8)
        const next = {
          right: Math.round(clamp(current.right, 8, maxRight)),
          top: Math.round(clamp(current.top, 8, maxTop)),
        }
        if (next.right !== current.right || next.top !== current.top) updatePosition(next)
      }, [updatePosition])

      React.useEffect(() => {
        clampToViewport()
      }, [open, clampToViewport])

      React.useEffect(() => {
        const onResize = () => clampToViewport()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }, [clampToViewport])

      React.useEffect(() => {
        const node = rootRef.current
        if (!node || typeof ResizeObserver === 'undefined') return undefined
        const observer = new ResizeObserver(() => clampToViewport())
        observer.observe(node)
        return () => observer.disconnect()
      }, [clampToViewport])

      React.useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            buttonRef.current?.focus()
          }
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        window.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true)
          window.removeEventListener('keydown', onKeyDown)
        }
      }, [open])

      React.useEffect(() => {
        const incoming = feed.data
        if (!incoming?.fetchedAt || !incoming.status || incoming.status === 'unknown') return
        const previous = lastStatus.current
        if (previous.fetchedAt === incoming.fetchedAt) return

        const wasAbnormal = ABNORMAL_STATUSES.has(previous.status)
        const isAbnormal = ABNORMAL_STATUSES.has(incoming.status)
        if (previous.status !== null) {
          if (!wasAbnormal && isAbnormal) {
            setBurst({
              id: Date.now(),
              tone: statusMeta(incoming.status).tone,
              from: previous.status,
              to: incoming.status,
            })
          } else if (wasAbnormal && incoming.status === 'operational') {
            setBurst({
              id: Date.now(),
              tone: 'success',
              from: previous.status,
              to: incoming.status,
            })
          }
        }
        lastStatus.current = { status: incoming.status, fetchedAt: incoming.fetchedAt }
      }, [feed.data])

      React.useEffect(() => {
        if (!burst) return undefined
        const timer = window.setTimeout(() => setBurst(null), 1600)
        return () => window.clearTimeout(timer)
      }, [burst])

      const handlePointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        const node = rootRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startRight: window.innerWidth - rect.right,
          startTop: rect.top,
          moved: false,
          last: null,
        }
        suppressClick.current = false
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Pointer capture is an enhancement; dragging still works without it.
        }
      }

      const handlePointerMove = (event) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        const dx = event.clientX - drag.startX
        const dy = event.clientY - drag.startY
        if (!drag.moved && Math.hypot(dx, dy) < 6) return
        if (!drag.moved) {
          drag.moved = true
          setDragging(true)
        }
        const node = rootRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const maxRight = Math.max(8, window.innerWidth - rect.width - 8)
        const maxTop = Math.max(8, window.innerHeight - rect.height - 8)
        const next = {
          right: Math.round(clamp(drag.startRight - dx, 8, maxRight)),
          top: Math.round(clamp(drag.startTop + dy, 8, maxTop)),
        }
        drag.last = next
        updatePosition(next)
      }

      const endDrag = (event, persist) => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        setDragging(false)
        try {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        } catch {
          // The browser may already have released capture.
        }
        if (drag.moved) {
          suppressClick.current = true
          if (persist && drag.last) storePosition(drag.last)
        }
      }

      const handlePointerUp = (event) => endDrag(event, true)

      const handlePointerCancel = (event) => {
        const drag = dragRef.current
        dragRef.current = null
        setDragging(false)
        suppressClick.current = false
        try {
          if (drag && event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        } catch {
          // Nothing left to release.
        }
      }

      const handleLostPointerCapture = () => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        setDragging(false)
        if (drag.moved) {
          suppressClick.current = true
          if (drag.last) storePosition(drag.last)
        }
      }

      const toggle = () => {
        if (suppressClick.current) {
          suppressClick.current = false
          return
        }
        setOpen((current) => !current)
      }

      const refresh = () => {
        if (!feed.refreshing) void feed.refresh()
        void account.refresh()
        if (open) void usage.refresh()
      }

      const togglePrivacy = () => {
        setPrivacy((current) => {
          const next = !current
          storePrivacy(next)
          return next
        })
      }

      const playBurst = (tone) => {
        setBurst({ id: Date.now(), tone, from: 'manual', to: 'manual' })
      }

      const data = feed.data
      const error = feed.error || data?.error || null
      const waiting = !feed.error && (!data || (!data.fetchedAt && !data.error))
      const failed = !data?.fetchedAt && Boolean(error)
      const status = waiting ? 'checking' : failed ? 'unknown' : data?.status || 'unknown'
      const stale = Boolean(data?.stale || feed.error)
      const meta = statusMeta(status)
      const alertTone = meta.tone === 'error' || meta.tone === 'partial' || meta.tone === 'warn'
      const positionStyle = position ? { top: `${position.top}px`, right: `${position.right}px` } : undefined

      return h(
        'div',
        {
          className: `ds-monitor ds-tone-${meta.tone}${alertTone ? ' is-alert' : ''}`,
          ref: rootRef,
          style: positionStyle,
        },
        h('style', null, CSS),
        burst
          ? h('div', {
              key: burst.id,
              className: `ds-flash ds-tone-${burst.tone}`,
              'aria-hidden': 'true',
            })
          : null,
        h(StatusPill, {
          t,
          locale,
          data,
          status,
          stale: stale && Boolean(data?.fetchedAt),
          open,
          dragging,
          account,
          privacy,
          onTogglePrivacy: togglePrivacy,
          onToggle: toggle,
          buttonRef,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          onPointerCancel: handlePointerCancel,
          onLostPointerCapture: handleLostPointerCapture,
        }),
        open
          ? h(Panel, {
              t,
              locale,
              data,
              error,
              status,
              stale,
              refreshing: feed.refreshing || account.refreshing || usage.loading || Boolean(usage.data?.refreshing),
              usage,
              privacy,
              onRefresh: refresh,
              onPlayBurst: playBurst,
              onClose: () => {
                setOpen(false)
                buttonRef.current?.focus()
              },
            })
          : null,
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const t = ctx.locale.bind(NS)
        ctx.effect(() => {
          const disposeEn = ctx.locale.register(NS, 'en', DICT_EN)
          const disposeZh = ctx.locale.register(NS, 'zh', DICT_ZH)
          return () => {
            disposeEn()
            disposeZh()
          }
        }, 'deepseek-status: dictionaries')

        function OverlayEntry() {
          const snapshot = useLocaleSnapshot(ctx)
          const translate = ctx.locale.bind(NS)
          return h(Monitor, { t: translate, locale: snapshot.active })
        }

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'deepseek-status',
              order: 113,
              label: () => t('panel.title'),
            },
            OverlayEntry,
          ),
        )
      },
    }
  },
})
