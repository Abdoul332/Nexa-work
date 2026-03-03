document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const mobileTrigger = document.querySelector('.mobile-menu-trigger');
    const navMobile = document.querySelector('.nav-mobile');

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileTrigger.addEventListener('click', () => {
        mobileTrigger.classList.toggle('active');
        navMobile.classList.toggle('active');
        
        // Prevent scroll when menu is open
        if (navMobile.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.nav-mobile a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileTrigger.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Fade-in-up Animation Trigger
    const observers = document.querySelectorAll('.animate-up');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    observers.forEach(obs => observer.observe(obs));

    // Animation des compteurs
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-count');
                const data = +counter.innerText;
                const time = value / speed;
                
                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value;
                }
            }
            
            animate();
        });
    }

    // Trigger animations for hero visual elements
    const heroObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-item')) {
                    entry.target.classList.add('visible');
                    // Start counter animation when visible
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && !counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        const value = +counter.getAttribute('data-count');
                        const speed = 200;
                        let current = 0;
                        
                        const animateCounter = () => {
                            if (current < value) {
                                current += Math.ceil(value / speed);
                                if (current > value) current = value;
                                counter.innerText = current;
                                requestAnimationFrame(animateCounter);
                            }
                        };
                        
                        animateCounter();
                    }
                }
                if (entry.target.classList.contains('trust-badges')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, heroObserverOptions);

    // Observe hero elements
    const statItems = document.querySelectorAll('.stat-item');
    const trustBadges = document.querySelector('.trust-badges');
    
    statItems.forEach(item => heroObserver.observe(item));
    if (trustBadges) heroObserver.observe(trustBadges);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handler
    const form = document.querySelector('.premium-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Merci pour votre demande. Nous vous contacterons dans les plus brefs délais.');
            form.reset();
        });
    }

    // Counter animation for stats
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (element.textContent.includes('€') ? 'M€' : '+');
        }, 30);
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                animateCounter(entry.target, number);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
});
