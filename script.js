document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  setTimeout(() => loader?.classList.add("hidden"), 650);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  menu?.addEventListener("click", () => {
    nav?.classList.toggle("open");
    menu.classList.toggle("active");
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  // Scroll progress + construction depth movement.
  const progress = document.getElementById("scroll-progress");
  const scene = document.querySelector(".construction-scene");
  const front = document.querySelector(".building-front");
  const back = document.querySelector(".building-back");
  const crane = document.querySelector(".crane");
  const updateScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    if (scene && y <= window.innerHeight * 1.15) {
      if (front) front.style.transform = `rotateY(-16deg) rotateX(1deg) translateY(${y * 0.045}px)`;
      if (back) back.style.transform = `rotateY(-24deg) translateZ(-100px) translateY(${y * 0.12}px)`;
      if (crane) crane.style.transform = `rotateY(-8deg) translateY(${y * 0.075}px)`;
    }
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  // Reveal sections as the visitor scrolls.
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section, .quick-strip, .project-card, .service-grid article, .process-grid article, .package-grid article").forEach(el => {
    el.classList.add("reveal");
    reveal.observe(el);
  });

  // Project filtering.
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".project-card").forEach(card => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  // Project image tilt + click-to-enlarge.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
  };
  document.querySelectorAll(".project-gallery figure").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 5;
      const y = ((e.clientY - r.top) / r.height - .5) * -5;
      card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      if (!img || !lightbox || !lightboxImage) return;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // Back to top.
  const backTop = document.getElementById("back-top");
  window.addEventListener("scroll", () => backTop?.classList.toggle("show", window.scrollY > 700), { passive: true });
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

// Replace this with the Google Form share URL created for asrlotus@gmail.com.
const GOOGLE_FORM_URL = "https://forms.gle/EDruMxXNg35GrA1A7";
const formLink = document.getElementById("google-form-link");
if (formLink && GOOGLE_FORM_URL) formLink.href = GOOGLE_FORM_URL;


/* ---------- Premium lightweight interaction layer ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Letter animation for the hero heading.
  document.querySelectorAll("[data-split-text]").forEach(el => {
    const walk = node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach((char, i) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.animationDelay = `${i * 0.022}s`;
          frag.appendChild(span);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        [...node.childNodes].forEach(walk);
      }
    };
    [...el.childNodes].forEach(walk);
  });

  // Reveal project images only when close to the viewport.
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("image-visible");
        imageObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px" });
  document.querySelectorAll("[data-image-reveal]").forEach(el => imageObserver.observe(el));

  // 3D card tilt and magnetic buttons only on desktop pointer devices.
  const canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(800px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateZ(2px)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform = "");
    });

    document.querySelectorAll(".magnetic-button").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
        btn.style.transform=`translate(${x*.07}px,${y*.07}px)`;
        btn.style.setProperty("--mx",`${e.clientX-r.left}px`);
        btn.style.setProperty("--my",`${e.clientY-r.top}px`);
      });
      btn.addEventListener("pointerleave", () => btn.style.transform = "");
    });
  }

  // User-selectable color themes.
  const themeButtons = document.querySelectorAll(".theme-dot");
  const savedTheme = localStorage.getItem("spc-theme") || "warm";
  const applyTheme = theme => {
    document.body.classList.remove("theme-warm","theme-sage","theme-slate");
    if (theme !== "warm") document.body.classList.add(`theme-${theme}`);
    themeButtons.forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
    localStorage.setItem("spc-theme", theme);
  };
  applyTheme(savedTheme);
  themeButtons.forEach(btn => btn.addEventListener("click", () => applyTheme(btn.dataset.theme)));

  // Motion toggle.
  const motionToggle = document.getElementById("motion-toggle");
  const storedMotion = localStorage.getItem("spc-motion");
  const reduceBySystem = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (storedMotion === "off" || (!storedMotion && reduceBySystem)) document.body.classList.add("motion-off");
  const syncMotion = () => {
    if (motionToggle) motionToggle.textContent = document.body.classList.contains("motion-off") ? "Motion: Off" : "Motion: On";
  };
  syncMotion();
  motionToggle?.addEventListener("click", () => {
    document.body.classList.toggle("motion-off");
    localStorage.setItem("spc-motion", document.body.classList.contains("motion-off") ? "off" : "on");
    syncMotion();
  });
});
