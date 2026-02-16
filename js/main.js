document.addEventListener('DOMContentLoaded', function () {
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
