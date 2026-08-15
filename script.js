/* ═══════════════════════════════════════════════════════════════
   COFFEE & LIBRARY — JavaScript
   Version: 1.0
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── PRELOADER ─── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const minDisplayTime = 1800; // minimum ms to show preloader
  const startTime = Date.now();

  function hidePreloader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(() => {
        preloader.remove();
      }, 600);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
})();

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

/* ─── SCROLL PROGRESS INDICATOR ─── */
(function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ─── HERO CANVAS PARTICLES (Warm ambient bokeh / steam motes) ─── */
(function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = initial ? Math.random() * (height || window.innerHeight) : (height || window.innerHeight) + 10;
      this.size = Math.random() * 3.5 + 1.2;
      this.speedY = Math.random() * 0.4 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * 0.02 + 0.01;
      this.pulseDir = 1;
      // Warm amber / cream golden tone
      this.hue = Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(203, 187, 170, ';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += this.pulse * this.pulseDir;
      if (this.opacity > 0.75 || this.opacity < 0.15) {
        this.pulseDir *= -1;
      }
      if (this.y < -10 || this.x < -10 || this.x > (width || window.innerWidth) + 10) {
        this.reset(false);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.hue}${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let isVisible = true;
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const obs = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    obs.observe(heroSection);
  }

  function animate() {
    if (isVisible && width > 0 && height > 0) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── NIGHT / ATMOSPHERE MODE ─── */
(function initNightMode() {
  const themeBtns = [
    document.getElementById('nav-theme-btn'),
    document.getElementById('mob-theme-btn'),
    document.getElementById('float-theme-btn')
  ].filter(Boolean);

  const savedTheme = localStorage.getItem('cl_night_mode');
  if (savedTheme === 'true') {
    document.body.classList.add('night-mode');
  }

  function updateIcons(isNight) {
    themeBtns.forEach(btn => {
      const iconSpan = btn.querySelector('.theme-icon') || btn.querySelector('.ctrl-icon');
      if (iconSpan) {
        iconSpan.textContent = isNight ? '☀️' : '🌙';
      }
      if (btn.id === 'mob-theme-btn') {
        btn.textContent = isNight ? '☀️ Gündüz Modu' : '🌙 Gece Modu';
        btn.classList.toggle('active', isNight);
      }
    });
  }

  updateIcons(document.body.classList.contains('night-mode'));

  function toggleTheme() {
    const isNight = document.body.classList.toggle('night-mode');
    localStorage.setItem('cl_night_mode', isNight);
    updateIcons(isNight);
  }

  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
})();

/* ─── INTERACTIVE MENU TABS ─── */
(function initMenuTabs() {
  const tabBtns = document.querySelectorAll('.menu-tab');
  const categories = document.querySelectorAll('.menu-category');

  if (!tabBtns.length || !categories.length) return;

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      categories.forEach(cat => {
        const catType = cat.getAttribute('data-cat');
        if (filter === 'all' || filter === catType) {
          cat.classList.remove('hidden');
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(10px)';
          setTimeout(() => {
            cat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
          }, 30);
        } else {
          cat.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── FLAVOR FINDER (Interaktif: Kahveni & Eşlikçini Bul) ─── */
(function initFlavorFinder() {
  const chips = document.querySelectorAll('.mood-chip');
  const coffeeName = document.getElementById('res-coffee-name');
  const coffeeNote = document.getElementById('res-coffee-note');
  const foodName = document.getElementById('res-food-name');
  const foodNote = document.getElementById('res-food-note');
  const orderBtn = document.getElementById('flavor-order-btn');
  const resultBox = document.getElementById('flavor-result-box');

  if (!chips.length || !coffeeName) return;

  const recommendations = {
    reading: {
      coffee: 'Kadifemsi Flat White',
      coffeeNote: 'Çift shot espresso ve yoğun mikro süt köpüğü ile sakin anların dengeli eşlikçisi.',
      food: 'Basque Cheesecake',
      foodNote: 'Karamelize üst doku ve eriyen kremsi iç kıvamıyla eşsiz bir uyum.',
      orderText: 'Merhaba, sitedeki öneriniz olan Flat White & Basque Cheesecake ikilisini tatmak istiyorum!'
    },
    focus: {
      coffee: 'Özel Seri Cold Brew & Double Americano',
      coffeeNote: '16 saat soğuk damıtılmış, narenciye ve çikolata notalarına sahip yüksek odak sağlayıcı.',
      food: 'Cevizli Islak Brownie',
      foodNote: '%70 Belçika çikolatası ile harmanlanmış taze fırın lezzeti.',
      orderText: 'Merhaba, sitedeki öneriniz olan Cold Brew & Brownie ikilisini tatmak istiyorum!'
    },
    refresh: {
      coffee: 'Kitap Eşlikçisi Iced Latte',
      coffeeNote: 'Buz küpleri üzerinde yavaşça süzülen espresso ve soğuk sütün ferahlatıcı dansı.',
      food: 'Meyveli Belçika Waffle',
      foodNote: 'Taze çilek, muz, fıstık ve sıcak Belçika çikolata sosu eşliğinde.',
      orderText: 'Merhaba, sitedeki öneriniz olan Iced Latte & Waffle ikilisini tatmak istiyorum!'
    },
    cozy: {
      coffee: 'Közde Ağır Pişmiş Türk Kahvesi',
      coffeeNote: 'Taze çekilmiş çekirdeklerden, kadim ritüellerle közde yavaşça demlenen geleneksel aroma.',
      food: 'San Sebastian & Çikolata Sos',
      foodNote: 'Sıcak eritilmiş çikolata şelalesiyle servis edilen fırın tatlısı.',
      orderText: 'Merhaba, sitedeki öneriniz olan Türk Kahvesi & San Sebastian ikilisini tatmak istiyorum!'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const mood = chip.getAttribute('data-mood');
      const data = recommendations[mood];
      if (!data) return;

      resultBox.style.opacity = '0.3';
      resultBox.style.transform = 'scale(0.98)';

      setTimeout(() => {
        coffeeName.textContent = data.coffee;
        coffeeNote.textContent = data.coffeeNote;
        foodName.textContent = data.food;
        foodNote.textContent = data.foodNote;
        orderBtn.href = `https://wa.me/905066595134?text=${encodeURIComponent(data.orderText)}`;

        resultBox.style.opacity = '1';
        resultBox.style.transform = 'scale(1)';
      }, 180);
    });
  });
})();

/* ─── QR MENÜ MODAL ─── */
(function initQRModal() {
  const modal = document.getElementById('qr-modal');
  const openBtn = document.getElementById('open-qr-modal-btn');
  const closeBtn = document.getElementById('qr-modal-close');
  const backdrop = document.getElementById('qr-modal-backdrop');
  const directBtn = document.getElementById('qr-direct-menu-btn');
  const qrImg = document.getElementById('qr-dynamic-img');

  if (!modal || !openBtn) return;

  function updateQRCode() {
    if (!qrImg) return;
    let targetUrl = window.location.href.split('#')[0] + '#menu';
    // Fallback if opened locally as file://
    if (window.location.protocol === 'file:') {
      targetUrl = 'https://cooderhasan.github.io/coffeshop/#menu';
    }
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=1c1714&bgcolor=FAF8F4&data=${encodeURIComponent(targetUrl)}`;
  }

  function openModal() {
    updateQRCode();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (directBtn) directBtn.addEventListener('click', closeModal);

  // Initialize once on load
  updateQRCode();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
})();

/* ─── WEB AUDIO API: KAFE AMBİYANS SESİ (Lofi Cozy Ambience) ─── */
(function initCafeAmbience() {
  const soundBtns = [
    document.getElementById('nav-sound-btn'),
    document.getElementById('mob-sound-btn'),
    document.getElementById('float-sound-btn')
  ].filter(Boolean);

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let noiseNode = null;
  let filterNode = null;

  function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Pink noise generation for warm relaxing rainfall / coffee shop warmth
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  function startAmbience() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const buffer = createNoiseBuffer(audioCtx);
    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(380, audioCtx.currentTime);

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 1.2);

    noiseNode.connect(filterNode);
    filterNode.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    noiseNode.start(0);
    isPlaying = true;
    updateSoundUI(true);
  }

  function stopAmbience() {
    if (!isPlaying || !masterGain || !audioCtx) return;
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    setTimeout(() => {
      if (noiseNode) {
        try { noiseNode.stop(); noiseNode.disconnect(); } catch (e) {}
      }
      isPlaying = false;
      updateSoundUI(false);
    }, 650);
  }

  function toggleAmbience() {
    isPlaying ? stopAmbience() : startAmbience();
  }

  function updateSoundUI(playing) {
    soundBtns.forEach(btn => {
      btn.classList.toggle('playing', playing);
      btn.classList.toggle('active', playing);
      if (btn.id === 'mob-sound-btn') {
        btn.textContent = playing ? '🔊 Ambiyans Açık' : '☕ Ambiyans Sesi';
      }
    });
  }

  soundBtns.forEach(btn => btn.addEventListener('click', toggleAmbience));
})();

/* ─── BACK TO TOP BUTTON ─── */
(function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  function onScroll() {
    if (window.scrollY > 450) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

