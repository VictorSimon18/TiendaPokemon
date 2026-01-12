/**
 * Efectos interactivos del cursor para temas Pokemon
 * Cada tema (fire, water, grass) tiene su propio efecto visual
 */

class CursorEffects {
    constructor() {
        this.isFireTheme = document.body.classList.contains('fire-theme') || document.querySelector('.fire-theme');
        this.isWaterTheme = document.body.classList.contains('water-theme') || document.querySelector('.water-theme');
        this.isGrassTheme = document.body.classList.contains('grass-theme') || document.querySelector('.grass-theme');

        this.container = null;
        this.lastMouseMove = 0;
        this.throttleDelay = 50; // ms entre efectos

        this.init();
    }

    init() {
        if (this.isFireTheme) {
            this.setupFireEffect();
        } else if (this.isWaterTheme) {
            this.setupWaterEffect();
        } else if (this.isGrassTheme) {
            this.setupGrassEffect();
        }
    }

    /**
     * Efecto de fuego: Partículas que flotan hacia arriba
     */
    setupFireEffect() {
        this.container = document.createElement('div');
        this.container.id = 'fire-cursor-effect';
        document.body.appendChild(this.container);

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastMouseMove < this.throttleDelay) return;
            this.lastMouseMove = now;

            this.createFireParticle(e.clientX, e.clientY);
        });
    }

    createFireParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Variación aleatoria en el movimiento
        const randomX = (Math.random() - 0.5) * 30;
        particle.style.setProperty('--random-x', `${randomX}px`);

        this.container.appendChild(particle);

        // Eliminar después de la animación
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }

    /**
     * Efecto de agua: Burbujas que flotan hacia arriba
     */
    setupWaterEffect() {
        this.container = document.createElement('div');
        this.container.id = 'water-cursor-effect';
        document.body.appendChild(this.container);

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastMouseMove < this.throttleDelay * 1.5) return;
            this.lastMouseMove = now;

            this.createWaterBubble(e.clientX, e.clientY);
        });
    }

    createWaterBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.className = 'water-bubble';

        // Tamaño aleatorio de burbuja
        const size = Math.random() * 20 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${x - size/2}px`;
        bubble.style.top = `${y - size/2}px`;

        // Movimiento aleatorio horizontal
        const randomX = (Math.random() - 0.5) * 50;
        bubble.style.setProperty('--random-x', `${randomX}px`);

        this.container.appendChild(bubble);

        // Eliminar después de la animación
        setTimeout(() => {
            bubble.remove();
        }, 2000);
    }

    /**
     * Efecto de planta: Hojas que caen
     */
    setupGrassEffect() {
        this.container = document.createElement('div');
        this.container.id = 'grass-cursor-effect';
        document.body.appendChild(this.container);

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastMouseMove < this.throttleDelay * 1.2) return;
            this.lastMouseMove = now;

            this.createGrassLeaf(e.clientX, e.clientY);
        });
    }

    createGrassLeaf(x, y) {
        const leaf = document.createElement('div');
        leaf.className = 'grass-leaf';
        leaf.style.left = `${x}px`;
        leaf.style.top = `${y}px`;

        // Rotación aleatoria
        const randomRotation = Math.random() * 360;
        leaf.style.transform = `rotate(${randomRotation}deg)`;

        // Movimiento horizontal aleatorio
        const randomX = (Math.random() - 0.5) * 40;
        leaf.style.setProperty('--random-x', `${randomX}px`);

        this.container.appendChild(leaf);

        // Eliminar después de la animación
        setTimeout(() => {
            leaf.remove();
        }, 2000);
    }
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CursorEffects();
});

// Exportar para uso global si es necesario
if (typeof window !== 'undefined') {
    window.CursorEffects = CursorEffects;
}
