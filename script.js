/* ═══════════════════════════════════════════════════════════════
   COFFEE & LIBRARY — JavaScript
   Version: 1.0
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── NAVBAR: Scroll behaviour ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function onScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ─── MOBILE MENU ─── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.getElementById('mobile-close');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link, .mobile-cta') : [];

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus trap: focus first link
    const firstLink = mobileMenu.querySelector('.mobile-link');
    if (firstLink) setTimeout(() => firstLink.focus(), 100);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (clicking outside nav)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
})();

/* ─── SCROLL REVEAL ─── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(el => observer.observe(el));
})();

/* ─── SMOOTH ANCHOR SCROLL ─── */
(function initSmoothScroll() {
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    });
  });
})();

/* ─── HERO VIDEO: performance ─── */
(function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  // Pause video on reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    video.pause();
    video.removeAttribute('autoplay');
  }

  // On mobile with slow connection, don't autoplay
  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.effectiveType === '2g' || conn.saveData) {
      video.pause();
      video.removeAttribute('autoplay');
    }
  }

  // Pause when not in viewport (battery/performance)
  const videoObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!prefersReduced.matches) video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.2 }
  );

  videoObserver.observe(video);
})();

/* ─── GALLERY: stagger reveal ─── */
(function initGalleryStagger() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, i) => {
    item.style.setProperty('--delay', `${(i % 4) * 0.08}s`);
  });
})();

/* ─── ATMOSPHERE: parallax ─── */
(function initAtmosphereParallax() {
  const section = document.querySelector('.atmosphere');
  const img = section ? section.querySelector('.atm-img') : null;
  if (!section || !img) return;

  // Only on desktop (no parallax on mobile for performance)
  const mq = window.matchMedia('(min-width: 769px)');
  if (!mq.matches) return;

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function updateParallax() {
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;

    if (rect.bottom < 0 || rect.top > viewH) return;

    const progress = (viewH - rect.top) / (viewH + rect.height);
    const shift = (progress - 0.5) * 60;

    img.style.transform = `translateY(${shift}px) scale(1.12)`;
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();

/* ─── FINAL CTA: parallax ─── */
(function initFinalParallax() {
  const section = document.querySelector('.final-cta');
  const img = section ? section.querySelector('.final-img') : null;
  if (!section || !img) return;

  const mq = window.matchMedia('(min-width: 769px)');
  if (!mq.matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  img.style.transform = 'translateY(0) scale(1.1)';

  function update() {
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > viewH) return;
    const progress = (viewH - rect.top) / (viewH + rect.height);
    const shift = (progress - 0.5) * 50;
    img.style.transform = `translateY(${shift}px) scale(1.1)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── STAGGER FINAL LINES ─── */
(function initFinalLines() {
  const lines = document.querySelectorAll('.final-lines span');
  const section = document.querySelector('.final-cta');
  if (!lines.length || !section) return;

  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(12px)';
    line.style.transition = `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`;
  });

  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      lines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  obs.observe(section);
})();

/* ─── NAV ACTIVE STATE on scroll ─── */
(function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('nav-link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav-link--active');
            }
          });
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || 72)}px 0px 0px 0px`,
    }
  );

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ─── HERO CONTENT: push down on load ─── */
(function initHeroEntrance() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Ensure reveal class triggers on hero immediately
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroContent.classList.add('revealed');
    }, 200);
  });
})();
