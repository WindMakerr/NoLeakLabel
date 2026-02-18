// Инициализация AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Корзина (имитация)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartModal() {
    const cartContainer = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Корзина пуста</p>';
    } else {
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2 border-bottom border-secondary pb-2">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.option} - ${item.price} руб.</small>
                        <span> x${item.quantity}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
        });
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        html += `<h5 class="mt-3">Итого: ${total} руб.</h5>`;
        cartContainer.innerHTML = html;
    }
}

function addToCart(name, price, option) {
    const existing = cart.find(item => item.name === name && item.option === option);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, option, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();

    // Показать уведомление
    const toast = new bootstrap.Toast(document.createElement('div'), { delay: 2000 });
    // Простая имитация уведомления
    alert('Товар добавлен в корзину!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

// Инициализация корзины
updateCartCount();

// Обработчик кнопки корзины
document.getElementById('cartBtn')?.addEventListener('click', () => {
    renderCartModal();
    new bootstrap.Modal(document.getElementById('cartModal')).show();
});

// Обработчик добавления в корзину на странице товара
document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    const selected = document.querySelector('input[name="productOption"]:checked');
    if (!selected) return;
    const price = parseInt(selected.value);
    const option = selected.nextElementSibling.textContent.trim();
    const name = document.querySelector('h1').textContent;
    addToCart(name, price, option);
});

// Обработчик оформления заказа
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    alert('Заказ оформлен! (имитация)');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
});

// Загрузка популярных товаров на главную
const popularProducts = [
    { name: 'ESP Hack Ultimate', img: 'https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13', price: 2999, link: 'product.html' },
    { name: 'Auto Last Hit Pro', img: 'https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13', price: 1999, link: 'product1.html' },
    { name: 'Map Hack Vision', img: 'https://ggcheats.shop/img/cheats/ico/melonity.png', price: 2499, link: 'product2.html' },
    { name: 'Script Pack Premium', img: 'https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026', price: 3499, link: 'product3.html' }
];

if (document.getElementById('popular-products')) {
    const container = document.getElementById('popular-products');
    popularProducts.forEach(prod => {
        container.innerHTML += `
            <div class="col-md-3">
                <div class="card bg-black border-purple h-100 catalog-item">
                    <img src="${prod.img}" class="card-img-top" alt="${prod.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${prod.name}</h5>
                        <p class="card-text text-purple fw-bold">${prod.price} руб./год</p>
                        <a href="${prod.link}" class="btn btn-outline-purple w-100">Подробнее</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Загрузка каталога (фильтрация)
const allProducts = [
    { name: 'ESP Hack Ultimate', type: 'esp', price: 2999, img: 'https://avatars.mds.yandex.net/i?id=48344677b610b8b0598228d64fb62806_sr-4821375-images-thumbs&n=13', link: 'product.html' },
    { name: 'Auto Last Hit Pro', type: 'lasthit', price: 1999, img: 'https://avatars.mds.yandex.net/i?id=ec731b6011cc2a56592a5e14aaa913af4c997c17-5232927-images-thumbs&n=13', link: 'product1.html' },
    { name: 'Map Hack Vision', type: 'map', price: 2499, img: 'https://ggcheats.shop/img/cheats/ico/melonity.png', link: 'product2.html' },
    { name: 'Script Pack Premium', type: 'script', price: 3499, img: 'https://yougame.biz/data/avatars/o/219/219827.jpg?1750491026', link: 'product3.html' }
];

function renderCatalog(filtered) {
    const container = document.getElementById('catalog-items');
    if (!container) return;
    container.innerHTML = '';
    filtered.forEach(prod => {
        container.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card bg-black border-purple h-100 catalog-item">
                    <img src="${prod.img}" class="card-img-top" alt="${prod.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${prod.name}</h5>
                        <p class="card-text text-purple fw-bold">${prod.price} руб./год</p>
                        <a href="${prod.link}" class="btn btn-outline-purple w-100">Подробнее</a>
                    </div>
                </div>
            </div>
        `;
    });
}

if (document.getElementById('catalog-items')) {
    renderCatalog(allProducts);

    document.getElementById('applyFilter').addEventListener('click', () => {
        const priceMax = parseInt(document.getElementById('priceRange').value) || 4000;
        const type = document.getElementById('typeFilter').value;
        const filtered = allProducts.filter(p => {
            return p.price <= priceMax && (type === 'all' || p.type === type);
        });
        renderCatalog(filtered);
    });
}

// Валидация формы контактов
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Сообщение отправлено! (имитация)');
    e.target.reset();
});

// Инициализация слайдера цены (можно добавить отображение значения)
const priceRange = document.getElementById('priceRange');
if (priceRange) {
    priceRange.addEventListener('input', (e) => {
        // можно показать текущее значение
    });
}
