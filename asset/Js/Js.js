document.addEventListener('DOMContentLoaded', function() {

    const hasGSAP = typeof window.gsap !== 'undefined';

    // ----------- FORMULAIRE DE CONTACT FONCTIONNEL -----------
    // Plusieurs sélecteurs pour s'assurer de trouver le formulaire
    const contactForm = document.querySelector('.nexa-form') || 
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
            
            // Vérifier si EmailJS est disponible
            if (typeof emailjs === 'undefined') {
                showMessage('Service EmailJS non disponible. Veuillez réessayer plus tard.', 'error');
                return;
            }
            
            // Affichage d'un message de confirmation
            showMessage('Envoi en cours...', 'info');
            
            // Paramètres EmailJS avec vos vrais IDs
            const templateParams = {
                nom: nom,
                email: email,
                telephone: telephone,
                besoin: besoin,
                projet: projet,
                date: new Date().toLocaleString("fr-FR"),
                from_email: "nexawork332@gmail.com",
                to_email: "nexawork332@gmail.com",
            };

            console.log("Envoi avec les paramètres:", templateParams);

            // Envoi via EmailJS
            emailjs
                .send("service_tljx75k", "template_4akj5k9", templateParams)
                .then(
                    function (response) {
                        console.log("SUCCESS!", response.status, response.text);
                        showMessage(
                            "Message envoyé avec succès ! Nous vous répondrons dans les 24h.",
                            "success"
                        );
                        contactForm.reset();
                    },
                    function (error) {
                        console.log("FAILED...", error);
                        showMessage(
                            "❌ Erreur lors de l'envoi: " + JSON.stringify(error),
                            "error"
                        );
                    }
                );
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

    // ----------- SECTION BADGE ANIMATION (LIQUIDE & PREMIUM) -----------
    const animateSectionBadge = (badge) => {
        if (!hasGSAP || !badge) return;
        
        const text = badge.querySelector('span');
        const tl = gsap.timeline();
        
        // Reset initial states
        gsap.set(badge, { scaleX: 0, transformOrigin: 'left center' });
        if (text) gsap.set(text, { y: 20, opacity: 0 });
        
        // Animation du fond jaune (Liquide)
        tl.to(badge, { 
            scaleX: 1, 
            duration: 1, 
            ease: 'expo.out',
            force3D: true 
        })
        // Animation du texte (Rebond subtil)
        .to(text, { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: 'back.out(1.7)',
            force3D: true
        }, '-=0.8');
    };

    // ----------- INTERSECTION OBSERVER ANIMATIONS -----------
    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        
        // Observer pour les badges (animation spécifique)
        const badgeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSectionBadge(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-badge').forEach(el => badgeObserver.observe(el));

        // Observer général pour le reste
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-header, .service-card, .value-card, .process-step').forEach(el => {
            if (!el.classList.contains('section-badge')) {
                animateObserver.observe(el);
            }
        });
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
                    tl.from(headerEls, { y: 20, opacity: 0, stagger: 0.12 });
                }
                if (contactItems.length) {
                    tl.from(contactItems, { y: 20, opacity: 0, scale: 0.9, stagger: 0.12 }, '-=0.3');
                }
                if (contactButtons.length) {
                    tl.from(contactButtons, { y: 20, opacity: 0, scale: 0.92, stagger: 0.08 }, '-=0.25');
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
                { y: 20, opacity: 0, scale: 0.85 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
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

    // ----------- AOS INITIALIZATION -----------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            easing: "ease-out-cubic",
        });
    }

    // ----------- HEADER SCROLL REVEAL ANIMATION GSAP -----------
    const header = document.querySelector('.nexa-header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Déterminer la direction du scroll
            if (currentScroll > lastScroll) {
                // Scroll vers le bas - masquer le header
                if (currentScroll > 100) {
                    gsap.to(header, {
                        yPercent: -100,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            } else {
                // Scroll vers le haut - révéler le header
                gsap.to(header, {
                    yPercent: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            }
            
            lastScroll = currentScroll;
        });
    }

    // ----------- BURGER GLOBAL - NOUVEAU SYSTÈME PROPRE -----------
    const burgerBtn = document.getElementById('nexa-burger-global');
    const fullMenu = document.getElementById('nexa-full-menu');
    const menuLinks = fullMenu ? fullMenu.querySelectorAll('.full-menu-link') : [];

    if (burgerBtn && fullMenu) {
        // Toggle menu au clic sur burger
        burgerBtn.addEventListener('click', function() {
            burgerBtn.classList.toggle('active');
            fullMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fermer menu au clic sur lien
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Fermer le menu
                burgerBtn.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.classList.remove('menu-open');

                // Smooth scroll pour liens d'ancrage
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                }
            });
        });

        // Fermer avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && fullMenu.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                fullMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ----------- ANIMATION PROCESS SECTION GSAP -----------
    if (hasGSAP) {
        // Animation de la ligne de connexion entre les étapes du processus
        const processSection = document.querySelector('.process-section');
        const processTimeline = document.querySelector('.process-timeline');
        const processLine = processTimeline ? processTimeline.querySelector('::before') : null;

        if (processSection && processTimeline) {
            // Créer un élément de ligne animé avec GSAP
            const connectionLine = document.createElement('div');
            connectionLine.style.cssText = `
                position: absolute;
                top: 50%;
                left: 10%;
                right: 10%;
                height: 2px;
                background: linear-gradient(90deg, var(--nexa-blue), var(--nexa-yellow), var(--nexa-blue));
                transform: scaleX(0);
                transform-origin: left center;
                z-index: 1;
                transition: all 0.3s ease;
            `;
            
            // Insérer la ligne dans la timeline
            processTimeline.style.position = 'relative';
            processTimeline.insertBefore(connectionLine, processTimeline.firstChild);

            // Animation au scroll avec ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);
            
            ScrollTrigger.create({
                trigger: processSection,
                start: "top 70%",
                end: "bottom 30%",
                onEnter: () => {
                    gsap.to(connectionLine, {
                        scaleX: 1,
                        duration: 1.5,
                        ease: "power2.out"
                    });
                },
                onLeave: () => {
                    gsap.to(connectionLine, {
                        scaleX: 0,
                        duration: 0.8,
                        ease: "power2.in"
                    });
                },
                onEnterBack: () => {
                    gsap.to(connectionLine, {
                        scaleX: 1,
                        duration: 1.5,
                        ease: "power2.out"
                    });
                }
            });
        }
    }

    // ----------- MOTEUR DE DÉFILEMENT UNIFIÉ (PORTFOLIO + TÉMOIGNAGES) -----------
    if (hasGSAP) {
        // Configuration globale optimisée
        const config = {
            baseDuration: 60, // 60s par défaut (Modèle Portfolio)
            slowdownTime: 1.5, // Temps pour ralentir
            resumeTime: 1,     // Temps pour reprendre
            slowScale: 0.1     // Vitesse lors du survol (Optimisé pour confort lecture)
        };

        // Stocker les timelines pour les recréer au resize
        const timelines = new Map();

        const initMarquee = (containerSelector, direction = 1, useScrollTrigger = true) => {
            const container = document.querySelector(containerSelector);
            if (!container) return;

            const content = container.querySelector('.portfolio-marquee-content') || container.querySelector('.marquee-content');
            if (!content) return;

            // Calculer la largeur réelle du premier groupe d'items (avant les duplicates)
            const items = Array.from(content.children);
            const duplicatesStartIndex = items.findIndex(item => item.hasAttribute('aria-hidden'));
            const originalItems = duplicatesStartIndex !== -1 ? items.slice(0, duplicatesStartIndex) : items.slice(0, Math.floor(items.length / 2));

            // Calculer la largeur totale du groupe original
            let totalWidth = 0;
            originalItems.forEach(item => {
                totalWidth += item.offsetWidth;
            });

            // Ajouter les gaps
            const gap = 40; // Valeur CSS gap
            totalWidth += gap * (originalItems.length - 1);

            // Clone dynamique pour remplir l'espace horizontal (4K proof)
            const viewportWidth = window.innerWidth;
            const minClonesNeeded = Math.ceil(viewportWidth / totalWidth) + 2; // +2 pour marge de sécurité

            // Supprimer les anciens clones
            const currentClones = items.filter(item => item.hasAttribute('aria-hidden'));
            currentClones.forEach(clone => clone.remove());

            // Ajouter les nouveaux clones nécessaires
            for (let i = 0; i < minClonesNeeded; i++) {
                originalItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true');
                    content.appendChild(clone);
                });
            }

            // Recalculer la largeur totale avec tous les clones
            const allItems = Array.from(content.children);
            let newTotalWidth = 0;
            allItems.forEach(item => {
                newTotalWidth += item.offsetWidth;
            });
            newTotalWidth += gap * (allItems.length - 1);

            // Création de la timeline GSAP pour une boucle infinie parfaite avec GPU acceleration
            const tl = gsap.timeline({
                repeat: -1,
                invalidateOnRefresh: true,
                force3D: true
            });

            // Utiliser la largeur calculée dynamiquement
            if (direction > 0) {
                tl.fromTo(content,
                    { x: 0 },
                    { x: -totalWidth, duration: config.baseDuration, ease: "none", force3D: true }
                );
            } else {
                tl.fromTo(content,
                    { x: -totalWidth },
                    { x: 0, duration: config.baseDuration, ease: "none", force3D: true }
                );
            }

            // Gestion des interactions (Magnet Effect) - ISOLÉE sur le conteneur marquee
            // timeScale progressif : ralentissement doux jusqu'à 0.1 au hover
            container.addEventListener('mouseenter', () => {
                gsap.to(tl, { timeScale: config.slowScale, duration: config.slowdownTime, ease: "power2.out" });
            });

            container.addEventListener('mouseleave', () => {
                gsap.to(tl, { timeScale: 1, duration: config.resumeTime, ease: "power2.inOut" });
            });

            // ScrollTrigger pour mettre en pause l'animation quand hors champ (uniquement pour Portfolio)
            if (useScrollTrigger) {
                ScrollTrigger.create({
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => tl.play(),
                    onLeave: () => tl.pause(),
                    onEnterBack: () => tl.play(),
                    onLeaveBack: () => tl.pause()
                });
            }

            // Stocker la timeline pour recréation au resize
            timelines.set(containerSelector, { tl, container, content, direction, useScrollTrigger });

            return tl;
        };

        // Initialisation au chargement complet de la page (images, CSS, etc.)
        window.addEventListener('load', () => {
            // 1. Initialisation Portfolio (Sens alternés) avec ScrollTrigger
            initMarquee('.row-web', 1, true);       // Gauche
            initMarquee('.row-seo', -1, true);      // Droite
            initMarquee('.row-branding', 1, true);  // Gauche

            // 2. Témoignages : Désactivé - Conversion en CSS natif pour performance
            // initMarquee('.marquee', 1, false); // Plus utilisé, remplacé par CSS
        });

        // Recalculer les dimensions et recréer les timelines au resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Arrêter toutes les timelines existantes
                timelines.forEach(({ tl }) => {
                    tl.kill();
                });
                timelines.clear();

                // Recréer uniquement les marquee Portfolio (Témoignages en CSS natif)
                initMarquee('.row-web', 1, true);
                initMarquee('.row-seo', -1, true);
                initMarquee('.row-branding', 1, true);

                ScrollTrigger.refresh();
            }, 250);
        });
    }
});

// --- FAQ ACCORDION INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle l'item actuel
            item.classList.toggle('active');
        });
    });
});
