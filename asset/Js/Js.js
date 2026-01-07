document.addEventListener('DOMContentLoaded', function() {

    const hasGSAP = typeof window.gsap !== 'undefined';

    // ----------- FORMULAIRE DE CONTACT FONCTIONNEL -----------
    // Plusieurs sélecteurs pour s'assurer de trouver le formulaire
    const contactForm = document.querySelector('form[action="mailto:nexawork332@gmail.com"]') || 
                       document.querySelector('.nexa-hover-card form') ||
                       document.querySelector('form');
    
    console.log('Formulaire trouvé:', contactForm); // Débogage
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Soumission du formulaire détectée'); // Débogage
            e.preventDefault(); // Empêche l'envoi par défaut
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const nom = formData.get('nom') || '';
            const email = formData.get('email') || '';
            const telephone = formData.get('telephone') || '';
            const besoin = formData.get('besoin') || '';
            const projet = formData.get('projet') || '';
            
            // Validation des champs
            if (!nom.trim() || !email.trim() || !telephone.trim() || !besoin || !projet.trim()) {
                showMessage('Veuillez remplir tous les champs du formulaire.', 'error');
                return;
            }
            
            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Validation du téléphone (format simple)
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(telephone) || telephone.length < 8) {
                showMessage('Veuillez entrer un numéro de téléphone valide.', 'error');
                return;
            }
            
            // Préparation du sujet et du corps de l'email
            const subject = encodeURIComponent(`Nouveau projet - ${nom}`);
            const body = encodeURIComponent(
                `Nom: ${nom}\n` +
                `Email: ${email}\n` +
                `Téléphone: ${telephone}\n` +
                `Besoin: ${besoin}\n\n` +
                `Description du projet:\n${projet}\n\n` +
                `---\n` +
                `Envoyé depuis le site Nexa Work`
            );
            
            // Construction de l'URL mailto
            const mailtoUrl = `mailto:nexawork332@gmail.com?subject=${subject}&body=${body}`;
            
            // Affichage d'un message de confirmation
            showMessage('Préparation de l\'envoi...', 'info');
            
            // Petite pause pour l'UX puis ouverture du client email
            setTimeout(() => {
                window.location.href = mailtoUrl;
                showMessage('Votre client email s\'ouvre. Vous pouvez envoyer le message directement.', 'success');
                
                // Réinitialisation du formulaire après un délai
                setTimeout(() => {
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
        
        // Alternative : gestionnaire sur le bouton submit
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                console.log('Clic sur le bouton détecté'); // Débogage
                e.preventDefault();
                
                // Déclencher manuellement la validation et l'envoi
                const event = new Event('submit', { cancelable: true });
                contactForm.dispatchEvent(event);
            });
        }
    } else {
        console.log('Formulaire non trouvé'); // Débogage
    }
    
    // Fonction pour afficher des messages
    function showMessage(message, type = 'info') {
        // Création de l'élément message
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        // Style selon le type de message
        switch(type) {
            case 'success':
                messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                messageDiv.style.color = 'white';
                break;
            case 'error':
                messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                messageDiv.style.color = 'white';
                break;
            case 'info':
            default:
                messageDiv.style.background = 'linear-gradient(135deg, #00438B, #003366)';
                messageDiv.style.color = 'white';
                break;
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Animation d'entrée
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
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

    // ----------- NEXXA STATS COUNTERS -----------
    const nexxaStats = document.querySelector('.nexxa-stats');
    if (nexxaStats && 'IntersectionObserver' in window) {
        const statNumbers = Array.from(nexxaStats.querySelectorAll('.nexxa-stat-number'));
        const parts = statNumbers.map(item => {
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

        // Animation function for stats
        function animateNexxaStats() {
            parts.forEach(part => {
                let current = 0;
                const increment = part.target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= part.target) {
                        current = part.target;
                        clearInterval(timer);
                    }
                    part.el.textContent = part.prefix + Math.floor(current) + part.suffix;
                }, 30);
            });
        }

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNexxaStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(nexxaStats);
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

    // ========== GESTION COOKIES NEXA DESIGN ==========
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllButton = document.getElementById('cookie-accept-all');
    const refuseButton = document.getElementById('cookie-refuse');
    
    const COOKIE_KEY = 'cookie-consent';
    const CONSENT_DURATION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois

    // Fonctions utilitaires
    const showCookieBanner = () => {
        if (cookieBanner) {
            requestAnimationFrame(() => cookieBanner.classList.add('show'));
        }
    };

    const hideCookieBanner = () => {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
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

    // Vérifier le consentement
    const checkConsent = () => {
        const consent = getCookie(COOKIE_KEY);
        const consentDate = getCookie('cookie-consent-date');
        
        if (consent && consentDate) {
            const consentTime = new Date(consentDate).getTime();
            const currentTime = Date.now();
            const timeDiff = currentTime - consentTime;
            
            // Si le consentement a moins de 6 mois, ne pas afficher la bannière
            if (timeDiff < CONSENT_DURATION_MS) {
                return;
            }
        }
        
        // Afficher la bannière après un délai pour laisser l'utilisateur voir la page
        setTimeout(showCookieBanner, 2000);
    };

    // Accepter tous les cookies
    const acceptAllCookies = () => {
        setCookie(COOKIE_KEY, 'all', 365);
        setCookie('cookie-consent-date', new Date().toISOString(), 365);
        hideCookieBanner();
        
        // Charger Google Analytics si accepté
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
    };

    // Refuser tous les cookies
    const refuseCookies = () => {
        setCookie(COOKIE_KEY, 'none', 365);
        setCookie('cookie-consent-date', new Date().toISOString(), 365);
        hideCookieBanner();
    };

    // Initialisation
    const initCookieConsent = () => {
        if (acceptAllButton) {
            acceptAllButton.addEventListener('click', acceptAllCookies);
        }
        
        if (refuseButton) {
            refuseButton.addEventListener('click', refuseCookies);
        }
        
        checkConsent();
    };

    // Lancer l'initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
});
