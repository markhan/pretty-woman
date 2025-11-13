// === 1. REGISTER PLUGINS AND INITIALIZE SCROLLSMOOTHER ===
// (This goes at the top, outside your DOMContentLoaded)

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

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

  // === ANIMATED SERVICES SCRIPT (GSAP with matchMedia) ===

  let mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
    },
    (context) => {
      let { isMobile, isDesktop } = context.conditions;
      let triggers = [];

      if (isDesktop) {
        // --- RUN DESKTOP LOGIC (Single Pin) ---
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
              toggleClass: { targets: '.pin-element', className: 'is-pinned' }, // Fixes overlap
            },
          });
          triggers.push(servicesTL.scrollTrigger);

          serviceItems.forEach((item, index) => {
            const description = item.querySelector('.service-description');

            servicesTL.to(description, {
              maxHeight: '1000px',
              opacity: 1,
              duration: 1,
              ease: 'power2.inOut',
            });

            // Your "final take": only shrink if it's NOT the last item
            if (index < serviceItems.length - 1) {
              servicesTL.to(
                description,
                {
                  maxHeight: 0,
                  opacity: 0,
                  duration: 1,
                  ease: 'power2.inOut',
                },
                '+=1' // Wait 1 "second"
              );
            }
          });
        }
      } else if (isMobile) {
        // --- RUN MOBILE LOGIC (GSAP Stacking/Pinning from Example) ---

        const panels = gsap.utils.toArray('.mobile-services .service-item');
        const nextSection = document.getElementById('gallery');

        if (panels.length > 0 && nextSection) {
          // 2. Create the REAL pin triggers for each panel
          panels.forEach((panel, i) => {
            const isLastPanel = i === panels.length - 1;
            let trigger = ScrollTrigger.create({
              trigger: panel,

              // If panel is shorter than viewport, pin top-to-top
              // If panel is TALLER than viewport, pin bottom-to-bottom
              start: () =>
                panel.offsetHeight < window.innerHeight
                  ? 'top top'
                  : 'bottom bottom',

              pin: true,
              pinSpacing: false,
              endTrigger: isLastPanel ? nextSection : undefined,
              end: isLastPanel ? 'top 90%' : undefined,
            });
            triggers.push(trigger); // Save for cleanup
          });
        }
      }

      // --- CLEANUP FUNCTION ---
      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    }
  );
});
