/* ============================================================
   CABB — Shared JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────
     1. ACTIVE NAV LINK (by filename)
  ───────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ─────────────────────────────────
     2. MOBILE HAMBURGER
  ───────────────────────────────── */
  const toggle   = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─────────────────────────────────
     3. NAVBAR SCROLL SHADOW
  ───────────────────────────────── */
  const navbar = document.querySelector('nav');
  if (navbar) {
    const onScroll = () => {
      navbar.style.boxShadow = window.scrollY > 30
        ? '0 2px 24px rgba(0,0,0,.35)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────
     4. FADE-IN OBSERVER
  ───────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────
     5. BACK TO TOP
  ───────────────────────────────── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────
     6. SMOOTH SCROLL (hash links)
  ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (navbar ? navbar.offsetHeight : 80) + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────
     7. COUNTER ANIMATION (stat numbers)
  ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.getAttribute('data-count');
        const dur    = 1600;
        const step   = Math.ceil(target / (dur / 16));
        let cur = 0;
        const timer = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = cur.toLocaleString('th-TH');
        }, 16);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ─────────────────────────────────
     8. CONTACT FORM (contact.html)
  ───────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fname   = (document.getElementById('fname')   || {}).value?.trim();
      const email   = (document.getElementById('email')   || {}).value?.trim();
      const message = (document.getElementById('message') || {}).value?.trim();
      const fb      = document.getElementById('formFeedback');

      if (!fname || !email || !message) {
        showFb(fb, 'กรุณากรอกข้อมูลให้ครบ', 'error'); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFb(fb, 'รูปแบบอีเมลไม่ถูกต้อง', 'error'); return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '⏳ กำลังส่ง...';

      setTimeout(() => {
        showFb(fb, `ขอบคุณ ${fname}! ทีม CABB จะติดต่อกลับเร็ว ๆ นี้ 🎉`, 'success');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'ส่งข้อความ ✈️';
      }, 1200);
    });
  }

  function showFb(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className   = 'form-feedback ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'form-feedback'; }, 5000);
  }

});
