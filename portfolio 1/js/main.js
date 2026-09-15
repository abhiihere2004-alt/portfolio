/**
 * ==========================================================================
 * ABDULLAH SAEED - PORTFOLIO INTERACTIVITY & SCROLL ENGINE
 * Multi-page architecture, dynamic themes & smooth scroll animations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPaletteSwitcher();
  initNavigationActiveState();
  initScrollProgressBar();
  initScrollReveal();
  initStatCounters();
  initBackToTop();
  initHeaderScroll();
  initBackgroundAnimation();
  initTypewriter();
  initMobileDrawer();
  initCopyButtons();
  initProjectModals();
  initProjectFilters();
  initFaqAccordion();
  initContactForm();
});

/* --------------------------------------------------------------------------
 * 1. THEME MANAGEMENT (DARK / LIGHT TOGGLE)
 * -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const drawerThemeBtn = document.getElementById('drawer-theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (drawerThemeBtn) {
    drawerThemeBtn.addEventListener('click', toggleTheme);
  }
}

/* --------------------------------------------------------------------------
 * 2. PALETTE SWITCHER (EMERALD / VIOLET / GOLD)
 * -------------------------------------------------------------------------- */
function initPaletteSwitcher() {
  const root = document.documentElement;
  const savedPalette = localStorage.getItem('palette') || 'emerald';
  root.setAttribute('data-palette', savedPalette);

  function updateActiveButtons(palette) {
    document.querySelectorAll('.palette-btn').forEach((btn) => {
      if (btn.getAttribute('data-palette') === palette) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  updateActiveButtons(savedPalette);

  document.querySelectorAll('.palette-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-palette');
      if (!selected) return;
      root.setAttribute('data-palette', selected);
      localStorage.setItem('palette', selected);
      updateActiveButtons(selected);
      const name = selected.charAt(0).toUpperCase() + selected.slice(1);
      showToast(`${name} color theme active`);
    });
  });
}

/* --------------------------------------------------------------------------
 * 3. MULTI-PAGE NAVIGATION ACTIVE HIGHLIGHT
 * -------------------------------------------------------------------------- */
function initNavigationActiveState() {
  const path = window.location.pathname;
  let currentPage = path.split('/').pop() || 'index.html';
  if (currentPage === '' || currentPage === '/') currentPage = 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .drawer-link, .footer-nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize href (remove leading slash or dot slash)
    const targetFile = href.replace(/^(\.\/|\/)/, '').split('#')[0];
    if (targetFile === currentPage) {
      link.classList.add('active');
    } else if (currentPage === 'index.html' && (href === 'index.html' || href === './' || href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
 * 4. SCROLL READING PROGRESS BAR
 * -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
 * 5. SCROLL ENTRANCE REVEAL ENGINE
 * -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal], .reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -6% 0px',
    threshold: 0.12
  });

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });
}

/* --------------------------------------------------------------------------
 * 6. ANIMATED STAT NUMBERS ON SCROLL
 * -------------------------------------------------------------------------- */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-num, .stat-counter-num');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);
        const originalText = el.textContent.trim();
        
        // Extract numeric part and prefix/suffix
        const match = originalText.match(/^([^0-9]*)([0-9]+)(.*)$/);
        if (!match) return;

        const prefix = match[1];
        const targetValue = parseInt(match[2], 10);
        const suffix = match[3];

        let startTimestamp = null;
        const duration = 1500; // ms

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOutProgress * targetValue);
          el.textContent = `${prefix}${currentVal}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = originalText;
          }
        }

        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.25 });

  statElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
 * 7. FLOATING BACK-TO-TOP BUTTON WITH CIRCULAR PROGRESS RING
 * -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');
  if (!backToTopBtn) return;

  const circumference = 141.37; // 2 * PI * 22.5

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollTop > 260) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    if (progressCircle && docHeight > 0) {
      const scrollRatio = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      const offset = circumference - (scrollRatio * circumference);
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
 * 8. HEADER SCROLL ELEVATION
 * -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
 * 9. TYPEWRITER EFFECT FOR HERO SUBTITLE
 * -------------------------------------------------------------------------- */
function initTypewriter() {
  const targetElement = document.getElementById('role-typewriter');
  if (!targetElement) return;

  const roles = [
    'Software Engineer',
    'Web Developer',
    'Frontend Craftsman',
    'Clean Code Enthusiast',
    'Interactive UI Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseEnd = 2000;
  const pauseStart = 400;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      targetElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      targetElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
 * 10. MOBILE DRAWER NAVIGATION
 * -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    mobileToggle?.classList.add('active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    drawerBackdrop?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    mobileToggle?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    drawerBackdrop?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
 * 11. COPY TO CLIPBOARD WITH FLOATING TOAST
 * -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${textToCopy}`);
      }
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary)">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3300);
}

