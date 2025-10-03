// Дані меню
const menuData = [
    { category: 'Напої', name: 'Еспресо', price: 25 },
    { category: 'Напої', name: 'Лате', price: 40 },
    { category: 'Напої', name: 'Капучіно', price: 35 },
    { category: 'Їжа', name: 'Круасан', price: 35 },
    { category: 'Їжа', name: 'Сендвіч', price: 55 },
    { category: 'Їжа', name: 'Тістечко', price: 45 }
];

let cart = [];

// DOM елементи
const menuContainer = document.getElementById('menu');
const totalEl = document.getElementById('total');

// Рендер меню
function renderMenu() {
    let currentCategory = '';
    menuData.forEach(item => {
        if (item.category !== currentCategory) {
            currentCategory = item.category;
            const h3 = document.createElement('h3');
            h3.textContent = currentCategory;
            menuContainer.appendChild(h3);
        }

        const div = document.createElement('div');
        div.className = 'item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.value = 0;
        input.dataset.price = item.price;
        input.addEventListener('input', () => updateCart(item, input.value));

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `₴${item.price}`;

        div.appendChild(nameSpan);
        div.appendChild(input);
        div.appendChild(priceSpan);

        menuContainer.appendChild(div);
    });
}

// Оновлення кошика та суми
function updateCart(item, qty) {
    qty = parseInt(qty);
    const index = cart.findIndex(i => i.name === item.name);
    if(qty > 0){
        if(index === -1) cart.push({ ...item, quantity: qty });
        else cart[index].quantity = qty;
    } else if(index !== -1){
        cart.splice(index, 1);
    }
    const sum = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    totalEl.textContent = sum;
}

renderMenu();

// Бургер-меню
const burger = document.getElementById('burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});
