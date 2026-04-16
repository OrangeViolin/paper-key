# 纸上键 · paper-key

> 给你的键盘一百种灵魂 · 打字即禅

**[👉 立即试玩](https://orangeviolin.github.io/paper-key/)**

一个浏览器里就能用的中文机械键盘音效站。20+ 款音色，从 HHKB 静电容到木鱼、清明雨、猫叫、算盘……挑一个敲起来试试。

## 特点

- 🎹 **20+ 款东方意境音色** — 机械键盘、节气、老物件、动物
- 🎯 **连击彩蛋** — 10 连击触发"叹气"，50 连击触发"钟磬"
- 🧘 **禅意模式 + 专注模式** — 25 分钟番茄钟，敲字即冥想
- 🎨 **01fish 墨绿宣纸风** — 不花里胡哨，安静好看
- ⚡ **纯前端，零后端** — Web Audio API 实时合成，无需下载

## 本地运行

```bash
git clone https://github.com/orangeviolin/paper-key.git
cd paper-key
python3 -m http.server 8000
# 打开 http://localhost:8000
```

或直接双击 `index.html`。

## Mac 全局生效？

当前版本**只在浏览器内响**。想让所有 App（VSCode / 微信 / Word）敲字都有音效，推荐方案：

- **过渡**：[Mechvibes](https://mechvibes.com/)（免费开源，Mac/Win/Linux 全平台）
- **未来**：Tauri + rdev 版纸上键 Mac App — 排队中

## 支持项目

纸上键完全免费开源。如果它让你敲字时多了一点点开心，欢迎：

- ⭐ 点个 Star
- 🍵 [请我喝杯茶](https://orangeviolin.github.io/paper-key/#support)
- 🐛 提 Issue 报 Bug / 想要的音色

## 许可

MIT © [01fish](https://01fish.com)
