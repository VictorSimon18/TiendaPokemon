// ==================== //
// AUTENTICACIÓN        //
// ==================== //

// Import Firebase Auth
import { auth, googleProvider } from './firebase-config.js';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

class Auth {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.setupAuthStateListener();
        this.setupEventListeners();
    }

    setupAuthStateListener() {
        // Firebase's onAuthStateChanged automatically handles auth state persistence
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                this.handleAuthStateChange(firebaseUser);
            } else {
                // User is signed out
                this.user = null;
                localStorage.removeItem('user');
                this.updateAuthUI();
            }
        });
    }

    handleAuthStateChange(firebaseUser) {
        // Convert Firebase user to our localStorage format for compatibility with cart.js
        const user = {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            provider: firebaseUser.providerData[0]?.providerId.includes('google') ? 'google' : 'email',
            avatar: firebaseUser.photoURL || '👤',
            loginDate: new Date().toISOString(),
            uid: firebaseUser.uid // Store Firebase UID for reference
        };

        this.user = user;
        // Maintain localStorage compatibility for cart.js
        localStorage.setItem('user', JSON.stringify(user));
        this.updateAuthUI();
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

    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // handleAuthStateChange will be called automatically via onAuthStateChanged
            this.showSuccessMessage(`¡Bienvenido, ${result.user.displayName || result.user.email}!`);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async loginWithEmail(form) {
        const email = form.email.value;
        const password = form.password.value;

        if (!email || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            this.showSuccessMessage(`¡Bienvenido de vuelta, ${result.user.email}!`);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async register() {
        // For demo: prompt for email/password, then use Firebase
        const email = prompt('Ingresa tu email:', 'usuario@email.com');

        if (!email || email === 'usuario@email.com') {
            return;
        }

        const password = prompt('Ingresa tu contraseña (mínimo 6 caracteres):', '');

        if (!password) {
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            this.showSuccessMessage('¡Cuenta creada! Bienvenido!');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async logout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            try {
                await signOut(auth);
                // onAuthStateChanged will handle cleanup automatically
                this.showSuccessMessage('Sesión cerrada correctamente');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                this.handleAuthError(error);
            }
        }
    }

    handleAuthError(error) {
        console.error('Auth error:', error);

        // User-friendly error messages in Spanish
        const errorMessages = {
            'auth/user-not-found': 'Usuario no encontrado. ¿Necesitas crear una cuenta?',
            'auth/wrong-password': 'Contraseña incorrecta. Intenta de nuevo.',
            'auth/email-already-in-use': 'Este email ya está registrado. Intenta iniciar sesión.',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
            'auth/invalid-email': 'El formato del email no es válido.',
            'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
            'auth/operation-not-allowed': 'Operación no permitida. Contacta al administrador.',
            'auth/invalid-credential': 'Credenciales inválidas. Verifica tus datos.'
        };

        const message = errorMessages[error.code] || `Error de autenticación: ${error.message}`;
        alert(message);
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
let authInstance;
document.addEventListener('DOMContentLoaded', () => {
    authInstance = new Auth();
});

// Export for compatibility (in case other scripts reference it)
export { authInstance as auth };