/* --------------------------------------------------------------------------
 * 12. PROJECT MODALS (IN-DEPTH OVERVIEW)
 * -------------------------------------------------------------------------- */
const projectsData = {
  fitzone: {
    title: 'FitZone Fitness',
    category: 'Single Page Web Application',
    image: 'assets/images/fitzone-preview.jpg',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'Netlify'],
    description: 'FitZone is an energetic, high-performance web application ("Train Hard. Stay Strong."). It showcases structured training programs (Strength, Cardio, Personal Training), professional coach profiles, interactive membership pricing tiers, and direct contact inquiry.',
    highlights: [
      'Engineered with clean semantic HTML5, modern CSS3, and mobile-first responsive design.',
      'Showcases specialized workout programs and coach spotlights with high visual contrast.',
      'Transparent membership pricing tiers ($29 Basic, $49 Premium, $79 Elite) with direct CTA actions.',
      'Live deployment on Netlify with fast load times and clean cross-device layout.'
    ],
    github: 'https://github.com/abhiihere2004-alt/Fitzone-Fitness',
    live: 'https://capable-pixie-7a0ab4.netlify.app/'
  },
  apexstore: {
    title: 'ApexStore',
    category: 'Full-Featured E-Commerce Web Store',
    image: 'assets/images/apexstore-preview.jpg',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Netlify', 'State Management'],
    description: 'ApexStore is a modern, curated e-commerce storefront for premium lifestyle essentials, consumer audio, and workspace accessories. It features dynamic category navigation, search filtering, interactive cart state management, discount coupon promo codes, and Netlify hosting.',
    highlights: [
      'Interactive product catalog showcasing curated collections in Electronics, Fashion, and Workspace Gear.',
      'Aura Noise-Canceling Audio featured hero showcase with responsive layout and 3D visual aesthetic.',
      'Dynamic shopping cart & wishlist badges with persistent session state.',
      'Optimized with clean semantic web technologies and deployed with Netlify.'
    ],
    github: 'https://github.com/abhiihere2004-alt/APEX-STORE',
    live: null
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const triggerButtons = document.querySelectorAll('.btn-quick-view');

  function openModal(projectKey) {
    const data = projectsData[projectKey];
    if (!data || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="tag">${data.category}</span>
        <h2 id="modal-title" class="modal-project-title">${data.title}</h2>
        <div class="project-tags">
          ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <img src="${data.image}" alt="${data.title} preview" class="modal-img">

      <p class="project-description">${data.description}</p>

      <h4 class="modal-section-title">Key Engineering Highlights</h4>
      <ul class="modal-list">
        ${data.highlights.map(item => `<li>${item}</li>`).join('')}
      </ul>

      <div class="modal-actions">
        ${data.live ? `
          <a href="${data.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Live Demo</span>
          </a>
        ` : ''}
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn ${data.live ? 'btn-secondary' : 'btn-primary'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>
    `;

    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      if (projectKey) openModal(projectKey);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
 * 13. PROJECT CATEGORY FILTERING (ON PROJECTS.HTML)
 * -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-showcase .project-card, .projects-grid .project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        const shouldShow = filter === 'all' || category.includes(filter);

        if (shouldShow) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
 * 14. FAQ ACCORDION (ON CONTACT.HTML)
 * -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
 * 15. CONTACT FORM VALIDATION & DIRECT MAILTO TRIGGER
 * -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, true);
      isValid = false;
    } else {
      setFieldError(emailInput, false);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, true);
      isValid = false;
    } else {
      setFieldError(subjectInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, true);
      isValid = false;
    } else {
      setFieldError(messageInput, false);
    }

    if (!isValid) return;

    const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
    const encodedBody = encodeURIComponent(
      `Hello Abdullah,\n\nMy name is ${nameInput.value.trim()} (${emailInput.value.trim()}).\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()}`
    );

    window.location.href = `mailto:abhiihere2004@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    showToast('Opening your email app to send message...');
    form.reset();
  });

  function setFieldError(input, hasError) {
    const parentGroup = input.closest('.form-group');
    if (hasError) {
      parentGroup?.classList.add('has-error');
    } else {
      parentGroup?.classList.remove('has-error');
    }
  }

  ['form-name', 'form-email', 'form-subject', 'form-message'].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      const parentGroup = input.closest('.form-group');
      parentGroup?.classList.remove('has-error');
    });
  });
}

