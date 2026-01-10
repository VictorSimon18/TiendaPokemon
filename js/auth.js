// ==================== //
// AUTENTICACIÓN        //
// ==================== //

class Auth {
    constructor() {
        this.user = this.getUser();
        this.init();
    }

    init() {
        this.updateAuthUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botón de login en el navbar
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.user) {
                    this.logout();
                } else {
                    window.location.href = 'login.html';
                }
            });
        }

        // Botón de login con Google
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.loginWithGoogle());
        }

        // Formulario de login tradicional
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.loginWithEmail(e.target);
            });
        }

        // Link de registro
        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.register();
            });
        }
    }

    loginWithGoogle() {
        // Simulación de login con Google
        const userName = prompt('Simulación de Google Login\n\n¿Cuál es tu nombre?', 'Usuario Pokemon');

        if (userName && userName.trim()) {
            const user = {
                name: userName.trim(),
                email: `${userName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                provider: 'google',
                avatar: '👤',
                loginDate: new Date().toISOString()
            };

            this.setUser(user);
            this.showSuccessMessage(`¡Bienvenido, ${user.name}!`);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    loginWithEmail(form) {
        const email = form.email.value;
        const password = form.password.value;

        if (!email || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Simulación de login con email
        const user = {
            name: email.split('@')[0],
            email: email,
            provider: 'email',
            avatar: '👤',
            loginDate: new Date().toISOString()
        };

        this.setUser(user);
        this.showSuccessMessage(`¡Bienvenido de vuelta, ${user.name}!`);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    register() {
        // Simulación de registro
        alert('Funcionalidad de registro\n\nEn una implementación real, aquí se mostraría un formulario de registro completo.');

        const userName = prompt('Para esta demo, ingresa tu nombre:', 'Nuevo Usuario');
        const userEmail = prompt('Ingresa tu email:', 'usuario@email.com');

        if (userName && userEmail) {
            const user = {
                name: userName,
                email: userEmail,
                provider: 'email',
                avatar: '👤',
                loginDate: new Date().toISOString()
            };

            this.setUser(user);
            this.showSuccessMessage(`¡Cuenta creada! Bienvenido, ${user.name}!`);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    logout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            localStorage.removeItem('user');
            this.user = null;
            this.updateAuthUI();
            this.showSuccessMessage('Sesión cerrada correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (!loginBtn) return;

        if (this.user) {
            loginBtn.textContent = `${this.user.avatar} ${this.user.name}`;
            loginBtn.title = 'Clic para cerrar sesión';
        } else {
            loginBtn.textContent = 'Iniciar Sesión';
            loginBtn.title = 'Clic para iniciar sesión';
        }
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
    }

    getUser() {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    }

    showSuccessMessage(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 9999;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Añadir animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar autenticación cuando se carga la página
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new Auth();
});
