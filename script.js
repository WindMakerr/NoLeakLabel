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

// Обработчик добавления в корзину на страницах товаров
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
    
    showNotification('✅ Заказ оформлен! С вами свяжутся в ближайшее время.', 'success');
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
});

// ========== АНИМАЦИЯ ЧАСТИЦ THREE.JS ==========
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
    const color3 = new THREE.Color(0xFF36B0);

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
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 18;

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0002;
        particlesMesh.rotation.z += 0.0001;
        renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========== ПАРАЛЛАКС ЭФФЕКТ ==========
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    document.querySelectorAll('.parallax-bg').forEach(el => {
        el.style.transform = `translate(${mouseX * 40}px, ${mouseY * 40}px)`;
    });
    
    document.querySelectorAll('.card-3d, .product-card, .contact-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - cardCenterX) / 25;
        const deltaY = (e.clientY - cardCenterY) / 25;
        
        card.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
});

document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.card-3d, .product-card, .contact-card').forEach(card => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    });
});

// ========== АНИМАЦИЯ СКРОЛЛА ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.parallax-section').forEach(el => {
        const speed = 0.3;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
    
    document.querySelectorAll('.fade-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        const opacity = Math.min(1, (window.innerHeight - rect.top) / 300);
        el.style.opacity = opacity;
    });
    
    document.querySelectorAll('.parallax-text').forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== ДИНАМИЧЕСКИЙ СЧЕТЧИК ==========
function animateCounter() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
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
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ========== АНИМАЦИЯ КНОПОК ==========
document.querySelectorAll('.btn-neon, .btn-purple').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.animation = 'btnPulse 1s infinite';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.animation = 'btnPulse 3s infinite';
    });
});

// ========== ТОВАРЫ ДЛЯ ГЛАВНОЙ ==========
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

// ========== КАТАЛОГ С ФИЛЬТРАЦИЕЙ ==========
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
    document.getElementById('resultsCount').textContent = filtered.length;
    
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
        
        document.getElementById('currentPrice').textContent = priceMax + ' ₽';
        
        const btn = document.getElementById('applyFilter');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    });

    document.getElementById('resetFilter')?.addEventListener('click', () => {
        document.getElementById('priceRange').value = 4000;
        document.getElementById('currentPrice').textContent = '4000 ₽';
        document.getElementById('typeFilter').value = 'all';
        renderCatalog(allProducts);
        
        const btn = document.getElementById('resetFilter');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    });

    document.getElementById('priceRange')?.addEventListener('input', (e) => {
        document.getElementById('currentPrice').textContent = e.target.value + ' ₽';
    });
}

// ========== АНИМАЦИЯ ПОЛЗУНКА ==========
const priceRange = document.getElementById('priceRange');
if (priceRange) {
    priceRange.addEventListener('mousemove', (e) => {
        const val = (e.target.value / e.target.max) * 100;
        e.target.style.background = `linear-gradient(90deg, var(--neon-purple) ${val}%, rgba(255,255,255,0.1) ${val}%)`;
    });
}

// ========== ВАЛИДАЦИЯ ФОРМЫ КОНТАКТОВ ==========
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправка...';
    btn.disabled = true;
    
    setTimeout(() => {
        showNotification('✅ Сообщение отправлено! Мы ответим в ближайшее время.', 'success');
        e.target.reset();
        btn.innerHTML = '<i class="bi bi-send me-2"></i> Отправить сообщение';
        btn.disabled = false;
    }, 1500);
});

// ========== FAQ ДЛЯ КОНТАКТОВ ==========
window.toggleFaq = function(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        answer.style.animation = 'fadeIn 0.5s';
        icon.className = 'bi bi-chevron-up';
    } else {
        answer.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            answer.style.display = 'none';
        }, 250);
        icon.className = 'bi bi-chevron-down';
    }
};

// ========== ТИПИНГ АНИМАЦИЯ ДЛЯ ЗАГОЛОВКОВ ==========
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    typingElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(el);
    });
}

// ========== ЗАПУСК ВСЕХ АНИМАЦИЙ ==========
window.addEventListener('load', () => {
    initParticles();
    animateCounter();
    initTypingAnimation();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Конфетти на главной
    if (window.location.pathname.includes('index') || window.location.pathname === '/') {
        setTimeout(() => {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#8B00FF', '#00FFFF', '#FF36B0']
                });
            }
        }, 1000);
    }
});

// ========== ДОБАВЛЕНИЕ НОВЫХ АНИМАЦИЙ ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 20px var(--neon-purple)); }
        50% { filter: drop-shadow(0 0 40px var(--neon-pink)); }
    }
    
    @keyframes rotateIn {
        from {
            transform: rotate(-180deg) scale(0);
            opacity: 0;
        }
        to {
            transform: rotate(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .float-animation {
        animation: float 4s ease-in-out infinite;
    }
    
    .glow-animation {
        animation: glow 3s ease-in-out infinite;
    }
    
    .rotate-in {
        animation: rotateIn 0.8s ease-out;
    }
    
    .bounce-in {
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .fade-out {
        animation: fadeOut 0.5s forwards;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hover-glow:hover {
        filter: drop-shadow(0 0 30px var(--neon-purple));
        transition: all 0.3s;
    }
`;
document.head.appendChild(style);
