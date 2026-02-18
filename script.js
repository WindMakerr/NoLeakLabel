// Инициализация AOS с улучшенными настройками
AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 120,
    easing: 'ease-out-cubic',
    delay: 100,
    anchorPlacement: 'top-bottom'
});

// Корзина с локальным хранилищем
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.textContent = count;
        // Добавляем эффект при обновлении
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
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-black rounded-3 border border-purple animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s">
                    <div>
                        <strong class="text-purple fs-5">${item.name}</strong><br>
                        <small class="text-muted">${item.option || ''}</small>
                        <span class="badge bg-purple ms-2">${item.price} ₽</span>
                        <span class="badge bg-gradient-purple ms-2">x${item.quantity || 1}</span>
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

// Улучшенные уведомления
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

// Обработчик кнопки корзины с анимацией
document.getElementById('cartBtn')?.addEventListener('click', () => {
    renderCartModal();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
    // Анимация кнопки
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
        
        // Сложная анимация кнопки
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
    
    showNotification('✅ Заказ оформлен! С вами свяжутся в ближайшее время.', 'success');
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
});

// Улучшенная анимация частиц Three.js
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || !window.THREE) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Создаем частицы разных форм
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    const color1 = new THREE.Color(0x8B00FF); // фиолетовый
    const color2 = new THREE.Color(0x00FFFF); // голубой
    const color3 = new THREE.Color(0xFF36B0); // розовый

    for (let i = 0; i < particlesCount; i++) {
        // Позиции в форме тора
        const radius = 8;
        const angle = (i / particlesCount) * Math.PI * 2;
        const height = (Math.random() - 0.5) * 10;
        
        positions[i*3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
        positions[i*3+1] = height + (Math.random() - 0.5) * 2;
        positions[i*3+2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

        // Цвета
        const mixColor = color1.clone().lerp(color2, Math.random());
        colors[i*3] = mixColor.r;
        colors[i*3+1] = mixColor.g;
        colors[i*3+2] = mixColor.b;

        // Размеры
        sizes[i] = Math.random() * 0.1 + 0.02;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Создаем материал с текстурой круга
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8B00FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.stroke();

    const particleTexture = new THREE.CanvasTexture(canvasTexture);

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 15;

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        
        // Плавное вращение
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0003;
        
        // Пульсация
        const time = Date.now() * 0.001;
        particlesMesh.scale.setScalar(1 + Math.sin(time) * 0.05);
        
        renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Улучшенный параллакс эффект
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    document.querySelectorAll('.parallax-bg').forEach(el => {
        el.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
    });
    
    document.querySelectorAll('.card-3d').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - cardCenterX) / 20;
        const deltaY = (e.clientY - cardCenterY) / 20;
        
        card.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
    });
});

// Анимация скролла с параллаксом
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax-section').forEach(el => {
        const speed = 0.3;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
    
    // Плавное появление элементов
    document.querySelectorAll('.fade-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        const opacity = Math.min(1, (window.innerHeight - rect.top) / 300);
        el.style.opacity = opacity;
    });
});

// Инициализация после загрузки
window.addEventListener('load', () => {
    initParticles();
    
    // Скрываем прелоадер
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.transition = 'opacity 1s';
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 1000);
    }
    
    // Запускаем конфетти на главной
    if (window.location.pathname.includes('index') || window.location.pathname === '/') {
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8B00FF', '#00FFFF', '#FF36B0']
            });
        }, 1000);
    }
});

// Популярные товары с улучшенным дизайном
const popularProducts = [
    { 
        name: 'ESP Hack Ultimate', 
        img
