// Création et ajout de la bannière de maintenance
const createMaintenanceBanner = () => {
    const banner = document.createElement('div');
    banner.id = 'maintenance-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #1e88e5, #1565c0);
        color: #ffffff;
        padding: 10px 0;
        text-align: center;
        z-index: 9999;
        font-size: 16px;
        border-bottom: 2px solid #0d47a1;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 1;
        transition: all 0.5s ease-out;
    `;

    banner.innerHTML = `
        <div style="
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        ">
            <span style="text-align: center; padding-right: 30px; font-size: 1em;">Site en cours d'amélioration - Merci de votre patience !</span>
            <button id="close-banner" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid #ffffff;
                color: #ffffff;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                padding: 2px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
            ">×</button>
        </div>
    `;

    // Ajout au début du body
    document.body.insertBefore(banner, document.body.firstChild);

    // Gestion de la fermeture
    const closeBanner = () => {
        banner.style.opacity = '0';
        setTimeout(() => banner.style.display = 'none', 500);
    };

    // Fermeture au clic
    const closeButton = document.getElementById('close-banner');
    if (closeButton) {
        closeButton.onclick = closeBanner;
    }

    // Fermeture automatique après 15 secondes
    setTimeout(closeBanner, 15000);
};

// Appel de la fonction quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMaintenanceBanner);
} else {
    createMaintenanceBanner();
}

document.addEventListener('DOMContentLoaded', function() {

    const hasGSAP = typeof window.gsap !== 'undefined';

    // ----------- MENU HAMBURGER MOBILE -----------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    
    if (mobileMenuBtn && navMenu) {
        // Toggle du menu
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Empêche le scroll du body quand le menu est ouvert
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Ferme le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Ferme le menu si on redimensionne vers desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Ferme le menu si on clique en dehors
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ----------- SMOOTH SCROLL -----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ----------- NAVBAR SCROLL EFFECT (PERFORMANT) -----------
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        };
        window.addEventListener('scroll', () => requestAnimationFrame(updateNavbar), { passive: true });
        updateNavbar(); // Appel initial
    }

    // ----------- INTERSECTION OBSERVER ANIMATIONS -----------
    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-header, .service-card, .value-card, .process-step').forEach(el => animateObserver.observe(el));
    }

    // ----------- TESTIMONIAL SLIDER (SÉCURISÉ) -----------
    const testimonials = Array.from(document.querySelectorAll('.testimonial-item'));
    const dots = Array.from(document.querySelectorAll('.nav-dot'));
    const slider = document.querySelector('.testimonials-container');

    if (testimonials.length > 0 && dots.length === testimonials.length) {
        let currentTestimonial = 0;
        let autoplayInterval = null;
        let isHovered = false;

        const startHoverListeners = () => {
            if (!slider) return;
            slider.addEventListener('mouseenter', () => { isHovered = true; });
            slider.addEventListener('mouseleave', () => { isHovered = false; });
        };

        const startAutoplay = (callback) => {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(() => {
                if (!isHovered) callback();
            }, 5000);
        };

        if (hasGSAP) {
            const createTimeline = (currentIndex, nextIndex) => {
                const current = testimonials[currentIndex];
                const next = testimonials[nextIndex];

                testimonials.forEach(t => t.style.zIndex = '1');
                current.style.zIndex = '2';
                next.style.zIndex = '3';

                const timeline = gsap.timeline({
                    defaults: { duration: 0.8, ease: 'power3.out' }
                });

                timeline
                    .set(next, { display: 'block' })
                    .fromTo(next,
                        { opacity: 0, xPercent: 35, rotateY: 15, scale: 0.92, filter: 'blur(6px)' },
                        { opacity: 1, xPercent: 0, rotateY: 0, scale: 1, filter: 'blur(0px)', duration: 0.9 }
                    )
                    .to(current,
                        { opacity: 0, xPercent: -35, rotateY: -20, scale: 0.9, filter: 'blur(6px)' },
                        '-=0.8'
                    )
                    .add(() => {
                        testimonials.forEach((t, i) => {
                            if (i === nextIndex) {
                                t.classList.add('active');
                                gsap.set(t, { clearProps: 'all' });
                            } else {
                                t.classList.remove('active');
                                gsap.set(t, { clearProps: 'all', display: i === nextIndex ? 'block' : 'none' });
                            }
                        });
                    });
            };

            const showTestimonial = (index) => {
                if (index === currentTestimonial) return;
                const nextIndex = index;
                createTimeline(currentTestimonial, nextIndex);
                currentTestimonial = nextIndex;
                dots.forEach((d, i) => d.classList.toggle('active', i === nextIndex));
            };

            const nextTestimonial = () => {
                const nextIndex = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(nextIndex);
            };

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    startAutoplay(nextTestimonial);
                    showTestimonial(i);
                });
            });

            testimonials.forEach((testimonial, index) => {
                gsap.set(testimonial, { display: index === 0 ? 'block' : 'none' });
            });
            dots[0].classList.add('active');
            startHoverListeners();
            startAutoplay(nextTestimonial);
        } else {
            // Fallback sans GSAP
            const applyState = (index) => {
                testimonials.forEach((testimonial, i) => {
                    testimonial.classList.toggle('active', i === index);
                    testimonial.style.display = i === index ? 'block' : 'none';
                });
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            };

            const nextTestimonial = () => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                applyState(currentTestimonial);
            };

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    currentTestimonial = i;
                    applyState(i);
                    startAutoplay(nextTestimonial);
                });
            });

            applyState(0);
            startHoverListeners();
            startAutoplay(nextTestimonial);
        }
    }

    // ----------- CONTACT SECTION ANIMATIONS -----------
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerEls = contactSection.querySelectorAll('.section-badge, .section-title, .section-subtitle');
        const contactItems = contactSection.querySelectorAll('.contact-item');
        const contactButtons = contactSection.querySelectorAll('.contact-cta-group .hero-cta');

        const animateContactSection = () => {
            if (hasGSAP) {
                const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
                if (headerEls.length) {
                    tl.from(headerEls, { y: 45, opacity: 0, filter: 'blur(8px)', stagger: 0.12 });
                }
                if (contactItems.length) {
                    tl.from(contactItems, { y: 60, opacity: 0, scale: 0.9, filter: 'blur(6px)', stagger: 0.12 }, '-=0.3');
                }
                if (contactButtons.length) {
                    tl.from(contactButtons, { y: 50, opacity: 0, scale: 0.92, filter: 'blur(6px)', stagger: 0.08 }, '-=0.25');
                }

                const floatingIcons = contactSection.querySelectorAll('.contact-icon');
                if (floatingIcons.length) {
                    gsap.to(floatingIcons, {
                        y: -6,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        duration: 2,
                        stagger: 0.2,
                        delay: 0.6
                    });
                }
            } else {
                contactSection.classList.add('contact-visible');
            }
        };

        if ('IntersectionObserver' in window) {
            const contactObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateContactSection();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35, rootMargin: '0px 0px -50px 0px' });

            contactObserver.observe(contactSection);
        } else {
            animateContactSection();
        }
    }

    // ----------- CONTACT CTA WOW EFFECT -----------
    const contactCTA = document.getElementById('contact-primary-cta');
    if (contactCTA) {
        const fireCTAAnimation = () => {
            if (typeof window.gsap === 'undefined') {
                contactCTA.style.animation = 'ctaDropIn 1.2s ease forwards';
                return;
            }

            gsap.fromTo(contactCTA,
                { y: -80, opacity: 0, scale: 0.85, filter: 'blur(10px)' },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: 0.2
                }
            );

            gsap.to(contactCTA, {
                y: -6,
                duration: 1.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 1.4
            });
        };

        if ('IntersectionObserver' in window) {
            const ctaObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fireCTAAnimation();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            ctaObserver.observe(contactCTA);
        } else {
            fireCTAAnimation();
        }
    }

    // ----------- LAZY LOAD IMAGES (AVEC SRCSET) -----------
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    if (img.dataset.srcset) img.srcset = img.dataset.srcset; // Support du srcset
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => imageObserver.observe(img));
    }

    // ----------- HERO MINI GRAPH ANIMATION -----------
    const miniGraph = document.querySelector('.mini-graph');
    if (miniGraph && 'IntersectionObserver' in window) {
        const graphValue = miniGraph.querySelector('.graph-value');
        const valueText = graphValue ? graphValue.textContent.trim() : '';
        let valuePrefix = '';
        let valueSuffix = '';
        let targetValue = 0;

        if (graphValue) {
            const match = valueText.match(/^(.*?)(\d+)(.*)$/);
            if (match) {
                valuePrefix = match[1];
                targetValue = parseInt(match[2], 10);
                valueSuffix = match[3];
            }
        }

        const animateGraph = () => {
            miniGraph.classList.add('is-visible');
            if (!graphValue || !targetValue) return;

            let current = 0;
            const steps = 45;
            const increment = Math.max(1, Math.floor(targetValue / steps));
            const interval = setInterval(() => {
                current = Math.min(current + increment, targetValue);
                graphValue.textContent = `${valuePrefix}${current}${valueSuffix}`;
                if (current >= targetValue) clearInterval(interval);
            }, 30);
        };

        const graphObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateGraph();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        graphObserver.observe(miniGraph);
    }

    // ----------- HERO CREDIBILITY COUNTERS -----------
    const heroCredibility = document.querySelector('.hero-credibility');
    if (heroCredibility && 'IntersectionObserver' in window) {
        const items = Array.from(heroCredibility.querySelectorAll('span'));
        const parts = items.map(item => {
            const text = item.textContent.trim();
            const match = text.match(/^(.*?)(\d+)(.*)$/);
            if (!match) return null;
            return {
                el: item,
                prefix: match[1],
                target: parseInt(match[2], 10),
                suffix: match[3]
            };
        }).filter(Boolean);

        if (parts.length) {
            const animateCredibility = () => {
                parts.forEach(({ el, prefix, target, suffix }) => {
                    let current = 0;
                    const steps = 45;
                    const increment = Math.max(1, Math.ceil(target / steps));
                    el.textContent = `${prefix}${0}${suffix}`;
                    const interval = setInterval(() => {
                        current = Math.min(current + increment, target);
                        el.textContent = `${prefix}${current}${suffix}`;
                        if (current >= target) clearInterval(interval);
                    }, 30);
                });
            };

            const credibilityObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCredibility();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            credibilityObserver.observe(heroCredibility);
        }
    }

    // ----------- STAT ANIMATION (ROBUSTE) -----------
    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (!statNumber) return;

                    const finalValueText = statNumber.textContent.trim();
                    const target = parseInt(finalValueText, 10);
                    if (isNaN(target)) { observer.unobserve(entry.target); return; }

                    let current = 0;
                    // Calcul dynamique de l'incrément pour une animation fluide
                    const step = Math.max(1, Math.ceil(target / 100)); 
                    const timer = setInterval(() => {
                        current = Math.min(current + step, target);
                        statNumber.textContent = current + (finalValueText.includes('%') ? '%' : finalValueText.includes('+') ? '+' : '');
                        if (current >= target) {
                            clearInterval(timer);
                            statNumber.textContent = finalValueText; // Assure la valeur finale exacte
                        }
                    }, 20); // Intervalle plus court pour plus de fluidité
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));
    }

    // ========== GESTION COOKIES RGPD COMPLÈTE ==========
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieModal = document.getElementById('cookie-modal');
    const acceptAllButton = document.getElementById('accept-all-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const customizeButton = document.getElementById('customize-cookies');
    const closeModalButton = document.getElementById('close-modal');
    const savePreferencesButton = document.getElementById('save-preferences');
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    
    const GA4_ID = 'G-57J8LJGQ1L';
    const COOKIE_KEY = 'cookie-consent';
    const ANALYTICS_KEY = 'analytics-consent';
    const CONSENT_DATE_KEY = 'cookie-consent-date';
    const CONSENT_DURATION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois

    // Fonctions utilitaires
    const showElement = (element, className = 'show') => {
        if (element) {
            element.style.display = element === cookieBanner ? 'block' : 'flex';
            requestAnimationFrame(() => element.classList.add(className));
        }
    };

    const hideElement = (element, className = 'show', delay = 300) => {
        if (element) {
            element.classList.remove(className);
            setTimeout(() => { element.style.display = 'none'; }, delay);
        }
    };

    // Gestion des cookies
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const deleteCookie = (name, domain = '') => {
        const domainStr = domain ? `domain=${domain};` : '';
        document.cookie = `${name}=;${domainStr}path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    };

    // Chargement conditionnel de Google Analytics
    const loadGA4 = () => {
        if (document.getElementById('ga4-script')) return; // Évite le double chargement
        
        const script = document.createElement('script');
        script.id = 'ga4-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { window.dataLayer.push(arguments); };
            gtag('js', new Date());
            gtag('config', GA4_ID, { 
                anonymize_ip: true,
                cookie_flags: 'SameSite=Lax;Secure'
            });
            console.log('✅ Google Analytics chargé avec consentement');
        };
    };

    // Suppression des cookies analytiques
    const clearAnalyticsCookies = () => {
        const analyticsCookies = ['_ga', '_ga_' + GA4_ID.replace('G-', ''), '_gid', '_gat'];
        const hostname = location.hostname.replace(/^www\./, '');
        
        analyticsCookies.forEach(cookieName => {
            deleteCookie(cookieName);
            deleteCookie(cookieName, `.${hostname}`);
        });
        
        // Supprime le script GA4 s'il existe
        const gaScript = document.getElementById('ga4-script');
        if (gaScript) gaScript.remove();
        
        console.log('🗑️ Cookies analytiques supprimés');
    };

    // Sauvegarde des préférences
    const saveConsent = (analyticsAccepted) => {
        setCookie(COOKIE_KEY, 'set', 180); // 6 mois
        setCookie(ANALYTICS_KEY, analyticsAccepted ? 'true' : 'false', 180);
        setCookie(CONSENT_DATE_KEY, Date.now().toString(), 180);
        
        if (analyticsAccepted) {
            loadGA4();
        } else {
            clearAnalyticsCookies();
        }
    };

    // Vérification du consentement existant
    const checkExistingConsent = () => {
        const consent = getCookie(COOKIE_KEY);
        const consentDate = getCookie(CONSENT_DATE_KEY);
        
        if (consent && consentDate) {
            const elapsed = Date.now() - parseInt(consentDate, 10);
            if (elapsed < CONSENT_DURATION_MS) {
                const analyticsConsent = getCookie(ANALYTICS_KEY) === 'true';
                if (analyticsConsent) loadGA4();
                return true; // Consentement valide trouvé
            }
        }
        return false; // Pas de consentement ou expiré
    };

    // Gestionnaires d'événements
    if (acceptAllButton) {
        acceptAllButton.addEventListener('click', () => {
            saveConsent(true);
            hideElement(cookieBanner);
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            saveConsent(false);
            hideElement(cookieBanner);
        });
    }

    if (customizeButton) {
        customizeButton.addEventListener('click', () => {
            hideElement(cookieBanner);
            showElement(cookieModal);
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            hideElement(cookieModal);
        });
    }

    if (savePreferencesButton) {
        savePreferencesButton.addEventListener('click', () => {
            const analyticsAccepted = analyticsCheckbox ? analyticsCheckbox.checked : false;
            saveConsent(analyticsAccepted);
            hideElement(cookieModal);
        });
    }

    // Fermeture du modal en cliquant à l'extérieur
    if (cookieModal) {
        cookieModal.addEventListener('click', (e) => {
            if (e.target === cookieModal) {
                hideElement(cookieModal);
            }
        });
    }

    // Initialisation
    if (cookieBanner) {
        if (!checkExistingConsent()) {
            // Affiche la bannière après un court délai pour une meilleure UX
            setTimeout(() => showElement(cookieBanner), 1000);
        }
    }
});
