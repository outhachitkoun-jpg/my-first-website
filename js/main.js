document.addEventListener('DOMContentLoaded', () => {

    // ========== 🕵️ HEADER SCROLL LOGIC ==========
    const header = document.querySelector('.site-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('site-header--glass');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('site-header--glass');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ========== 📱 MOBILE MENU ==========
    const menuToggle = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // ========== 🌊 SCROLL REVEAL (Intersection Observer) ==========
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== 🌍 LANGUAGE PICKER ==========
    const langDropdown = document.querySelector('.lang-dropdown');
    const langBtns = document.querySelectorAll('.lang-btn');

    if (langDropdown) {
        // Handled by CSS hover usually, but adding click for mobile if needed
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (typeof switchLanguage === 'function') {
                    switchLanguage(lang);
                }
                // Update active state
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // ========== ⚓ SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
