// Инициализация AOS
AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 120,
    easing: 'ease-out-cubic',
    delay: 100
});

// ========== КОРЗИНА ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.textContent = count;
        cartCountElem.style.animation = 'none';
        cartCountElem.offsetHeight;
        cartCountElem.style.animation = 'cartPulse 0.5s';
    }
}

function renderCartModal() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center p-5"><i class="bi bi-cart-x fs-1 text-purple"></i><p class="mt-3">Корзина пуста</p></div>';
    } else {
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-black rounded-3 border border-purple" style="animation: fadeInUp 0.5s ${index * 0.1}s both;">
                    <div>
                        <strong class="text-purple fs-5">${item.name}</strong><br>
                        <small class="text-muted">${item.option || ''}</small>
                        <span class="badge bg-purple ms-2">${item.price} ₽</span>
                        <span class="badge" style="background: linear-gradient(135deg, var(--neon-purple), var(--neon-pink));">x${item.quantity || 1}</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm rounded-circle" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
        const total = cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
        html += `<h4 class="mt-4 text-end text-purple">Итого: ${total} ₽ <span class="text-cyan">(${cart.length} товаров)</span></h4>`;
        cartContainer.innerHTML = html;
    }
}

function addToCart(name, price, option) {
    if (!name || !price) return;
    
    const existing = cart.find(item => item.name === name && item.option === option);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ name, price, option, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
    showNotification('✨ Товар добавлен в корзину!', 'success');
}

window.addToCart = addToCart;

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal();
        showNotification('🗑️ Товар удален из корзины', 'warning');
    }
}

window.removeFromCart = removeFromCart;

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `toast align-items-center border-0 show position-fixed top-0 end-0 m-4`;
    notification.setAttribute('role', 'alert');
    notification.style.cssText = 'z-index: 9999; background: linear-gradient(135deg, #8B00FF, #FF36B0); color: white; border-radius: 50px; padding: 15px 30px; box-shadow: 0 10px 40px rgba(139,0,255,0.5); animation: slideInRight 0.5s, fadeOut 0.5s 2.5s forwards;';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} fs-4 me-3"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Инициализация корзины
updateCartCount();

// Обработчик кнопки корзины
document.getElementById('cartBtn')?.addEventListener('click', () => {
    renderCartModal();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
    const btn = document.getElementById('cartBtn');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
});

// Обработчик добавления в корзину
document.querySelectorAll('#addToCartBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const selected = document.querySelector('input[name="productOption"]:checked');
        if (!selected) {
            showNotification('❌ Выберите вариант товара', 'warning');
            return;
        }
        const price = parseInt(selected.value);
        const option = selected.nextElementSibling?.textContent?.trim() || '';
        const name = document.querySelector('h1')?.textContent || 'Товар';
        addToCart(name, price, option);
        
        this.style.transform = 'scale(0.9) rotate(-5deg)';
        setTimeout(() => this.style.transform = 'scale(1.1) rotate(5deg)', 100);
        setTimeout(() => this.style.transform = 'scale(1) rotate(0)', 200);
    });
});

// Оформление заказа
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста', 'warning');
        return;
    }
    
    showNotification('✅ Заказ оформлен! С вами свяжутся.', 'success');
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
});

// ========== АНИМАЦИЯ ЧАСТИЦ ==========
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || !window.THREE) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x8B00FF);
    const color2 = new THREE.Color(0x00FFFF);

    for (let i = 0; i < particlesCount; i++) {
        const radius = 10;
        const angle = (i / particlesCount) * Math.PI * 2;
        const height = (Math.random() - 0.5) * 15;
        
        positions[i*3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
        positions[i*3+1] = height + (Math.random() - 0.5) * 3;
        positions[i*3+2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;

        const mixColor = color1.clone().lerp(color2, Math.random());
        colors[i*3] = mixColor.r;
        colors[i*3+1] = mixColor.g;
        colors[i*3+2] = mixColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 18;

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0003;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========== ПАРАЛЛАКС ==========
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.card-3d, .product-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - cardCenterX) / 25;
        const deltaY = (e.clientY - cardCenterY) / 25;
        
        card.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
    });
});

// ========== АНИМАЦИЯ СЧЕТЧИКОВ ==========
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ========== ТОВАРЫ ДЛЯ ГЛАВНОЙ ==========
const popularProducts = [
    { 
        name: 'ESP Hack Ultimate', 
        img: 'https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13', 
        price: 2999, 
        link: 'product.html',
        description: 'Полный ESP с отображением врагов'
    },
    { 
        name: 'Auto Last Hit Pro', 
        img: 'https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13', 
        price: 1999, 
        link: 'product1.html',
        description: 'Автоматический ласт хит 99.8%'
    },
    { 
        name: 'Map Hack Vision', 
        img: 'https://ggcheats.shop/img/cheats/ico/melonity.png', 
        price: 2499, 
        link: 'product2.html',
        description: 'Полное видение карты'
    },
    { 
        name: 'Script Pack Premium', 
        img: 'https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026', 
        price: 3499, 
        link: 'product3.html',
        description: '400+ скриптов для героев'
    }
];

if (document.getElementById('popular-products')) {
    const container = document.getElementById('popular-products');
    popularProducts.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-3';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        card.innerHTML = `
            <div class="product-card">
                <img src="${prod.img}" class="product-img" alt="${prod.name}" loading="lazy">
                <div class="product-body">
                    <h5 class="text-purple">${prod.name}</h5>
                    <p class="text-muted small">${prod.description}</p>
                    <p class="text-purple fw-bold fs-4">${prod.price} ₽</p>
                    <a href="${prod.link}" class="btn-neon w-100 text-center" style="padding: 8px;">Подробнее</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ========== КАТАЛОГ ==========
const allProducts = [
    { name: 'ESP Hack Ultimate', type: 'esp',
