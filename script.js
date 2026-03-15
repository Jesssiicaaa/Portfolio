/* ============================================================
   PORTFOLIO — script.js
   Custom cursor · Particles · Typing effect · Scroll reveal
   Mobile nav · Smooth scroll · Active nav highlight
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     1. CUSTOM CURSOR
     Dot follows mouse instantly; ring lags
     behind using linear interpolation (lerp)
  ──────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate cursor + lagging ring
    (function animateCursor() {
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';

      // Lerp: ring slowly catches up to mouse position
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';

      requestAnimationFrame(animateCursor);
    })();

    // Expand ring + shift colour on interactive elements
    const interactive = 'a, button, .project-card, .featured-card, .tag, .clink, .btn';
    document.querySelectorAll(interactive).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width       = '52px';
        ring.style.height      = '52px';
        ring.style.borderColor = 'rgba(247,37,133,0.7)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width       = '34px';
        ring.style.height      = '34px';
        ring.style.borderColor = 'rgba(99,102,241,0.6)';
      });
    });
  }


  /* ────────────────────────────────────────
     2. PARTICLE BACKGROUND
     Canvas API — floating coloured dots
     connected by faint lines when close
  ──────────────────────────────────────── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts;

    const COLOURS = ['#6366F1', '#22D3EE', '#A78BFA', '#818cf8', '#f72585'];
    const COUNT   = 65;
    const LINK_DIST = 100;

    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initParticles() {
      pts = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r:  Math.random() * 1.2 + 0.3,
        c:  COLOURS[Math.floor(Math.random() * COLOURS.length)],
        a:  Math.random() * 0.35 + 0.08,
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw dots
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
        if (p.x < 0) p.x = W;  if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;  if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle   = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });

      // Draw connecting lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx   = pts[i].x - pts[j].x;
          const dy   = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.05 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    drawParticles();
  }


  /* ────────────────────────────────────────
     3. TYPING EFFECT
     Cycles through phrases, types and
     deletes each one with realistic timing
  ──────────────────────────────────────── */
  const typingTarget = document.getElementById('typingTarget');
  if (typingTarget) {
    const phrases = [
      'embedded firmware',
      'FPGA systems',
      'robotic middleware',
      'full-stack platforms',
      'AI-powered tools',
      'PCB circuits',
      'real-time systems',
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let pauseTicks  = 0;

    function type() {
      if (pauseTicks > 0) {
        pauseTicks--;
        setTimeout(type, 80);
        return;
      }

      const current = phrases[phraseIndex];

      if (!isDeleting) {
        // Type forward
        typingTarget.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          isDeleting  = true;
          pauseTicks  = 28; // pause at end of phrase
        }
        setTimeout(type, 75);
      } else {
        // Delete backward
        typingTarget.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          isDeleting   = false;
          phraseIndex  = (phraseIndex + 1) % phrases.length;
          pauseTicks   = 6;
        }
        setTimeout(type, 42);
      }
    }

    setTimeout(type, 1200); // initial delay before starting
  }


  /* ────────────────────────────────────────
     4. SCROLL REVEAL
     Intersection Observer watches elements
     with class "reveal" and adds "visible"
     when they enter the viewport
  ──────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once only
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ────────────────────────────────────────
     5. MOBILE NAV TOGGLE
     Hamburger button opens/closes the nav
     links on small screens
  ──────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }


  /* ────────────────────────────────────────
     6. ACTIVE NAV HIGHLIGHT
     Highlights the correct nav link as you
     scroll through sections
  ──────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.style.color = '';   // reset all
            a.style.setProperty('--underline-w', '0');
          });
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) {
            active.style.color = 'var(--text)';
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* ────────────────────────────────────────
     7. SMOOTH SCROLL (fallback)
     Handles browsers that don't support
     CSS scroll-behavior: smooth natively
  ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});