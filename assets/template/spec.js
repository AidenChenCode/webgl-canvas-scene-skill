/* spec.js — 项目配置 + 时间表。BEAT 由 engine-visual.js 按 SPEC.bpm 定义，这里用 b(n) 换算拍→秒 */
'use strict';
const SPEC = {
  title: 'Scene',
  width: 1920, height: 1080, fps: 30,
  duration: 10,                 // 秒；导出帧数 = duration × fps
  bpm: 120,                     // 切点放在拍上
  seed: 1,                      // 所有随机的种子
  colors: { primary: '#E2231A', ink: '#141418', gray: '#7A7A80', paper: '#F2EFE6', accent: '#F2C46B', dark: '#07070B' },
  fonts: {
    sans: '"Avenir Next", "Helvetica Neue", Arial, sans-serif',
    cn: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    mono: '"SF Mono", Menlo, Consolas, monospace',
  },
  hud: { show: true, topLeft: ['SCENE  v1.0', 'WEBGL2 · CANVAS2D'], bottomLeft: 'CODE MOTION · 2026', spectrum: false, fadeAt: 9.2 },
  music: { outGain: 0.75 },     // 有音乐层时的输出增益
};

// 时间表：以拍定义，scenes.js / score.js 只引用 TL，不写死秒数
const b = n => n * 60 / SPEC.bpm;
const TL = {
  start: 0,
  hit: b(8),                    // 落点：4.0 s @120
  fade: SPEC.duration - 0.8,
  end: SPEC.duration,
};

// video-verify 的核对项（可选）：应有起音的切点 + 各时刻底色类型
SPEC.verify = { cues: [TL.hit], colors: [{ t: 0.05, kind: 'dark' }, { t: SPEC.duration - 0.05, kind: 'black' }] };
