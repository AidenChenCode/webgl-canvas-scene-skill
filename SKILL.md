---
name: webgl-canvas-scene
description: "画面层：用 WebGL2（RGBA16F 浮点纹理 HDR 累积、实例化精灵做辉光/拖尾/爆发/连线）+ Canvas2D（文字、线框、蓝图标注、HUD）写'时间 t 的纯函数'动画页面，自带页面契约（__seek / __meta / __ready），可直接被 headless-export 逐帧导出成视频。当用户要'用代码做动画/动效/粒子/光效/片头画面''写一个 canvas 或 WebGL 动画''做视频的画面部分''逐帧渲染的网页动画''kinetic typography''程序化视觉'，或任何最终要变成视频的代码画面时触发；纯浏览器里播放、不导出的动画也适用。不要用 CSS 动画或 GIF 方案代替。"
---

# WebGL2 + Canvas2D 画面层

目标：写一个**任意帧只依赖时间 t** 的动画页面。光效（辉光、拖尾、爆发、连线）画在 WebGL2 层，文字与平面图形画在 Canvas2D 层，两层叠加。因为是纯函数，导出脚本可以随机访问、并行渲染任何一帧，两次渲染逐比特一致。

## 上下游

- 下游：`headless-export`（逐帧导出 PNG + 音频）→ `ffmpeg-encode`（编码）→ `video-verify`（核对）。
- 平行：`webaudio-score`（音乐层，同页加载、共用时间表）。
- 现成组合：`motion-graphics` skill 用这一层做了一套品牌动画分镜；只想改品牌出片就用它，想自由写画面就用本 skill。

## 工作流

### 1. 建项目
```bash
mkdir -p <dir> && cp -R <skill>/assets/template/. <dir>/
```
得到 `index.html`（壳）、`spec.js`（配置 + 时间表）、`engine-visual.js`（引擎，不改）、`scenes.js`（分镜，主要写这里）。双击 `index.html` 点 PLAY 预览；`index.html?frame=120` 静态看第 120 帧。

### 2. 定 `spec.js`
画幅 / fps / 时长 / bpm / seed / 配色 / 字体 / HUD。**时间表 `TL` 用拍定义**（`b(n)`），所有场景切点、落点都引用 `TL.*`，不在 scenes.js 里写死秒数——改 bpm 或调整结构时不会散架，音乐层也引用同一张表。

### 3. 写 `scenes.js`（四个钩子）
```js
PROJECT.look(t)          → { bg:[r,g,b], grain, vig, theme:'dark'|'light'|'primary', expo? }   // 底色/颗粒/暗角
PROJECT.fx(t)            // 只调 GL.sprite / glow / trail / line —— 辉光、拖尾、粒子、连线
PROJECT.draw(t, frame)   // 只调 ui 与 txt / rrect / ring2d / dim / scramble / typewriter / drawGlyph / drawBadge
PROJECT.overlay(t)       // flash / fadeBlack，画在 HUD 之上
```
元素入场用 `sat(t, T0, d)` 做 0→1 进度再套缓动（`easeOutExpo` / `spring`），退场用 `1 - sat(t, T1, d)`。粒子先在加载时用 `mulberry32(SPEC.seed + k)` 生成数据表，位置写成 `x = f(t)`（利萨茹、`v·(1−e^(−k·tau))/k` 减速、`sin` 摆动）。现成配方（火花、冲击环、星座网络、流光拖尾、爆发与纸屑、乱码、蓝图标注、基本件拼字母、描边灌入、镜头光条、环绕光点、打字机、模糊入场）见 `references/effects-cookbook.md`，API 见 `references/engine-api.md`。

### 4. 看效果
改一次看一次：浏览器里 `?frame=N`，或用 headless-export 抽几帧：`node <headless-export>/scripts/export.mjs <dir>/index.html --test 45,120,240` → `build/test_*.png`，**用 Read 打开看**。

### 5. 交出去
页面已满足契约（`references/page-contract.md`）。要音乐：把 `webaudio-score` 的 `engine-audio.js` 与一个 `score.js` 放进目录，取消 `index.html` 里两行注释。然后 `headless-export` → `ffmpeg-encode` → `video-verify`。

## 铁律

1. **纯函数**：不用 `Math.random()`、`Date.now()`、逐帧累积的状态；`preserveDrawingBuffer` 已开，不要改。
2. **分层**：大面积模糊/辉光只在 GL 层做（加法混合，alpha 可 >1 表示更亮）；2D 层不要用 `filter: blur` 画大块（慢且不一致），文字模糊入场除外。
3. **拍点**：切换、重击、落位放在 `TL` 的拍上。
4. **看图**再下结论；文字是否溢出、颜色是否协调脚本测不出。
5. 换分辨率时按 `W/1920`、`H/1080` 缩放 scenes.js 里的像素常量（引擎本身不限分辨率）。

## 文件

```
assets/template/index.html · spec.js · engine-visual.js · scenes.js
references/engine-api.md          全局常量、缓动、GL API、2D 助手、字母表、字标/徽标、HUD、钩子契约、确定性规则
references/effects-cookbook.md    视觉配方（代码 + 旋钮）
references/page-contract.md       与导出层的契约；自写页面（three.js/p5 等）如何接入
```
