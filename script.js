/* ===== Starfield ===== */
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 1.6,
  }));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ===== Typewriter ===== */
function typewriter(selector, text, speed) {
  const el = document.querySelector(selector);
  if (!el) return;
  speed = speed || 45;
  el.textContent = '';
  el.classList.add('typewriter-text');
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
    } else {
      clearInterval(timer);
      el.classList.remove('typewriter-text');
      el.classList.add('typewriter-done');
    }
  }, speed);
}

/* ===== Sequential typewriter for multiple elements ===== */
function typewriterAll(items, defaultSpeed) {
  let chain = Promise.resolve();
  items.forEach(function (item) {
    chain = chain.then(function () {
      return new Promise(function (resolve) {
        const el = document.querySelector(item.sel);
        if (!el) { resolve(); return; }
        const text = item.text || el.dataset.text || el.textContent;
        el.textContent = '';
        el.classList.add('typewriter-text');
        const speed = item.speed || defaultSpeed || 40;
        let i = 0;
        const timer = setInterval(function () {
          if (i < text.length) {
            el.textContent += text[i++];
          } else {
            clearInterval(timer);
            el.classList.remove('typewriter-text');
            el.classList.add('typewriter-done');
            setTimeout(resolve, item.pause || 300);
          }
        }, speed);
      });
    });
  });
  return chain;
}
