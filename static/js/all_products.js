document.addEventListener('DOMContentLoaded', function() {
    const filterEl = document.querySelector('.filter');
    const btnFilter = document.querySelector('.btn_filter');
    const productsDev = document.getElementById('products_dev');
    const paginationEl = document.querySelector('.pagination');
    let allProducts = [];
    let currentPage = 1;
    const productsPerPage = 6;

    window.open_close_filter = function() {
        if (filterEl) {
            filterEl.classList.toggle("active");
        }
    };

    if (btnFilter) {
        btnFilter.addEventListener('click', open_close_filter);
    }

    function renderProducts(products, page = 1) {
        if (!productsDev) return;
        
        productsDev.innerHTML = '';
        
        if (!Array.isArray(products)) {
            productsDev.innerHTML = '<p style="padding:20px;color:#333;">No products (invalid data)</p>';
            return;
        }
        
        if (products.length === 0) {
            productsDev.innerHTML = '<p style="padding:20px;">No products found matching your filters</p>';
            return;
        }

        window.all_products_json = products;

        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        productsDev.innerHTML = paginatedProducts.map(product => {
            const oldPriceHtml = product.old_price 
                ? `<p class="old_price">$${product.old_price}</p>` 
                : '';
            
            const discountHtml = product.old_price
                ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>`
                : '';

            return `
                <div class="product" data-id="${product.id}" data-category="${product.category}" data-brand="${product.brand}" data-color="${product.color}">
                    <div class="icons">  
                        <span><i onclick="addToCart(${product.id}, this)" class="fa-solid fa-cart-plus"></i></span>
                        <span><i class="fa-solid fa-heart"></i></span>
                        <span><i class="fa-solid fa-share"></i></span>
                    </div>
                    ${discountHtml}
                    <div class="img_product">
                        <img src="${product.img}" alt="${product.name}">
                        <img class="img_hover" src="${product.img_hover}" alt="${product.name}">
                    </div>
                    <h3 class="name_product"><a href="#">${product.name}</a></h3>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="price">
                        <p>$${product.price}</p>
                        ${oldPriceHtml}
                    </div>
                </div>`;
        }).join('');

        if(window.updateAddToCartButtons) {
            updateAddToCartButtons();
        }

        updatePagination(products.length);
    }

    function updatePagination(totalProducts) {
        if (!paginationEl) return;
        
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);
        
        paginationEl.innerHTML = '';
        
        const prevBtn = document.createElement('span');
        prevBtn.className = 'btn_page prev';
        prevBtn.innerHTML = '<i class="fa-solid fa-backward-step"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                applyFilters();
            }
        });
        paginationEl.appendChild(prevBtn);
        
        pageNumbers.forEach(page => {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            const pageSpan = document.createElement('span');
            pageSpan.className = `num_page ${page === currentPage ? 'active' : ''}`;
            pageSpan.textContent = page;
            pageLink.appendChild(pageSpan);
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = page;
                applyFilters();
            });
            paginationEl.appendChild(pageLink);
        });
        
        const nextBtn = document.createElement('span');
        nextBtn.className = 'btn_page next';
        nextBtn.innerHTML = '<i class="fa-solid fa-forward-step"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyFilters();
            }
        });
        paginationEl.appendChild(nextBtn);
    }

    function applyFilters() {
        if (!allProducts.length) return;

        const getSelectedValues = (container) => {
            if (!container) return [];
            
            return Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => {
                    if (cb.parentElement.querySelector('.color')) {
                        const colorSpan = cb.parentElement.querySelector('.color');
                        return colorSpan.style.backgroundColor || 
                               colorSpan.getAttribute('data-color') || 
                               colorSpan.className.replace('color', '').trim();
                    }
                    const span = cb.parentElement.querySelector('span:not(.color)');
                    return span ? span.textContent.trim() : '';
                })
                .filter(Boolean);
        };

        const categoryContainer = document.querySelector('.filter_item:nth-of-type(1)');
        const brandContainer = document.querySelector('.filter_item:nth-of-type(2)');
        const colorContainer = document.querySelector('.filter_item:nth-of-type(3)');

        const selectedCategories = getSelectedValues(categoryContainer);
        const selectedBrands = getSelectedValues(brandContainer);
        const selectedColors = getSelectedValues(colorContainer);

        const filteredProducts = allProducts.filter(product => {
            const categoryMatch = selectedCategories.length === 0 || 
                selectedCategories.some(cat => 
                    product.category && product.category.toLowerCase().includes(cat.toLowerCase()));
            
            const brandMatch = selectedBrands.length === 0 || 
                selectedBrands.some(brand => 
                    product.brand && product.brand.toLowerCase().includes(brand.toLowerCase()));
            
            const colorMatch = selectedColors.length === 0 || 
                selectedColors.some(color => {
                    if (!product.color) return false;
                    const productColor = product.color.toLowerCase();
                    const selectedColor = color.toLowerCase();
                    return productColor.includes(selectedColor) || 
                           selectedColor.includes(productColor);
                });

            return categoryMatch && brandMatch && colorMatch;
        });

        renderProducts(filteredProducts, currentPage);
    }

    fetch('js/items.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
            
            document.querySelectorAll('.filter input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    currentPage = 1; 
                    applyFilters();
                });
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            if(productsDev) {
                productsDev.innerHTML = `<p style="padding:20px;color:red;">Error loading products. Please try again later.</p>`;
            }
        });
});