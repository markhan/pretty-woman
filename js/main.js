// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // === 1. MOBILE MENU SCRIPT (for all pages) ===
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const panel = document.getElementById('mobile-menu-panel');

  // Check if the menu elements exist on this page
  if (menuBtn && closeBtn && backdrop && panel) {
    const menuLinks = panel.querySelectorAll('a');

    function toggleMenu() {
      panel.classList.toggle('translate-x-full');
      panel.classList.toggle('translate-x-0');
      backdrop.classList.toggle('opacity-0');
      backdrop.classList.toggle('opacity-100');
      backdrop.classList.toggle('invisible');
      document.body.classList.toggle('overflow-hidden');
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (panel.classList.contains('translate-x-0')) {
          toggleMenu();
        }
      });
    });
  }

  // === 2. GALLERY SCROLL SCRIPT (Your update) ===
  const gallery = document.getElementById('gallery-scroll');
  const scrollLeftBtn = document.getElementById('scroll-left-btn');
  const scrollRightBtn = document.getElementById('scroll-right-btn');

  // Check if the gallery elements exist on this page
  if (gallery && scrollLeftBtn && scrollRightBtn) {
    const scrollAmount = 1000; // Your new value

    scrollRightBtn.addEventListener('click', function () {
      gallery.scrollLeft += scrollAmount;
    });

    scrollLeftBtn.addEventListener('click', function () {
      gallery.scrollLeft -= scrollAmount;
    });
  }

  // === 3. SCROLL ANIMATION SCRIPT (Your update) ===
  const animatedElements = document.querySelectorAll('.fade-in-up');

  // Check if there are any elements to animate
  if (animatedElements.length > 0) {
    function animateOnScroll() {
      for (const el of animatedElements) {
        const rect = el.getBoundingClientRect();

        // Your new animation values
        const animationStart = window.innerHeight * 0.8;
        const animationEnd = window.innerHeight * 0.6;
        const elTop = rect.top;

        const progress = Math.max(
          0,
          Math.min(
            1,
            (animationStart - elTop) / (animationStart - animationEnd)
          )
        );

        el.style.opacity = progress;
        el.style.transform = `translateY(${(1 - progress) * 2}rem)`;
      }
    }

    let ticking = false;
    document.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          animateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Run it once on load
    animateOnScroll();
  }

  // === 4. ANIMATED SERVICES SCRIPT ===

  gsap.registerPlugin(ScrollTrigger);

  // We only run the desktop (min-width: 768px) logic
  gsap.matchMedia().add('(min-width: 768px)', () => {
    // --- RUN DESKTOP LOGIC ---
    const serviceItems = document.querySelectorAll(
      '.desktop-services .service-item'
    );

    if (serviceItems.length > 0) {
      const servicesTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.pin-wrapper',
          pin: '.pin-element',
          start: 'top top',
          end: '+=2000',
          scrub: 1.5,
        },
      });

      // Loop over each service item and add it to the timeline
      serviceItems.forEach((item, index) => {
        const description = item.querySelector('.service-description');

        // Animate this item's description IN
        servicesTL.to(description, {
          maxHeight: '1000px', // Animate to a large height
          opacity: 1,
          duration: 1,
        });

        // If it's NOT the last item, animate it OUT
        if (index < serviceItems.length - 1) {
          servicesTL.to(
            description,
            {
              maxHeight: 0,
              opacity: 0,
              duration: 1,
            },
            '+=1'
          ); // Wait 1 "second" on the timeline before shrinking
        }
      });
    }

    return () => {
      ScrollTrigger.killAll(); // Kills all triggers when resizing to mobile
    };
  });
});
