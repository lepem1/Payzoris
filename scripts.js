/* ===== HERO CANVAS — HEX GRID PARTICLES ===== */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function drawHex(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      drawHex(ctx, p.x, p.y, p.size);
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 180)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles(60);
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles(60);
  });
})();

/* ===== 3D CARD TILT + CURSOR GLOW ===== */
(function initCardTilt() {
  const card = document.getElementById('demoCard');
  if (!card) return;
  const inner = card.querySelector('.demo-card-inner');
  const cursorGlow = card.querySelector('.demo-card-cursor-glow');
  const glowSize = 160;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    /* Tilt */
    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 14;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    /* Cursor glow */
    if (cursorGlow) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      cursorGlow.style.background = `radial-gradient(circle ${glowSize}px at ${px}px ${py}px, rgba(255, 192, 0, 0.12), transparent 100%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (cursorGlow) {
      cursorGlow.style.background = 'radial-gradient(circle 120px at 50% 50%, rgba(255, 192, 0, 0.08), transparent 100%)';
    }
  });

  if (window.DeviceOrientationEvent) {
    let beta = 0, gamma = 0;
    window.addEventListener('deviceorientation', (e) => {
      if (e.beta !== null) beta = e.beta;
      if (e.gamma !== null) gamma = e.gamma;
      const rotateX = Math.max(-12, Math.min(12, (beta - 45) * 0.3));
      const rotateY = Math.max(-12, Math.min(12, gamma * 0.3));
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });
  }
})();

/* ===== SCROLL PROGRESS BAR ===== */
(function initProgressBar() {
  const bar = document.getElementById('heroProgress');
  if (!bar) return;

  window.addEventListener(
    'scroll',
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    },
    { passive: true }
  );
})();

/* ===== MOBILE HAMBURGER / MENU ===== */
(function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('navOverlay');
  if (!hamburger || !overlay) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  document.querySelectorAll('.nav-menu-link').forEach((link) => {
    link.addEventListener('click', toggleMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) toggleMenu();
  });
})();

/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  for (const el of reveals) {
    observer.observe(el);
  }
})();

/* ===== STAT COUNTERS ===== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const isFloat = target % 1 !== 0;
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            el.textContent = isFloat
              ? current.toFixed(1)
              : Math.floor(current).toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = isFloat
                ? target.toFixed(1)
                : Math.floor(target).toLocaleString();
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      }
    },
    { threshold: 0.5 }
  );

  for (const el of counters) {
    observer.observe(el);
  }
})();
