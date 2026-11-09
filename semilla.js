/* =========================================================
   FERRETERÍA — Datos de ejemplo (iguales en la web y el panel)
   ========================================================= */
window.FR_AJUSTES = {
  nombre: "Ferretería Ronald", ruc: "", marca1: "FERRETERÍA", marca2: "RONALD", lema: "Construye tus proyectos con confianza", logo: "",
  whatsapp: "51987654321", telefono: "+51 987 654 321", email: "ventas@tuferreteria.com", horario: "Lunes a sábado, 8:00 a.m. – 7:00 p.m.",
  direccion: "Av. Principal 123, Lima, Perú", mapa: "Lima, Peru", redes: { facebook: "", instagram: "", tiktok: "" },
  heroTit: "Todo lo que necesitas en *un solo lugar*", heroSub: "Herramientas, materiales de construcción, plomería, electricidad y mucho más...", heroFoto: "",
  perks: ["Envíos a domicilio (zona local)", "Productos de calidad y garantía", "Múltiples métodos de pago", "Atención personalizada de lunes a sábado"],
  promoTit: "Materiales para *tus grandes* proyectos", promoFoto: "", promoCat: "construccion",
  nosTit: "Construye tus proyectos con confianza", nosFoto: "",
  nosP1: "En Ferretería Ronald te ofrecemos herramientas, materiales de construcción y todo lo necesario para tu obra, taller u hogar, con precios justos y atención personalizada.",
  nosP2: "Asesoramos a maestros de obra, contratistas, empresas y familias para que elijan el producto correcto y ahorren tiempo y dinero.",
  // Pagos
  pagoYape: true, yapeQR: "", yapeNum: "987 654 321", yapeTitular: "Ferretería Ronald",
  pagoPlin: true, plinQR: "", plinNum: "987 654 321", plinTitular: "Ferretería Ronald",
  pagoTransf: true, cuentas: [
    { id: "bcp", banco: "BCP", num: "191-98765432-0-11", cci: "002-191-198765432011-55", titular: "Ferretería Ronald EIRL", url: "https://www.viabcp.com" },
    { id: "interbank", banco: "Interbank", num: "200-3009876543", cci: "003-200-013009876543-41", titular: "Ferretería Ronald EIRL", url: "https://interbank.pe" }],
  contraEntrega: true, pagoOCR: true,
  // Envíos
  zonas: [ { n: "Mismo distrito", costo: 10 }, { n: "Distritos vecinos", costo: 15 }, { n: "Lima Metropolitana", costo: 25 } ],
  envioGratisDesde: 300, recojo: true
};
window.FR_SEMILLA = function () {
  const db = { ajustes: { general: JSON.parse(JSON.stringify(window.FR_AJUSTES)) }, categorias: {}, productos: {}, pedidos: {}, capturas: {}, movimientos: {}, mensajes: {} };
  const FOTOS_CAT = { electricas: "1606676539940-12768ce0e762", pinturas: "1562259949-e8e7689d7828", construccion: "1637241612956-b7309005288b", seguridad: "1662309376159-b95fb193d96b" };
  Object.entries(typeof CATEGORIAS_EJEMPLO !== "undefined" ? CATEGORIAS_EJEMPLO : {}).forEach(([k, c], i) => db.categorias[k] = { nombre: c.nombre, icono: c.icono, orden: i, foto: FOTOS_CAT[k] ? `https://images.unsplash.com/photo-${FOTOS_CAT[k]}?auto=format&fit=crop&w=500&q=80` : "", franja: !!FOTOS_CAT[k] });
  (typeof PRODUCTOS_EJEMPLO !== "undefined" ? PRODUCTOS_EJEMPLO : []).forEach((p, i) => db.productos["p" + p.id] = { nombre: p.nombre, cat: p.cat, precio: p.precio, antes: p.antes, unidad: p.unidad, foto: p.foto, badge: p.badge || "", stock: p.stock ? [12, 4, 30, 18, 9, 25, 7, 40, 22, 35, 3, 15, 50, 60, 28, 20][i % 16] : 0, specs: p.specs || [], desc: p.desc || "", activo: true, orden: i });
  if (window.FR_DEMO_PEDIDOS !== false) {
    const now = Date.now(), h = n => new Date(now - n * 3600e3).toISOString(), hoy = new Date().toISOString().slice(0, 10);
    db.pedidos["FR-DEMO01"] = { codigo: "FR-DEMO01", items: [{ id: "p1", n: "Taladro percutor 750W", precio: 349, cant: 1, unidad: "unidad" }, { id: "p6", n: "Alicate de corte 8\"", precio: 29.9, cant: 2, unidad: "unidad" }], subtotal: 408.8, envio: 0, total: 408.8,
      entrega: "domicilio", zona: "Mismo distrito", direccion: "Jr. Los Pinos 450, Lima", referencia: "Frente al parque", nombre: "Jorge Huamán", celular: "987111222", doc: "", comprobante: "Boleta", pago: "Yape", banco: "", monto: 408.8, operacion: "13579246",
      estado: "por-validar", origen: "web", creado: h(1), montoLeido: 408.8, coincide: true };
    db.capturas["FR-DEMO01"] = { pedido: "FR-DEMO01", captura: "" };
    db.pedidos["FR-DEMO02"] = { codigo: "FR-DEMO02", items: [{ id: "p14", n: "Ladrillo King Kong 18 huecos (x100)", precio: 125, cant: 3, unidad: "ciento" }], subtotal: 375, envio: 15, total: 390, entrega: "domicilio", zona: "Distritos vecinos", direccion: "Av. Perú 1200, SMP", referencia: "", nombre: "Constructora Andina", celular: "987333444", doc: "20601234567", comprobante: "Factura",
      pago: "Contra entrega", banco: "", monto: 390, estado: "nuevo", origen: "web", creado: h(3) };
    db.pedidos["FR-DEMO03"] = { codigo: "FR-DEMO03", items: [{ id: "p8", n: "Pintura látex blanco 1 gal", precio: 45.9, cant: 4, unidad: "galón" }, { id: "p9", n: "Kit rodillo y bandeja", precio: 24.9, cant: 1, unidad: "kit" }], subtotal: 208.5, envio: 0, total: 208.5, entrega: "recojo", nombre: "María Quispe", celular: "987555666", comprobante: "Boleta",
      pago: "Plin", monto: 208.5, estado: "preparando", stockDescontado: true, pagado: 208.5, origen: "web", creado: h(26) };
    db.movimientos["MV-DEMO1"] = { fecha: hoy, hora: h(2), concepto: "Venta en tienda · 2 productos", monto: 64.8, metodo: "Efectivo", usuario: "Ventas" };
    db.mensajes["MS-DEMO1"] = { nombre: "Luis Cárdenas", telefono: "987777888", asunto: "Cotización para obra", mensaje: "Necesito 50 bolsas de cemento y 2 millares de ladrillo para una obra en Comas.", estado: "nuevo", creado: h(5) };
  }
  return db;
};
