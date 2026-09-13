document.addEventListener('DOMContentLoaded', () => {
  console.log('LOAD SCROLL:', window.scrollY);
  setTimeout(() => {
  console.log('AFTER 500MS:', window.scrollY);
}, 500);

setTimeout(() => {
  console.log('AFTER 1500MS:', window.scrollY);
}, 1500);
  const header = document.querySelector('.site-header');
  const pageLinks = document.querySelectorAll('a[href^="#"]');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const revealItems = document.querySelectorAll('.reveal');
  const videoShell = document.querySelector('.video-shell');
  const video = document.getElementById('campaign-video');
  const campaignVideo = document.getElementById('campaign-card-video');
  const playButton = document.querySelector('.play-button');
  const watchVideoLink = document.querySelector('a[href="#film"]');
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

  const pauseMedia = (element) => {
    if (!element) return;

    try {
      element.pause();
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

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
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
      pauseMedia(video);
      videoShell.classList.remove('is-playing');
    };

    const previewVideo = () => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (error) {
      }
      videoShell.classList.remove('is-playing');
    };

    const toggleVideo = () => {
      if (video.paused) {
        startVideo();
      } else {
        stopVideo();
      }
    };

    video.muted = false;
    video.volume = 1;
    video.addEventListener('loadeddata', previewVideo);
    video.addEventListener('loadedmetadata', previewVideo);
    previewVideo();

    if (playButton) {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleVideo();
      });
    }

    video.addEventListener('click', toggleVideo);

    if (watchVideoLink) {
      watchVideoLink.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('film')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Removes # to Anchor points
window.addEventListener('hashchange', e => {
    history.replaceState({}, "", location.hash.slice(1));
});