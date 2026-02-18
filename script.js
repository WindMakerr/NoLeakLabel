// Инициализация AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
    offset: 50
});

// Данные товаров
const products = [
    {
        id: 1,
        name: "Dota 2 ESP Hack Ultimate",
        description: "Полный набор функций ESP для Dota 2 с отображением врагов через стены, здоровьем и маной противников.",
        price: 2999,
        monthlyPrice: 299,
        image: "https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13",
        link: "product.html",
        rating: 4.9,
        reviews: 128
    },
    {
        id: 2,
        name: "Dota 2 Auto Last Hit Pro",
        description: "Автоматический ласт хит и денай для максимального фарма с настройкой под любого героя.",
        price: 1999,
        monthlyPrice: 199,
        image: "https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13",
        link: "product1.html",
        rating: 4.8,
        reviews: 95
    },
    {
        id: 3,
        name: "Dota 2 Map Hack Vision",
        description: "Полная карта с видением противника, вардами и предупреждениями о гангах.",
        price: 2499,
        monthlyPrice: 249,
        image: "https://ggcheats.shop/img/cheats/ico/melonity.png",
        link: "product2.html",
        rating: 4.7,
        reviews: 87
    },
    {
        id: 4,
        name: "Dota 2 Script Pack Premium",
        description: "Набор скриптов для всех героев с автоматизацией комбо и умных способностей.",
        price: 3499,
        monthlyPrice: 349,
        image: "https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026",
        link: "product3.html",
        rating: 4.9,
        reviews: 156
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
        
        // Анимация при изменении
        cartCount.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            cartCount.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    }
}

// Добавление в корзину
function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Показываем уведомление
    showNotification(`Товар "${product.name}" добавлен в корзину`, 'success');
    
    // Обновляем отображение корзины, если модальное окно открыто
    if (document.getElementById('cartModal').classList.contains('show')) {
        displayCartItems();
    }
}

// Удаление из корзины
function removeFromCart(index) {
    const removed = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification(`Товар "${removed.name}" удален из корзины`, 'info');
}

// Отображение товаров в корзине
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Корзина пуста</p>';
        return;
    }
    
    let total = 0;
    let html = '<div class="table-responsive"><table class="table table-dark"><thead><tr><th>Товар</th><th>Цена</th><th>Действие</th></tr></thead><tbody>';
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()} ₽</td>
                <td><button class="btn btn-sm btn-danger remove-item" data-index="${index}"><i class="bi bi-trash"></i></button></td>
            </tr>
        `;
    });
    
    html += `<tr class="table-active"><td colspan="2"><strong>Итого:</strong></td><td><strong>${total.toLocaleString()} ₽</strong></td></tr>`;
    html += '</tbody></table></div>';
    
    cartItems.innerHTML = html;
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            removeFromCart(index);
        });
    });
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} position-fixed top-0 end-0 m-3 animate__animated animate__fadeInRight`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'info' ? 'bi-info-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('animate__fadeInRight');
        notification.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Загрузка популярных товаров на главную
function loadPopularProducts() {
    const popularContainer = document.getElementById('popular-products');
    if (!popularContainer) return;
    
    // Берем первые 3 товара
    const popularProducts = products.slice(0, 3);
    
    popularProducts.forEach((product, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', (index + 1) * 100);
        
        col.innerHTML = `
            <div class="product-card hvr-grow-shadow">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="text-muted small">${product.description.substring(0, 80)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <span class="ms-2 small">(${product.reviews})</span>
                    </div>
                    <div class="product-price">${product.price.toLocaleString()} ₽/год</div>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="${product.link}" class="btn btn-outline-purple btn-sm">Подробнее</a>
                        <button class="btn btn-purple btn-sm add-to-cart-mini" data-product='${JSON.stringify({id: product.id, name: product.name, price: product.price})}'>
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        popularContainer.appendChild(col);
    });
    
    // Добавляем обработчики для мини-кнопок добавления
    document.querySelectorAll('.add-to-cart-mini').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productData = JSON.parse(e.currentTarget.dataset.product);
            addToCart(productData);
        });
    });
}

// Загрузка каталога товаров
function loadCatalogProducts() {
    const catalogContainer = document.getElementById('catalog-products');
    if (!catalogContainer) return;
    
    products.forEach((product, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 col-xl-3';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', (index % 4) * 50);
        
        col.innerHTML = `
            <div class="product-card hvr-grow-shadow">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="text-muted small">${product.description.substring(0, 60)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <span class="ms-2 small">(${product.reviews})</span>
                    </div>
                    <div class="product-price">${product.price.toLocaleString()} ₽/год</div>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="${product.link}" class="btn btn-outline-purple btn-sm">Подробнее</a>
                        <button class="btn btn-purple btn-sm add-to-cart-mini" data-product='${JSON.stringify({id: product.id, name: product.name, price: product.price})}'>
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        catalogContainer.appendChild(col);
    });
    
    // Добавляем обработчики для мини-кнопок добавления
    document.querySelectorAll('.add-to-cart-mini').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productData = JSON.parse(e.currentTarget.dataset.product);
            addToCart(productData);
        });
    });
}

// Генерация звезд рейтинга
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star text-warning"></i>';
    }
    
    return stars;
}

// Поиск товаров
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
}

// Анимация счетчиков статистики
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const updateCounter = () => {
            const increment = target / 100;
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        // Используем Waypoints для запуска анимации при появлении
        if (typeof Waypoint !== 'undefined') {
            new Waypoint({
                element: counter,
                handler: function() {
                    updateCounter();
                    this.destroy();
                },
                offset: '80%'
            });
        } else {
            // Fallback
            updateCounter();
        }
    });
}

// Обработка форм
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Здесь можно отправить данные на сервер
        showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        contactForm.reset();
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Загружаем товары
    loadPopularProducts();
    loadCatalogProducts();
    
    // Анимируем счетчики
    animateCounters();
    
    // Обработка формы контактов
    handleContactForm();
    
    // Поиск товаров
    searchProducts();
    
    // Кнопка корзины
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            displayCartItems();
            cartModal.show();
        });
    }
    
    // Кнопка оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Корзина пуста!', 'info');
                return;
            }
            
            showNotification('Заказ оформлен! Спасибо за покупку.', 'success');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            cartModal.hide();
        });
    }
    
    // Обработчики для кнопок на страницах товаров
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.currentTarget.dataset.product;
            const productPrice = parseInt(e.currentTarget.dataset.price);
            addToCart({name: productName, price: productPrice});
        });
    });
    
    document.querySelectorAll('.add-to-cart-monthly').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.currentTarget.dataset.product;
            const productPrice = parseInt(e.currentTarget.dataset.price);
            addToCart({name: `${productName} (месяц)`, price: productPrice});
        });
    });
    
    document.querySelectorAll('.add-to-cart-trial').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = e.currentTarget.dataset.product;
            const productPrice = parseInt(e.currentTarget.dataset.price);
            addToCart({name: `${productName} (пробная)`, price: productPrice});
        });
    });
    
    // Добавляем параллакс эффект для фона
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.parallax-section');
        if (parallax) {
            parallax.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
        }
    });
    
    // Добавляем класс для анимации при скролле
    window.addEventListener('scroll', () => {
        const elements = document.querySelectorAll('.feature-card, .product-card, .price-card');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            if (isVisible) {
                el.classList.add('in-view');
            }
        });
    });
});

// Обработка ошибок загрузки изображений
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/400x300/1a1a1a/8B00FF?text=Image+Not+Found';
    }
}, true);
