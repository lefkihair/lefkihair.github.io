// ============================================================
// Lefki Hair Salon – script.js
// Fixes: scroll animations, lightbox (fixed position),
//        hamburger outside-click, inner-page nav, touch swipe
// ============================================================

// --- Hamburger Menu Toggle ---
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.textContent = '☰';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.textContent = '☰';
        }
    });
}

// --- Navbar Scroll Effect ---
// FIX: on inner pages (no .hero), always keep nav in scrolled state
const nav     = document.querySelector('nav');
const hasHero = document.querySelector('.hero');

function updateNav() {
    if (!nav) return;
    if (!hasHero || window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
    } else {
        nav.classList.add('transparent');
        nav.classList.remove('scrolled');
    }
}

// Apply immediately on load so inner pages don't flash white text on white bg
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

// --- Scroll Animations ---
// FIX: was animating immediately on load; now only triggers when element enters viewport
const animateElements = document.querySelectorAll(
    '.animate, .animate-left, .animate-right, .animate-input'
);

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stagger: small random delay for visual rhythm
            entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
            entry.target.classList.add('visible');
            animationObserver.unobserve(entry.target); // animate once
        }
    });
}, { threshold: 0.15 });

animateElements.forEach(el => animationObserver.observe(el));

// --- Particle Animation ---
const particleBg = document.querySelector('.particle-bg');
if (particleBg) {
    for (let i = 0; i < 55; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left              = `${Math.random() * 100}%`;
        p.style.animationDelay    = `${Math.random() * 6}s`;
        p.style.animationDuration = `${4 + Math.random() * 6}s`;
        particleBg.appendChild(p);
    }
}

// --- Typing Animation for Hero ---
const phrases    = ["Timeless Bridal Hair", "Wedding Hair & Styling", "Elegant Updos"];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const typingText = document.getElementById('typing-text');

function type() {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, --charIndex);
    } else {
        typingText.textContent = currentPhrase.substring(0, ++charIndex);
    }
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 1800);
    } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 300);
    } else {
        setTimeout(type, isDeleting ? 45 : 90);
    }
}
if (typingText) setTimeout(type, 600);

// --- Testimonial Carousel ---
const testimonials    = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

if (testimonials.length > 0) {
    testimonials[0].classList.add('active');
    setInterval(() => {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 5000);
}

// --- Lightbox ---
// FIX: position is now fixed in CSS, removed all the hacky initialTopPosition JS
const lightbox      = document.querySelector('.lightbox');
const lightboxImg   = document.querySelector('.lightbox-content');
const closeLightbox = document.querySelector('.close-lightbox');
const lightboxPrev  = document.querySelector('.lightbox-prev');
const lightboxNext  = document.querySelector('.lightbox-next');
const galleryImages = Array.from(document.querySelectorAll('.lightbox-img'));
let currentIndex    = 0;
let counter         = null;

function openLightbox(index) {
    currentIndex     = index;
    lightboxImg.src  = galleryImages[index].src;
    lightboxImg.alt  = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    lightboxImg.style.animation  = 'lightboxFade 0.4s ease-out';
    updateCounter();
}

function closeLightboxFn() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.style.animation  = '';
}

function navigate(direction) {
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.style.setProperty('--x', `${direction > 0 ? '50px' : '-50px'}`);
    lightboxImg.style.animation = '';
    // Trigger reflow to restart animation
    void lightboxImg.offsetWidth;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    lightboxImg.style.animation = 'lightboxSlide 0.35s ease-out';
    updateCounter();
}

function updateCounter() {
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'lightbox-counter';
        lightbox.appendChild(counter);
    }
    counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

if (lightbox && lightboxImg && closeLightbox) {
    galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(i));
        img.style.cursor = 'pointer';
    });

    closeLightbox.addEventListener('click', closeLightboxFn);
    lightboxPrev?.addEventListener('click', () => navigate(-1));
    lightboxNext?.addEventListener('click', () => navigate(1));

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightboxFn();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape')     closeLightboxFn();
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
}

// --- Contact Form Validation ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const service = document.querySelector('#service')?.value;
        if (!service) {
            e.preventDefault();
            document.querySelector('#service').focus();
            alert('Please select a service before submitting.');
        }
    });
}
