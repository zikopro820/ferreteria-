/* =========================================================
   FERRETERÍA RONALD — Funciones de la tienda (ziko.pro)
   ⚠️ CAMBIA AQUÍ TUS DATOS
   ========================================================= */
const WHATSAPP = "51987654321";       // código de país + número, sin + ni espacios
const TIENDA   = "Ferretería Ronald";

/* ---------- Íconos ---------- */
const ICONOS = {
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  drill:  '<path d="M3 6h11v6H3zM14 7h4l3 2-3 2h-4M6 12l-1 9h4l1-9"/>',
  brick:  '<path d="M3 5h18v14H3zM3 10h18M3 15h18M9 5v5M15 10v5M9 15v4"/>',
  roller: '<rect x="3" y="3" width="15" height="6" rx="1"/><path d="M18 6h3v5h-9v3M11 14h2v7h-2z"/>',
  pipe:   '<path d="M3 9h7a3 3 0 0 1 3 3v9M3 15h4a1 1 0 0 1 1 1v5M17 3v6M14 3h6"/>',
  bolt:   '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  helmet: '<path d="M4 16a8 8 0 0 1 16 0M2 16h20v3H2zM10 8V5h4v3"/>',
  chev:   '<path d="M9 6l6 6-6 6"/>',
  cart:   '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  trash:  '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>'
};
const icon = (k, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24">${ICONOS[k] || ""}</svg>`;

/* ---------- Utilidades ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const soles = n => "S/ " + n.toFixed(2);
const waLink = txt => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
const getProd = id => PRODUCTOS.find(p => p.id === Number(id));

/* ---------- Carrito (se guarda en el navegador) ---------- */
let memoryCart = [];
function readCart() {
  try { return JSON.parse(localStorage.getItem("ferre_cart")) || []; } catch (e) { return memoryCart; }
}
function saveCart(cart) {
  memoryCart = cart;
  try { localStorage.setItem("ferre_cart", JSON.stringify(cart)); } catch (e) {}
  refreshCartUI();
}
function addToCart(id, qty = 1) {
  const cart = readCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty; else cart.push({ id, qty });
  saveCart(cart);
  toast("✓ " + getProd(id).nombre + " agregado");
}
function changeQty(id, delta) {
  let cart = readCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
}
function removeItem(id) { saveCart(readCart().filter(i => i.id !== id)); }
const cartTotal = cart => cart.reduce((s, i) => s + getProd(i.id).precio * i.qty, 0);

/* ---------- Aviso flotante ---------- */
let toastTimer;
function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.innerHTML = "<span></span><a href='carrito'>Ver carrito</a>";
  t.firstChild.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Categorías en la barra lateral y menú ---------- */
const params = new URLSearchParams(location.search);
$$(".js-cats").forEach(ul => {
  const actual = params.get("cat");
  ul.innerHTML = Object.entries(CATEGORIAS).map(([k, c]) =>
    `<li><a href="productos?cat=${k}"${k === actual ? ' class="active"' : ""}>${icon(c.icono)}${c.nombre}${icon("chev", "ico chev")}</a></li>`).join("");
});
$$(".js-drop").forEach(ul => {
  ul.innerHTML = Object.entries(CATEGORIAS).map(([k, c]) =>
    `<li><a href="productos?cat=${k}">${icon(c.icono)}${c.nombre}</a></li>`).join("");
});

/* ---------- Tarjeta de producto ---------- */
function badgeHTML(p, extra = "") {
  if (!p.badge) return "";
  const cls = p.badge === "Oferta" ? "oferta" : p.badge === "Nuevo" ? "nuevo" : "";
  return `<span class="badge ${cls} ${extra}">${p.badge}</span>`;
}
function productCard(p) {
  return `
    <article class="card" data-id="${p.id}">
      <a class="card-img" href="producto?id=${p.id}">
        ${badgeHTML(p)}
        <img src="${p.foto}" alt="${p.nombre}" loading="lazy" onerror="this.style.display='none'">
      </a>
      <h3><a href="producto?id=${p.id}">${p.nombre}</a></h3>
      <div class="price"><strong>${soles(p.precio)}</strong>${p.antes ? `<del>${soles(p.antes)}</del>` : ""}</div>
      <div class="stock${p.stock ? "" : " out"}">${p.stock ? "En stock" : "Agotado"}</div>
      <div class="qty"><button class="q-minus" aria-label="Menos">−</button><span class="q-val">1</span><button class="q-plus" aria-label="Más">+</button></div>
      <button class="btn btn-yellow btn-block add"${p.stock ? "" : " disabled"}>${icon("cart")} Agregar al carrito</button>
    </article>`;
}
function renderGrid(el, list) {
  if (!el) return;
  el.innerHTML = list.length ? list.map(productCard).join("") :
    `<div class="empty"><h3>No encontramos productos</h3><p>Prueba con otra palabra o elige otra categoría.</p></div>`;
}
// Botones de las tarjetas (cantidad y agregar)
document.addEventListener("click", e => {
  const card = e.target.closest(".card[data-id]");
  if (!card) return;
  const val = $(".q-val", card);
  if (e.target.closest(".q-minus")) val.textContent = Math.max(1, +val.textContent - 1);
  if (e.target.closest(".q-plus")) val.textContent = +val.textContent + 1;
  if (e.target.closest(".add")) { addToCart(+card.dataset.id, +val.textContent); val.textContent = 1; }
});

/* ---------- Buscador del encabezado ---------- */
const searchForm = $("#searchForm");
if (searchForm) {
  if (params.get("q")) $("#q").value = params.get("q");
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = $("#q").value.trim();
    location.href = "productos" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
}

/* ---------- Mini carrito y contador ---------- */
function refreshCartUI() {
  const cart = readCart().filter(i => getProd(i.id));
  const n = cart.reduce((s, i) => s + i.qty, 0);
  $$(".cart-count").forEach(el => { el.textContent = n || ""; el.dataset.n = n; });
  const mini = $("#miniCart");
  if (mini) {
    $("#miniCount").textContent = n;
    $("#miniItems").innerHTML = cart.length ? cart.map(i => {
      const p = getProd(i.id);
      return `
        <div class="mini-item">
          <img src="${p.foto.replace("w=600", "w=120")}" alt="${p.nombre}" onerror="this.style.visibility='hidden'">
          <div>
            <h4>${p.nombre}</h4>
            <div class="mini-row">
              <strong>${soles(p.precio)}</strong>
              <div class="qty"><button data-mq="-1" data-id="${p.id}" aria-label="Menos">−</button><span>${i.qty}</span><button data-mq="1" data-id="${p.id}" aria-label="Más">+</button></div>
              <button class="trash" data-del="${p.id}" aria-label="Quitar">${icon("trash")}</button>
            </div>
          </div>
        </div>`;
    }).join("") : `<div class="mini-empty">Tu carrito está vacío.<br>Agrega productos para comenzar.</div>`;
    $("#miniSub").textContent = soles(cartTotal(cart));
  }
  if (typeof drawCart === "function") drawCart();
}
document.addEventListener("click", e => {
  const mq = e.target.closest("[data-mq]");
  const del = e.target.closest("[data-del]");
  if (mq) changeQty(+mq.dataset.id, +mq.dataset.mq);
  if (del) removeItem(+del.dataset.del);
});

/* ---------- Inicio ---------- */
renderGrid($("#featured"), PRODUCTOS.filter(p => p.badge).slice(0, 8));

/* ---------- Catálogo ---------- */
const grid = $("#catalogGrid");
if (grid) {
  const state = { cat: params.get("cat") || "", q: params.get("q") || "", ofertas: params.get("ofertas") === "1", nuevos: params.get("nuevos") === "1", order: "relevancia" };
  const title = $("#pageTitle");
  if (CATEGORIAS[state.cat]) title.textContent = CATEGORIAS[state.cat].nombre;
  else if (state.ofertas) title.innerHTML = "Ofertas <span>de la semana</span>";
  else if (state.nuevos) title.innerHTML = "<span>Novedades</span>";
  else if (state.q) title.innerHTML = "Resultados de búsqueda";
  $("#onlyOffers").checked = state.ofertas;
  $("#onlyStock").checked = false;

  function draw() {
    let list = PRODUCTOS.filter(p =>
      (!state.cat || p.cat === state.cat) &&
      (!state.ofertas || p.antes) &&
      (!state.nuevos || p.badge === "Nuevo") &&
      (!$("#onlyStock").checked || p.stock) &&
      (p.nombre + " " + CATEGORIAS[p.cat].nombre).toLowerCase().includes(state.q.toLowerCase()));
    if (state.order === "menor") list.sort((a, b) => a.precio - b.precio);
    if (state.order === "mayor") list.sort((a, b) => b.precio - a.precio);
    if (state.order === "az") list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    $("#resultCount").innerHTML = `<b>${list.length}</b> productos` + (state.q ? ` para "<b>${state.q.replace(/</g, "")}</b>"` : "");
    renderGrid(grid, list);
  }
  $("#order").addEventListener("change", e => { state.order = e.target.value; draw(); });
  $("#onlyOffers").addEventListener("change", e => { state.ofertas = e.target.checked; draw(); });
  $("#onlyStock").addEventListener("change", draw);
  $("#catToggle").addEventListener("click", () => $(".shop-grid > aside").classList.toggle("open"));
  draw();
}

/* ---------- Página de producto ---------- */
const pdp = $("#pdp");
if (pdp) {
  const p = getProd(params.get("id")) || PRODUCTOS[0];
  let qty = 1;
  document.title = p.nombre + " | " + TIENDA;
  $("#crumbName").textContent = p.nombre;
  pdp.innerHTML = `
    <div class="pdp-img">${badgeHTML(p, "left")}<img src="${p.foto.replace("w=600", "w=1100")}" alt="${p.nombre}" onerror="this.style.display='none'"></div>
    <div>
      <a class="pdp-cat" href="productos?cat=${p.cat}">${CATEGORIAS[p.cat].nombre}</a>
      <h1>${p.nombre}</h1>
      <div class="price"><strong>${soles(p.precio)}</strong>${p.antes ? `<del>${soles(p.antes)}</del>` : ""}<small>/ ${p.unidad}</small></div>
      ${p.antes ? `<span class="save">Ahorras ${soles(p.antes - p.precio)}</span>` : ""}
      <div class="stock${p.stock ? "" : " out"}">${p.stock ? "En stock · Listo para envío" : "Agotado"}</div>
      <p class="desc">${p.desc}</p>
      <ul class="specs">${p.specs.map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="buy-row">
        <div class="qty"><button id="pMinus" aria-label="Menos">−</button><span id="pQty">1</span><button id="pPlus" aria-label="Más">+</button></div>
        <button class="btn btn-yellow" id="pAdd"${p.stock ? "" : " disabled"}>${icon("cart")} Agregar al carrito</button>
      </div>
      <a class="btn btn-green btn-block" id="pWa" target="_blank" rel="noopener">Consultar o comprar por WhatsApp</a>
      <div class="pdp-info-list">
        <div><svg class="ico" viewBox="0 0 24 24"><path d="M1 4h14v12H1zM15 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>Envío a domicilio en la zona · Recojo en tienda gratis</div>
        <div><svg class="ico" viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>Productos originales con garantía</div>
        <div><svg class="ico" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>Paga con Yape, Plin, tarjeta o transferencia</div>
      </div>
    </div>`;
  const wa = () => $("#pWa").href = waLink("Hola " + TIENDA + " 👋 Quiero este producto:\n• " + p.nombre + "\nCantidad: " + qty + "\nPrecio: " + soles(p.precio * qty) + "\n¿Tienen stock?");
  wa();
  $("#pMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#pQty").textContent = qty; wa(); });
  $("#pPlus").addEventListener("click", () => { qty++; $("#pQty").textContent = qty; wa(); });
  $("#pAdd").addEventListener("click", () => addToCart(p.id, qty));
  renderGrid($("#related"), PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id)
    .concat(PRODUCTOS.filter(x => x.cat !== p.cat && x.id !== p.id)).slice(0, 4));
}

