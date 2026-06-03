/**
 * GEO Marketing Group — motion runtime.
 * Dependency-free. Bundled by Astro via a <script> import in Base.astro.
 * Everything degrades gracefully without JS and honours prefers-reduced-motion.
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Scroll-triggered reveals ------------------------------------ */
function initReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
}

/* ---- Count-up numerals ------------------------------------------- */
function animateCount(el: HTMLElement) {
  const to = parseFloat(el.dataset.to ?? el.textContent ?? '0');
  const decimals = parseInt(el.dataset.decimals ?? '0', 10);
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  const dur = 1500;
  const start = performance.now();

  const fmt = (n: number) =>
    `${prefix}${n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  function frame(now: number) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = fmt(to * eased);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = fmt(to);
  }
  requestAnimationFrame(frame);
}

function initCountUps() {
  const els = document.querySelectorAll<HTMLElement>('[data-countup]');
  if (!els.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      const to = parseFloat(el.dataset.to ?? '0');
      const decimals = parseInt(el.dataset.decimals ?? '0', 10);
      el.textContent = `${el.dataset.prefix ?? ''}${to.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${el.dataset.suffix ?? ''}`;
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---- Magnetic buttons -------------------------------------------- */
function initMagnetic() {
  if (reduce || window.matchMedia('(pointer: coarse)').matches) return;
  const els = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* ---- Scroll progress bar ----------------------------------------- */
function initScrollProgress() {
  if (reduce) return;
  const root = document.documentElement;
  let ticking = false;
  const update = () => {
    const max = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--scroll', max > 0 ? String(root.scrollTop / max) : '0');
    ticking = false;
  };
  document.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

function boot() {
  initReveals();
  initCountUps();
  initMagnetic();
  initScrollProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
