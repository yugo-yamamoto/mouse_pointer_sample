(function () {
  const STYLE_ID = '__glove_cursor__';
  const cursorUrl = chrome.runtime.getURL('cursor.png');
  const css = `*, *::before, *::after { cursor: url("${cursorUrl}") 26 10, auto !important; }`;

  function applyCursor() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  function removeCursor() {
    const s = document.getElementById(STYLE_ID);
    if (s) s.remove();
  }

  // ---- Sparkle canvas ----
  const COLORS = ['#FFD700', '#FFF8A0', '#FFFFFF', '#B0E0FF', '#FFB6E1', '#C8FF80'];
  let canvas, ctx, particles = [], rafId = null;

  function initCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100vw', 'height:100vh',
      'pointer-events:none',
      'z-index:2147483646',
    ].join(';');
    resize();
    document.documentElement.appendChild(canvas);
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function removeCanvas() {
    if (!canvas) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    window.removeEventListener('resize', resize);
    canvas.remove();
    canvas = ctx = null;
    particles = [];
  }

  function spawnParticles(x, y) {
    const count = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.floor(Math.random() * 30),
      });
    }
  }

  function drawStar(x, y, size, rotation) {
    const spikes = 4, outer = size, inner = size * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = rotation + (i * Math.PI) / spikes;
      i === 0 ? ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
              : ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rotation += p.rotSpeed;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      drawStar(p.x, p.y, p.size, p.rotation);
      ctx.restore();
    }
    rafId = requestAnimationFrame(tick);
  }

  function startSparkle() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', startSparkle); return; }
    initCanvas();
    if (!rafId) rafId = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMouseMove);
  }

  function stopSparkle() {
    document.removeEventListener('mousemove', onMouseMove);
    removeCanvas();
  }

  function onMouseMove(e) {
    spawnParticles(e.clientX, e.clientY);
  }

  // ---- State management ----
  chrome.storage.local.get({ cursorEnabled: true, sparkleEnabled: true }, ({ cursorEnabled, sparkleEnabled }) => {
    if (cursorEnabled)  applyCursor();
    if (sparkleEnabled) startSparkle();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.cursorEnabled)  changes.cursorEnabled.newValue  ? applyCursor()   : removeCursor();
    if (changes.sparkleEnabled) changes.sparkleEnabled.newValue ? startSparkle()  : stopSparkle();
  });
})();
