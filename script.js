/* ============================================
   Kim Moran Portfolio JavaScript
   - Typing effect
   - Navigation (scroll state, active section, mobile menu)
   - Scroll-triggered reveal & count-up stats
   - Spotlight hover, copy email, toast
   - Web3Forms email handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Typing Effect ---
    const titles = [
        'Full Stack Developer',
        'Data & AI Developer',
        'RPA Automation Engineer',
        'Electronics → Software'
    ];
    const dynamicTitle = document.getElementById('dynamicTitle');
    let titleIndex = 0;
    let charIndex = titles[0].length;
    let isDeleting = true;

    function typeEffect() {
        const current = titles[titleIndex];
        charIndex += isDeleting ? -1 : 1;
        dynamicTitle.textContent = current.substring(0, charIndex);

        let delay = isDeleting ? 35 : 75;
        if (!isDeleting && charIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            delay = 400;
        }
        setTimeout(typeEffect, delay);
    }

    if (!reducedMotion) setTimeout(typeEffect, 2200);

    // --- Navbar, progress, active section ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const progress = document.getElementById('scrollProgress');
    const topButton = document.getElementById('topButton');

    function handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${maxScroll > 0 ? Math.min(100, scrollY / maxScroll * 100) : 0}%`;
        navbar.classList.toggle('scrolled', scrollY > 30);
        topButton.hidden = scrollY < 600;
    }

    function setActive(id) {
        navLinks.forEach(link => {
            const active = link.dataset.section === id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main .section').forEach(s => sectionObserver.observe(s));
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
    }

    navToggle.addEventListener('click', () => setMenuOpen(!navLinksContainer.classList.contains('open')));
    navLinksContainer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
            setMenuOpen(false);
            navToggle.focus();
        }
    });
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) setMenuOpen(false);
    });

    // Move focus to the target section for keyboard/screen reader users.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', () => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    // --- Scroll reveal & count-up ---
    function countUp(el) {
        const end = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const format = v => {
            const fixed = v.toFixed(decimals);
            return (el.dataset.format === 'comma' ? Number(fixed).toLocaleString('en-US') : fixed) + suffix;
        };
        const duration = 1400;
        const start = performance.now();
        const step = now => {
            const t = Math.min(1, (now - start) / duration);
            el.textContent = format(end * (1 - Math.pow(1 - t, 3)));
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && !reducedMotion) {
        document.documentElement.classList.add('motion-ready');
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const siblings = el.parentElement.querySelectorAll(':scope > [data-aos]');
                const delay = siblings.length > 1 ? Array.from(siblings).indexOf(el) * 110 : 0;
                setTimeout(() => el.classList.add('visible'), delay);
                el.querySelectorAll('[data-count]').forEach(countUp);
                revealObserver.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));
    }

    // --- Spotlight hover ---
    if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.spotlight').forEach(card => {
            card.addEventListener('pointermove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        });
    }

    // --- Toast & copy email ---
    const toast = document.getElementById('toast');
    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    document.querySelectorAll('.copy-email').forEach(btn => {
        btn.addEventListener('click', async () => {
            const email = btn.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
                showToast(`이메일 주소를 복사했습니다 · ${email}`);
            } catch {
                window.location.href = `mailto:${email}`;
            }
        });
    });

    // --- Web3Forms Handling ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const sendAnother = document.getElementById('sendAnother');
    const formError = document.getElementById('formError');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    function setLoading(loading) {
        btnText.hidden = loading;
        btnLoading.hidden = !loading;
        submitBtn.disabled = loading;
        contactForm.toggleAttribute('aria-busy', loading);
    }

    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (submitBtn.disabled || !contactForm.reportValidity()) return;

        setLoading(true);
        formError.hidden = true;
        // Bound network waits so visitors can retry after a stalled connection.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
            const data = Object.fromEntries(new FormData(contactForm));
            data.subject = `[김모란 포트폴리오] ${data.title.trim()}`;
            data.replyto = data.email;

            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            const result = await response.json();
            if (!response.ok || result.success !== true) throw new Error(result.message || 'Form submission failed');

            contactForm.hidden = true;
            formSuccess.hidden = false;
            formSuccess.focus({ preventScroll: true });
        } catch {
            formError.hidden = false;
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    });

    sendAnother.addEventListener('click', () => {
        contactForm.reset();
        contactForm.hidden = false;
        formSuccess.hidden = true;
        formError.hidden = true;
        contactForm.elements.name.focus({ preventScroll: true });
    });

    topButton.addEventListener('click', () => {
        document.querySelector('.nav-logo').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    handleScroll();
});
