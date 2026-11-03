/* =========================================================
   FERRETERÍA RONALD — LISTA DE PRODUCTOS
   Aquí agregas, quitas o cambias productos. Cada producto
   aparece solo en la tienda, en su página y en el carrito.

   Campos:
   id       → número único (no repetir)
   nombre   → nombre del producto
   cat      → clave de la categoría (ver CATEGORIAS abajo)
   precio   → precio actual en soles
   antes    → precio anterior si está en oferta (o null)
   unidad   → cómo se vende (unidad, galón, rollo, etc.)
   foto     → enlace de la foto (puedes usar fotos propias: "fotos/taladro.jpg")
   badge    → "Más vendido", "Oferta", "Nuevo" o ""
   stock    → true si hay stock, false si está agotado
   specs    → lista de características
   desc     → descripción
   ========================================================= */
const FOTO = id => "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=600&q=80";

const CATEGORIAS = {
  manuales:    { nombre: "Herramientas Manuales",  icono: "wrench" },
  electricas:  { nombre: "Herramientas Eléctricas", icono: "drill" },
  construccion:{ nombre: "Construcción",           icono: "brick" },
  pinturas:    { nombre: "Pinturas",               icono: "roller" },
  plomeria:    { nombre: "Plomería",               icono: "pipe" },
  electricidad:{ nombre: "Electricidad",           icono: "bolt" },
  seguridad:   { nombre: "Seguridad Industrial",   icono: "helmet" }
};

