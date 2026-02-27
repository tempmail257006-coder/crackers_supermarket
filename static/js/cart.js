// Initialize cart from LocalStorage
let cart = JSON.parse(localStorage.getItem('crackersCart')) || [];

// Update Cart Badge in Navbar
function updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = cart.length;
    }
}

// Add Item to Cart
function addToCart(name, price, image) {
    // Check if item exists
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name: name, price: price, image: image, qty: 1 });
    }
    
    localStorage.setItem('crackersCart', JSON.stringify(cart));
    updateBadge();
    alert(name + " added to cart!");
}

// Render Cart Page
function renderCart() {
    const cartTable = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (!cartTable) return;

    cartTable.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.qty;
        total += itemTotal;
        
        cartTable.innerHTML += `
            <tr>
                <td><img src="/static/images/${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>Rs. ${item.price}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, -1)">-</button>
                    ${item.qty}
                    <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>Rs. ${itemTotal}</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button></td>
            </tr>
        `;
    });

    totalEl.innerText = total;
}

// Change Quantity
function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('crackersCart', JSON.stringify(cart));
    renderCart();
    updateBadge();
}

// Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('crackersCart', JSON.stringify(cart));
    renderCart();
    updateBadge();
}

// Prepare Checkout Data (Called on Checkout Page Load)
function prepareCheckout() {
    const inputData = document.getElementById('items_data');
    const inputTotal = document.getElementById('total_amt');
    const displayTotal = document.getElementById('display_total');
    
    if (!inputData) return;

    let total = 0;
    let dataString = "";

    cart.forEach(item => {
        total += (item.price * item.qty);
        // Format: Name|Qty|Price
        dataString += `${item.name}|${item.qty}|${item.price},`;
    });

    inputData.value = dataString;
    inputTotal.value = total;
    displayTotal.innerText = "Rs. " + total;
}

// Clear Cart after Order Success
if (window.location.pathname.includes("order_success")) {
    localStorage.removeItem('crackersCart');
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    if (document.getElementById('cart-items')) renderCart();
    if (document.getElementById('items_data')) prepareCheckout();
});