/* ---------- Página del carrito ---------- */
const cartBox = $("#cartBox");
var drawCart;
if (cartBox) {
  drawCart = function () {
    const cart = readCart().filter(i => getProd(i.id));
    if (!cart.length) {
      cartBox.innerHTML = `
        <div class="cart-empty">${icon("cart")}
          <h2>Tu carrito está vacío</h2>
          <p>Encuentra herramientas y materiales para tu proyecto.</p>
          <a href="productos" class="btn btn-yellow">Ver productos</a>
        </div>`;
      return;
    }
    if ($("#checkout")) {           // si ya existe el formulario, solo actualiza la lista y totales
      $("#cartList").innerHTML = listHTML(cart);
      $("#cartTotals").innerHTML = totalsHTML(cart);
      return;
    }
    cartBox.innerHTML = `
      <div class="cart-layout">
        <div class="cart-list" id="cartList">${listHTML(cart)}</div>
        <aside class="summary">
          <h2>Resumen del pedido</h2>
          <div id="cartTotals">${totalsHTML(cart)}</div>
          <div class="note-box">El costo de envío se confirma por WhatsApp según tu dirección. El recojo en tienda es gratis.</div>
          <form id="checkout">
            <label>Entrega</label>
            <div class="radio-list">
              <label><input type="radio" name="entrega" value="Envío a domicilio" checked> Envío a domicilio</label>
              <label><input type="radio" name="entrega" value="Recojo en tienda"> Recojo en tienda</label>
            </div>
            <label for="cNombre">Nombre *</label><input id="cNombre" required placeholder="Tu nombre">
            <label for="cDir">Dirección o referencia</label><input id="cDir" placeholder="Calle, número, distrito">
            <label for="cPago">Forma de pago</label>
            <select id="cPago"><option>Yape</option><option>Plin</option><option>Transferencia bancaria</option><option>Tarjeta</option><option>Efectivo contra entrega</option></select>
            <button class="btn btn-yellow btn-block" type="submit">${icon("cart")} Finalizar compra por WhatsApp</button>
            <p class="note">Te confirmamos stock, precio final y tiempo de entrega por WhatsApp.</p>
          </form>
        </aside>
      </div>`;
    $("#checkout").addEventListener("submit", e => {
      e.preventDefault();
      const c = readCart().filter(i => getProd(i.id));
      const lines = c.map(i => { const p = getProd(i.id); return "• " + p.nombre + " x" + i.qty + " = " + soles(p.precio * i.qty); }).join("\n");
      const msg = "Hola " + TIENDA + " 👋 Quiero hacer este pedido:\n\n" + lines +
        "\n\nSUBTOTAL: " + soles(cartTotal(c)) +
        "\n\nNombre: " + $("#cNombre").value + "\nEntrega: " + $('input[name="entrega"]:checked').value +
        ($("#cDir").value ? "\nDirección: " + $("#cDir").value : "") + "\nPago: " + $("#cPago").value;
      window.open(waLink(msg), "_blank");
    });
  };
  function listHTML(cart) {
    return cart.map(i => {
      const p = getProd(i.id);
      return `
        <div class="cart-item">
          <img src="${p.foto.replace("w=600", "w=200")}" alt="${p.nombre}" onerror="this.style.visibility='hidden'">
          <div><h3><a href="producto?id=${p.id}">${p.nombre}</a></h3><small>${soles(p.precio)} / ${p.unidad}</small>
            <button class="trash" data-del="${p.id}" style="margin-top:6px;display:flex;gap:4px;align-items:center;font-size:.85rem">${icon("trash")} Quitar</button></div>
          <div class="qty"><button data-mq="-1" data-id="${p.id}" aria-label="Menos">−</button><span>${i.qty}</span><button data-mq="1" data-id="${p.id}" aria-label="Más">+</button></div>
          <div class="line-total">${soles(p.precio * i.qty)}</div>
        </div>`;
    }).join("");
  }
  function totalsHTML(cart) {
    const n = cart.reduce((s, i) => s + i.qty, 0);
    return `<div class="sum-row"><span>Productos (${n})</span><span>${soles(cartTotal(cart))}</span></div>
            <div class="sum-row"><span>Envío</span><span>Por confirmar</span></div>
            <div class="sum-row total"><span>Subtotal</span><strong>${soles(cartTotal(cart))}</strong></div>`;
  }
}

/* ---------- Contacto ---------- */
const contactForm = $("#contactForm");
if (contactForm) contactForm.addEventListener("submit", e => {
  e.preventDefault();
  window.open(waLink("Hola " + TIENDA + " 👋\nNombre: " + $("#fNombre").value + "\nTeléfono: " + $("#fTel").value +
    "\nAsunto: " + $("#fAsunto").value + "\nMensaje: " + $("#fMensaje").value), "_blank");
});

/* ---------- WhatsApp, menú y año ---------- */
$$(".wa-link").forEach(a => {
  a.href = waLink(a.dataset.msg || "Hola " + TIENDA + " 👋 Quiero hacer una consulta.");
  a.target = "_blank"; a.rel = "noopener";
});
$("#hamburger")?.addEventListener("click", () => $("#menu").classList.toggle("open"));
$$(".has-drop > a").forEach(a => a.addEventListener("click", e => {
  if (window.innerWidth <= 1000) { e.preventDefault(); a.parentElement.classList.toggle("open"); }
}));
$$(".year").forEach(el => el.textContent = new Date().getFullYear());
refreshCartUI();
