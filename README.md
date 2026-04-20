# 纸上键 · paper-key

> 给你的键盘一百种灵魂 · 打字即禅

一个极简的 **macOS 机械键盘音效 App** — 在任何 App 里敲任何键，都能出真实机械键盘的声音。18 款真实录音 · 23 MB 原生 · 不带 Electron。

<p>
  <a href="https://github.com/OrangeViolin/paper-key/releases/latest">
    <img src="https://img.shields.io/github/v/release/OrangeViolin/paper-key?color=1A3328&label=Release" alt="release">
  </a>
  <img src="https://img.shields.io/badge/macOS-11%2B-1A3328" alt="macOS">
  <img src="https://img.shields.io/badge/Arch-Apple%20Silicon-1A3328" alt="arch">
  <img src="https://img.shields.io/badge/License-GPL--3.0-C44536" alt="license">
</p>

这是 [Mechvibes](https://mechvibes.com) 在 macOS 上的精神续作 — 同样的音色库，但用 **Tauri 2 + Rust** 原生重写，零 Electron 开销。

---

## 特点

- 🎹 **18 款真实机械键盘录音** — Cherry MX（青/茶/红/黑 · ABS/PBT）、Topre 静电容、Holy Pandas、NK Cream、Everglide Oreo / Crystal Purple、Tealio Turquoise、Travel 系列…
- 🌏 **全局生效** — 在任意 App 里敲键都出声（浏览器、编辑器、终端、Finder、微信…），不止本窗口
- 🧭 **三步权限引导** — 首次启动自动带你授权 Input Monitoring，不用自己摸索系统设置
- 🔄 **权限失效一键修复** — ad-hoc 签名更新后 CDHash 会漂移，内置诊断面板会自动检测 + 提示修复步骤
- 🎚️ **音量调节** + **选择记忆** — 关了再开还是你上次用的那款
- 🎨 **宣纸美学** — 墨绿 / 朱红 / 宣纸三色，中文书法感 UI，不花里胡哨
- 📦 **23 MB 安装包** — CGEventTap + Web Audio，启动即开

---

## 下载 & 安装

### 1. 下载

到 [Releases](../../releases/latest) 页面，下载最新的 `纸上键-v*.dmg`（Apple Silicon，macOS 11+）。

### 2. 拖到应用程序

打开 DMG，把「纸上键」拖到 `/Applications/`。

### 3. 首次打开：右键 → 打开

> ⚠️ 本 App 使用 **ad-hoc 签名**，没经过 Apple 公证。双击会被 Gatekeeper 拦。

正确姿势：在 `/Applications/` 里找到「纸上键」，**右键 → 打开**，弹窗里再点「打开」。之后就可以双击了。

### 4. 授权输入监控

跟着 App 里的三步引导走：

**欢迎** → **解释权限用途** → **点「去开启」**（会弹系统授权对话框）

然后在**系统设置 → 隐私与安全性 → 输入监控** 里打开「纸上键」开关，回到 App，敲键盘 → 出声 🎵。

> 为什么要这个权限？macOS 对「全局捕获键盘事件」的 App 要求 **Input Monitoring（输入监控）** 权限，跟截屏录屏同级。
> App 只监听「哪个键被按下」这个信号，不读取键的内容，也不联网。

### 5. 遇到「⚠ 权限失效」？

ad-hoc 签名的代码哈希（CDHash）每次更新都会变，老的权限记录会失效。App 会自动检测并在状态栏提示，点一下会打开修复面板，按步骤把「纸上键」从列表删掉再拖回来即可。

详见 **[INSTALL.md](./INSTALL.md)** 的「权限失效怎么办」章节。

---

## 适合谁

- 用 Mac 写作 / 编程，想要机械键盘手感又不想买机械键盘的人
- 有机械键盘但半夜不想打扰室友 / 家人的人
- 喜欢 mechvibes 但受不了 Electron 体积的人
- 想体验一下中文书法感 + 宣纸风 UI 的键盘音效 App

**不适合**：

- 不在 macOS 上 — 请用 [mechvibes](https://mechvibes.com)（跨平台）
- Intel Mac — 当前只编译了 Apple Silicon，需要自己 `cargo build --target x86_64-apple-darwin`
- 要上 App Store 的 — GPL-3.0 与 App Store 条款不兼容

---

## 常见问题

| 问题 | 解决 |
|------|------|
| 双击打不开 / 显示「来自身份不明的开发者」 | 右键 → 打开 |
| 按键没声音 | 看状态栏提示；或点「诊断」看是不是 Input Monitoring 没开 |
| 更新后权限失效 | 点状态栏「⚠ 权限失效」→ 按引导修复 |
| 声音太吵 / 太小 | App 内音量条可调 |
| 想换音色 | 点任意一张卡片切换，选择会被记住 |
| 想加自己的音色 | 见下面「添加新音色」 |

更多排错：[INSTALL.md](./INSTALL.md)

---

## 开发

```bash
# 1. 拉音色（首次必跑，从 mechvibes 上游克隆 18 款音色包到 src/assets/sounds/）
bash scripts/fetch-sounds.sh

# 2. 装依赖
npm install
rustup target add aarch64-apple-darwin  # M 系列 Mac

# 3. 开发模式
npm run tauri dev -- --target aarch64-apple-darwin

# 4. 一键打包（build + ad-hoc 签名 + 自定义 DMG）
bash scripts/release.sh 0.2.0
# 产物：dist/纸上键-v0.2.0.dmg（约 23 MB，含 /Applications 拖拽符号链接）
```

### 目录结构

```
paper-key/
├── src/                    # 前端（原生 HTML + JS，无框架）
│   ├── index.html          # 18 张音色卡 + 状态栏
│   ├── app.js              # 音色加载 + Web Audio 播放 + Tauri event 桥
│   ├── onboarding.js       # 三步引导 + 权限状态 + 诊断面板
│   ├── onboarding.css
│   ├── style.css           # 宣纸风 UI
│   └── assets/sounds/      # 18 款音色包（fetch-sounds.sh 拉）
├── src-tauri/
│   └── src/lib.rs          # CGEventTap 全局监听 + IOHID 权限 + 诊断命令
├── scripts/
│   ├── fetch-sounds.sh     # 拉音色
│   └── release.sh          # 一键打包
└── INSTALL.md              # 给 beta 用户的安装/排错指南
```

### 添加新音色

1. 在 `src/assets/sounds/<id>/` 放 `config.json` + 音频文件（格式见 [mechvibes 文档](https://github.com/hainguyents13/mechvibes#custom-sounds)）
2. 在 `src/index.html` 里复制一张 `.card` 加上 `data-pack="<id>"`

---

## 技术选型 & 踩过的坑

### 为什么不用 rdev？

[rdev](https://github.com/Narsil/rdev) 是 Rust 社区最成熟的跨平台键盘监听库，最初用的就是它。但在 macOS 14+ 上会崩：它的 callback 线程里调 `TSMGetInputSourceProperty`，触发 `dispatch_assert_queue_fail` → `SIGTRAP`（macOS 14+ 对 queue assertion 收得更紧）。

最终放弃，直接用 core-graphics 的 **CGEventTap + ListenOnly mode** 自己写，约 150 行 Rust。

### 为什么走 Input Monitoring 而不是 Accessibility？

历史上 Mac 键盘音效类 App 基本都要「辅助功能（Accessibility）」权限，那个权限太重（可以模拟点击、修改其他 App 的状态），给全局键盘监听有点用力过猛。

macOS 10.15+ 引入了更细粒度的 **Input Monitoring** 权限，专门管「只读监听键盘事件」这件事。本 App 走这个权限，更符合最小权限原则。

代码里通过 IOHID API（`IOHIDCheckAccess` / `IOHIDRequestAccess`）检测和申请，不走 CGEventTap 的 prompt（那个会强制要 Accessibility）。

### 依赖

| 用途 | 库 | 作者 |
|------|----|------|
| 桌面 App 框架 | [Tauri 2](https://tauri.app) | tauri-apps |
| macOS FFI | [core-foundation-rs](https://github.com/servo/core-foundation-rs) | Mozilla / Servo |
| CGEventTap 绑定 | [core-graphics](https://crates.io/crates/core-graphics) | Mozilla / Servo |
| JSON | [serde](https://serde.rs) | dtolnay et al. |

---

## 致谢

**本项目是站在巨人的肩膀上拼起来的。强烈建议先去给下面这些项目点个 Star。**

### 核心 — mechvibes

[**hainguyents13/mechvibes**](https://github.com/hainguyents13/mechvibes) by Hai Nguyen — **本项目所有 18 款音色包直接来自 mechvibes 仓库**，`config.json` 格式（`defines` 字段、sprite 偏移）也完全沿用。mechvibes 是 Electron 版本，跨平台支持 Windows / macOS / Linux。

**如果你不在 Mac 上，或者想要上游的完整生态（键盘音效商店、自定义音色分享等），请直接用 mechvibes。**

- 协议：**GPL-3.0**（本项目因此也采用 GPL-3.0）
- 音色文件全部来自 [`mechvibes/src/audio/`](https://github.com/hainguyents13/mechvibes/tree/master/src/audio)
- 原始录制者的 attribution 详见 mechvibes 上游 README

### 深度参与

**Claude Code**（Anthropic 的 CLI 编码工具）深度参与了这个项目的开发 — 从权限模型调研、CGEventTap 排错到 onboarding UI，都是人机协作的产物。

---

## 支持项目 🍵

纸上键完全免费开源。如果它让你敲字时多了一点点开心，欢迎：

- ⭐ **[点个 Star](../../stargazers)**
- 🐛 **[提 Issue](../../issues)** — 报 Bug / 想要的音色 / 想法
- 🍵 **请我喝杯茶** — 微信扫下面这个码：

<p align="center">
  <img src="./src/assets/wechat-pay.png" alt="微信赞赏" width="240">
</p>

哪怕只是一杯咖啡钱，都是对继续迭代的最大鼓励。

---

## License

**GPL-3.0-or-later** — 因为引用了 mechvibes 的音色资产（GPL-3.0），本项目保持一致授权。

- 完整协议文本：[LICENSE](LICENSE)
- 版权声明 / 衍生作品声明 / 第三方依赖：[NOTICE](NOTICE)

### 这意味着什么

- ✅ 你可以**自由使用、修改、再分发**本项目（商业用途也可以）
- ⚠️ 任何基于本项目的修改或衍生作品，**必须也采用 GPL-3.0 开源**
- ⚠️ 分发二进制时必须同时提供完整源码（或给出可获取源码的方式）
- ⚠️ 保留原始 `LICENSE` / `NOTICE` / 版权声明，不得移除
- ⚠️ GPL-3.0 与 Apple App Store 分发条款不兼容，**本项目无法上架 Mac App Store**

---

## 作者

**[01fish](https://01fish.com)** · 上海 · 做 AI 产品 + 写点东西

- 网站：[01fish.com](https://01fish.com)
- 微信公众号：`01fish` / 小红书：`01fish`

如果喜欢这个项目的审美 / 气质，欢迎来公众号串门。
