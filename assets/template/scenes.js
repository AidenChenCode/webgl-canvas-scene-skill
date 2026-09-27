/* scenes.js — 起步示例：星尘 + 一颗带拖尾的光点 + 落点（光条闪 + 冲击环 + 白闪）+ 标题乱码入场 + 淡出
   四个钩子：look(t) 底色/颗粒/暗角/主题 · fx(t) GL 光效 · draw(t, frame, look) 2D 图形 · overlay(t) 白闪/淡出
   所有东西只依赖 t。更多配方见 references/effects-cookbook.md */
'use strict';
const ACC = hexRGB(C.accent), PRIM = hexRGB(C.primary), DARK = hexRGB(C.dark);
const DUST = (() => {
  const R = mulberry32(SPEC.seed + 11); const a = [];
  for (let i = 0; i < 200; i++) a.push({ x: R() * W, y: R() * H, s: 1.2 + R() * 2.4, p: R() * 6.28, sp: 0.4 + R() });
  return a;
})();
const TITLE = (SPEC.title || 'SCENE').toUpperCase();

PROJECT.look = t => ({ bg: DARK, grain: 0.045, vig: 0.5, theme: 'dark' });

PROJECT.fx = t => {
  const endFade = 1 - sat(t, TL.fade, 0.6);
  for (const d of DUST) {
    const x = d.x + 14 * Math.sin(t * 0.21 * d.sp + d.p), y = d.y + 9 * Math.cos(t * 0.17 * d.sp + d.p * 2);
    const tw = 0.35 + 0.35 * Math.sin(t * 1.7 * d.sp + d.p * 3);
    GL.sprite(x, y, d.s * 2.6, d.s * 2.6, 1, 0.93, 0.82, tw * 0.3 * endFade, 0, 1);
  }
  // 光点沿利萨茹轨迹飞行并拖尾
  const path = tk => ({ x: CX + 520 * Math.sin(tk * 0.7), y: CY - 60 + 180 * Math.sin(tk * 1.1 + 1.3) });
  GL.trail(t, path, 20, 0.022, 18, ACC[0], ACC[1], ACC[2] * 0.7, 0.6 * sat(t, 0.3, 0.6) * endFade);
  // 落点：水平光条 + 主色辉光
  const tau = t - TL.hit;
  if (tau >= 0) {
    const fl = Math.exp(-tau * 6);
    GL.sprite(CX, CY, 900 * (0.5 + fl), 30, 1, 0.9, 0.8, 1.4 * fl, 0, 2);
    GL.sprite(CX, CY, 500 * (0.6 + fl), 500 * (0.6 + fl), PRIM[0], PRIM[1], PRIM[2], 0.9 * fl, 0, 0);
  }
};

PROJECT.draw = (t, frame) => {
  const endFade = 1 - sat(t, TL.fade, 0.8);
  if (t >= TL.hit) {
    const p = sat(t, TL.hit, 0.3);
    const s = p < 1 ? scramble(TITLE, EN_POOL, p, frame, 7) : TITLE;
    txt(s, CX, CY + 60, { font: `700 180px ${SANS}`, color: '#fff', align: 'center', ls: 14, alpha: endFade });
    txt(typewriter('WEBGL2 · CANVAS2D · A PURE FUNCTION OF t', t, TL.hit + 0.4, 0.04), CX, CY + 130, { font: `500 22px ${MONO}`, color: C.accent, align: 'center', ls: 6, alpha: 0.9 * endFade });
  } else {
    txt('STANDBY', CX, CY + 60, { font: `500 22px ${MONO}`, color: '#fff', align: 'center', ls: 10, alpha: 0.4 * (0.6 + 0.4 * Math.sin(t * 4)) });
  }
  ring2d(CX, CY, TL.hit, t, 'rgba(255,255,255,0.7)', 1100, 0.9, 3);
};

PROJECT.overlay = t => { flash(t, TL.hit); fadeBlack(t, TL.fade, 0.8); };
