// --- SÉCURITÉ PROTOTYPE - ANTI-VOL ---
// Désactivation du clic droit
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Blocage des raccourcis clavier (F12, Ctrl+Shift+I, Ctrl+U)
document.addEventListener('keydown', function(e) {
    // F12 - Outils de développement
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I - Inspecter
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U - Voir le code source
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+C - Sélecteur d'éléments
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
});

// Création du filigrane dynamique
function createWatermark() {
    const watermark = document.createElement('div');
    watermark.className = 'prototype-watermark';
    document.body.appendChild(watermark);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    createWatermark();
    
    // Message de sécurité dans la console
    console.clear();
    console.log('%c⚠️ PROTOTYPE CONFIDENTIEL - NEXA WORK ⚠️', 'color: #ff0000; font-size: 20px; font-weight: bold;');
    console.log('%cCe prototype est protégé et confidentiel. Toute copie ou reproduction est interdite.', 'color: #ff6600; font-size: 14px;');
});

// Détection des outils de développement
(function() {
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c🔒 Outils de développement détectés - Accès non autorisé 🔒', 'color: #ff0000; font-size: 16px; font-weight: bold;');
                document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: white; font-family: Arial; text-align: center; padding: 20px;"><h1>🔒 ACCÈS NON AUTORISÉ 🔒<br><small>Prototype confidentiel - NEXA WORK</small></h1></div>';
            }
        } else {
            devtools.open = false;
        }
    }, 500);
})();
