# DeepSeek 服务状态监控（dsh-deepseek-status-monitor）

> [English](README.md) | 中文

悬浮在 DeepSeek Harness（DSH）Web 界面右上角的服务与用量监控条：不用离开对话，就能看到 DeepSeek 各项服务是否正常、当前账户余额与峰谷时段，以及本地估算的会话消耗 TOP3；服务状态翻转时还会全屏三闪提醒。

> 这是社区第三方插件，读取 DeepSeek 官方公开状态页 <https://status.deepseek.com/> 与配置的 DeepSeek 余额，与 DeepSeek 官方无隶属关系。
> 作者：无尽云岚 · 版本 1.1.0 · MIT 许可

## 功能

- **状态胶囊**：正常、降级、部分故障、全面故障、维护中、未知、检测中，七种状态一眼可辨，附带对应颜色的信号灯。
- **余额与峰谷**：优先 DeepSeek API Key 余额，失败回退 DSH 账户钱包；余额前用绿色 **谷** / 红色 **峰** 标识当前计费时段，并标注 **DS API / DS 账户** 来源。
- **隐私与数字转盘**：眼睛按钮遮住所有金额；余额变化逐位滚动，系统减少动态效果时自动关闭动画。
- **展开面板**：总体状态与「正常 / 总数」服务计数、进行中的故障与维护事件、按 **API 服务** 与 **Chat 服务** 分组的全部组件、最后更新时间与手动刷新、一键打开官方状态页。
- **会话消耗 TOP3**：今日与累计消耗最高的会话 TOP3，按金额降序，并常驻「金额为本地估算，仅供参考 · 实际以平台账单为准」备注。
- **全屏三闪提醒**：总体状态在正常与故障之间切换时，约 1.5 秒内全屏闪三次（故障按黄 / 橙红 / 红取色，恢复用绿色），鼠标穿透；系统开启「减少动态效果」时自动跳过。
- **可拖拽定位**：按住胶囊拖到任意位置，位置按浏览器源保存在本地，并自动限制在视口内。
- **掉线不空窗**：状态服务暂时不可达时，保留上一次成功的快照并标注过期，而不是直接消失。
- **自适应轮询**：健康时每 10 分钟、故障中每 1 分钟拉取一次；失败后 2 分钟重试。前端在故障期间也改为每分钟读取缓存。
- **明暗主题与中英双语**：跟随 Harness 当前语言与主题。
- **毛玻璃视觉**：胶囊、面板、内嵌卡片与页脚统一使用半透明分层，亮色 / 暗色下都可读。

## 安装

本插件以 DSH 插件包（bundle）形式分发，需要安装在某个 DSH profile 里。

### 方式一：从 GitHub 直接安装（推荐）

终端可用 DSH CLI 时，直接安装公开仓库：

```bash
dsh plugin --profile desktop add "github:realcloudblue/dsh-deepseek-status-monitor"
```

安装后重启 DSH，到插件页启用 `dsh-deepseek-status-monitor`。

### 方式二：使用安装包

1. 在深求社区插件页下载 `dsh-deepseek-status-monitor-1.1.0.zip`；
2. 解压到任意目录，例如 `C:\Users\你\Downloads\dsh-deepseek-status-monitor`；
3. 在终端执行（把路径换成你的解压目录）：

   ```bash
   dsh plugin --profile desktop add "C:\Users\你\Downloads\dsh-deepseek-status-monitor"
   ```

4. 重启 DSH（或在支持热更新的环境下重载），到 **设置 / 插件** 页确认 `dsh-deepseek-status-monitor` 已启用。

Windows PowerShell 一次做完：

```powershell
Expand-Archive .\dsh-deepseek-status-monitor-1.1.0.zip -DestinationPath .
dsh plugin --profile desktop add "$PWD\dsh-deepseek-status-monitor"
```

### 方式三：交给 Harness 代装

把深求社区的插件页链接发给你正在用的 Harness，让它下载安装包、解压后按上面的命令安装即可。安装完成后同样需要重启并确认启用。

