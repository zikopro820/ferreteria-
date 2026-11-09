/* =========================================================
   FERRETERÍA — Funciones de la tienda (ziko.pro)
   Los datos (productos, categorías, logo, WhatsApp, textos,
   pagos y envíos) se editan desde el PANEL administrativo.
   ========================================================= */
let PRODUCTOS = [], CATEGORIAS = {}, AJ = {};

/* ---------- Íconos ---------- */
const ICONOS = {
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  drill:  '<path d="M3 6h11v6H3zM14 7h4l3 2-3 2h-4M6 12l-1 9h4l1-9"/>',
  brick:  '<path d="M3 5h18v14H3zM3 10h18M3 15h18M9 5v5M15 10v5M9 15v4"/>',
  roller: '<rect x="3" y="3" width="15" height="6" rx="1"/><path d="M18 6h3v5h-9v3M11 14h2v7h-2z"/>',
  pipe:   '<path d="M3 9h7a3 3 0 0 1 3 3v9M3 15h4a1 1 0 0 1 1 1v5M17 3v6M14 3h6"/>',
  bolt:   '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  helmet: '<path d="M4 16a8 8 0 0 1 16 0M2 16h20v3H2zM10 8V5h4v3"/>',
  screw:  '<path d="M9 3h6l-1 4h-4zM10 7h4v3l-4 2v2l4 2v2l-2 3-2-3"/>',
  garden: '<path d="M12 22V12M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/>',
  lock:   '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  bulb:   '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  ladder: '<path d="M7 2v20M17 2v20M7 6h10M7 11h10M7 16h10"/>',
  box:    '<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  ruler:  '<path d="M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
  chev:   '<path d="M9 6l6 6-6 6"/>',
  cart:   '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  trash:  '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>',
  check:  '<path d="M5 12l5 5L20 7"/>', truck: '<path d="M1 4h14v12H1zM15 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  store:  '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
const icon = (k, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24">${ICONOS[k] || ICONOS.box}</svg>`;

/* ---------- Utilidades ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const soles = n => "S/ " + (+n || 0).toFixed(2);
const TIENDA = () => AJ.nombre || [AJ.marca1, AJ.marca2].filter(Boolean).map(x => x.charAt(0) + x.slice(1).toLowerCase()).join(" ") || "Ferretería";
const waLink = txt => "https://wa.me/" + String(AJ.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(txt);
const getProd = id => PRODUCTOS.find(p => String(p.id) === String(id));
const hayStock = p => p.stock == null || p.stock === true || +p.stock > 0;
const maxStock = p => p.stock == null || p.stock === true ? 999 : Math.max(0, +p.stock);
const foto = (p, w) => String(p.foto || "").replace("w=600", "w=" + w);
const params = new URLSearchParams(location.search);

/* ---------- Carrito (se guarda en el navegador) ---------- */
let memoryCart = [];
function readCart() { try { return JSON.parse(localStorage.getItem("ferre_cart")) || []; } catch (e) { return memoryCart; } }
function saveCart(cart) { memoryCart = cart; try { localStorage.setItem("ferre_cart", JSON.stringify(cart)); } catch (e) {} refreshCartUI(); }
function addToCart(id, qty = 1) {
  const p = getProd(id); if (!p) return;
  const cart = readCart(), item = cart.find(i => String(i.id) === String(id)), ya = item ? item.qty : 0, max = maxStock(p);
  if (ya + qty > max) { qty = max - ya; if (qty <= 0) return toast("Solo tenemos " + max + " en stock de " + p.nombre); }
  if (item) item.qty += qty; else cart.push({ id: String(id), qty });
  saveCart(cart); toast("✓ " + p.nombre + " agregado");
}
function changeQty(id, delta) {
  let cart = readCart(); const item = cart.find(i => String(i.id) === String(id)), p = getProd(id); if (!item) return;
  item.qty = Math.min(item.qty + delta, p ? maxStock(p) : 999); if (item.qty < 1) cart = cart.filter(i => String(i.id) !== String(id));
  saveCart(cart);
}
function removeItem(id) { saveCart(readCart().filter(i => String(i.id) !== String(id))); }
const cartTotal = cart => cart.reduce((s, i) => s + getProd(i.id).precio * i.qty, 0);
const cartValido = () => readCart().filter(i => getProd(i.id));

/* ---------- Aviso flotante ---------- */
let toastTimer;
function toast(msg, sinLink) {
  let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.innerHTML = "<span></span>" + (sinLink ? "" : "<a href='carrito'>Ver carrito</a>"); t.firstChild.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Tarjeta de producto ---------- */
function badgeHTML(p, extra = "") {
  if (!p.badge) return "";
  const cls = p.badge === "Oferta" ? "oferta" : p.badge === "Nuevo" ? "nuevo" : "";
  return `<span class="badge ${cls} ${extra}">${esc(p.badge)}</span>`;
}
const stockHTML = (p, largo) => { const ok = hayStock(p), pocos = ok && p.stock != null && p.stock !== true && +p.stock <= 5;
  return `<div class="stock${ok ? "" : " out"}${pocos ? " low" : ""}">${!ok ? "Agotado" : pocos ? `¡Quedan ${+p.stock}!` : largo ? "En stock · Listo para envío" : "En stock"}</div>`; };
function productCard(p) {
  return `
    <article class="card" data-id="${esc(p.id)}">
      <a class="card-img" href="producto?id=${encodeURIComponent(p.id)}">${badgeHTML(p)}<img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.style.display='none'"></a>
      <h3><a href="producto?id=${encodeURIComponent(p.id)}">${esc(p.nombre)}</a></h3>
      <div class="price"><strong>${soles(p.precio)}</strong>${p.antes ? `<del>${soles(p.antes)}</del>` : ""}</div>
      ${stockHTML(p)}
      <div class="qty"><button class="q-minus" aria-label="Menos">−</button><span class="q-val">1</span><button class="q-plus" aria-label="Más">+</button></div>
      <button class="btn btn-yellow btn-block add"${hayStock(p) ? "" : " disabled"}>${icon("cart")} Agregar al carrito</button>
    </article>`;
}
function renderGrid(el, list) {
  if (!el) return;
  el.innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty"><h3>No encontramos productos</h3><p>Prueba con otra palabra o elige otra categoría.</p></div>`;
}
document.addEventListener("click", e => {
  const card = e.target.closest(".card[data-id]"); if (!card) return;
  const val = $(".q-val", card), p = getProd(card.dataset.id);
  if (e.target.closest(".q-minus")) val.textContent = Math.max(1, +val.textContent - 1);
  if (e.target.closest(".q-plus")) val.textContent = Math.min(+val.textContent + 1, p ? maxStock(p) : 999);
  if (e.target.closest(".add")) { addToCart(card.dataset.id, +val.textContent); val.textContent = 1; }
});

/* ---------- Mini carrito y contador ---------- */
function refreshCartUI() {
  const cart = cartValido(), n = cart.reduce((s, i) => s + i.qty, 0);
  $$(".cart-count").forEach(el => { el.textContent = n || ""; el.dataset.n = n; });
  const mini = $("#miniCart");
  if (mini) {
    $("#miniCount").textContent = n;
    $("#miniItems").innerHTML = cart.length ? cart.map(i => { const p = getProd(i.id);
      return `<div class="mini-item"><img src="${esc(foto(p, 120))}" alt="" onerror="this.style.visibility='hidden'"><div><h4>${esc(p.nombre)}</h4><div class="mini-row"><strong>${soles(p.precio)}</strong>
        <div class="qty"><button data-mq="-1" data-id="${esc(p.id)}" aria-label="Menos">−</button><span>${i.qty}</span><button data-mq="1" data-id="${esc(p.id)}" aria-label="Más">+</button></div>
        <button class="trash" data-del="${esc(p.id)}" aria-label="Quitar">${icon("trash")}</button></div></div></div>`; }).join("") : `<div class="mini-empty">Tu carrito está vacío.<br>Agrega productos para comenzar.</div>`;
    $("#miniSub").textContent = soles(cartTotal(cart));
  }
  if (typeof drawCart === "function") drawCart();
}
document.addEventListener("click", e => {
  const mq = e.target.closest("[data-mq]"), del = e.target.closest("[data-del]");
  if (mq) changeQty(mq.dataset.id, +mq.dataset.mq); if (del) removeItem(del.dataset.del);
});

/* ---------- Marca: logo, textos y datos que se editan en el panel ---------- */
function aplicarMarca() {
  const nombre = TIENDA();
  document.title = document.title.replace(/Ferretería Ronald/g, nombre);
  $$(".logo").forEach(a => {
    a.setAttribute("aria-label", nombre + " inicio");
    if (AJ.logo) { const svg = $("svg", a); if (svg) svg.outerHTML = `<img class="logo-img" src="${esc(AJ.logo)}" alt="">`; }
    const t = $(".logo-text", a); if (t) { $("small", t).textContent = AJ.marca1 || ""; $("strong", t).textContent = AJ.marca2 || ""; $("em", t).textContent = AJ.lema || ""; }
  });
  if (AJ.logo) { const l = $('link[rel="icon"]'); if (l) { l.href = AJ.logo; l.type = "image/png"; } }
  $$(".h-act.wa b").forEach(b => b.textContent = AJ.telefono || "+" + AJ.whatsapp);
  $$(".wa-link").forEach(a => { a.href = waLink(a.dataset.msg || "Hola " + nombre + " 👋 Quiero hacer una consulta."); a.target = "_blank"; a.rel = "noopener"; if (a.closest(".info-card")) a.textContent = AJ.telefono || a.textContent; });
  const redes = AJ.redes || {}; let alguna = false;
  $$(".socials a").forEach(a => { const k = (a.getAttribute("aria-label") || "").toLowerCase(), u = redes[k]; if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; alguna = true; } else a.hidden = true; });
  $$(".socials").forEach(s => s.hidden = !alguna);
  $$(".foot-right > div:last-child").forEach(d => d.innerHTML = d.innerHTML.replace(/Ferretería Ronald/g, esc(nombre)));
  const conSpan = t => esc(t || "").replace(/\*(.+?)\*/g, "<span>$1</span>");
  // Inicio
  if ($("#heroTit")) {
    $("#heroTit").innerHTML = conSpan(AJ.heroTit); $("#heroSub").textContent = AJ.heroSub || "";
    if (AJ.heroFoto) $("#heroImg").src = AJ.heroFoto;
    $$(".hero-perk span").forEach((s, i) => { if ((AJ.perks || [])[i]) s.textContent = AJ.perks[i]; });
    const fr = Object.entries(CATEGORIAS).filter(([, c]) => c.franja && c.foto).slice(0, 4);
    if (fr.length) $("#catStrip").innerHTML = fr.map(([k, c]) => `<a href="productos?cat=${encodeURIComponent(k)}" class="cat-tile"><img src="${esc(c.foto)}" alt="${esc(c.nombre)}" loading="lazy" onerror="this.style.display='none'"><span>${esc(c.nombre)}</span></a>`).join("");
    if ($("#promo")) { $("#promoTit").innerHTML = conSpan(AJ.promoTit).replace(/<span>/, "<b>").replace(/<\/span>/, "</b>"); if (AJ.promoFoto) $("#promo img").src = AJ.promoFoto; if (AJ.promoCat) $("#promo").href = "productos?cat=" + encodeURIComponent(AJ.promoCat); }
    const pays = [AJ.pagoYape !== false && `<div><i class="yape">yape</i>Yape</div>`, AJ.pagoPlin !== false && `<div><i class="plin">plin</i>Plin</div>`,
      AJ.pagoTransf !== false && `<div><i class="bank">${icon("store")}</i>Transferencia</div>`, AJ.contraEntrega !== false && `<div><i class="card-p">${icon("truck")}</i>Contra entrega</div>`].filter(Boolean);
    if ($("#pays")) $("#pays").innerHTML = pays.join("");
  }
  // Contacto
  if ($("#cDir")) { $("#cEmail").textContent = AJ.email || ""; $("#cHorario").textContent = AJ.horario || ""; $("#cDir").textContent = AJ.direccion || ""; $("#cMap").src = "https://www.google.com/maps?q=" + encodeURIComponent(AJ.mapa || AJ.direccion || "Lima") + "&output=embed"; }
  // Nosotros
  if ($("#nosTit")) { $("#nosTit").textContent = AJ.nosTit || ""; $("#nosP1").textContent = AJ.nosP1 || ""; $("#nosP2").textContent = AJ.nosP2 || ""; if (AJ.nosFoto) $("#nosFoto").src = AJ.nosFoto; $("#nosCats").textContent = Object.keys(CATEGORIAS).length; }
}

/* ---------- Página: inicio, catálogo, producto ---------- */
function paginas() {
  $$(".js-cats").forEach(ul => { const actual = params.get("cat");
    ul.innerHTML = Object.entries(CATEGORIAS).map(([k, c]) => `<li><a href="productos?cat=${encodeURIComponent(k)}"${k === actual ? ' class="active"' : ""}>${icon(c.icono)}${esc(c.nombre)}${icon("chev", "ico chev")}</a></li>`).join(""); });
  $$(".js-drop").forEach(ul => { ul.innerHTML = Object.entries(CATEGORIAS).map(([k, c]) => `<li><a href="productos?cat=${encodeURIComponent(k)}">${icon(c.icono)}${esc(c.nombre)}</a></li>`).join(""); });
  const destacados = PRODUCTOS.filter(p => p.badge); renderGrid($("#featured"), (destacados.length ? destacados : PRODUCTOS).slice(0, 8));

  const grid = $("#catalogGrid");
  if (grid) {
    const state = { cat: params.get("cat") || "", q: params.get("q") || "", ofertas: params.get("ofertas") === "1", nuevos: params.get("nuevos") === "1", order: "relevancia" };
    const title = $("#pageTitle");
    if (CATEGORIAS[state.cat]) title.textContent = CATEGORIAS[state.cat].nombre;
    else if (state.ofertas) title.innerHTML = "Ofertas <span>de la semana</span>";
    else if (state.nuevos) title.innerHTML = "<span>Novedades</span>";
    else if (state.q) title.innerHTML = "Resultados de búsqueda";
    $("#onlyOffers").checked = state.ofertas; $("#onlyStock").checked = false;
    const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    function draw() {
      let list = PRODUCTOS.filter(p => (!state.cat || p.cat === state.cat) && (!state.ofertas || p.antes) && (!state.nuevos || p.badge === "Nuevo") && (!$("#onlyStock").checked || hayStock(p)) &&
        norm(p.nombre + " " + ((CATEGORIAS[p.cat] || {}).nombre || "") + " " + (p.desc || "")).includes(norm(state.q)));
      if (state.order === "menor") list.sort((a, b) => a.precio - b.precio);
      if (state.order === "mayor") list.sort((a, b) => b.precio - a.precio);
      if (state.order === "az") list.sort((a, b) => a.nombre.localeCompare(b.nombre));
      $("#resultCount").innerHTML = `<b>${list.length}</b> productos` + (state.q ? ` para "<b>${esc(state.q)}</b>"` : "");
      renderGrid(grid, list);
    }
    $("#order").addEventListener("change", e => { state.order = e.target.value; draw(); });
    $("#onlyOffers").addEventListener("change", e => { state.ofertas = e.target.checked; draw(); });
    $("#onlyStock").addEventListener("change", draw);
    $("#catToggle").addEventListener("click", () => $(".shop-grid > aside").classList.toggle("open"));
    draw();
  }

  const pdp = $("#pdp");
  if (pdp) {
    const p = getProd(params.get("id")) || PRODUCTOS[0]; if (!p) return;
    let qty = 1; document.title = p.nombre + " | " + TIENDA(); $("#crumbName").textContent = p.nombre;
    pdp.innerHTML = `
      <div class="pdp-img">${badgeHTML(p, "left")}<img src="${esc(foto(p, 1100))}" alt="${esc(p.nombre)}" onerror="this.style.display='none'"></div>
      <div>
        <a class="pdp-cat" href="productos?cat=${encodeURIComponent(p.cat)}">${esc((CATEGORIAS[p.cat] || {}).nombre || "")}</a>
        <h1>${esc(p.nombre)}</h1>
        <div class="price"><strong>${soles(p.precio)}</strong>${p.antes ? `<del>${soles(p.antes)}</del>` : ""}<small>/ ${esc(p.unidad || "unidad")}</small></div>
        ${p.antes ? `<span class="save">Ahorras ${soles(p.antes - p.precio)}</span>` : ""}
        ${stockHTML(p, true)}
        <p class="desc">${esc(p.desc || "")}</p>
        ${(p.specs || []).length ? `<ul class="specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
        <div class="buy-row"><div class="qty"><button id="pMinus" aria-label="Menos">−</button><span id="pQty">1</span><button id="pPlus" aria-label="Más">+</button></div>
          <button class="btn btn-yellow" id="pAdd"${hayStock(p) ? "" : " disabled"}>${icon("cart")} Agregar al carrito</button></div>
        <a class="btn btn-green btn-block" id="pWa" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        <div class="pdp-info-list">
          <div>${icon("truck")}Envío a domicilio${AJ.envioGratisDesde ? ` · gratis desde ${soles(AJ.envioGratisDesde)}` : ""}${AJ.recojo !== false ? " · Recojo en tienda gratis" : ""}</div>
          <div><svg class="ico" viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>Productos originales con garantía</div>
          <div><svg class="ico" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>Paga con ${[AJ.pagoYape !== false && "Yape", AJ.pagoPlin !== false && "Plin", AJ.pagoTransf !== false && "transferencia", AJ.contraEntrega !== false && "contra entrega"].filter(Boolean).join(", ")}</div>
        </div>
      </div>`;
    const wa = () => $("#pWa").href = waLink("Hola " + TIENDA() + " 👋 Consulto por este producto:\n• " + p.nombre + "\nCantidad: " + qty + "\nPrecio: " + soles(p.precio * qty));
    wa();
    $("#pMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#pQty").textContent = qty; wa(); });
    $("#pPlus").addEventListener("click", () => { qty = Math.min(qty + 1, maxStock(p)); $("#pQty").textContent = qty; wa(); });
    $("#pAdd").addEventListener("click", () => addToCart(p.id, qty));
    renderGrid($("#related"), PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).concat(PRODUCTOS.filter(x => x.cat !== p.cat && x.id !== p.id)).slice(0, 4));
  }
}

/* ---------- Carrito y pago ---------- */
var drawCart;
function paginaCarrito() {
  const cartBox = $("#cartBox"); if (!cartBox) return;
  let pago = null;
  const zonas = () => (AJ.zonas || []).filter(z => z && z.n);
  const envioDe = (sub, entrega, zona) => { if (entrega !== "domicilio") return 0; if (AJ.envioGratisDesde && sub >= +AJ.envioGratisDesde) return 0; const z = zonas().find(x => x.n === zona); return z ? +z.costo || 0 : 0; };
  const estado = () => { const F = $("#checkout"); if (!F) return {}; const ent = (F.querySelector('[name="entrega"]:checked') || {}).value || "domicilio"; return { ent, zona: $("#cZona")?.value || "" }; };
  function totales(cart) {
    const sub = cartTotal(cart), { ent, zona } = estado(), env = envioDe(sub, ent, zona), n = cart.reduce((s, i) => s + i.qty, 0), falta = AJ.envioGratisDesde && ent === "domicilio" && sub < AJ.envioGratisDesde ? AJ.envioGratisDesde - sub : 0;
    return { sub, env, total: sub + env, html: `<div class="sum-row"><span>Productos (${n})</span><span>${soles(sub)}</span></div>
      <div class="sum-row"><span>Envío</span><span>${ent === "recojo" ? "Gratis (recojo)" : env ? soles(env) : zona || AJ.envioGratisDesde && sub >= AJ.envioGratisDesde ? "Gratis" : "Elige tu zona"}</span></div>
      ${falta ? `<div class="free-ship">Te faltan <b>${soles(falta)}</b> para envío gratis 🚚</div>` : ""}
      <div class="sum-row total"><span>Total</span><strong>${soles(sub + env)}</strong></div>` };
  }
  drawCart = function () {
    const cart = cartValido();
    if (!cart.length) { if (!$("#okPedido")) cartBox.innerHTML = `<div class="cart-empty">${icon("cart")}<h2>Tu carrito está vacío</h2><p>Encuentra herramientas y materiales para tu proyecto.</p><a href="productos" class="btn btn-yellow">Ver productos</a></div>`; return; }
    if ($("#checkout")) { $("#cartList").innerHTML = listHTML(cart); const t = totales(cart); $("#cartTotals").innerHTML = t.html; pago && pago.setMonto(t.total); return; }
    const zs = zonas();
    cartBox.innerHTML = `
      <div class="cart-layout">
        <div><div class="cart-list" id="cartList">${listHTML(cart)}</div><a href="productos" class="see-all" style="margin:14px 4px">← Seguir comprando</a></div>
        <aside class="summary">
          <h2>Resumen del pedido</h2>
          <div id="cartTotals"></div>
          <form id="checkout" novalidate>
            <label>Entrega</label>
            <div class="radio-list">
              <label class="on"><input type="radio" name="entrega" value="domicilio" checked> ${icon("truck")} Envío a domicilio</label>
              ${AJ.recojo !== false ? `<label><input type="radio" name="entrega" value="recojo"> ${icon("store")} Recojo en tienda (gratis)</label>` : ""}
            </div>
            <div id="fDomicilio">
              ${zs.length ? `<label for="cZona">Zona de envío *</label><select id="cZona"><option value="">— Elige tu zona —</option>${zs.map(z => `<option value="${esc(z.n)}">${esc(z.n)} · ${soles(z.costo)}</option>`).join("")}</select>` : ""}
              <label for="cDir">Dirección *</label><input id="cDir" placeholder="Calle, número, distrito" autocomplete="street-address">
              <label for="cRef">Referencia</label><input id="cRef" placeholder="Ej. frente al parque, puerta verde">
            </div>
            <p class="note" id="fRecojo" hidden>📍 Recoges en: <b>${esc(AJ.direccion || "")}</b> · ${esc(AJ.horario || "")}</p>
            <div class="form-row"><div><label for="cNombre">Nombre *</label><input id="cNombre" autocomplete="name" placeholder="Tu nombre o empresa"></div>
              <div><label for="cCel">Celular (WhatsApp) *</label><input id="cCel" type="tel" inputmode="tel" autocomplete="tel" placeholder="987 654 321"></div></div>
            <div class="form-row"><div><label for="cComp">Comprobante</label><select id="cComp"><option>Boleta</option><option>Factura</option></select></div>
              <div><label for="cDoc">DNI o RUC</label><input id="cDoc" inputmode="numeric" maxlength="11" placeholder="Opcional para boleta"></div></div>
            <label style="margin-top:6px">Forma de pago</label>
            <div id="pagoBox"></div>
            <p class="f-err" id="cErr" role="alert"></p>
            <button class="btn btn-yellow btn-block" type="submit" id="cBtn">${icon("check")} Confirmar pedido</button>
            <p class="note">Te enviaremos la confirmación por WhatsApp. Puedes seguir tu pedido con su código.</p>
          </form>
        </aside>
      </div>`;
    pago = Pago($("#pagoBox"), AJ, { contraEntrega: true, onChange: () => {} });
    const upd = () => { const t = totales(cartValido()); $("#cartTotals").innerHTML = t.html; pago.setMonto(t.total); };
    pago.pintar().then(upd); upd();
    $("#checkout").addEventListener("change", e => {
      if (e.target.name === "entrega") { $$(".radio-list label").forEach(l => l.classList.toggle("on", l.contains(e.target))); $("#fDomicilio").hidden = e.target.value !== "domicilio"; $("#fRecojo").hidden = e.target.value !== "recojo"; }
      if (["entrega", "cZona"].includes(e.target.name || e.target.id)) upd();
      if (e.target.id === "cComp") $("#cDoc").placeholder = e.target.value === "Factura" ? "RUC (11 dígitos) *" : "Opcional para boleta";
    });
    $("#checkout").addEventListener("submit", async e => {
      e.preventDefault(); const err = m => { $("#cErr").textContent = m; $("#cErr").scrollIntoView({ block: "center", behavior: "smooth" }); };
      $("#cErr").textContent = "";
      const c = cartValido(); if (!c.length) return err("Tu carrito está vacío.");
      const sinStock = c.find(i => i.qty > maxStock(getProd(i.id))); if (sinStock) return err(`Solo quedan ${maxStock(getProd(sinStock.id))} de «${getProd(sinStock.id).nombre}». Ajusta la cantidad.`);
      const { ent, zona } = estado(), v = id => ($("#" + id)?.value || "").trim();
      if (ent === "domicilio" && zonas().length && !zona) return err("Elige tu zona de envío.");
      if (ent === "domicilio" && !v("cDir")) return err("Escribe tu dirección.");
      if (!v("cNombre") || v("cCel").replace(/\D/g, "").length < 9) return err("Escribe tu nombre y un celular válido.");
      if (v("cComp") === "Factura" && v("cDoc").replace(/\D/g, "").length !== 11) return err("Para factura escribe tu RUC de 11 dígitos.");
      const t = totales(c); pago.setMonto(t.total); const pe = pago.validar(); if (pe) return err(pe);
      const pd = pago.datos(), cod = codigo("FR"), ce = pd.pago === "Contra entrega";
      const pedido = { codigo: cod, items: c.map(i => { const p = getProd(i.id); return { id: String(p.id), n: p.nombre, precio: +p.precio, cant: i.qty, unidad: p.unidad || "unidad" }; }),
        subtotal: Math.round(t.sub * 100) / 100, envio: t.env, total: Math.round(t.total * 100) / 100, entrega: ent, zona: ent === "domicilio" ? zona : "", direccion: ent === "domicilio" ? v("cDir").slice(0, 160) : "", referencia: v("cRef").slice(0, 160),
        nombre: v("cNombre").slice(0, 80), celular: v("cCel").slice(0, 20), doc: v("cDoc").slice(0, 11), comprobante: v("cComp"), pago: pd.pago, banco: pd.banco, monto: ce ? t.total : pd.monto, operacion: pd.operacion,
        montoLeido: pd.montoLeido, coincide: pd.coincide, fechaOk: pd.fechaOk, estado: ce ? "nuevo" : "por-validar", origen: "web", creado: new Date().toISOString() };
      const b = $("#cBtn"); b.disabled = true; b.textContent = "Enviando…";
      try { await DB.crearPedido(pedido, pd.captura); } catch (er) { console.error(er); b.disabled = false; b.innerHTML = icon("check") + " Confirmar pedido"; return err("No se pudo enviar tu pedido. Revisa tu conexión e inténtalo otra vez."); }
      try { localStorage.setItem("ferre_ultimo", cod); } catch (e2) {}
      saveCart([]);
      const msg = `Hola ${TIENDA()} 👋 Acabo de hacer el pedido *${cod}*\n\n${pedido.items.map(i => `• ${i.n} x${i.cant} = ${soles(i.precio * i.cant)}`).join("\n")}\n\nTOTAL: ${soles(pedido.total)}\nPago: ${pedido.pago}${pedido.banco ? " " + pedido.banco : ""}\nEntrega: ${ent === "domicilio" ? "Envío a " + pedido.direccion : "Recojo en tienda"}`;
      cartBox.innerHTML = `<div class="ok-box" id="okPedido">${icon("check")}<h2>¡Pedido recibido!</h2><p>Tu código es</p><div class="ok-code">${cod}</div>
        <p>${ce ? "Te confirmaremos por WhatsApp cuándo llega tu pedido." : "Estamos validando tu pago. Te avisaremos por WhatsApp apenas lo confirmemos."}</p>
        <div class="ok-acts"><a class="btn btn-green" target="_blank" rel="noopener" href="${waLink(msg)}">Enviar mi pedido por WhatsApp</a><a class="btn btn-dark" href="pedido?c=${cod}">Seguir mi pedido</a><a class="btn btn-line" href="productos">Seguir comprando</a></div></div>`;
      scrollTo({ top: 0, behavior: "smooth" });
    });
  };
  function listHTML(cart) {
    return cart.map(i => { const p = getProd(i.id);
      return `<div class="cart-item"><img src="${esc(foto(p, 200))}" alt="" onerror="this.style.visibility='hidden'">
          <div><h3><a href="producto?id=${encodeURIComponent(p.id)}">${esc(p.nombre)}</a></h3><small>${soles(p.precio)} / ${esc(p.unidad || "unidad")}${p.stock != null && p.stock !== true && +p.stock <= 5 ? ` · quedan ${+p.stock}` : ""}</small>
            <button class="trash" data-del="${esc(p.id)}" style="margin-top:6px;display:flex;gap:4px;align-items:center;font-size:.85rem">${icon("trash")} Quitar</button></div>
          <div class="qty"><button data-mq="-1" data-id="${esc(p.id)}" aria-label="Menos">−</button><span>${i.qty}</span><button data-mq="1" data-id="${esc(p.id)}" aria-label="Más">+</button></div>
          <div class="line-total">${soles(p.precio * i.qty)}</div></div>`; }).join("");
  }
}

/* ---------- Seguir mi pedido ---------- */
function paginaPedido() {
  const box = $("#trackBox"); if (!box) return;
  let c0 = params.get("c"); try { c0 = c0 || localStorage.getItem("ferre_ultimo") || ""; } catch (e) {}
  box.innerHTML = `<form class="track-f" id="tf"><label for="tc">Código de tu pedido</label><div><input id="tc" value="${esc(c0)}" placeholder="FR-XXXXXX" maxlength="12" style="text-transform:uppercase"><button class="btn btn-yellow">Buscar</button></div></form><div id="tRes" aria-live="polite"></div>`;
  const PASOS = [["por-validar", "Pago en revisión", "clock"], ["nuevo", "Pedido confirmado", "check"], ["preparando", "Preparando", "box"], ["enviado", "En camino / listo para recoger", "truck"], ["entregado", "Entregado", "check"]];
  async function ver(c) {
    $("#tRes").innerHTML = `<p class="note">Buscando…</p>`; let p = null; try { p = await DB.pedido(c); } catch (e) {}
    if (!p) { $("#tRes").innerHTML = `<div class="empty"><h3>No encontramos ese pedido</h3><p>Revisa el código e inténtalo otra vez.</p></div>`; return; }
    const malo = ["anulado", "rechazado"].includes(p.estado), idx = PASOS.findIndex(x => x[0] === p.estado), pasos = p.pago === "Contra entrega" ? PASOS.slice(1) : PASOS;
    $("#tRes").innerHTML = `<div class="track panel"><div class="track-h"><div><small>Pedido</small><b>${esc(p.codigo)}</b></div><div><small>Total</small><b>${soles(p.total)}</b></div><div><small>Pago</small><b>${esc(p.pago)}${p.banco ? " " + esc(p.banco) : ""}</b></div><div><small>Entrega</small><b>${p.entrega === "recojo" ? "Recojo en tienda" : "A domicilio"}</b></div></div>
      ${malo ? `<div class="track-bad">Este pedido fue ${p.estado === "rechazado" ? "rechazado porque no pudimos validar el pago" : "anulado"}${p.motivo ? ": " + esc(p.motivo) : ""}. Escríbenos por WhatsApp para ayudarte.</div>`
      : `<ol class="steps">${pasos.map(([k, t, ic]) => { const i = PASOS.findIndex(x => x[0] === k), est = i < idx ? "done" : i === idx ? "now" : ""; return `<li class="${est}">${icon(ic)}<span>${p.entrega === "recojo" && k === "enviado" ? "Listo para recoger" : t}</span></li>`; }).join("")}</ol>`}
      <div class="track-items">${p.items.map(i => `<div><span>${i.cant} × ${esc(i.n)}</span><b>${soles(i.precio * i.cant)}</b></div>`).join("")}${p.envio ? `<div><span>Envío (${esc(p.zona || "")})</span><b>${soles(p.envio)}</b></div>` : ""}</div>
      <a class="btn btn-green" target="_blank" rel="noopener" href="${waLink(`Hola ${TIENDA()} 👋 Consulto por mi pedido ${p.codigo}`)}">Consultar por WhatsApp</a></div>`;
    history.replaceState(null, "", "?c=" + p.codigo);
  }
  $("#tf").addEventListener("submit", e => { e.preventDefault(); ver($("#tc").value); });
  if (c0) ver(c0);
}

/* ---------- Contacto: guarda la consulta en el panel y abre WhatsApp ---------- */
function paginaContacto() {
  const f = $("#contactForm"); if (!f) return;
  f.addEventListener("submit", async e => {
    e.preventDefault(); const m = { nombre: $("#fNombre").value.trim().slice(0, 80), telefono: $("#fTel").value.trim().slice(0, 20), asunto: $("#fAsunto").value, mensaje: $("#fMensaje").value.trim().slice(0, 1500), estado: "nuevo", creado: new Date().toISOString() };
    try { await DB.mensaje(m); } catch (er) { console.warn(er); }
    window.open(waLink("Hola " + TIENDA() + " 👋\nNombre: " + m.nombre + "\nTeléfono: " + m.telefono + "\nAsunto: " + m.asunto + "\nMensaje: " + m.mensaje), "_blank");
    f.reset(); toast("✓ Consulta enviada. Te responderemos pronto.", true);
  });
}

/* ---------- Buscador, menú y año ---------- */
const searchForm = $("#searchForm");
if (searchForm) {
  if (params.get("q")) $("#q").value = params.get("q");
  searchForm.addEventListener("submit", e => { e.preventDefault(); const q = $("#q").value.trim(); location.href = "productos" + (q ? "?q=" + encodeURIComponent(q) : ""); });
}
$("#hamburger")?.addEventListener("click", () => $("#menu").classList.toggle("open"));
$$(".has-drop > a").forEach(a => a.addEventListener("click", e => { if (window.innerWidth <= 1000) { e.preventDefault(); a.parentElement.classList.toggle("open"); } }));
$$(".year").forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Arranque: carga los datos del panel y dibuja la página ---------- */
(async function () {
  const c = await DB.catalogo();
  AJ = c.aj || {};
  c.cats.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99)).forEach(x => CATEGORIAS[x.id] = x);
  PRODUCTOS = c.prods.filter(p => p.activo !== false).sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
  aplicarMarca(); paginas(); paginaCarrito(); paginaPedido(); paginaContacto(); refreshCartUI();
})();
