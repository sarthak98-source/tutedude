document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const materialsCart = document.getElementById('materialsCart');
    const noMaterialsMessage = document.getElementById('noMaterialsMessage');
    const cartCount = document.getElementById('cartCount');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const supplierSearch = document.getElementById('supplierSearch');
    
    // Selected materials
    let selectedMaterials = [];
    
    // Initialize cart from localStorage
    function initCart() {
        const savedCart = localStorage.getItem('supplierMaterialsCart');
        if (savedCart) {
            selectedMaterials = JSON.parse(savedCart);
            updateCart();
        }
    }
    
    // Update cart display
    function updateCart() {
        if (selectedMaterials.length === 0) {
            noMaterialsMessage.classList.remove('hidden');
            materialsCart.innerHTML = '';
            materialsCart.appendChild(noMaterialsMessage);
            cartCount.textContent = '0 items';
            createGroupBtn.classList.add('opacity-50', 'cursor-not-allowed');
            return;
        }
        
        noMaterialsMessage.classList.add('hidden');
        materialsCart.innerHTML = '';
        
        selectedMaterials.forEach((material, index) => {
            const materialCard = document.createElement('div');
            materialCard.className = 'border border-gray-200 rounded-lg p-3 flex items-center justify-between';
            materialCard.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 ${getMaterialBgClass(material.category)} rounded-full flex items-center justify-center mr-3">
                        <i class="fas ${getMaterialIcon(material.category)} ${getMaterialTextClass(material.category)}"></i>
                    </div>
                    <div>
                        <h5 class="font-medium text-sm">${material.name}</h5>
                        <p class="text-xs text-gray-500">${material.supplier} • ₹${material.price}/kg</p>
                    </div>
                </div>
                <button class="remove-from-cart text-red-500 hover:text-red-700" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            materialsCart.appendChild(materialCard);
        });
        
        cartCount.textContent = `${selectedMaterials.length} ${selectedMaterials.length === 1 ? 'item' : 'items'}`;
        createGroupBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Helper functions for material styling
    function getMaterialBgClass(category) {
        const classes = {
            grains: 'bg-amber-100',
            dairy: 'bg-blue-100',
            vegetables: 'bg-green-100',
            spices: 'bg-red-100',
            meat: 'bg-rose-100'
        };
        return classes[category] || 'bg-gray-100';
    }
    
    function getMaterialTextClass(category) {
        const classes = {
            grains: 'text-amber-600',
            dairy: 'text-blue-600',
            vegetables: 'text-green-600',
            spices: 'text-red-600',
            meat: 'text-rose-600'
        };
        return classes[category] || 'text-gray-600';
    }
    
    function getMaterialIcon(category) {
        const icons = {
            grains: 'fa-wheat-alt',
            dairy: 'fa-cheese',
            vegetables: 'fa-carrot',
            spices: 'fa-pepper-hot',
            meat: 'fa-drumstick-bite'
        };
        return icons[category] || 'fa-shopping-basket';
    }
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const material = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: btn.dataset.price,
                category: btn.dataset.category,
                supplier: btn.dataset.supplier
            };
            
            // Check if already in cart
            if (!selectedMaterials.some(item => item.id === material.id)) {
                selectedMaterials.push(material);
                localStorage.setItem('supplierMaterialsCart', JSON.stringify(selectedMaterials));
                updateCart();
                
                // Show success message
                showToast(`${material.name} added to cart`);
            } else {
                showToast(`${material.name} is already in cart`, 'warning');
            }
        }
        
        // Remove from cart
        if (e.target.classList.contains('remove-from-cart') || e.target.closest('.remove-from-cart')) {
            const btn = e.target.classList.contains('remove-from-cart') ? e.target : e.target.closest('.remove-from-cart');
            const index = parseInt(btn.dataset.index);
            const removedItem = selectedMaterials[index];
            
            selectedMaterials.splice(index, 1);
            localStorage.setItem('supplierMaterialsCart', JSON.stringify(selectedMaterials));
            updateCart();
            
            // Show removed message
            showToast(`${removedItem.name} removed from cart`, 'info');
        }
    });
    
    // Create group with selected materials
    createGroupBtn.addEventListener('click', function() {
        if (selectedMaterials.length === 0) return;
        
        // Save materials to be used in group creation
        localStorage.setItem('groupCreationMaterials', JSON.stringify(selectedMaterials));
        
        // Redirect to group creation page
        window.location.href = 'group.html?from=suppliers';
    });
    
    // Search functionality
    supplierSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.bg-white.rounded-xl').forEach(supplierCard => {
            const supplierName = supplierCard.querySelector('h3').textContent.toLowerCase();
            const products = supplierCard.querySelectorAll('[data-name]');
            let hasMatch = false;
            
            // Check supplier name
            if (supplierName.includes(searchTerm)) {
                hasMatch = true;
            }
            
            // Check products
            products.forEach(product => {
                const productName = product.dataset.name.toLowerCase();
                if (productName.includes(searchTerm)) {
                    hasMatch = true;
                    product.closest('.border').classList.remove('hidden');
                } else {
                    product.closest('.border').classList.add('hidden');
                }
            });
            
            // Show/hide supplier based on matches
            if (hasMatch) {
                supplierCard.classList.remove('hidden');
            } else {
                supplierCard.classList.add('hidden');
            }
        });
    });
    
    // Toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            info: 'bg-blue-100 text-blue-800',
            error: 'bg-red-100 text-red-800'
        };
        
        toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-md ${colors[type]} flex items-center`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : type === 'info' ? 'fa-info-circle' : 'fa-times-circle'} mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Initialize
    initCart();
});