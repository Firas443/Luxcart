/* ==========================================
   LuxCart — Vanilla JS (V2 UI)
   - Catalog + rendering
   - Filters + sorting
   - Product detail gallery
   - Cart CRUD + totals + LocalStorage
   - Checkout validation
   - Reveal animations
   ========================================== */

const PRODUCTS = [
  {
    id:"lx-001", title:"Roco Wireless Headphone", price:129.0, rating:4.8, category:"Audio",
    images:[
      "https://images.unsplash.com/photo-1518441313221-20f1d1ff0f65?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518441902117-f0a4f0bde1a6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Crisp audio, deep bass, premium comfort. Built for all-day listening with a clean luxury finish."
  },
  {
    id:"lx-002", title:"Pulse Smart Watch", price:189.0, rating:4.6, category:"Wearables",
    images:[
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"A minimal smart watch with a premium feel—smooth UI, solid build, and subtle elegance."
  },
  {
    id:"lx-003", title:"Orbit Speaker Mini", price:79.0, rating:4.4, category:"Audio",
    images:[
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Compact. Loud. Elegant. A clean speaker design with warm tones and stable connection."
  },
  {
    id:"lx-004", title:"Vanta Gaming Controller", price:59.0, rating:4.5, category:"Gaming",
    images:[
      "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Responsive triggers, comfortable grip, and a premium matte finish—made for long sessions."
  },
  {
    id:"lx-005", title:"Aero Laptop Sleeve", price:39.0, rating:4.2, category:"Accessories",
    images:[
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Slim protection with a soft interior. Designed for minimal carry and premium texture."
  },
  {
    id:"lx-006", title:"Nova Wireless Mouse", price:29.0, rating:4.3, category:"Computing",
    images:[
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1620119878633-0d5d7bd7bf1d?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Silent clicks, smooth glide, clean design. A simple upgrade that feels expensive."
  },
  {
    id:"lx-007", title:"Gilded Earbuds", price:99.0, rating:4.6, category:"Audio",
    images:[
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1603398938378-e54a8c79f1d7?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"Low latency, crisp sound, premium charging case. Built for everyday movement."
  },
  {
    id:"lx-008", title:"Prism Phone Stand", price:19.0, rating:4.1, category:"Accessories",
    images:[
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1520975682131-4c8a3a85e1f6?auto=format&fit=crop&w=1600&q=80"
    ],
    description:"A minimal stand that looks good on any desk. Clean angles, strong stability."
  }
];

/* Helpers */
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const money = (n)=>`$${Number(n).toFixed(2)}`;
const getParam = (k)=>new URL(location.href).searchParams.get(k);

/* LocalStorage cart */
const CART_KEY = "luxcart_cart_v2";
function readCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    if(!raw) return { items:{} };
    const p = JSON.parse(raw);
    return p?.items ? p : { items:{} };
  }catch{ return { items:{} }; }
}
function writeCart(c){
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  updateCartBadge();
}
function cartCount(){
  const c = readCart();
  return Object.values(c.items).reduce((a,b)=>a+b,0);
}
function addToCart(id, qty=1){
  const c = readCart();
  c.items[id] = (c.items[id]||0)+qty;
  if(c.items[id]<=0) delete c.items[id];
  writeCart(c);
}
function setCartQty(id, qty){
  const c = readCart();
  if(qty<=0) delete c.items[id];
  else c.items[id]=qty;
  writeCart(c);
}
function removeFromCart(id){
  const c = readCart();
  delete c.items[id];
  writeCart(c);
}
function cartLines(){
  const c = readCart();
  return Object.entries(c.items).map(([id, qty])=>{
    const product = PRODUCTS.find(p=>p.id===id);
    return product ? { product, qty } : null;
  }).filter(Boolean);
}
function cartTotals(){
  const lines = cartLines();
  const subtotal = lines.reduce((s,l)=>s + l.product.price*l.qty, 0);
  const shipping = subtotal>=120 ? 0 : (subtotal===0?0:9.99);
  const tax = subtotal*0.07;
  const total = subtotal + shipping + tax;
  return {subtotal, shipping, tax, total};
}

/* UI */
function updateCartBadge(){
  const b = $("#cartBadge");
  if(b) b.textContent = String(cartCount());
}

/* Reveal on scroll */
function initReveal(){
  const nodes = $$(".reveal");
  if(!nodes.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.12});
  nodes.forEach(n=>obs.observe(n));
}

/* Rating */
function starRating(r){
  return `<span class="rating"><span class="star"></span>${r.toFixed(1)}</span>`;
}

/* Product cards */
function productCard(p){
  return `
    <article class="card reveal">
      <a class="card-media" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="Open ${p.title}">
        <img src="${p.images[0]}" alt="${p.title}">
      </a>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">
          <span class="price">${money(p.price)}</span>
          ${starRating(p.rating)}
        </div>
        <div class="card-actions">
          <button class="smallbtn" data-view="${p.id}">Details</button>
          <button class="smallbtn primary" data-add="${p.id}">Add</button>
        </div>
      </div>
    </article>
  `;
}

function bindProductButtons(){
  $$("[data-add]").forEach(b=>{
    b.onclick = ()=> addToCart(b.dataset.add, 1);
  });
  $$("[data-view]").forEach(b=>{
    b.onclick = ()=> location.href = `product.html?id=${encodeURIComponent(b.dataset.view)}`;
  });
}

/* Home */
function initHome(){
  const heroImg = $("#heroImg");
  if(!heroImg) return;

  const hero = PRODUCTS[0];
  $("#heroTitle").innerHTML = `Upgrade your <span>everyday tech</span>`;
  $("#heroSub").textContent = "Inspired by modern ecommerce layouts: clean, product-first, and built for fast decisions.";
  heroImg.src = hero.images[0];
  $("#heroPrice").textContent = money(hero.price);
  $("#heroMiniTitle").textContent = hero.title;
  $("#heroMiniMeta").textContent = `${hero.category} • ${hero.rating.toFixed(1)} rating`;
  $("#heroShop").href = "shop.html";
  $("#heroView").href = `product.html?id=${encodeURIComponent(hero.id)}`;
  $("#heroAdd").onclick = ()=> addToCart(hero.id, 1);

  // Categories (click sets a query param for shop)
  const cats = [
    {name:"Audio", icon:"♪"},
    {name:"Wearables", icon:"⌚"},
    {name:"Gaming", icon:"🎮"},
    {name:"Computing", icon:"⌨"},
    {name:"Accessories", icon:"✦"},
    {name:"New", icon:"⚡"}
  ];
  const catRow = $("#catRow");
  if(catRow){
    catRow.innerHTML = cats.map(c=>`
      <div class="cat-tile" data-cat="${c.name}">
        <div class="cat-icon">${c.icon}</div>
        <b>${c.name}</b>
        <small>Browse</small>
      </div>
    `).join("");
    catRow.onclick = (e)=>{
      const t = e.target.closest("[data-cat]");
      if(!t) return;
      const cat = t.dataset.cat;
      location.href = `shop.html?cat=${encodeURIComponent(cat)}`;
    };
  }

  // Featured grid
  const featured = [...PRODUCTS].sort((a,b)=>b.rating-a.rating).slice(0,8);
  const grid = $("#featuredGrid");
  if(grid){
    grid.innerHTML = featured.map(productCard).join("");
    bindProductButtons();
  }
}

/* Shop */
function initShop(){
  const grid = $("#shopGrid");
  if(!grid) return;

  const categorySel = $("#categoryFilter");
  const priceRange = $("#priceFilter");
  const priceLabel = $("#priceLabel");
  const sortSel = $("#sortBy");
  const searchInput = $("#searchInput");

  const cats = ["All", ...new Set(PRODUCTS.map(p=>p.category))];
  categorySel.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join("");

  const maxPrice = Math.ceil(Math.max(...PRODUCTS.map(p=>p.price)));
  priceRange.max = String(maxPrice);
  priceRange.value = String(maxPrice);
  priceLabel.textContent = `Up to ${money(priceRange.value)}`;

  // read cat from URL
  const preCat = getParam("cat");
  if(preCat && cats.includes(preCat)) categorySel.value = preCat;

  function apply(){
    const cat = categorySel.value;
    const max = Number(priceRange.value);
    const sort = sortSel.value;
    const q = (searchInput.value||"").trim().toLowerCase();

    let list = PRODUCTS.filter(p => (cat==="All" || p.category===cat) && p.price<=max);
    if(q) list = list.filter(p=>p.title.toLowerCase().includes(q));

    if(sort==="featured") list.sort((a,b)=>b.rating-a.rating);
    if(sort==="ratingHigh") list.sort((a,b)=>b.rating-a.rating);
    if(sort==="priceLow") list.sort((a,b)=>a.price-b.price);
    if(sort==="priceHigh") list.sort((a,b)=>b.price-a.price);

    grid.innerHTML = list.map(productCard).join("");
    bindProductButtons();
    initReveal();
  }

  categorySel.onchange = apply;
  sortSel.onchange = apply;
  searchInput.oninput = apply;
  priceRange.oninput = ()=>{
    priceLabel.textContent = `Up to ${money(priceRange.value)}`;
    apply();
  };

  apply();
}

/* Product detail */
function initProduct(){
  const root = $("#productRoot");
  if(!root) return;

  const id = getParam("id") || PRODUCTS[0].id;
  const product = PRODUCTS.find(p=>p.id===id) || PRODUCTS[0];

  $("#pdTitle").textContent = product.title;
  $("#pdPrice").textContent = money(product.price);
  $("#pdRating").innerHTML = starRating(product.rating);
  $("#pdDesc").textContent = product.description;

  const main = $("#pdMainImg");
  const thumbs = $("#pdThumbs");
  main.src = product.images[0];
  thumbs.innerHTML = product.images.map((src, i)=>`
    <div class="thumb ${i===0?"active":""}" data-src="${src}">
      <img src="${src}" alt="thumb ${i+1}">
    </div>
  `).join("");

  thumbs.onclick = (e)=>{
    const t = e.target.closest(".thumb");
    if(!t) return;
    $$(".thumb", thumbs).forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    main.src = t.dataset.src;
  };

  const qty = $("#pdQty");
  $("#pdMinus").onclick = ()=> qty.value = String(Math.max(1, Number(qty.value||1)-1));
  $("#pdPlus").onclick = ()=> qty.value = String(Math.min(99, Number(qty.value||1)+1));

  $("#pdAdd").onclick = ()=>{
    const q = Math.max(1, Math.min(99, Number(qty.value||1)));
    addToCart(product.id, q);
  };
  $("#pdBuy").onclick = ()=>{
    const q = Math.max(1, Math.min(99, Number(qty.value||1)));
    addToCart(product.id, q);
    location.href = "checkout.html";
  };

  const rel = PRODUCTS.filter(p=>p.category===product.category && p.id!==product.id).slice(0,4);
  const relGrid = $("#relatedGrid");
  relGrid.innerHTML = rel.map(productCard).join("");
  bindProductButtons();

  initReveal();
}

/* Cart */
function initCart(){
  const cartList = $("#cartList");
  if(!cartList) return;

  const subtotalEl = $("#sumSubtotal");
  const shippingEl = $("#sumShipping");
  const taxEl = $("#sumTax");
  const totalEl = $("#sumTotal");

  function render(){
    const lines = cartLines();
    if(lines.length===0){
      cartList.innerHTML = `
        <div style="padding:14px">
          <p style="color:var(--muted);margin:0">Your cart is empty.</p>
          <div style="margin-top:12px">
            <a class="btn primary" href="shop.html">Browse Shop</a>
          </div>
        </div>
      `;
    }else{
      cartList.innerHTML = lines.map(({product, qty})=>`
        <div class="item">
          <img src="${product.images[0]}" alt="${product.title}">
          <div>
            <h4>${product.title}</h4>
            <small>${product.category} • ${product.rating.toFixed(1)} rating</small>
            <div class="item-actions">
              <div class="qty">
                <button class="mini" data-dec="${product.id}">−</button>
                <input class="mini" type="number" min="1" max="99" value="${qty}" data-qty="${product.id}">
                <button class="mini" data-inc="${product.id}">+</button>
              </div>
              <button class="linkbtn" data-remove="${product.id}">Remove</button>
              <a class="linkbtn" href="product.html?id=${encodeURIComponent(product.id)}">View</a>
            </div>
          </div>
          <div class="item-right">
            <div class="price">${money(product.price*qty)}</div>
            <small>${money(product.price)} each</small>
          </div>
        </div>
      `).join("");
    }

    const t = cartTotals();
    subtotalEl.textContent = money(t.subtotal);
    shippingEl.textContent = t.shipping===0 ? "Free" : money(t.shipping);
    taxEl.textContent = money(t.tax);
    totalEl.textContent = money(t.total);

    updateCartBadge();
  }

  cartList.onclick = (e)=>{
    const dec = e.target.closest("[data-dec]");
    const inc = e.target.closest("[data-inc]");
    const rem = e.target.closest("[data-remove]");
    if(dec){
      const id = dec.dataset.dec;
      const cur = readCart().items[id] || 1;
      setCartQty(id, cur-1);
      render();
    }
    if(inc){
      const id = inc.dataset.inc;
      const cur = readCart().items[id] || 1;
      setCartQty(id, Math.min(99, cur+1));
      render();
    }
    if(rem){
      removeFromCart(rem.dataset.remove);
      render();
    }
  };

  cartList.oninput = (e)=>{
    const q = e.target.closest("[data-qty]");
    if(!q) return;
    const id = q.dataset.qty;
    const val = Math.max(1, Math.min(99, Number(q.value||1)));
    q.value = String(val);
    setCartQty(id, val);
    render();
  };

  render();
}

/* Checkout */
function initCheckout(){
  const form = $("#checkoutForm");
  if(!form) return;

  const sum = {
    items: $("#coItems"),
    subtotal: $("#coSubtotal"),
    shipping: $("#coShipping"),
    tax: $("#coTax"),
    total: $("#coTotal"),
  };

  function renderSummary(){
    const lines = cartLines();
    if(lines.length===0){
      sum.items.innerHTML = `<p style="margin:0;color:var(--muted)">No items in cart.</p>`;
    }else{
      sum.items.innerHTML = lines.map(l=>`
        <div class="line">
          <span>${l.product.title} ×${l.qty}</span>
          <strong>${money(l.product.price*l.qty)}</strong>
        </div>
      `).join("");
    }
    const t = cartTotals();
    sum.subtotal.textContent = money(t.subtotal);
    sum.shipping.textContent = t.shipping===0 ? "Free" : money(t.shipping);
    sum.tax.textContent = money(t.tax);
    sum.total.textContent = money(t.total);
  }
  renderSummary();

  const req = $$("[data-required='true']", form);

  function validateField(el){
    const v = (el.value||"").trim();
    let ok = true;
    if(el.name==="name") ok = v.length>=2;
    if(el.name==="address") ok = v.length>=6;
    if(el.name==="city") ok = v.length>=2;
    if(el.name==="email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if(el.name==="payment") ok = v.length>=3;

    el.style.borderColor = ok ? "rgba(15,18,34,.12)" : "rgba(244,63,94,.55)";
    return ok;
  }

  req.forEach(f=>{
    f.oninput = ()=> validateField(f);
    f.onblur = ()=> validateField(f);
  });

  form.onsubmit = (e)=>{
    e.preventDefault();

    if(cartLines().length===0){
      alert("Your cart is empty.");
      location.href = "shop.html";
      return;
    }

    const allOk = req.every(validateField);
    if(!allOk){
      alert("Please complete the highlighted fields.");
      return;
    }

    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    alert("✅ Purchase confirmed. Thank you for shopping LuxCart!");
    location.href = "index.html";
  };
}

/* Global init */
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartBadge();
  setImageFallbacks();
  initReveal();
  initHome();
  initShop();
  initProduct();
  initCart();
  initCheckout();
});

function setImageFallbacks(){
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error", ()=>{
      // simple clean fallback (SVG placeholder)
      img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
            <defs>
              <linearGradient id='g' x1='0' x2='1'>
                <stop stop-color='#eef2ff'/>
                <stop offset='1' stop-color='#fff1f2'/>
              </linearGradient>
            </defs>
            <rect width='100%' height='100%' fill='url(#g)'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              fill='#6b7280' font-family='Arial' font-size='42' font-weight='700'>
              LuxCart Image
            </text>
          </svg>
        `);
      img.style.objectFit = "cover";
    }, { once:true });
  });
}
