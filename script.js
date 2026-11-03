/* ============================================================================
   HARSHAL PATIL PORTFOLIO - JAVASCRIPT
   Interactive Features, Animations, and Form Handling
   ============================================================================ */

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollReveal();
    initializeCounterAnimation();
    initializeForm();
    setupScrollListeners();
});

// ============================================================================
// NAVIGATION
// ============================================================================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    // Close menu when clicking outside 
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================================================
// TYPING EFFECT
// ============================================================================

function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
        'Web Developer & Programmer',
        'JavaScript & Node.js Enthusiast',
        'MongoDB Expert',
        'Problem Solver & Innovator'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const delayBetweenTexts = 2000;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingElement.textContent = currentText.substring(0, charIndex);

        if (!isDeleting && charIndex === currentText.length) {
            // Finished typing, wait before deleting
            isDeleting = true;
            setTimeout(type, delayBetweenTexts);
            return;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
            return;
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(type, speed);
    }

    // Start typing effect
    type();
}

// ============================================================================
// SCROLL REVEAL ANIMATION
// ============================================================================

function initializeScrollReveal() {
    // Add scroll-reveal class to elements that should animate on scroll
    const elementsToReveal = document.querySelectorAll(
        '.about-text p, .project-card, .contact-form'
    );

    elementsToReveal.forEach(el => {
        el.classList.add('scroll-reveal');
    });

    observeElements();
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ============================================================================
// COUNTER ANIMATION
// ============================================================================

function initializeCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const stats = [];

    statNumbers.forEach(stat => {
        stats.push({
            element: stat,
            target: parseInt(stat.getAttribute('data-target')),
            current: 0
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find the stat object for this element
                const stat = stats.find(s => s.element === entry.target);
                if (stat && stat.current === 0) {
                    animateCounter(stat);
                }
                // Only observe once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(stat) {
    const increment = stat.target / 30; // 30 frames animation
    const timer = setInterval(() => {
        stat.current += increment;
        if (stat.current >= stat.target) {
            stat.current = stat.target;
            clearInterval(timer);
        }
        stat.element.textContent = Math.floor(stat.current);
    }, 30);
}

// ============================================================================
// FORM HANDLING
// ============================================================================

function initializeForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    let errorMessage = '';

    if (field.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.id === 'name') {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
    } else if (field.id === 'message') {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
    }

    if (isValid) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    } else {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }

    return isValid;
}


function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const fields = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    // Validate all fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) return;

    // Collect form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Your WhatsApp number with country code
    // Replace with your actual number
    const whatsappNumber = "918767897675";

    // Create WhatsApp message
    const whatsappMessage =
        `Hello! I received a new portfolio inquiry.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}`;

    // Generate WhatsApp URL
    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show confirmation
    showFormSuccess(form);

    // Reset form
    form.reset();

    // Clear success message
    setTimeout(() => {
        clearFormMessage(form);
    }, 5000);
}


function showFormSuccess(form) {
    const noteElement = document.getElementById('formNote');

    if (noteElement) {
        noteElement.textContent =
            'WhatsApp opened! Please press Send to deliver your message.';
        noteElement.classList.add('form-success');
    }
}

function clearFormMessage(form) {
    const noteElement = document.getElementById('formNote');
    if (noteElement) {
        noteElement.textContent = '';
        noteElement.classList.remove('form-success');
    }
}

// ============================================================================
// SCROLL LISTENERS
// ============================================================================

function setupScrollListeners() {
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for fixed navbar

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Smooth scroll for all anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Debounce function for optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// LAZY LOADING FOR IMAGES
// ============================================================================

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================================================
// PAGE PERFORMANCE OPTIMIZATION
// ============================================================================

// Prefetch external links
function prefetchLinks() {
    document.querySelectorAll('a').forEach(link => {
        if (link.origin === window.location.origin && link.protocol === 'http:') {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
        }
    });
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Skip to main content with keyboard
    if (e.altKey && e.key === 'm') {
        const main = document.querySelector('main') || document.querySelector('section');
        if (main) {
            main.focus();
        }
    }

    // Close mobile menu with Escape
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime, 'ms');
    });
}

// ============================================================================
// LOCAL STORAGE FOR PREFERENCES
// ============================================================================

function saveUserPreferences() {
    const preferences = {
        lastVisit: new Date().toISOString(),
        theme: 'light'
    };
    localStorage.setItem('portfolioPreferences', JSON.stringify(preferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('portfolioPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        console.log('Welcome back! Last visit:', preferences.lastVisit);
    }
}

// Save preferences on page load
loadUserPreferences();
window.addEventListener('beforeunload', saveUserPreferences);

// ============================================================================
// ANALYTICS TRACKING
// ============================================================================

function trackPageEvent(eventName, eventData = {}) {
    const event = {
        name: eventName,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        ...eventData
    };
    // Send to analytics service
    console.log('Event tracked:', event);
}

// Track when user scrolls to different sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            trackPageEvent('section_view', {
                section: entry.target.id
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackPageEvent('button_click', {
            buttonText: btn.textContent,
            buttonClass: btn.className
        });
    });
});

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================

// Add skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #3B82F6;
    color: white;
    padding: 8px;
    z-index: 100;
    border-radius: 4px;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ============================================================================
// POLYFILLS AND FALLBACKS
// ============================================================================

// Smooth scroll polyfill for older browsers
if (!window.CSS || !window.CSS.supports || !window.CSS.supports('scroll-behavior', 'smooth')) {
    function smoothScroll(element, target, duration = 300) {
        const start = element.scrollTop;
        const distance = target - start;
        const startTime = Date.now();

        const scroll = () => {
            const elapsed = Date.now() - startTime;
            const run = ease(elapsed / duration);
            if (elapsed < duration) {
                element.scrollTop = start + distance * run;
                requestAnimationFrame(scroll);
            } else {
                element.scrollTop = target;
            }
        };

        const ease = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        scroll();
    }
}

// ============================================================================
// DEBUGGING AND LOGGING
// ============================================================================

if (process && process.env && process.env.NODE_ENV === 'development') {
    console.log('Portfolio loaded in development mode');
    console.log('Performance metrics:', window.performance);
}

console.log('%cHarshal Patil - Full Stack Web Developer', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
console.log('%cCheck out the code and feel free to reach out!', 'color: #8B5CF6; font-size: 12px;');