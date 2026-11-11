# DeepSeek 服务状态监控（dsh-deepseek-status-monitor）

> [English](README.md) | 中文

悬浮在 DeepSeek Harness（DSH）Web 界面右上角的服务健康监控条：不用离开对话，就能看到 DeepSeek 各项服务当前是否正常；一旦服务状态在「正常 / 故障」之间翻转，还会用一次全屏三闪提醒你。

> 这是社区第三方插件，读取 DeepSeek 官方公开状态页 <https://status.deepseek.com/>，与 DeepSeek 官方无隶属关系。
> 作者：无尽云岚 · 版本 1.0.0 · MIT 许可

## 功能

- **状态胶囊**：正常、降级、部分故障、全面故障、维护中、未知、检测中，七种状态一眼可辨，附带对应颜色的信号灯。
- **展开面板**：总体状态与「正常 / 总数」服务计数、进行中的故障与维护事件（状态、开始时间、受影响服务数）、按 **API 服务** 与 **Chat 服务** 分组的全部组件、最后更新时间与手动刷新、一键打开官方状态页。
- **全屏三闪提醒**：总体状态在正常与故障之间切换时，约 1.5 秒内全屏闪三次（故障按黄 / 橙红 / 红取色，恢复用绿色），鼠标穿透；系统开启「减少动态效果」时自动跳过。
- **可拖拽定位**：按住胶囊拖到任意位置，位置按浏览器源保存在本地，并自动限制在视口内。
- **掉线不空窗**：状态服务暂时不可达时，保留上一次成功的快照并标注过期，而不是直接消失。
- **自适应轮询**：健康时每 10 分钟、故障中每 1 分钟拉取一次；失败后 2 分钟重试。前端在故障期间也改为每分钟读取缓存。
- **明暗主题与中英双语**：跟随 Harness 当前语言与主题。
- **毛玻璃视觉**：胶囊、面板、内嵌卡片与页脚统一使用半透明分层，亮色 / 暗色下都可读。

## 安装

本插件以 DSH 插件包（bundle）形式分发，需要安装在某个 DSH profile 里。

### 方式一：使用安装包（推荐）

1. 在深求社区插件页下载 `dsh-deepseek-status-monitor-1.0.0.zip`；
2. 解压到任意目录，例如 `C:\Users\你\Downloads\dsh-deepseek-status-monitor`；
3. 在终端执行（把路径换成你的解压目录）：

   ```bash
   dsh plugin --profile web add "C:\Users\你\Downloads\dsh-deepseek-status-monitor"
   ```

4. 重启 DSH（或在支持热更新的环境下重载），到 **设置 / 插件** 页确认 `dsh-deepseek-status-monitor` 已启用。

Windows PowerShell 一次做完：

```powershell
Expand-Archive .\dsh-deepseek-status-monitor-1.0.0.zip -DestinationPath .
dsh plugin --profile web add "$PWD\dsh-deepseek-status-monitor"
```

### 方式二：交给 Harness 代装

把深求社区的插件页链接发给你正在用的 Harness，让它下载安装包、解压后按上面的命令安装即可。安装完成后同样需要重启并确认启用。

## 使用

- 拖动胶囊可移动位置；点击胶囊展开或收起面板。
- 面板里的刷新按钮可立即拉取一次最新状态（2 秒内重复点击会被合并）。
- 面板底部的 **Flash test** 可手动试播三闪效果，不影响真实状态。
- 关闭面板用右上角 **×**，胶囊会继续保留在界面上。

## 环境要求

- DeepSeek Harness **0.2.x**（Web GUI：桌面端或 `dsh web`）
- 能访问 `https://status.deepseek.com/`
- 无需额外依赖，插件文件自包含

## 数据与隐私

- Host 半部只请求公开的状态页 JSON，并把它转成同源、带鉴权的快照接口 `GET /deepseek-status/api`（`?refresh=1` 表示立即刷新）。
- 插件不采集、不上报任何使用数据；不上传你的对话、文件或凭据。
- 界面上记住的只有胶囊位置（浏览器 `localStorage`，键名 `deepseek-status.position.v1`）。
- 请求频率很低：健康时每天约 144 次、响应体约 0.4 MB；只有故障期间才会提高到每分钟一次。

## 卸载

在 DSH 的插件页移除，或在终端执行：

```bash
dsh plugin --profile web remove dsh-deepseek-status-monitor
```

## 文件结构

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半部：轮询状态页、归一化快照、提供同源鉴权接口 |
| `client.js` | Client 半部：悬浮胶囊、展开面板、全屏三闪 |
| `cordis.patch.yml` | 把插件插入 profile 的插件名册 |
| `locale/zh.json`、`locale/en.json` | 插件管理器中显示的名称与简介 |
| `icon.svg` | 插件图标 |
| `package.json` | 包元信息与 `dsh.bundle` / `dsh.client` 声明 |

## 已知限制

- 依赖 `status.deepseek.com` 的公开接口与其页面 ID；DeepSeek 更换状态服务或页面 ID 时需要更新 `index.js` 里的常量。
- 只适用于 Web GUI，不提供终端 / ACP 形态。
- 不发送浏览器系统通知，只在界面内提示。

## English

A floating DeepSeek service status monitor for the DSH Web GUI. It reads the public status page at <https://status.deepseek.com/>, shows the overall state and active incidents, and plays a full-screen triple flash when the aggregate state crosses between normal and an incident. Install with `dsh plugin --profile web add <path-to-unzipped-package>` after downloading the release zip from the DeepSeek.club plugin page, then restart DSH and enable the bundle in the plugins page.

## 许可证

[MIT](./LICENSE)
