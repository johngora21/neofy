// Neofy Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navbar.style.borderBottom = '1px solid #eaeaea';
                navbar.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.borderBottom = '1px solid transparent';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.style.animationDelay || '0s';
                
                // Convert delay to milliseconds
                const delayMs = parseFloat(delay) * 1000;
                
                setTimeout(() => {
                    element.classList.add('visible');
                    console.log('Animation triggered for:', element.className, 'with delay:', delay);
                    
                    // Special handling for about images - hide first image when second appears
                    if (element.classList.contains('about-image') && delayMs > 0) {
                        console.log('Second about image triggered, hiding first image');
                        const aboutImages = document.querySelectorAll('.about-image');
                        if (aboutImages.length >= 2) {
                            // Hide the first image with fade out
                            aboutImages[0].style.opacity = '0';
                            aboutImages[0].style.transition = 'opacity 0.5s ease';
                            
                            // Show the second image with slide in
                            element.style.opacity = '1';
                            element.style.transform = 'translateX(0)';
                            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            element.style.zIndex = '2';
                            
                            console.log('First image opacity:', aboutImages[0].style.opacity);
                            console.log('Second image opacity:', element.style.opacity);
                        }
                    }
                }, delayMs);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements (excluding about images which have their own observer)
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in'
    );
    
    console.log('Found animated elements:', animatedElements.length);
    
    animatedElements.forEach(el => {
        // Skip about images as they have their own special observer
        if (!el.classList.contains('about-image')) {
            animationObserver.observe(el);
        } else {
            console.log('Skipping about-image from main observer:', el);
        }
    });
    
    // Special observer for event cards with more sensitive settings
    const eventCardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Event card animation triggered for:', entry.target.className);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px 0px 0px'
    });
    
    // Observe event cards specifically
    const eventCards = document.querySelectorAll('.event-card.scale-in');
    eventCards.forEach(card => {
        eventCardObserver.observe(card);
    });
    

    
    // Fallback: If no elements are found, show all content after 1 second
    if (animatedElements.length === 0) {
        console.log('No animated elements found, showing all content');
        setTimeout(() => {
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
                el.classList.add('visible');
            });
        }, 1000);
    }

    // Staggered word/line reveal for Solutions (vertical list)
    function initStaggeredReveal() {
        const groups = document.querySelectorAll('.plain-item');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    const parts = container.querySelectorAll('h3, li');
                    parts.forEach((node, index) => {
                        node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        node.style.transitionDelay = `${index * 90}ms`;
                        node.style.opacity = '1';
                        node.style.transform = 'translateY(0)';
                    });
                    io.unobserve(container);
                }
            });
        }, { threshold: 0.2 });

        groups.forEach(group => {
            const parts = group.querySelectorAll('h3, li');
            parts.forEach((node) => {
                node.style.opacity = '0';
                node.style.transform = 'translateY(14px)';
            });
            io.observe(group);
        });
    }

    initStaggeredReveal();
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const partnershipType = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !partnershipType || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#2d5a27' : type === 'error' ? '#dc3545' : '#6c757d'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Counter animation for impact numbers
    const impactNumbers = document.querySelectorAll('.impact-number');
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    impactNumbers.forEach(number => {
        numberObserver.observe(number);
    });
    
    function animateCounter(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isPlus = text.includes('+');
        const isX = text.includes('x');
        const numericValue = parseFloat(text.replace(/[^\d.-]/g, ''));
        
        if (isNaN(numericValue)) return;
        
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = numericValue * easeOutQuart;
            
            let displayValue = Math.round(currentValue);
            if (isPercentage) displayValue += '%';
            if (isPlus) displayValue += '+';
            if (isX) displayValue += 'x';
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Add loading state to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.href && this.href.includes('#')) {
                // This is a smooth scroll link, don't add loading state
                return;
            }
            
            // Add loading state for other buttons
            if (!this.disabled) {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Preload critical images (if any are added later)
    function preloadImages() {
        const imageUrls = [
            // Add image URLs here when images are added
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Initialize preloading
    preloadImages();
    
    // Performance optimization: Debounce scroll events
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
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Any additional scroll-based functionality can be added here
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Add focus management for better accessibility
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], select'
    );
    
    // Trap focus in mobile menu when open
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="email"], select');
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Initialize focus trapping for mobile menu
    if (navMenu) {
        trapFocus(navMenu);
    }
    
    // Emergency fallback: Show all content after 3 seconds regardless
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
                console.log('Emergency fallback: showing element', el.className);
            }
        });
    }, 3000);
    
    console.log('Neofy website initialized successfully!');
});
