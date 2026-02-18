// Инициализация AOS
AOS.init({
    duration: 1200,
    once: false,
    mirror: true,
    offset: 120,
    easing: 'ease-in-out-cubic',
    delay: 100
});

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.textContent = count;
    }
}

function renderCartModal() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Корзина пуста</p>';
    } else {
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                    <div>
                        <strong class="text-purple">${item.name}</strong><br>
                        <small>${item.option || ''} - ${item.price} руб.</small>
                        <span class="badge bg-purple ms-2">x${item.quantity || 1}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
        const total = cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
        html += `<h5 class="mt-3 text-end text-purple">Итого: ${total} руб.</h5>`;
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
    showNotification('Товар добавлен в корзину!', 'success');
}

window.addToCart = addToCart;

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartModal();
        showNotification('Товар удален из корзины', 'warning');
    }
}

window.removeFromCart = removeFromCart;

// Кастомное уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.cssText = 'z-index: 9999; background: #8B00FF; color: white; border: none; padding: 15px 25px; border-radius: 10px; animation: slideInRight 0.3s;';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация корзины
updateCartCount();

// Обработчик кнопки корзины
document.getElementById('cartBtn')?.addEventListener('click', () => {
    renderCartModal();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
});

// Обработчик добавления в корзину на странице товара
document.querySelectorAll('#addToCartBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const selected = document.querySelector('input[name="productOption"]:checked');
        if (!selected) {
            showNotification('Выберите вариант товара', 'warning');
            return;
        }
        const price = parseInt(selected.value);
        const option = selected.nextElementSibling?.textContent?.trim() || '';
        const name = document.querySelector('h1')?.textContent || 'Товар';
        addToCart(name, price, option);
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 200);
    });
});

// Обработчик оформления заказа
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'warning');
        return;
    }
    
    showNotification('Заказ оформлен! С вами свяжутся.', 'success');
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
});

// Анимация частиц Three.js
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || !window.THREE) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 20;
        
        colorArray[i] = Math.random() * 0.5 + 0.5;
        colorArray[i + 1] = Math.random() * 0.3;
        colorArray[i + 2] = Math.random() * 0.8 + 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({ 
        size: 0.03,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        particlesMesh.rotation.y += 0.0002;
        particlesMesh.rotation.x += 0.0001;
        renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Параллакс эффект
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(el => {
        const speed = 0.05;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// Анимация скролла
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.parallax-section');
    parallax.forEach(el => {
        const speed = 0.5;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
});

// Прелоадер
window.addEventListener('load', () => {
    initParticles();
    
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);
});

// Популярные товары
const popularProducts = [
    { 
        name: 'ESP Hack Ultimate', 
        img: 'https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13', 
        price: 2999, 
        link: 'product.html',
        description: 'Полный ESP с отображением врагов через стены'
    },
    { 
        name: 'Auto Last Hit Pro', 
        img: 'https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13', 
        price: 1999, 
        link: 'product1.html',
        description: 'Автоматический ласт хит с точностью 99.8%'
    },
    { 
        name: 'Map Hack Vision', 
        img: 'https://ggcheats.shop/img/cheats/ico/melonity.png', 
        price: 2499, 
        link: 'product2.html',
        description: 'Полное видение карты и вардов'
    },
    { 
        name: 'Script Pack Premium', 
        img: 'https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026', 
        price: 3499, 
        link: 'product3.html',
        description: '400+ скриптов для всех героев'
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

// Каталог с фильтрацией
const allProducts = [
    { name: 'ESP Hack Ultimate', type: 'esp', price: 2999, img: 'https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13', link: 'product.html', description: 'Полный ESP' },
    { name: 'Auto Last Hit Pro', type: 'lasthit', price: 1999, img: 'https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13', link: 'product1.html', description: 'Авто ласт хит' },
    { name: 'Map Hack Vision', type: 'map', price: 2499, img: 'https://ggcheats.shop/img/cheats/ico/melonity.png', link: 'product2.html', description: 'Map hack' },
    { name: 'Script Pack Premium', type: 'script', price: 3499, img: 'https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026', link: 'product3.html', description: 'Скрипты' }
];

function renderCatalog(filtered) {
    const container = document.getElementById('catalog-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="fs-3">Товары не найдены</p></div>';
        return;
    }
    
    filtered.forEach((prod, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', index * 50);
        col.innerHTML = `
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
        container.appendChild(col);
    });
}

if (document.getElementById('catalog-items')) {
    renderCatalog(allProducts);

    document.getElementById('applyFilter')?.addEventListener('click', () => {
        const priceMax = parseInt(document.getElementById('priceRange')?.value) || 4000;
        const type = document.getElementById('typeFilter')?.value || 'all';
        
        const filtered = allProducts.filter(p => {
            return p.price <= priceMax && (type === 'all' || p.type === type);
        });
        
        renderCatalog(filtered);
        
        const btn = document.getElementById('applyFilter');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    });
}

// Валидация формы контактов
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправка...';
    btn.disabled = true;
    
    setTimeout(() => {
        showNotification('Сообщение отправлено!', 'success');
        e.target.reset();
        btn.innerHTML = 'Отправить';
        btn.disabled = false;
    }, 1500);
});

// Анимация ползунка цены
const priceRange = document.getElementById('priceRange');
const priceDisplay = document.createElement('span');
if (priceRange) {
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        if (!priceDisplay.parentNode) {
            priceDisplay.className = 'badge bg-purple position-absolute';
            priceDisplay.style.cssText = 'top: -25px; transform: translateX(-50%);';
            priceRange.parentNode.style.position = 'relative';
            priceRange.parentNode.appendChild(priceDisplay);
        }
        priceDisplay.textContent = `${value} ₽`;
        const percent = (value / 4000) * 100;
        priceDisplay.style.left = `${percent}%`;
    });
}

// Анимация при наведении на карточки
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s';
    });
});

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
