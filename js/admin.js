document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const navItems = document.querySelectorAll('.admin-nav li');
    const tabContents = document.querySelectorAll('.admin-tab');
    const saveBtns = document.querySelectorAll('.save-btn');
    const addProductForm = document.getElementById('add-product-form');
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Login functionality
    loginBtn.addEventListener('click', function() {
        const password = passwordInput.value;
        
        if (password === '1234') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
        } else {
            loginError.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
        }
    });
    
    // Allow Enter key to submit login
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        hideAdminPanel();
    });
    
    // Tab navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active tab
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Save product price changes
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const priceInput = document.getElementById(`price-${productId}`);
            const newPrice = priceInput.value;
            
            // In a real application, this would send data to a server
            // For now, we'll just show a success message and store in localStorage
            
            // Store the updated price in localStorage
            localStorage.setItem(`product-${productId}-price`, newPrice);
            
            // Show success message
            const successMsg = document.createElement('span');
            successMsg.textContent = 'Price updated!';
            successMsg.style.color = 'green';
            successMsg.style.marginLeft = '10px';
            
            this.parentNode.appendChild(successMsg);
            
            // Remove success message after 2 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 2000);
            
            // Update price on the main page (if it exists)
            updateMainPagePrice(productId, newPrice);
        });
    });
    
    // Add new product form submission
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productName = document.getElementById('product-name').value;
            const productDescription = document.getElementById('product-description').value;
            const productPrice = document.getElementById('product-price').value;
            const productTags = document.getElementById('product-tags').value;
            const productImage = document.getElementById('product-image').value || 'images/placeholder.jpg';
            
            // In a real application, this would send data to a server
            // For now, we'll just show a success message and store in localStorage
            
            // Generate a new product ID
            const productId = new Date().getTime();
            
            // Store the new product in localStorage
            const newProduct = {
                id: productId,
                name: productName,
                description: productDescription,
                price: productPrice,
                tags: productTags.split(',').map(tag => tag.trim()),
                image: productImage
            };
            
            // Get existing products or initialize empty array
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            existingProducts.push(newProduct);
            
            // Save updated products array
            localStorage.setItem('products', JSON.stringify(existingProducts));
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.textContent = 'Product added successfully!';
            successMsg.style.color = 'green';
            successMsg.style.marginTop = '1rem';
            
            addProductForm.appendChild(successMsg);
            
            // Reset form
            addProductForm.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
            
            // Add product to the products list in the admin panel
            addProductToList(newProduct);
        });
    }
    
    // Load saved prices from localStorage
    loadSavedPrices();
    
    // Load custom products from localStorage
    loadCustomProducts();
    
    // Helper Functions
    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
    }
    
    function hideAdminPanel() {
        adminPanel.style.display = 'none';
        loginContainer.style.display = 'flex';
        passwordInput.value = '';
        loginError.textContent = '';
    }
    
    function loadSavedPrices() {
        // Load saved prices from localStorage
        for (let i = 1; i <= 5; i++) {
            const savedPrice = localStorage.getItem(`product-${i}-price`);
            if (savedPrice) {
                const priceInput = document.getElementById(`price-${i}`);
                if (priceInput) {
                    priceInput.value = savedPrice;
                }
            }
        }
    }
    
    function loadCustomProducts() {
        // Load custom products from localStorage
        const customProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        customProducts.forEach(product => {
            addProductToList(product);
        });
    }
    
    function addProductToList(product) {
        const productList = document.querySelector('.product-list');
        
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-actions">
                <div class="price-edit">
                    <label for="price-${product.id}">Price (€):</label>
                    <input type="number" id="price-${product.id}" value="${product.price}" min="0" step="0.5">
                </div>
                <button class="save-btn" data-id="${product.id}">Save</button>
            </div>
        `;
        
        productList.appendChild(productItem);
        
        // Add event listener to the new save button
        const newSaveBtn = productItem.querySelector('.save-btn');
        newSaveBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const priceInput = document.getElementById(`price-${productId}`);
            const newPrice = priceInput.value;
            
            // Store the updated price in localStorage
            localStorage.setItem(`product-${productId}-price`, newPrice);
            
            // Update the product in the products array
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const productIndex = products.findIndex(p => p.id == productId);
            
            if (productIndex !== -1) {
                products[productIndex].price = newPrice;
                localStorage.setItem('products', JSON.stringify(products));
            }
            
            // Show success message
            const successMsg = document.createElement('span');
            successMsg.textContent = 'Price updated!';
            successMsg.style.color = 'green';
            successMsg.style.marginLeft = '10px';
            
            this.parentNode.appendChild(successMsg);
            
            // Remove success message after 2 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 2000);
        });
    }
    
    function updateMainPagePrice(productId, newPrice) {
        // This function would update the price on the main page if it exists
        // In a real application with a backend, this would be handled differently
        
        // For now, we'll just log the change
        console.log(`Product ${productId} price updated to ${newPrice}€`);
    }
});
