# DeepSeek Status Monitor (dsh-deepseek-status-monitor)

A floating DeepSeek dashboard in the top-right corner of the DeepSeek Harness (DSH) Web UI. It shows service health, the DeepSeek account balance, peak/off-peak pricing, and locally estimated session-spend TOP3 — without leaving the conversation — and plays a full-screen triple flash when the overall service state flips.

> A community third-party plugin that reads the public DeepSeek status page at <https://status.deepseek.com/> and the configured DeepSeek balance. It is not affiliated with DeepSeek.
> Author: 无尽云岚 · Version 1.1.0 · MIT License
>
> [中文说明](README.zh-CN.md)

## Features

- **Status pill**: Seven states at a glance — operational, degraded, partial outage, major outage, maintenance, unknown, and checking — each with a color-coded signal light.
- **Balance and pricing period**: DeepSeek API-key balance first, DSH account wallet as fallback, with a green **谷** (off-peak) or red **峰** (peak) label and a **DS API / DS 账户** source tag.
- **Privacy mode and rolling digits**: The eye button masks all monetary values; balance changes roll digit-by-digit (suppressed for reduced motion).
- **Expanded panel**: Overall status and an "operational / total" service count; active incidents and maintenance events; all components grouped by **API services** and **Chat services**; last update time and manual refresh; one-click access to the official status page.
- **Session spend TOP3**: Today and all-time TOP3 sessions by locally estimated spend, sorted descending, with a persistent "estimated locally, actual billing on the platform" note.
- **Full-screen triple flash**: When the overall state crosses between normal and an incident, the screen flashes three times in about 1.5 seconds (yellow / orange-red / red for incidents, green for recovery), with mouse click-through. Automatically skipped when the system "reduce motion" setting is on.
- **Draggable position**: Drag the pill anywhere; its position is stored locally per browser origin and clamped to the viewport.
- **No blank state when offline**: If the status service is temporarily unreachable, the last successful snapshot is kept and marked as stale instead of disappearing.
- **Adaptive polling**: Every 10 minutes while healthy, every minute during an incident, and a 2-minute retry after a failure. The frontend also switches to once-a-minute cache reads during incidents.
- **Light/dark themes and bilingual UI**: Follows Harness's current language and theme.
- **Frosted-glass visuals**: The pill, panel, embedded cards, and footer share translucent layered styling that stays readable in light and dark modes.

## Installation

This plugin is distributed as a DSH bundle and must be installed into a DSH profile.

### Option 1: Install directly from GitHub (recommended)

With the DSH CLI available, install the public repository directly:

```bash
dsh plugin --profile desktop add "github:realcloudblue/dsh-deepseek-status-monitor"
```

Then restart DSH and enable `dsh-deepseek-status-monitor` on the Plugins page.

### Option 2: Install from the package

1. Download `dsh-deepseek-status-monitor-1.1.0.zip` from the DeepSeek.club community plugin page.
2. Extract it to any directory, for example `C:\Users\you\Downloads\dsh-deepseek-status-monitor`.
3. In a terminal, run (replace the path with your extraction directory):

   ```bash
   dsh plugin --profile desktop add "C:\Users\you\Downloads\dsh-deepseek-status-monitor"
   ```

4. Restart DSH (or reload in an environment that supports hot reload), then open **Settings / Plugins** and confirm that `dsh-deepseek-status-monitor` is enabled.

One-liner in Windows PowerShell:

```powershell
Expand-Archive .\dsh-deepseek-status-monitor-1.1.0.zip -DestinationPath .
dsh plugin --profile desktop add "$PWD\dsh-deepseek-status-monitor"
```

### Option 3: Let Harness install it

Send the DeepSeek.club plugin page link to the Harness you are using and ask it to download the package, extract it, and run the command above. After installation, restart DSH and confirm that the plugin is enabled.

## Usage

- Drag the pill to move it; click it to expand or collapse the panel.
- The pill shows the balance source, current peak/off-peak label and the balance. Use the eye button for privacy mode; the choice is remembered locally.
- The panel shows overall status, components, active changes, and the Today / All-time session-spend TOP3 cards.
- The refresh button refreshes both status and balances immediately (repeated clicks are coalesced).
- **Flash test** at the bottom of the panel previews the triple-flash effect without changing the real status.
- Close the panel with the **×** in the top-right corner; the pill remains on screen.

## Requirements

- DeepSeek Harness **0.2.x** (Web GUI: desktop app or `dsh web`)
- Network access to `https://status.deepseek.com/`
- A signed-in DSH DeepSeek account for the account wallet, or `DEEPSEEK_API_KEY` for the API balance; if neither is available, the pill shows unavailable
- No additional dependencies; the plugin files are self-contained

## Data and privacy

- The Host requests the public status-page JSON and exposes same-origin authenticated routes: `GET /deepseek-status/api`, `/account` and `/usage`. All routes pass through `connection.requestRejection`.
- Balance is read through the DSH DeepSeek credentials/account services. API keys and account tokens stay in the Host; they are never sent to the browser or written to the plugin cache.
- Session-spend estimation reads local DSH session logs and stores only token buckets (day, peak/off-peak, model) under `$DSH_HOME/storages/deepseek-status/usage-cache.v1.json`. It does not store message text.
- Per-session amounts are **local estimates**, not Platform invoices; the UI always shows the disclaimer. Actual billing can differ.
- The browser stores only the pill position (`deepseek-status.position.v1`) and the privacy flag; it does not store balances or session content.
- Request volume is low: status about 144 requests/day while healthy, balance/usage refreshed at most once per minute. Upstream response bodies are small.

## Uninstall

Remove the plugin from the DSH Plugins page, or run:

```bash
dsh plugin --profile desktop remove dsh-deepseek-status-monitor
```

## File structure

| File | Purpose |
|---|---|
| `index.js` | Host half: polls the status page, reads the DeepSeek balance, builds the incremental session-spend index, and serves authenticated routes |
| `client.js` | Client half: floating pill, expanded panel, balance/privacy/session-spend UI, and full-screen triple flash |
| `cordis.patch.yml` | Inserts the plugin into the profile's plugin registry |
| `locale/zh.json`, `locale/en.json` | Name and description shown in the plugin manager |
| `icon.svg` | Plugin icon |
| `package.json` | Package metadata and `dsh.bundle` / `dsh.client` declarations |

## Known limitations

- Depends on the public `status.deepseek.com` API and its page ID. If DeepSeek changes the status service or page ID, the constant in `index.js` must be updated.
- Web GUI only; no terminal / ACP form factor.
- Does not send browser system notifications; alerts appear only inside the UI.
- Session spend is a local estimate based on official DeepSeek token prices; it is not a Platform invoice.
- The spend index uses the 2026 Beijing peak/off-peak calendar and local DSH session logs; it must be updated when prices, holidays, or the log schema change.
- Balance currently supports DeepSeek API/account only. Kimi/Zhipu adapters are reserved but disabled in this release; OpenAI/Anthropic/Gemini do not expose a standard simple balance API.

## License

[MIT](./LICENSE)
