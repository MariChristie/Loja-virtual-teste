/* open & close Cart */
var cart = document.querySelector('.cart');

function open_cart() {
    cart.classList.add("active");
}
function close_cart() {
    cart.classList.remove("active");
}

/* open & close menu */
const menu = document.querySelector('#menu');

function open_menu() {
    menu.classList.add("active");
}

function close_menu() {
    menu.classList.remove("active");
}

// charge item image
let bigImage = document.getElementById("bigImg");

function ChangeItemImage(img) {
    if(bigImage) bigImage.src = img;
}

/* add items in cart */
var all_products_json;
var items_in_cart = document.querySelector(".items_in_cart");
let product_cart = JSON.parse(localStorage.getItem('cart')) || [];
let count_item = document.querySelector('.count_item');
let count_item_cart = document.querySelector('.count_item_cart');
let price_cart_total = document.querySelector('.price_cart_total');
let price_cart_Head = document.querySelector('.price_cart_Head');

// Função para atualizar os botões de adicionar ao carrinho
function updateAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll(".fa-cart-plus");
    addToCartButtons.forEach(button => {
        const productId = parseInt(button.getAttribute('onclick').match(/addToCart\((\d+)/)[1]);
        button.classList.toggle('active', product_cart.some(item => item.id === productId));
    });
}

function addToCart(id, btn) {
    if(!all_products_json || !all_products_json[id]) return;
    
    product_cart.push(all_products_json[id]);
    if(btn) btn.classList.add("active");
    saveCart();
    getCartItems();
    updateAddToCartButtons();
}

function getCartItems() {
    if(!items_in_cart || !price_cart_Head || !count_item || !count_item_cart || !price_cart_total) return;

    let total_price = 0;
    let items_c = "";
    let checkout_items = ""; 

    for (let i = 0; i < product_cart.length; i++) {
        items_c += `
            <div class="item_cart">
                <img src="${product_cart[i].img}" alt="">
                <div class="content">
                    <h4>${product_cart[i].name}</h4>
                    <p class="price_cart">$${product_cart[i].price}</p>
                </div>
                <button onclick="remove_from_cart(${i})" class="delete_item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        checkout_items += `
            <div class="item_cart">
                <img src="${product_cart[i].img}" alt="">
                <div class="content">
                    <h4>${product_cart[i].name}</h4>
                    <p class="price_cart">Price: <span>$${product_cart[i].price}</span></p>
                </div>
            </div>
        `;

        total_price += product_cart[i].price;
    }

    items_in_cart.innerHTML = items_c;
    price_cart_Head.textContent = "$" + total_price;
    count_item.textContent = product_cart.length;
    count_item_cart.textContent = `(${product_cart.length} Item${product_cart.length !== 1 ? 's' : ''} in Cart)`;
    price_cart_total.textContent = "$" + total_price;

    if (document.getElementById('checkout-items')) {
        document.getElementById('checkout-items').innerHTML = checkout_items;
        document.getElementById('checkout-total').textContent = "$" + total_price;
    }
}

function remove_from_cart(index) {
    if(index >= 0 && index < product_cart.length) {
        product_cart.splice(index, 1);
        saveCart();
        getCartItems();
        updateAddToCartButtons();
    }
}

// back_to_top js
let back_to_top = document.querySelector(".back_to_top");
if(back_to_top) {
    back_to_top.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(product_cart));
}

if (document.querySelector('.checkout .button_div button')) {
    document.querySelector('.checkout .button_div button').addEventListener('click', function() {
        product_cart = [];
        saveCart();
        getCartItems();
        alert('Order placed successfully!');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getCartItems();
    updateAddToCartButtons();
});