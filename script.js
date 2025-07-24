// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    document.querySelector('.hamburger').setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
    } else {
        nav.classList.add('transparent');
        nav.classList.remove('scrolled');
    }
});

// Scroll Animations
const animateElements = document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-input');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

animateElements.forEach(element => observer.observe(element));

// Particle Animation
const particleBg = document.querySelector('.particle-bg');
if (particleBg) {
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${4 + Math.random() * 6}s`;
        particleBg.appendChild(particle);
    }
}

// Typing Animation for Hero
const phrases = ["Timeless Bridal Hair", "Wedding Hair & Styling", "Elegant Updos"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById('typing-text');

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex--);
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentPhrase.length + 1) {
        isDeleting = true;
        setTimeout(type, 1500); // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 200); // Pause before next phrase
    } else {
        setTimeout(type, isDeleting ? 50 : 100); // Typing/deleting speed
    }
}

if (typingText) {
    setTimeout(type, 500); // Start typing
}

// Testimonial Carousel
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

function showNextTestimonial() {
    testimonials[currentTestimonial].classList.remove('active');
    setTimeout(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 1000); // Wait for fade-out (matches CSS transition)
}

if (testimonials.length > 0) {
    testimonials[currentTestimonial].classList.add('active');
    setInterval(showNextTestimonial, 5000); // Change every 5 seconds
}

// Lightbox for Gallery
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-content');
const closeLightbox = document.querySelector('.close-lightbox');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const galleryImages = document.querySelectorAll('.lightbox-img');
let currentIndex = 0;
let initialTopPosition = 0; // Store initial lightbox position
let initialLightboxHeight = 0; // Store initial lightbox height

if (lightbox && lightboxImg && closeLightbox && lightboxPrev && lightboxNext) {
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            lightboxImg.style.animation = 'lightboxFade 0.5s ease-out';

            // Set initial position based on clicked image
            const imgRect = img.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const offsetTop = imgRect.top + window.scrollY;
            initialLightboxHeight = Math.max(lightboxImg.offsetHeight || viewportHeight, viewportHeight);
            initialTopPosition = offsetTop - (viewportHeight / 2) + (imgRect.height / 2);
            lightbox.style.top = `${Math.max(0, initialTopPosition)}px`;
            lightbox.style.minHeight = `${initialLightboxHeight}px`;
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightboxImg.style.animation = '';
        lightbox.style.top = ''; // Reset position
        lightbox.style.minHeight = ''; // Reset height
        initialTopPosition = 0; // Reset initial position
        initialLightboxHeight = 0; // Reset initial height
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxImg.style.animation = '';
            lightbox.style.top = ''; // Reset position
            lightbox.style.minHeight = ''; // Reset height
            initialTopPosition = 0; // Reset initial position
            initialLightboxHeight = 0; // Reset initial height
        }
    });

    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.style.animation = 'lightboxSlide 0.5s ease-out';
        lightboxImg.style.setProperty('--x', '-50px');
        // Maintain initial position
        lightbox.style.top = `${Math.max(0, initialTopPosition)}px`;
        lightbox.style.minHeight = `${initialLightboxHeight}px`;
    });

    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.style.animation = 'lightboxSlide 0.5s ease-out';
        lightboxImg.style.setProperty('--x', '50px');
        // Maintain initial position
        lightbox.style.top = `${Math.max(0, initialTopPosition)}px`;
        lightbox.style.minHeight = `${initialLightboxHeight}px`;
    });

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            } else if (e.key === 'Escape') {
                closeLightbox.click();
            }
        }
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const service = document.querySelector('#service')?.value;
        if (service === '') {
            e.preventDefault();
            alert('Please select a service.');
        }
    });
}