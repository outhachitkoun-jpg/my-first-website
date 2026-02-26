// Google Translate Initialization & Persistence
window.googleTranslateElementInit = function () {
    if (window.googleTranslateElementInitDone) return;
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,lo,th,fr,ja',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    window.googleTranslateElementInitDone = true;
};

window.translateLanguage = function (lang) {
    if (!lang) return;
    console.log("Translation requested for:", lang);

    // Save preference
    localStorage.setItem('preferredLanguage', lang);

    // Handle Body Classes for Language-Specific Styling (Readability)
    document.body.classList.remove('lao-font');
    if (lang === 'lo') {
        document.body.classList.add('lao-font');
    }

    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
        selectElement.value = lang;
        // Standard change event
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));

        // Brute force triggers for different Google Translate implementations
        ['change', 'click', 'input', 'blur'].forEach(evtName => {
            const event = new Event(evtName, { bubbles: true });
            selectElement.dispatchEvent(event);
        });

        console.log("Events dispatched for:", lang);
    } else {
        // Load Google Translate script if it's not present
        if (!document.querySelector('script[src*="translate_a/element.js"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);
        }

        // Wait and retry
        setTimeout(() => window.translateLanguage(lang), 500);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Language Flag Click Handler (Dropdown)
    const langFlags = document.querySelectorAll('.lang-flag');
    langFlags.forEach(flag => {
        flag.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');

            // Update UI for the dropdown trigger
            const currentImg = document.querySelector('.lang-current img');
            const currentText = document.querySelector('.lang-current span');
            const selectedImg = this.querySelector('img');

            if (currentImg && selectedImg) currentImg.src = selectedImg.src;
            if (currentText) currentText.textContent = lang.toUpperCase();

            window.translateLanguage(lang);
        });
    });

    // Auto-apply saved language
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        // Wait a bit for everything to settle
        setTimeout(() => window.translateLanguage(savedLang), 1000);
    }

    // Initialize specific tour if needed (optional)
    // Initialize Hero Slider
    const heroSlides = document.querySelectorAll('.hero-bg-img');
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 5000); // Change every 5 seconds
    }

    // Initialize all sliders
    const sliders = document.querySelectorAll('.tour-slider');
    sliders.forEach(slider => {
        const id = slider.getAttribute('id').replace('slider-', '');

        // Initialize indices
        if (!slideIndices[id]) slideIndices[id] = 1;

        // Show first slide
        showSlides(1, id);

        // Start auto-slide
        startAutoSlide(id);

        // Add pause on hover
        slider.addEventListener('mouseenter', () => {
            stopAutoSlide(id);
        });

        // Resume on mouse leave
        slider.addEventListener('mouseleave', () => {
            startAutoSlide(id);
        });
    });

    // Initialize thumbnails hover effect
    const thumbnails = document.querySelectorAll('.tour-thumbnails a');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('mouseenter', () => {
            const tourId = thumb.getAttribute('data-lightbox');
            if (!tourId) return;

            // Find all thumbnails for this specific tour to determine index
            const tourGroup = document.querySelectorAll(`.tour-thumbnails a[data-lightbox="${tourId}"]`);
            let newIndex = 1;

            tourGroup.forEach((t, i) => {
                if (t === thumb) newIndex = i + 1;
            });

            stopAutoSlide(tourId);
            currentSlide(newIndex, tourId);
        });

        thumb.addEventListener('mouseleave', () => {
            const tourId = thumb.getAttribute('data-lightbox');
            if (tourId) startAutoSlide(tourId);
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });


    revealElements.forEach(el => revealObserver.observe(el));

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.querySelector('.nav-overlay');

    if (mobileMenuBtn && mainNav) {
        const toggleMenu = () => {
            const isOpen = mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', toggleMenu);
        }

        // Close menu when a link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's a mobile view and menu is active
                if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Review Stars Interaction
    const starBtns = document.querySelectorAll('.star-btn');
    let selectedRating = 5;

    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.getAttribute('data-rating'));
            starBtns.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        // Set default 5 stars
        if (btn.getAttribute('data-rating') === "5") btn.click();
    });

    // Review Form Submission
    const reviewForm = document.getElementById('guest-review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const tour = document.getElementById('review-tour-select').value;
            const msg = document.getElementById('review-message').value;

            // Create New Review Card
            const grid = document.getElementById('reviews-grid');
            const card = document.createElement('div');
            card.className = 'review-card reveal active';
            card.style.borderLeft = '4px solid var(--secondary)';

            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const today = new Date();
            const month = today.toLocaleString('default', { month: 'long' });
            const year = today.getFullYear();

            card.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar" style="background: var(--gradient-sunset);">${initials}</div>
                    <div class="review-meta">
                        <h4>${name}</h4>
                        <span class="review-tour">📍 ${tour}</span>
                    </div>
                </div>
                <div class="review-stars">${'★'.repeat(selectedRating)}${'☆'.repeat(5 - selectedRating)}</div>
                <p class="review-text">"${msg}"</p>
                <span class="review-date">🗓️ ${month} ${year}</span>
            `;

            grid.prepend(card);

            // Feedback
            document.getElementById('review-success').style.display = 'block';
            reviewForm.reset();
            starBtns.forEach(s => s.classList.remove('active'));
            selectedRating = 0;

            // Scroll to the new review
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Header Scroll Effect
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }

    // Initialize WhatsApp Bot
    function initWhatsAppBot() {
        if (document.getElementById('whatsapp-bot')) return;

        const botContainer = document.createElement('div');
        botContainer.className = 'whatsapp-bot-container';
        botContainer.id = 'whatsapp-bot';

        botContainer.innerHTML = `
            <div class="bot-header">
                <div class="bot-avatar">🤖</div>
                <div class="bot-info">
                    <h4>Smile Bot</h4>
                    <span>Online</span>
                </div>
                <button class="bot-close" id="bot-close">&times;</button>
            </div>
            <div class="bot-body" id="bot-body">
                <!-- Message will be injected here -->
            </div>
            <div class="bot-footer">
                <a href="https://wa.me/8562098457614" target="_blank" class="bot-chat-btn">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                        <path d="M16.003 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.35.613 4.646 1.781 6.674L2.667 29.333l6.84-1.76c1.96 1.07 4.17 1.63 6.493 1.63 7.364 0 13.333-5.97 13.333-13.333s-5.969-13.333-13.333-13.333zm0 24c-2.073 0-4.1-.523-5.897-1.514l-.423-.239-4.06 1.046 1.083-3.951-.275-.406c-1.112-1.646-1.699-3.563-1.699-5.478 0-5.546 4.514-10.06 10.06-10.06s10.06 4.514 10.06 10.06-4.514 10.06-10.06 10.06zm5.523-7.526c-.302-.151-1.79-.883-2.068-.984-.278-.101-.48-.151-.681.151-.201.302-.782.984-.959 1.186-.177.201-.353.227-.655.076-.302-.151-1.275-.471-2.429-1.503-.898-.8-1.503-1.789-1.68-2.091-.177-.302-.019-.466.133-.617.137-.136.302-.353.453-.53.151-.177.201-.302.302-.504.101-.201.051-.378-.025-.529-.076-.151-.681-1.64-.933-2.247-.245-.587-.494-.508-.681-.517-.176-.008-.378-.01-.58-.01-.201 0-.53.076-.806.378-.277.302-1.057 1.032-1.057 2.515 0 1.483 1.081 2.914 1.232 3.117.151.201 2.129 3.252 5.164 4.558.722.312 1.284.498 1.722.639.723.23 1.38.197 1.9.119.579-.086 1.79-.731 2.043-1.437.252-.706.252-1.31.176-1.437-.076-.126-.277-.201-.58-.353z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                </a>
            </div>
        `;

        document.body.appendChild(botContainer);

        // Show bot after 5 seconds
        setTimeout(() => {
            botContainer.classList.add('active');

            const botBody = botContainer.querySelector('.bot-body');

            function addMessage(text, isTyping = true, delay = 1000) {
                if (isTyping) {
                    const typing = document.createElement('div');
                    typing.className = 'bot-bubble typing';
                    typing.innerHTML = '<span></span><span></span><span></span>';
                    botBody.appendChild(typing);
                    botBody.scrollTop = botBody.scrollHeight;

                    setTimeout(() => {
                        typing.remove();
                        const bubble = document.createElement('div');
                        bubble.className = 'bot-bubble';
                        bubble.textContent = text;
                        botBody.appendChild(bubble);
                        botBody.scrollTop = botBody.scrollHeight;
                    }, delay);
                } else {
                    const bubble = document.createElement('div');
                    bubble.className = 'bot-bubble';
                    bubble.textContent = text;
                    botBody.appendChild(bubble);
                    botBody.scrollTop = botBody.scrollHeight;
                }
            }

            // First message
            addMessage("Sabaidee! 🙏 Welcome to Laos Smile Trip. How can I help you today?", true, 1500);

            // Second message after 4 seconds
            setTimeout(() => {
                addMessage("We're here to help you plan your perfect Laos trip 24/7!", true, 1500);
            }, 4000);

        }, 5000);

        // Close logic
        document.getElementById('bot-close').addEventListener('click', () => {
            botContainer.classList.remove('active');
        });
    }

    initWhatsAppBot();

});

// Object to store slide indices and intervals for each tour
const slideIndices = {};
const slideIntervals = {};
const AUTO_SLIDE_DELAY = 6000; // 6 seconds

function startAutoSlide(tourId) {
    // Clear existing interval just in case
    stopAutoSlide(tourId);

    slideIntervals[tourId] = setInterval(() => {
        moveSlide(1, tourId);
    }, AUTO_SLIDE_DELAY);
}

function stopAutoSlide(tourId) {
    if (slideIntervals[tourId]) {
        clearInterval(slideIntervals[tourId]);
        delete slideIntervals[tourId];
    }
}

function moveSlide(n, tourId) {
    if (!slideIndices[tourId]) slideIndices[tourId] = 1;
    showSlides(slideIndices[tourId] += n, tourId);
}

function currentSlide(n, tourId) {
    showSlides(slideIndices[tourId] = n, tourId);
}

function showSlides(n, tourId) {
    let i;
    const sliderContainer = document.getElementById('slider-' + tourId);
    if (!sliderContainer) return;

    const slides = sliderContainer.getElementsByClassName("slider-img");

    if (!slideIndices[tourId]) slideIndices[tourId] = 1;

    if (n > slides.length) { slideIndices[tourId] = 1 }
    if (n < 1) { slideIndices[tourId] = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }

    slides[slideIndices[tourId] - 1].style.display = "block";
    slides[slideIndices[tourId] - 1].classList.add("active");
}

function openGallery(tourId) {
    const galleryLink = document.querySelector('[data-lightbox="' + tourId + '"]');
    if (galleryLink) {
        galleryLink.click();
    }
}
