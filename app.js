
let products = [
    { id: "car1",   name: "Car 1",   price: 20000, image: "/images/car1.jpg",   category: "car"   },
    { id: "bike1",  name: "Bike 1",  price: 1500,  image: "/images/bike1.jpg",  category: "bike"  },
    { id: "car2",   name: "Car 2",   price: 25000, image: "/images/car2.png",   category: "car"   },
    { id: "bike2",  name: "Bike 2",  price: 1800,  image: "/images/bike2.png",  category: "bike"  },
    { id: "car3",   name: "Car 3",   price: 30000, image: "/images/car3.png",   category: "car"   },
    { id: "bike3",  name: "Bike 3",  price: 2200,  image: "/images/bike3.png",  category: "bike"  },
    { id: "car4",   name: "Car 4",   price: 35000, image: "/images/car4.png",   category: "car"   },
    { id: "bike4",  name: "Bike 4",  price: 2600,  image: "/images/bike4.png",  category: "bike"  },
    { id: "car6",   name: "Car 6",   price: 40000, image: "/images/car6.png",   category: "car"   },
    { id: "cycle1", name: "Cycle 1", price: 800,   image: "/images/cycle1.png", category: "cycle" },
    { id: "cycle2", name: "Cycle 2", price: 900,   image: "/images/cycle2.png", category: "cycle" },
    { id: "cycle3", name: "Cycle 3", price: 1000,  image: "/images/cycle3.png", category: "cycle" },
    { id: "cycle4", name: "Cycle 4", price: 1100,  image: "/images/cycle4.png", category: "cycle" },
    { id: "cycle5", name: "Cycle 5", price: 1200,  image: "/images/cycle5.png", category: "cycle" },
    { id: "bus1", name: "Bus 1", price: 15000, image: "/images/bus1.png", category: "bus" },
    { id: "bus2", name: "Bus 2", price: 18000, image: "/images/bus2.png", category: "bus" },
    { id: "bus3", name: "Bus 3", price: 20000, image: "/images/bus3.png", category: "bus" },
    { id: "bus4", name: "Bus 4", price: 22000, image: "/images/bus4.png", category: "bus" },
    { id: "bus5", name: "Bus 5", price: 25000, image: "/images/bus5.png", category: "bus" }
];

/* ── LOCALSTORAGE HELPERS ── */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ── CART BADGE ── */
function updateBadge() {
  const cart  = getCart();
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = total;
}

/* ── CATEGORY FILTER ── */
let selectedCategory = "all";

document.querySelectorAll(".Category li").forEach(item => {
  item.addEventListener("click", function () {
    selectedCategory = this.id;
    document.querySelectorAll(".Category li").forEach(li => li.classList.remove("active"));
    this.classList.add("active");
    displayProducts();
  });
});

/* ── DISPLAY PRODUCTS ── */
function displayProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const sort   = document.getElementById("sort").value;

  let result = products.filter(p => p.name.toLowerCase().includes(search));

  if (selectedCategory !== "all") {
    result = result.filter(p => p.category === selectedCategory);
  }

  if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc")  result.sort((a, b) => b.name.localeCompare(a.name));

  const output = result.map(p => `
    <div class="product" id="${p.id}">
      <img src="${p.image}" alt="${p.name}"
           onerror="this.src='https://via.placeholder.com/240x200?text=${encodeURIComponent(p.name)}'">
      <h3>${p.name}</h3>
      <p>$${p.price.toLocaleString()}</p>
      <button class="add-to-cart" onclick="addToCart('${p.id}')">Add to Cart</button>
    </div>
  `).join("");

  document.querySelector(".products").innerHTML =
    output || "<p style='color:var(--text-muted);text-align:center;padding:3rem;letter-spacing:0.15em;'>No products found.</p>";
}

/* ── ADD TO CART ── */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  alert(product.name + " added to cart");
  if (!product) return;

  const cart     = getCart();
  const existing = cart.find(c => c.id === productId);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  updateBadge();
  showToast(`${product.name} added to cart`);
}

/* ── TOAST ── */
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ── INIT ── */
displayProducts();
updateBadge();