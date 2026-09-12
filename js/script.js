document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const topLinks = document.querySelectorAll('a[href="#top"]');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const revealItems = document.querySelectorAll('.reveal');
  const videoShell = document.querySelector('.video-shell');
  const video = document.getElementById('campaign-video');
  const campaignVideo = document.getElementById('campaign-card-video');
  const playButton = document.querySelector('.play-button');
  const watchVideoLink = document.querySelector('a[href="#course"]');
  const ctaForm = document.querySelector('.cta-form');
  const ctaEmail = document.getElementById('lead-email');
  const statusBox = document.querySelector('.form-status');
  const switcherTabs = document.querySelectorAll('.switcher-tab');
  const switcherPanels = document.querySelectorAll('.switcher-panel');
  const journeySteps = document.querySelectorAll('.journey-step');
  const hero = document.querySelector('.hero');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopMedia = (element) => {
    if (!element) return;

    try {
      element.pause();
      element.currentTime = 0;
    } catch (error) {
    }
  };

  // Sticky header
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  topLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      window.history.replaceState(null, '', '#top');
    });
  });

  // Mobile menu
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Cursor glow
  const cursorGlow = document.querySelector('.cursor-glow');

  if ((cursorGlow || hero) && !prefersReducedMotion) {
    let glowFrame = null;

    const updateGlow = (event) => {
      if (glowFrame) return;

      glowFrame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;

        document.documentElement.style.setProperty('--cursor-x', `${x}%`);
        document.documentElement.style.setProperty('--cursor-y', `${y}%`);

        if (hero) {
          const { left, top, width, height } = hero.getBoundingClientRect();
          const heroX = ((event.clientX - left) / width) * 100;
          const heroY = ((event.clientY - top) / height) * 100;

          hero.style.setProperty('--hero-x', `${heroX}%`);
          hero.style.setProperty('--hero-y', `${heroY}%`);
        }

        glowFrame = null;
      });
    };

    window.addEventListener('pointermove', updateGlow, { passive: true });
  }

  // Reveal on scroll
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Hero video
  if (video && videoShell) {
    const startVideo = () => {
      stopMedia(campaignVideo);
      videoShell.classList.add('is-playing');

      if (video.src || video.querySelector('source')) {
        video.play().catch(() => {
          videoShell.classList.remove('is-playing');
        });
      }
    };

    const stopVideo = () => {
      stopMedia(video);
      videoShell.classList.remove('is-playing');
    };

    if (playButton) {
      playButton.addEventListener('click', startVideo);
    }

    if (watchVideoLink) {
      watchVideoLink.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('course')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => startVideo(), 220);
      });
    }

    video.addEventListener('ended', stopVideo);
  }

  if (campaignVideo) {
    campaignVideo.muted = false;
    campaignVideo.volume = 1;

    campaignVideo.addEventListener('click', async () => {
      if (campaignVideo.paused) {
        try {
          await campaignVideo.play();
        } catch (error) {
          // Ignore autoplay restrictions.
        }
      } else {
        campaignVideo.pause();
      }
    });
  }

  // Tab switcher
  switcherTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const panelName = tab.dataset.panel;

      switcherTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      switcherPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === panelName);
      });
    });
  });

  // Journey scroll state
  if (journeySteps.length) {
    const revealJourney = () => {
      const viewportMiddle = window.innerHeight * 0.55;

      journeySteps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const isInView = rect.top < viewportMiddle && rect.bottom > viewportMiddle * 0.3;
        step.classList.toggle('is-active', isInView);
      });
    };

    revealJourney();
    window.addEventListener('scroll', revealJourney, { passive: true });
  }

  // Submit state
  if (ctaForm && ctaEmail && statusBox) {
    ctaForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!ctaEmail.reportValidity()) {
        return;
      }

      statusBox.textContent = 'Thanks — the concept update is on the way.';
      ctaForm.reset();
    });
  }
});
