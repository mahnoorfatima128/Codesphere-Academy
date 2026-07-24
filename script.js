/* =========================================================
   CodeSphere Academy — Main Script
   Handles: mobile menu, theme toggle, smooth scroll,
   FAQ accordion, form validation, scroll animations
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initThemeToggle();
  initSmoothScroll();
  initFaqAccordion();
  initScrollAnimations();
  initBackToTop();
  initContactForm();
  initNewsletterForm();
  initStatsCounters();
  initScrollProgress();
  setActiveNavLink();
});

/* ---------------------------------------------------------
   Mobile Menu Toggle
--------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".nav-overlay");

  if (!hamburger || !navMenu) return;

  const closeMenu = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    hamburger.classList.add("active");
    navMenu.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  hamburger.addEventListener("click", () => {
    const isActive = navMenu.classList.contains("active");
    isActive ? closeMenu() : openMenu();
  });

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Close menu when a nav link is clicked (mobile UX)
  navMenu.querySelectorAll(".nav-link, .btn").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on resize back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

/* ---------------------------------------------------------
   Dark / Light Mode Toggle
   Persists user preference in localStorage
--------------------------------------------------------- */
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll(".theme-toggle");
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("codesphere-theme");

  // Apply stored preference, or fall back to system preference
  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("codesphere-theme", next);
    });
  });
}

/* ---------------------------------------------------------
   Smooth Scrolling for in-page anchor links
--------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const targetId = href.substring(hashIndex + 1);
      if (!targetId) return;

      // Only intercept if the target section exists on this page
      const targetPage = href.substring(0, hashIndex);
      const currentPage = window.location.pathname.split("/").pop();
      const isSamePage = targetPage === "" || targetPage === currentPage;

      const targetEl = document.getElementById(targetId);
      if (isSamePage && targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ---------------------------------------------------------
   FAQ Accordion
--------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other items (accordion behavior)
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Toggle the clicked item
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ---------------------------------------------------------
   Scroll Animations (Intersection Observer)
   Reveals cards/sections as they enter the viewport
--------------------------------------------------------- */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".course-card, .why-card, .process-step, .reveal, .value-card, .instructor-card, .testimonial-card"
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Back to Top Button
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------
   Contact Form Validation
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successMessage = document.querySelector(".form-success");

  const fields = {
    name: {
      el: document.getElementById("full-name"),
      validate: (val) => val.trim().length >= 2,
      message: "Please enter your full name (at least 2 characters).",
    },
    email: {
      el: document.getElementById("email"),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      message: "Please enter a valid email address.",
    },
    phone: {
      el: document.getElementById("phone"),
      validate: (val) => val.trim() === "" || /^[0-9+\-\s()]{7,20}$/.test(val.trim()),
      message: "Please enter a valid phone number.",
    },
    course: {
      el: document.getElementById("course"),
      validate: (val) => val.trim() !== "",
      message: "Please select a course you're interested in.",
    },
    message: {
      el: document.getElementById("message"),
      validate: (val) => val.trim().length >= 10,
      message: "Please enter a message (at least 10 characters).",
    },
  };

  function showError(field) {
    field.el.classList.add("error");
    const errorEl = field.el.parentElement.querySelector(".error-message");
    if (errorEl) {
      errorEl.textContent = field.message;
      errorEl.classList.add("visible");
    }
  }

  function clearError(field) {
    field.el.classList.remove("error");
    const errorEl = field.el.parentElement.querySelector(".error-message");
    if (errorEl) {
      errorEl.classList.remove("visible");
    }
  }

  // Real-time validation on blur
  Object.values(fields).forEach((field) => {
    field.el.addEventListener("blur", () => {
      if (field.validate(field.el.value)) {
        clearError(field);
      } else {
        showError(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    Object.values(fields).forEach((field) => {
      if (!field.validate(field.el.value)) {
        showError(field);
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) {
      const firstError = form.querySelector(".error");
      if (firstError) firstError.focus();
      return;
    }

    // Simulate successful submission (no backend configured)
    if (successMessage) {
      successMessage.classList.add("visible");
      successMessage.textContent = "Thank you! Your message has been received. We'll get back to you soon.";
    }

    form.reset();

    // Hide success message after a few seconds
    setTimeout(() => {
      if (successMessage) successMessage.classList.remove("visible");
    }, 6000);
  });
}

/* ---------------------------------------------------------
   Scroll Progress Bar
--------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ---------------------------------------------------------
   Animated Stat Counters
   Counts up from 0 to data-count when the stat scrolls
   into view. Supports decimals and a suffix (+, /5, etc.)
--------------------------------------------------------- */
function initStatsCounters() {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const suffix = el.dataset.suffix || "";

    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Newsletter Form (footer)
--------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  const input = document.getElementById("newsletter-email");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!isValid) {
      input.focus();
      return;
    }

    form.classList.add("submitted");
    const button = form.querySelector("button");
    const originalLabel = button.textContent;
    button.textContent = "Subscribed ✓";
    input.value = "";

    setTimeout(() => {
      form.classList.remove("submitted");
      button.textContent = originalLabel;
    }, 4000);
  });
}

/* ---------------------------------------------------------
   Highlight active nav link based on current page
--------------------------------------------------------- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href").split("#")[0];
    if (linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
}