/* ============================================
   Portfolio JavaScript
   - Typing effect
   - Smooth scrolling & navigation
   - Scroll-triggered animations
   - Web3Forms email handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // --- Typing Effect ---
    const titles = [
        'Full Stack Developer',
        'Data & AI Developer',
        'RPA Developer',
        'Problem Solver'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const dynamicTitle = document.getElementById('dynamicTitle');

    function typeEffect() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            dynamicTitle.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            dynamicTitle.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (!reducedMotion) typeEffect();

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const progress = document.getElementById('scrollProgress');
    const topButton = document.getElementById('topButton');

    function handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${maxScroll > 0 ? Math.min(100, scrollY / maxScroll * 100) : 0}%`;
        topButton.hidden = scrollY < 500;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    function setMenuOpen(open) {
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
        navLinksContainer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => setMenuOpen(!navLinksContainer.classList.contains('open')));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinksContainer.classList.contains('open')) {
            setMenuOpen(false);
            navToggle.focus();
        }
    });
    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target)) setMenuOpen(false);
    });
    navbar.addEventListener('focusout', (event) => {
        if (!navbar.contains(event.relatedTarget)) setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuOpen(false);
        handleScroll();
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            setMenuOpen(false);
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                window.scrollTo({
                    top: offsetTop,
                    behavior: reducedMotion ? 'auto' : 'smooth'
                });
                history.pushState(null, '', this.getAttribute('href'));
            }
        });
    });

    // --- Scroll-Triggered Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if ('IntersectionObserver' in window && !reducedMotion) {
        document.documentElement.classList.add('motion-ready');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger animation for cards.
                    const delay = entry.target.closest('.about-cards, .skills-grid, .portfolio-grid')
                        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 150
                        : 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // --- Web3Forms Handling ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const sendAnother = document.getElementById('sendAnother');
    const formError = document.getElementById('formError');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (submitBtn.disabled || !contactForm.reportValidity()) return;

            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Show loading
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
            contactForm.setAttribute('aria-busy', 'true');
            formError.hidden = true;
            // Bound network waits so visitors can retry after a stalled connection.
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), 20000);

            try {
                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                object.subject = `[박미금 포트폴리오] ${object.title.trim()}`;
                object.replyto = object.email;
                const json = JSON.stringify(object);

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json,
                    signal: controller.signal
                });

                const result = await response.json();

                if (response.ok && result.success === true) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.focus({ preventScroll: true });
                } else {
                    throw new Error(result.message || 'Form submission failed');
                }
            } catch (error) {
                formError.hidden = false;
            } finally {
                window.clearTimeout(timeout);
                btnText.style.display = 'inline-flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                contactForm.removeAttribute('aria-busy');
            }
        });
    }

    if (sendAnother) {
        sendAnother.addEventListener('click', () => {
            contactForm.reset();
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            formError.hidden = true;
            contactForm.elements.name.focus({ preventScroll: true });
        });
    }

    // --- Skill Tags Hover Interaction ---
    if (!reducedMotion) {
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            tag.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // --- Parallax Effect for Hero Shapes ---
        window.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 8;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    topButton.addEventListener('click', () => {
        document.querySelector('.nav-logo').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    // Initial scroll check
    handleScroll();
});