## 使用

- 拖动胶囊可移动位置；点击胶囊展开或收起面板。
- 胶囊显示余额来源、峰谷标签与余额；眼睛按钮切换隐私模式，状态保存在本地。
- 面板显示总体状态、组件、活动事件，以及今日 / 累计会话消耗 TOP3。
- 面板里的刷新按钮同时刷新状态与余额（重复点击会被合并）。
- 面板底部的 **Flash test** 可手动试播三闪效果，不影响真实状态。
- 关闭面板用右上角 **×**，胶囊会继续保留在界面上。

## 环境要求

- DeepSeek Harness **0.2.x**（Web GUI：桌面端或 `dsh web`）
- 能访问 `https://status.deepseek.com/`
- 已登录 DSH DeepSeek 账户以读取账户钱包，或配置 `DEEPSEEK_API_KEY` 读取 API 余额；两者都不可用时显示不可用
- 无需额外依赖，插件文件自包含

## 数据与隐私

- Host 请求公开状态页 JSON，并提供同源、带鉴权的 `GET /deepseek-status/api`、`/account`、`/usage` 接口；所有接口都经过 `connection.requestRejection`。
- 余额通过 DSH 的 DeepSeek 凭据 / 账户服务读取；API Key 与账户 token 只留在 Host，不进入浏览器，也不写入插件缓存。
- 会话消耗估算读取本地 DSH 会话日志，只在 `$DSH_HOME/storages/deepseek-status/usage-cache.v1.json` 保存 token 分桶（日期 / 峰谷 / 模型），不保存消息正文。
- 逐会话金额是**本地估算**，不是平台账单；界面始终显示免责声明，实际扣费可能不同。
- 浏览器只保存胶囊位置（`deepseek-status.position.v1`）和隐私开关，不保存余额或会话内容。
- 请求量低：健康时状态每天约 144 次，余额 / 用量最多每分钟刷新一次。

## 卸载

在 DSH 的插件页移除，或在终端执行：

```bash
dsh plugin --profile desktop remove dsh-deepseek-status-monitor
```

## 文件结构

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半部：轮询状态页、读取 DeepSeek 余额、建立增量会话消耗索引、提供同源鉴权接口 |
| `client.js` | Client 半部：悬浮胶囊、展开面板、余额 / 隐私 / 会话消耗 UI、全屏三闪 |
| `cordis.patch.yml` | 把插件插入 profile 的插件名册 |
| `locale/zh.json`、`locale/en.json` | 插件管理器中显示的名称与简介 |
| `icon.svg` | 插件图标 |
| `package.json` | 包元信息与 `dsh.bundle` / `dsh.client` 声明 |

## 已知限制

- 依赖 `status.deepseek.com` 的公开接口与其页面 ID；DeepSeek 更换状态服务或页面 ID 时需要更新 `index.js` 里的常量。
- 只适用于 Web GUI，不提供终端 / ACP 形态。
- 不发送浏览器系统通知，只在界面内提示。
- 会话消耗是按 DeepSeek 官方 token 价格计算的本地估算，不是平台账单。
- 消耗索引使用 2026 年北京时间峰谷日历与本地 DSH 会话日志；价格、节假日或日志结构变化时需要更新。
- 余额当前只支持 DeepSeek API / 账户；Kimi / 智谱适配器保留但本版关闭，OpenAI / Anthropic / Gemini 没有统一简单余额接口。

## English

A floating DeepSeek status, balance and session-spend dashboard for the DSH Web GUI. It reads the public status page at <https://status.deepseek.com/>, shows the DeepSeek API/account balance and locally estimated Today/All-time session-spend TOP3, and plays a full-screen triple flash when the aggregate state crosses between normal and an incident. Install with `dsh plugin --profile desktop add "github:realcloudblue/dsh-deepseek-status-monitor"` (or from the release zip), then restart DSH and enable the bundle in the plugins page.

## 许可证

[MIT](./LICENSE)
