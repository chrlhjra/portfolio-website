// Mobile menu: slides open, closes on link tap, outside tap or Esc
var menu = document.getElementById('menu'), links = document.getElementById('links'), scrim = document.getElementById('scrim');
function setMenu(open) {
  links.classList.toggle('open', open); scrim.classList.toggle('on', open);
  menu.setAttribute('aria-expanded', open);
}
menu.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
scrim.addEventListener('click', function () { setMenu(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
links.querySelectorAll('a').forEach(function (a, i) { a.style.setProperty('--i', i); });

// Highlight the nav link for the section being read
var spy = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    links.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['home', 'services', 'experience', 'portfolio', 'tools', 'about', 'contact'].forEach(function (id) { spy.observe(document.getElementById(id)); });

// Scroll-in: each block fades up once (CSS only hides them when the "js" class is set)
if (document.documentElement.classList.contains('js')) {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.hero .w, section .w, footer .w').forEach(function (w) {
    Array.prototype.forEach.call(w.children, function (el, i) {
      el.classList.add('rv'); el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's'); io.observe(el);
    });
  });
}

// Portfolio filter: each card lists its categories in data-tags
var filters = document.querySelectorAll('.filters button'), cards = document.querySelectorAll('.pcard');
filters.forEach(function (b) {
  b.addEventListener('click', function () {
    filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    cards.forEach(function (c) {
      c.hidden = !(b.dataset.f === 'all' || c.dataset.tags.split(' ').indexOf(b.dataset.f) > -1);
    });
  });
});

// Case studies: a button with data-open="id" opens <dialog id="id">
document.querySelectorAll('[data-open]').forEach(function (b) {
  b.addEventListener('click', function () { document.getElementById(b.dataset.open).showModal(); });
});
document.querySelectorAll('dialog').forEach(function (d) {
  d.addEventListener('click', function (e) { if (e.target === d || e.target.classList.contains('close')) d.close(); });
});

// Smooth scrolling for anchor links with custom easing and duration
document.addEventListener("DOMContentLoaded", () => {
  // Select all links with href starting with "#"
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's just "#" or empty
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Close mobile navigation menu if open (using your existing scrim/menu setup)
        const linksMenu = document.getElementById("links");
        const menuBtn = document.getElementById("menu");
        const scrim = document.getElementById("scrim");

        if (linksMenu && linksMenu.classList.contains("open")) {
          linksMenu.classList.remove("open");
          if (scrim) scrim.classList.remove("active");
          if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        }

        // Custom Smooth Scroll Logic
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        const duration = 1000; // Animation duration in milliseconds (1000ms = 1s). Adjust to make faster/slower.
        let start = null;

        function step(currentTime) {
          if (!start) start = currentTime;
          const timeElapsed = currentTime - start;
          const progress = Math.min(timeElapsed / duration, 1);

          // Ease-in-out quadratic easing function for natural motion
          const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

          window.scrollTo(0, startPosition + distance * ease);

          if (timeElapsed < duration) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
      }
    });
  });
});