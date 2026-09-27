# engine-visual.js API

加载顺序 `spec.js → engine-visual.js → [engine-audio.js] → scenes.js → [score.js]`，全是经典脚本，顶层 `const` 共享全局作用域，`file://` 可直接打开。

## 全局常量

| 名称 | 说明 |
|---|---|
| `SPEC` | spec.js 的配置 |
| `W H FPS DUR FRAMES CX CY` | 画幅、帧率、时长（秒）、总帧数、中心 |
| `BEAT` | `60 / SPEC.bpm`（引擎定义；spec.js 里用 `b(n) = n * 60 / SPEC.bpm` 换算，不要再声明 `BEAT`） |
| `TL` | spec.js 里的时间表（可选） |
| `C` | `SPEC.colors` |
| `MONO SANS CN` | 字体栈（`SPEC.fonts.mono/sans/cn`） |
| `PROJECT` | 钩子挂载点（`window.PROJECT`） |

坐标：像素，原点左上。

## 随机与缓动

```js
mulberry32(seed)()          // 确定性 [0,1)
hash2(a, b)                 // 两个整数 → [0,1)
clamp lerp sat(t, t0, d)    // sat：t0 起 d 秒内 0→1
easeOutCubic easeInCubic easeInOut easeOutExpo easeOutBack easeInBack
spring(age, w=16, z=0.42)   // 闭式弹簧 0→1
hexRGB('#rrggbb') → [r,g,b] (0..1)      pad2(n)
```

## GL 光效层

每帧 `draw()` 调 `GL.begin()` → `PROJECT.fx(t)` → `GL.end(bg, grain, vig, frame, expo)`。加法混合进 RGBA16F 纹理，`1 − exp(−hdr)` 色调映射，alpha 可大于 1。

```js
GL.sprite(x, y, sx, sy, r, g, b, a, rot=0, shape=0)   // 0 辉光 / 1 光核 / 2 光条(rot 方向)
GL.glow(x, y, size, r, g, b, a, coreMul=1)            // 辉光 + 白光核
GL.trail(t, path, n, dt, size, r, g, b, a, head=true) // 沿 path(tk)→{x,y} 的拖尾
GL.line(x1, y1, x2, y2, r, g, b, a)
GL.hasFloat                                           // 无 EXT_color_buffer_float 时退回 RGBA8
```
容量 8000 精灵 / 6000 线每帧。`grain` 暗场 0.05、浅场 0.02；`vig` 0.2–0.55。

## 2D 图形层（`ui`）

```js
txt(s, x, y, {font, color, alpha, align, baseline, ls, blur})
rrect(x, y, w, h, r)                                   // 只建路径
ring2d(cx, cy, tBirth, t, color, maxR, dur, lw=2)      // 冲击环
dim(x1, y1, x2, y2, label, alpha, color)               // 尺寸标注
scramble(s, pool, p, frame, salt)   CN_POOL / EN_POOL  // 乱码
typewriter(s, t, t0, cps=0.075, cursor='|')
flash(t, tc, strength=0.85, k=16)   fadeBlack(t, t0, dur)
```

基本件字母表：`GLYPHS[a–z]`（`line/arc/dot` 部件，100×140 字框），`drawGlyph(ch, gx, gy, scale, age, stagger)`、`drawPart(part, u, lw)`；弧与点=`C.primary`，横竖线=`C.ink`，斜线=`C.gray`。

字标/徽标（`SPEC.brand` 可选：`latin / cn / logo{src,height,tint} / wordmarkWidth`）：`wordmark()`、`markSize(s)`、`badgeRect(cx, cy, s)`、`drawMark(cx, cy, s, color)`、`drawBadge(cx, cy, s, alpha)`。

HUD（`SPEC.hud` 可选）：`topLeft[2]`、`topRight`、`bottomLeft`、`spectrum`、`spectrumFrom`、`headerFadeIn`、`fadeAt`、`show`；`theme==='light'` 时前景用墨色。

## 钩子契约

```js
PROJECT.look(t)  → { bg:[r,g,b], grain, vig, theme, expo? }   // 缺省：暗底
PROJECT.fx(t)                 // GL
PROJECT.draw(t, frame, look)  // 2D
PROJECT.overlay(t, frame)     // 可选
PROJECT.score(kit)            // 由 webaudio-score 的 score.js 提供（可选）
```
顺序：look → GL → 清 2D → draw → hud → overlay。

## 页面契约（导出用）

`window.__ready`、`window.__meta = {title, W, H, FPS, DUR, FRAMES, BPM, hasFloat, TL, verify, primary, hasAudio}`、`window.__seek(frame)`；`?export=1`、`?frame=N`。详见 page-contract.md。

## 确定性规则

- 数据表在加载时用 `mulberry32(SPEC.seed + k)` 生成一次；位置写成 `t` 的闭式。
- 不用 `Math.random()` / `Date.now()` / `performance.now()`（预览时钟除外，引擎内部）。
- 颗粒用整数哈希（引擎内置），不要改回 `fract(sin())`。
- 缓存只缓存与 `t` 无关的量。
