// Дані про товари
const products = [
    // Напої
    {id:1, name:"Еспресо", price:25, category:"drinks", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDlfKX-f9EMr-7ntLqaZeHsB47GuT5VcKM-w&s"},
    {id:2, name:"Лате", price:40, category:"drinks", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Latte_art_3.jpg/1200px-Latte_art_3.jpg"},
    {id:3, name:"Капучіно", price:35, category:"drinks", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"},
    {id:4, name:"Мокачино", price:45, category:"drinks", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"},
    {id:5, name:"Американо", price:30, category:"drinks", img:"https://lh6.googleusercontent.com/proxy/XKdoiiR5jeu688YEeIVJlv2044dJdq1GcgI59AePNF8Xuihh8dsCqSsAMIcyvntIHEm8vEnWlucNFZQG4iNb62EbVntJXdndG68rig"},
    {id:6, name:"Раф-кава", price:50, category:"drinks", img:"https://t-coffee.com.ua/image/cache/catalog/image/data/news/news_4/_raf_kofe.webp"},

    // Десерти
    {id:7, name:"Круасан", price:35, category:"desserts", img:"https://biscotti.com.ua/storage/products/photo_313986.jpg"},
    {id:8, name:"Сендвіч", price:55, category:"desserts", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgvOuf499fZ_70FUUljTO_CP1XOFjEhph31Q&s"},
    {id:9, name:"Тістечко", price:40, category:"desserts", img:"https://kuldim.com/wa-data/public/shop/products/91/29/2991/images/54592/54592.970.jpg"},
    {id:10, name:"Макарон", price:45, category:"desserts", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmP2imm4t48XPS9MVGG4mlJBXsjMGkYJwM9Q&s"},
    {id:11, name:"Чізкейк", price:60, category:"desserts", img:"https://lasunka.com/Blog/prew/klasichnij-chizkejk-z-morozivom.png"},
    {id:12, name:"Панкейк", price:50, category:"desserts", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQev_QA3LwowivDoCJ9ToZ340ofzOXMOr_A6A&s"}
];

const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
let cart = [];

// Фільтри
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    });
});

// Рендер товарів
function renderProducts(category="all") {
    productsGrid.innerHTML = '';
    const filtered = category === "all" ? products : products.filter(p=>p.category===category);
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.price}₴</p>
            <button onclick="addToCart(${product.id})">Додати в кошик</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Додати товар у кошик
function addToCart(id) {
    const product = products.find(p=>p.id===id);
    const exist = cart.find(item=>item.id===id);
    if(exist){
        exist.quantity +=1;
    } else {
        cart.push({...product, quantity:1});
    }
    updateCart();
}

// Оновлення кошика
function updateCart() {
    cartItemsContainer.innerHTML = '';
    if(cart.length===0){
        cartItemsContainer.innerHTML = '<p class="empty-cart">Кошик порожній</p>';
        cartTotalEl.textContent = 0;
        return;
    }
    let total=0;
    cart.forEach(item=>{
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className='cart-item';
        div.innerHTML=`
            <img src="${item.img}" alt="${item.name}">
            <span class="item-name">${item.name}</span>
            <span class="item-weight">1шт</span>
            <div class="item-quantity">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})">✖</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    cartTotalEl.textContent = total;
}

// Зміна кількості
function changeQuantity(id, delta){
    const item = cart.find(i=>i.id===id);
    if(!item) return;
    item.quantity += delta;
    if(item.quantity <=0){
        removeFromCart(id);
    } else {
        updateCart();
    }
}

// Видалення
function removeFromCart(id){
    cart = cart.filter(i=>i.id!==id);
    updateCart();
}

// Початковий рендер
renderProducts();
updateCart();


// Відкриття попапу
const checkoutBtn = document.querySelector('.checkout-btn');
const orderPopup = document.getElementById('order-popup');
const orderForm = document.getElementById('order-form');
const popupTotal = document.getElementById('popup-total');
const cancelBtn = document.querySelector('.cancel-btn');
const orderType = document.getElementById('order-type');
const orderTime = document.getElementById('order-time');

checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0){
        alert("Кошик порожній!");
        return;
    }
    popupTotal.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    orderPopup.style.display = "flex";
});

// Закрити попап
cancelBtn.addEventListener('click', () => {
    orderPopup.style.display = "none";
});

// Обмеження часу залежно від типу замовлення
orderType.addEventListener('change', () => {
    if(orderType.value === "takeaway") {
        orderTime.min = "08:00";
        orderTime.max = "21:00";
    } else if(orderType.value === "dinein") {
        orderTime.min = "08:00";
        orderTime.max = "20:00";
    } else {
        orderTime.min = "";
        orderTime.max = "";
    }
});

// Підтвердження замовлення
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const type = orderType.value;
    const time = orderTime.value;

    if(!firstName || !lastName || !phone || !type || !time){
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    alert(`Замовлення оформлено!\nСума: ${popupTotal.textContent}₴\nДякуємо, ${firstName} ${lastName}!`);
    cart = [];
    updateCart();
    orderPopup.style.display = "none";
    orderForm.reset();
});


const burger = document.getElementById('burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});
