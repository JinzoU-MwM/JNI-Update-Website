/* =====================================================
   Corporate Consultant Website - JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===== MOBILE NAVIGATION TOGGLE =====
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarCenter = document.querySelector('.navbar-center');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  if (navbarToggle && navbarCenter) {
    navbarToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navbarCenter.classList.toggle('active');
      document.body.style.overflow = navbarCenter.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarToggle.classList.remove('active');
        navbarCenter.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navbarCenter.contains(e.target) && !navbarToggle.contains(e.target)) {
        navbarToggle.classList.remove('active');
        navbarCenter.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== NAVBAR SCROLL EFFECT (Transparent → White/Scrolled) =====
  const navbar = document.querySelector('.navbar');

  const handleNavbarScroll = function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Initial check on page load
  handleNavbarScroll();

  // Listen for scroll events
  window.addEventListener('scroll', handleNavbarScroll);

  // ===== ACTIVE NAVIGATION LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== SERVICES PAGE - CATEGORY TAB FILTERING =====
  // Logic migrated to assets/js/modules/services-filter.js


  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== SCROLL REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.service-card, .team-card, .blog-card, .gallery-item, .why-block, .about-grid');

  const revealOnScroll = function () {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (element.classList.contains('hidden-card')) return; // Fix: Ignore filtered items

      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial styles for reveal animation
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.hero-stat h3');
  let countersAnimated = false;

  const animateCounters = function () {
    if (countersAnimated) return;

    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
      const suffix = counter.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const increment = target / 50;
      const duration = 2000;
      const stepTime = duration / 50;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current) + suffix;
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = target + suffix;
        }
      };

      updateCounter();
    });

    countersAnimated = true;
  };

  // Check if hero stats are visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(heroStats);
  }

  // ===== FORM VALIDATION =====
  const contactForm = document.querySelector('.contact-form form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Basic validation
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#e74c3c';
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      const emailField = this.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          isValid = false;
          emailField.style.borderColor = '#e74c3c';
        }
      }

      if (isValid) {
        // Success feedback
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Pesan Terkirim!';
        submitBtn.style.background = '#4CAF50';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          this.reset();
        }, 3000);

        console.log('Form submitted:', data);
      }
    });

    // Remove error styling on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  // ===== GALLERY LIGHTBOX (Simple Implementation) =====
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('h4')?.textContent || '';

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
      `;

      lightbox.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; text-align: center;">
          <img src="${img.src}" alt="${img.alt}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">
          <p style="color: white; margin-top: 15px; font-size: 1.1rem;">${title}</p>
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      lightbox.addEventListener('click', function () {
        this.remove();
        document.body.style.overflow = '';
      });
    });
  });

  // ===== BACK TO TOP BUTTON =====
  const createBackToTop = () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #387C44 0%, #4CAF50 100%);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(56, 124, 68, 0.3);
    `;

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-5px)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
    });
  };

  createBackToTop();

  // ===== SERVICE CARDS HOVER EFFECT ENHANCEMENT =====
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  // ===== PRELOADER (Optional) =====
  window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });

});

// Add fadeIn animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);
