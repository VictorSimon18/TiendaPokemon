// ==================== //
// CARRITO DE COMPRAS   //
// ==================== //

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botón del carrito en el navbar
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }

        // Botón cerrar modal
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCart());
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeCart();
                }
            });
        }

        // Botones de añadir al carrito
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productData = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseFloat(e.target.dataset.price),
                    type: e.target.dataset.type
                };
                this.addItem(productData);
                this.showAddedFeedback(e.target);
            });
        });

        // Botón de checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
                this.renderCartItems();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
        }

        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = this.getTotalPrice().toFixed(2) + '€';
        }
    }

    openCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.add('show');
            this.renderCartItems();
        }
    }

    closeCart() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Tu carrito está vacío</p>
                    <p>¡Añade algunos Pokemon a tu colección!</p>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Tipo: ${item.type} • ${item.price.toFixed(2)}€</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    showAddedFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Añadido';
        button.style.backgroundColor = '#10b981';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Debes iniciar sesión para completar la compra');
            window.location.href = 'login.html';
            return;
        }

        const total = this.getTotalPrice();
        const itemCount = this.getTotalItems();

        if (confirm(`¿Confirmar compra de ${itemCount} artículos por ${total.toFixed(2)}€?`)) {
            alert(`¡Gracias por tu compra, ${user.name}! Tu pedido está siendo procesado.`);
            this.items = [];
            this.saveCart();
            this.updateCartUI();
            this.closeCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }
}

// Inicializar el carrito cuando se carga la página
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
