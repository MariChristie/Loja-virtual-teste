document.addEventListener('DOMContentLoaded', function () {

    const saleSwiper = new Swiper('.sale_sec', {
        loop: true,
        spaceBetween: 20,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            450: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
        }
    });

    const productSwipers = document.querySelectorAll('.product_swip');
    productSwipers.forEach(function(swiperContainer) {
        new Swiper(swiperContainer, {
            loop: true,
            spaceBetween: 20,
            grabCursor: true,
            navigation: {
                nextEl: swiperContainer.querySelector('.swiper-button-next'),
                prevEl: swiperContainer.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                450: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }
        });
    });

    var cart = document.querySelector('.cart');
    function open_cart() { cart.classList.add("active"); }
    function close_cart() { cart.classList.remove("active"); }

    var menu = document.querySelector('#menu');
    function open_menu() { menu.classList.add("active"); }
    function close_menu() { menu.classList.remove("active"); }

    document.querySelectorAll('.icon_cart').forEach(el => el.addEventListener('click', open_cart));
    document.querySelectorAll('.close_cart, .bg-overlay').forEach(el => el.addEventListener('click', close_cart));
    document.querySelectorAll('.btn_open_menu').forEach(el => el.addEventListener('click', open_menu));
    document.querySelectorAll('.btn_close_menu').forEach(el => el.addEventListener('click', close_menu));

    let product_cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    window.addToCart = function(productId, btn) {
        const productCard = btn.closest('.product');
        if (!productCard) return;

        const productName = productCard.querySelector('.name_product a').innerText;
        const productPriceText = productCard.querySelector('.price span').innerText;
        const productImage = productCard.querySelector('.img_product img').src;
        const price = parseFloat(productPriceText.replace('R$', '').replace(',', '.').trim());
        
        const product = { id: productId, name: productName, price: price, img: productImage };

        product_cart.push(product);
        saveCart();
        renderCartItems();
    }

    function renderCartItems() {
        let total_price = 0;
        let items_html = "";
        
        for (let i = 0; i < product_cart.length; i++) {
            items_html += `
                <div class="item_cart">
                    <img src="${product_cart[i].img}" alt="">
                    <div class="content">
                        <h4>${product_cart[i].name}</h4>
                        <p class="price_cart">R$ ${product_cart[i].price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCart(${i})" class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            total_price += product_cart[i].price;
        }

        let items_in_cart = document.querySelector(".items_in_cart");
        if (items_in_cart) {
            items_in_cart.innerHTML = items_html;
        }

        document.querySelector('.price_cart_Head').textContent = "R$ " + total_price.toFixed(2);
        document.querySelector('.count_item').textContent = product_cart.length;
    }

    window.removeFromCart = function(index) {
        product_cart.splice(index, 1);
        saveCart();
        renderCartItems();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(product_cart));
    }
    
    renderCartItems();
});