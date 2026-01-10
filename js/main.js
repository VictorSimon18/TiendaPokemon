// ==================== //
// FUNCIONES GENERALES  //
// ==================== //

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initAnimations();
    showWelcomeMessage();
});

// Scroll suave para enlaces ancla
function initSmoothScroll() {
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
}

// Animaciones al hacer scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos animables
    const animatableElements = document.querySelectorAll('.product-card, .category-card, .feature-item');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mensaje de bienvenida para usuarios nuevos
function showWelcomeMessage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

    // Solo mostrar en la página principal
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        return;
    }

    if (user && !hasSeenWelcome) {
        setTimeout(() => {
            showNotification(`¡Bienvenido a Tienda Pokemon, ${user.name}! 🎮`, 'info');
            localStorage.setItem('hasSeenWelcome', 'true');
        }, 1000);
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'success') {
    const colors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    };

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Validación de formularios
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Formatear precio
function formatPrice(price) {
    return price.toFixed(2) + '€';
}

// Scroll to top suave
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Detección de tema oscuro del sistema
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
    }
    return false;
}

// Guardar favoritos
function toggleFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        showNotification('Producto eliminado de favoritos', 'info');
    } else {
        favorites.push(productId);
        showNotification('Producto añadido a favoritos', 'success');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Obtener favoritos
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

// Debug: Limpiar localStorage (útil para desarrollo)
function clearAllData() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esto cerrará tu sesión y vaciará el carrito.')) {
        localStorage.clear();
        window.location.reload();
    }
}

// Exportar funciones para uso global
window.pokemonShop = {
    showNotification,
    validateEmail,
    formatPrice,
    scrollToTop,
    toggleFavorite,
    getFavorites,
    clearAllData
};

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('¡Has encontrado el código secreto! 🎮✨', 'success');

    // Añadir efecto especial
    document.body.style.animation = 'rainbow 2s ease infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 5000);
}

// Log de inicio
console.log('%c🎮 Tienda Pokemon', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%c¡Bienvenido! Esta es una tienda demo de figuritas Pokemon.', 'color: #764ba2; font-size: 12px;');
console.log('%cPara limpiar todos los datos: window.pokemonShop.clearAllData()', 'color: #999; font-size: 10px;');
