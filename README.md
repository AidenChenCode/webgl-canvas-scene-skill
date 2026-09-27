# webgl-canvas-scene — 画面层 Claude Code Skill

> Visual layer of a code-generated video pipeline: author animation pages as pure functions of time `t` with a WebGL2 light-effects layer (RGBA16F HDR accumulation, instanced glow / trail / burst sprites, additive lines) plus a Canvas2D layer for typography, blueprint annotations and HUD — exposing a small page contract (`__ready / __meta / __seek`) so any frame can be rendered on demand and exported headlessly.

技术栈五层里的**画面**层。光效画进浮点纹理做加法累积，文字与平面图形用 Canvas2D 叠在上面；任何一帧只依赖 `t`，所以可以随机访问、并行导出、两次渲染逐比特一致。

## 安装

```bash
git clone https://github.com/AidenChenCode/webgl-canvas-scene-skill.git ~/.claude/skills/webgl-canvas-scene
```

## 使用

在 Claude Code 里说「用代码做一个 XX 动画 / 片头画面 / 粒子光效」即可触发。手动：

```bash
mkdir my-scene && cp -R ~/.claude/skills/webgl-canvas-scene/assets/template/. my-scene/
open my-scene/index.html        # 点 PLAY 预览；?frame=N 看静态帧
# 改 spec.js（画幅 / 时长 / bpm / 配色 / 时间表）和 scenes.js（四个钩子 look / fx / draw / overlay）
```
导出成视频用 [headless-export](https://github.com/AidenChenCode/headless-export-skill)，配乐用 [webaudio-score](https://github.com/AidenChenCode/webaudio-score-skill)。

## 结构

```
SKILL.md                          工作流与铁律
assets/template/index.html        壳（两层 canvas + PLAY）
assets/template/spec.js           配置 + 以拍定义的时间表
assets/template/engine-visual.js  引擎：GL 光效层、2D 助手、字母表、字标/徽标、HUD、页面契约
assets/template/scenes.js         起步示例分镜
references/engine-api.md          API 速查与确定性规则
references/effects-cookbook.md    视觉配方（火花、冲击环、星座网络、拖尾、爆发、乱码、蓝图、拼字母、光条…）
references/page-contract.md       与导出层的契约；自写 three.js / p5 页面如何接入
```

## 同一套技术栈的其它 skill

| 层 | 仓库 |
|---|---|
| 画面 | webgl-canvas-scene-skill（本仓库） |
| 音乐 | [webaudio-score-skill](https://github.com/AidenChenCode/webaudio-score-skill) |
| 导出 | [headless-export-skill](https://github.com/AidenChenCode/headless-export-skill) |
| 编码 | [ffmpeg-encode-skill](https://github.com/AidenChenCode/ffmpeg-encode-skill) |
| 核对 | [video-verify-skill](https://github.com/AidenChenCode/video-verify-skill) |
| 组合体 | [motion-graphics-skill](https://github.com/AidenChenCode/motion-graphics-skill)（品牌动画一键出片） |