/* --------------------------------------------------------------------------
 * 16. INTERACTIVE CANVAS BACKGROUND ANIMATION (CONSTELLATION MESH)
 * -------------------------------------------------------------------------- */
function initBackgroundAnimation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = window.innerWidth <= 768;
  const particleCount = prefersReducedMotion
    ? 0
    : isMobile
      ? Math.min(Math.max(Math.floor(width / 24), 16), 24)
      : Math.min(Math.max(Math.floor(width / 24), 36), 70);

  const maxDistance = isMobile ? 85 : 120;
  const mouseRadius = isMobile ? 95 : 140;

  const mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }, 150);
  });

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const palette = document.documentElement.getAttribute('data-palette') || 'emerald';
    
    let particles;
    let lineBase;
    
    if (palette === 'violet') {
      particles = isDark
        ? ['rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(245, 158, 11, 0.6)']
        : ['rgba(139, 92, 246, 0.4)', 'rgba(219, 39, 119, 0.4)', 'rgba(217, 119, 6, 0.35)'];
      lineBase = isDark ? '139, 92, 246' : '124, 58, 237';
    } else if (palette === 'gold') {
      particles = isDark
        ? ['rgba(234, 179, 8, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(226, 232, 240, 0.6)']
        : ['rgba(202, 138, 4, 0.4)', 'rgba(234, 88, 12, 0.4)', 'rgba(100, 116, 139, 0.35)'];
      lineBase = isDark ? '234, 179, 8' : '202, 138, 4';
    } else {
      particles = isDark
        ? ['rgba(16, 185, 129, 0.7)', 'rgba(0, 245, 160, 0.7)', 'rgba(6, 182, 212, 0.6)']
        : ['rgba(16, 185, 129, 0.4)', 'rgba(5, 150, 105, 0.4)', 'rgba(8, 145, 178, 0.35)'];
      lineBase = isDark ? '16, 185, 129' : '5, 150, 105';
    }

    return { isDark, particles, lineBase };
  }

  let particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.8 + 1;
      
      const speed = prefersReducedMotion ? 0.05 : 0.45;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      
      const colors = getThemeColors().particles;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  let animationId;
  let isVisible = true;

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !animationId) {
      animate();
    }
  });

  function animate() {
    if (!isVisible) {
      animationId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const themeColors = getThemeColors();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * (themeColors.isDark ? 0.22 : 0.12);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${themeColors.lineBase}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const opacity = (1 - dist / mouseRadius) * (themeColors.isDark ? 0.35 : 0.2);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${themeColors.lineBase}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
}
