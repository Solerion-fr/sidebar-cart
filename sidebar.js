/**
 * Sidebar Cart System
 * -------------------
 * - Manages cart items in localStorage (persist across refresh).
 * - Handles sidebar open/close with overlay.
 * - Adds products to the cart, updates quantities, and recalculates totals.
 * - Updates badge counter with animation.
 */

const openBtn = document.getElementById("open-sidebar");
const closeBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===========================
   Sidebar open/close handlers
   =========================== */
function openSidebar() {
  sidebar.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("opacity-100"));
}

function closeSidebar() {
  sidebar.classList.add("translate-x-full");
  overlay.classList.remove("opacity-100");
  overlay.classList.add("opacity-0");

  overlay.addEventListener(
    "transitionend",
    () => {
      if (overlay.classList.contains("opacity-0")) {
        overlay.classList.add("hidden");
      }
    },
    { once: true }
  );
}

openBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

/* ===========================
   Cart manipulation functions
   =========================== */

// Simulate async fetch request when adding to cart
function addToCart(name, price) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      saveCart();
      resolve();
    }, 150);
  });
}

// Save cart state in localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update quantity directly (from input field)
function updateQuantity(index, value) {
  const qty = parseInt(value, 10);
  if (isNaN(qty) || qty <= 0) {
    cart.splice(index, 1); // Remove if invalid or 0
  } else {
    cart[index].quantity = qty;
  }
  saveCart();
  renderCart();
}

/* ===========================
   Rendering functions
   =========================== */
function renderCart() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";

    div.innerHTML = `
      <div>
        <p class="font-medium text-gray-700">${item.name}</p>
        <p class="text-sm text-gray-500">${item.price.toFixed(2)}€ each</p>
      </div>
      <div class="flex items-center space-x-2">
        <input type="number" min="1" value="${item.quantity}" 
               class="w-12 text-center border rounded" data-index="${index}">
        <span class="ml-2 font-semibold">${(item.price * item.quantity).toFixed(2)}€</span>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  // Update total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `${total.toFixed(2)}€`;

  // Update badge with total quantity
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.classList.toggle("hidden", totalItems === 0);

  // Add listeners to quantity inputs
  document.querySelectorAll("input[data-index]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = parseInt(input.dataset.index, 10);
      updateQuantity(index, input.value);
    });
  });
}

/* ===========================
   Add-to-cart buttons
   =========================== */
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    await addToCart(name, price);
    renderCart();

    // Animate badge when item is added
    cartCount.classList.add("animate-bounce");
    setTimeout(() => cartCount.classList.remove("animate-bounce"), 500);
  });
});

// Initial render when page loads
renderCart();