const PRODUCTOS = [
  { id: 1, nombre: "Taladro percutor 750W", cat: "electricas", precio: 349.00, antes: null, unidad: "unidad",
    foto: FOTO("1562259929-b4e1fd3aef09"), badge: "Más vendido", stock: true,
    specs: ["Potencia: 750 W", "Mandril de 13 mm", "Función percutor para concreto", "Incluye maletín"],
    desc: "Taladro percutor para trabajos en madera, metal y concreto. Velocidad variable y empuñadura auxiliar para mayor control." },
  { id: 2, nombre: "Amoladora angular 4 1/2\"", cat: "electricas", precio: 189.00, antes: 229.00, unidad: "unidad",
    foto: FOTO("1518709414768-a88981a4515d"), badge: "Oferta", stock: true,
    specs: ["Potencia: 850 W", "Disco de 115 mm", "Mango lateral ajustable", "Guarda de seguridad"],
    desc: "Amoladora para cortar y desbastar metal, cerámica y concreto. Compacta y fácil de manejar." },
  { id: 3, nombre: "Martillo de uña 16 oz", cat: "manuales", precio: 34.90, antes: null, unidad: "unidad",
    foto: FOTO("1586864387789-628af9feed72"), badge: "", stock: true,
    specs: ["Peso: 16 oz", "Cabeza de acero forjado", "Mango antideslizante"],
    desc: "Martillo de uña con cabeza de acero y mango ergonómico. Ideal para carpintería y trabajos generales." },
  { id: 4, nombre: "Set martillo y destornilladores", cat: "manuales", precio: 59.90, antes: null, unidad: "set",
    foto: FOTO("1581783898377-1c85bf937427"), badge: "Nuevo", stock: true,
    specs: ["1 martillo", "Destornilladores plano y estrella", "Mangos bimaterial"],
    desc: "Set básico de herramientas para el hogar. Todo lo necesario para reparaciones del día a día." },
  { id: 5, nombre: "Juego de herramientas 40 piezas", cat: "manuales", precio: 129.00, antes: 159.00, unidad: "set",
    foto: FOTO("1454988501794-2992f706932e"), badge: "Oferta", stock: true,
    specs: ["40 piezas", "Dados, llaves y puntas", "Estuche organizador"],
    desc: "Juego completo de dados, llaves y puntas en estuche resistente. Para mecánica, hogar y taller." },
  { id: 6, nombre: "Alicate de corte 8\"", cat: "manuales", precio: 29.90, antes: null, unidad: "unidad",
    foto: FOTO("1581166397057-235af2b3c6dd"), badge: "", stock: true,
    specs: ["Largo: 8 pulgadas", "Acero al cromo vanadio", "Mango aislado"],
    desc: "Alicate de corte diagonal para cables y alambres. Filo templado de larga duración." },
  { id: 7, nombre: "Kit de carpintería 6 piezas", cat: "manuales", precio: 99.00, antes: 119.00, unidad: "kit",
    foto: FOTO("1567361808960-dec9cb578182"), badge: "Oferta", stock: true,
    specs: ["Formones y cepillo", "Escuadra y wincha", "Ideal para principiantes"],
    desc: "Herramientas esenciales para trabajos de carpintería en madera." },
  { id: 8, nombre: "Pintura látex blanco 1 gal", cat: "pinturas", precio: 45.90, antes: null, unidad: "galón",
    foto: FOTO("1585676737728-432f58d5fdba"), badge: "Más vendido", stock: true,
    specs: ["Rendimiento: hasta 40 m² por galón", "Acabado mate", "Lavable"],
    desc: "Pintura látex para interiores y exteriores, de alto poder cubriente y secado rápido." },
  { id: 9, nombre: "Kit rodillo y bandeja", cat: "pinturas", precio: 24.90, antes: 32.90, unidad: "kit",
    foto: FOTO("1599619585752-c3edb42a414c"), badge: "Oferta", stock: true,
    specs: ["Rodillo de 9\"", "Bandeja plástica", "Felpa para superficies lisas"],
    desc: "Kit para pintar paredes de forma rápida y pareja." },
  { id: 10, nombre: "Set de brochas x3", cat: "pinturas", precio: 19.90, antes: null, unidad: "set",
    foto: FOTO("1513364776144-60967b0f800f"), badge: "", stock: true,
    specs: ["Medidas: 1\", 2\" y 3\"", "Cerda natural", "Mango de madera"],
    desc: "Brochas para retoques, marcos y bordes. Cerda que no se desprende." },
  { id: 11, nombre: "Cable eléctrico 2.5 mm (100 m)", cat: "electricidad", precio: 189.00, antes: null, unidad: "rollo",
    foto: FOTO("1518181835702-6eef8b4b2113"), badge: "", stock: true,
    specs: ["Calibre: 2.5 mm²", "Rollo de 100 metros", "Cobre electrolítico"],
    desc: "Cable para instalaciones eléctricas domiciliarias de tomacorrientes y alumbrado." },
  { id: 12, nombre: "Cables de colores 1.5 mm (50 m)", cat: "electricidad", precio: 79.90, antes: 89.90, unidad: "rollo",
    foto: FOTO("1601462904263-f2fa0c851cb9"), badge: "Oferta", stock: true,
    specs: ["Calibre: 1.5 mm²", "Rollo de 50 metros", "Varios colores"],
    desc: "Cable flexible para iluminación y circuitos de baja carga." },
  { id: 13, nombre: "Tubo galvanizado 1/2\" x 6 m", cat: "plomeria", precio: 39.90, antes: null, unidad: "unidad",
    foto: FOTO("1580810734898-5e1753f23337"), badge: "", stock: true,
    specs: ["Diámetro: 1/2 pulgada", "Largo: 6 metros", "Acero galvanizado"],
    desc: "Tubo resistente para redes de agua y estructuras livianas." },
  { id: 14, nombre: "Ladrillo King Kong 18 huecos (x100)", cat: "construccion", precio: 125.00, antes: null, unidad: "ciento",
    foto: FOTO("1637241612956-b7309005288b"), badge: "Más vendido", stock: true,
    specs: ["100 unidades", "Medida: 9 x 13 x 24 cm", "Para muros portantes"],
    desc: "Ladrillo de arcilla cocida para muros. Precio por ciento, consulta por millar." },
  { id: 15, nombre: "Pasta para muros 20 kg", cat: "construccion", precio: 32.90, antes: null, unidad: "bolsa",
    foto: FOTO("1768839725085-829e6ac7ac26"), badge: "Nuevo", stock: true,
    specs: ["Bolsa de 20 kg", "Para resanes y empastes", "Fácil de lijar"],
    desc: "Pasta para dejar muros lisos y listos para pintar." },
  { id: 16, nombre: "Casco de seguridad", cat: "seguridad", precio: 24.90, antes: null, unidad: "unidad",
    foto: FOTO("1552879890-3a06dd3a06c2"), badge: "", stock: true,
    specs: ["Con suspensión ajustable", "Polietileno de alta densidad", "Color amarillo"],
    desc: "Casco de protección para obra y trabajos industriales." }
];
