document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SALUDO DINÁMICO Y AÑO AUTOMÁTICO (NIVEL 1)
    const mensajeSaludo = document.getElementById("mensaje-saludo");
    const horaActual = new Date().getHours();
    let saludo = "¡Hola!";

    if (horaActual >= 6 && horaActual < 12) {
        saludo = "☀️ ¡Buenos días! Bienvenidos a PinUp!";
    } else if (horaActual >= 12 && horaActual < 20) {
        saludo = "🌤️ ¡Buenas tardes! Bienvenidos a PinUp!";
    } else {
        saludo = "🌙 ¡Buenas noches! Bienvenidos a PinUp!";
    }
    if (mensajeSaludo) mensajeSaludo.textContent = saludo;

    const footerAnio = document.getElementById("footer-anio");
    if (footerAnio) footerAnio.textContent = new Date().getFullYear();

    // 2. MODO CLARO / OSCURO CON LOCALSTORAGE (NIVEL 1 Y 4)
    const btnTheme = document.getElementById("theme-toggle");
    if (localStorage.getItem("pinup_theme") === "dark") {
        document.body.classList.add("dark-mode");
        btnTheme.textContent = "☀️ Modo Claro";
    }
    btnTheme.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        btnTheme.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
        localStorage.setItem("pinup_theme", isDark ? "dark" : "light");
    });

    // 3. MENÚ HAMBURGUESA RESPONSIVE (NIVEL 1)
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 4. BOTÓN VOLVER ARRIBA Y SCROLL (NIVEL 1)
    const btnVolverArriba = document.getElementById("btn-volver-arriba");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnVolverArriba.style.display = "block";
        } else {
            btnVolverArriba.style.display = "none";
        }
    });

    // 5. GALERÍA LIGHTBOX (NIVEL 1)
    const imagenesGaleria = document.querySelectorAll(".img-galeria");
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");

    imagenesGaleria.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightboxModal.style.display = "flex";
        });
    });

    // 6. ARRAY, OBJETOS Y BUCLE PARA CATÁLOGO DINÁMICO (NIVEL 2)
    renderizarCatalogo(productosStock);

    // 7. BUSCADOR EN TIEMPO REAL (NIVEL 2)
    const buscadorInput = document.getElementById("buscador-input");
    if (buscadorInput) {
        buscadorInput.addEventListener("input", (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = productosStock.filter(p => p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto));
            renderizarCatalogo(filtrados);
        });
    }

    // 8. FILTROS DE COLOR
    const botonesFiltro = document.querySelectorAll(".btn-filtro");
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(b => b.classList.remove("active"));
            boton.classList.add("active");
            const color = boton.getAttribute("data-color");
            if (color === "todos") {
                renderizarCatalogo(productosStock);
            } else {
                const filtrados = productosStock.filter(p => p.categoria === color);
                renderizarCatalogo(filtrados);
            }
        });
    });

    // 9. ACORDEÓN PREGUNTAS FRECUENTES (NIVEL 2)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.addEventListener("click", () => {
            item.classList.toggle("active");
            const span = item.querySelector(".faq-pregunta span");
            if (span) span.textContent = item.classList.contains("active") ? "-" : "+";
        });
    });

    // 10. SIMULADOR DE PINES
    const inputImagen = document.getElementById("subir-imagen");
    const imagenUsuario = document.getElementById("imagen-usuario");
    const placeholderTexto = document.getElementById("placeholder-texto");
    if (inputImagen) {
        inputImagen.addEventListener("change", (event) => {
            const archivo = event.target.files[0];
            if (archivo) {
                const lector = new FileReader();
                lector.onload = function(e) {
                    imagenUsuario.src = e.target.result;
                    imagenUsuario.style.display = "block";
                    placeholderTexto.style.display = "none";
                }
                lector.readAsDataURL(archivo);
            }
        });
    }

    // 11. CUENTA REGRESIVA PROMO (NIVEL 4)
    iniciarCountdown();

    // 12. GESTIÓN DE SESIÓN Y CARRITO
    chequearSesion();
    actualizarContadorCarrito();
});

// --- DATOS DEL CATÁLOGO (NIVEL 2: Array de Objetos) ---
const productosStock = [
    { nombre: "Plantilla Osamu Dazai", precio: 3000, categoria: "marron", imagen: "dazai.jpe", descripcion: "Ilustraciones de Dazai con gabardina, estilo capitán y Port Mafia." },
    { nombre: "Plantilla Monika (DDLC)", precio: 3000, categoria: "marron", imagen: "Monika button pins!.jpe", descripcion: "Pines de Monika de Doki Doki Literature Club! con su moño blanco." },
    { nombre: "Plantilla Warm Cocoa", precio: 3000, categoria: "marron", imagen: "brown theme pin.jpe", descripcion: "Grizzly de Escandalosos, Garfield, Domo-kun y café latte art." },
    { nombre: "Plantilla Jester", precio: 3000, categoria: "morado", imagen: "Jester (tfc).jpe", descripcion: "Diseños teatrales con máscara, cuernos y tonos violeta oscuros." },
    { nombre: "Plantilla Twilight Sparkle", precio: 3000, categoria: "morado", imagen: "twilight.jpe", descripcion: "Diseños de Twilight Sparkle leyendo libros y magia de la amistad." },
    { nombre: "Plantilla Yuri (DDLC)", precio: 3000, categoria: "morado", imagen: "Yuri button pins!.jpe", descripcion: "Pines de Yuri con tazas de té, libros y miradas tímidas." },
    { nombre: "Plantilla Kuromi Lila", precio: 3000, categoria: "morado", imagen: "Kuromi.jpe", descripcion: "Ilustraciones de Kuromi en tono violeta pastel con peluches y pijamas." },
    { nombre: "Plantilla Mafuyu Asahina", precio: 3000, categoria: "morado", imagen: "Mafuyu Pin Template.jpe", descripcion: "Cartas dramáticas e ilustraciones de Mafuyu Asahina." },
    { nombre: "Plantilla Lavender Dreams", precio: 3000, categoria: "morado", imagen: "morado.jpe", descripcion: "Frases en pixel art, lunas púrpuras, tulipanes y Hello Kitty." },
    { nombre: "Plantilla Ado", precio: 3000, categoria: "azul", imagen: "ado.jpe", descripcion: "Diseños de la cantante Ado con su emblemática rosa azul y micrófono." },
    { nombre: "Plantilla KAITO", precio: 3000, categoria: "azul", imagen: "kaito.jpe", descripcion: "Colección de KAITO con su clásica bufanda azul y lentes." },
    { nombre: "Plantilla Blue Ocean Soft", precio: 3000, categoria: "azul", imagen: "azul.jpe", descripcion: "Ilustraciones tiernas de tiburones, Cinnamoroll y gatitos azules." },
    { nombre: "Plantilla Sua (Alien Stage)", precio: 3000, categoria: "azul", imagen: "Sua pin bases 58mm for pin makers or diy!.jpe", descripcion: "Elegantes cortes de Sua de Alien Stage." },
    { nombre: "Plantilla Hatsune Miku", precio: 3000, categoria: "azul", imagen: "miku.jpe", descripcion: "Colección completa de Hatsune Miku con coletas turquesa." },
    { nombre: "Plantilla Cinnamoroll Soft", precio: 3000, categoria: "azul", imagen: "cinnamoroll.jpe", descripcion: "Cinnamoroll en patineta, con auriculares y roles adorables." },
    { nombre: "Plantilla Shadow Milk Cookie", precio: 3000, categoria: "azul", imagen: "Shadow Milk Cookie.jpe", descripcion: "Expresiones místicas y divertidas de Shadow Milk Cookie." },
    { nombre: "Plantilla Planet Neptuno", precio: 3000, categoria: "azul", imagen: "neptuno.jpe", descripcion: "El planeta Neptuno animado con caras graciosas y lentes de sol." },
    { nombre: "Plantilla Nene Kusanagi", precio: 3000, categoria: "verde", imagen: "nene.jpe", descripcion: "Capturas y cartas de Nene Kusanagi con cabello verde pastel." },
    { nombre: "Plantilla GIR", precio: 3000, categoria: "verde", imagen: "Pin idea.jpe", descripcion: "GIR en su traje de perrito verde comiendo pizza y cupcakes." },
    { nombre: "Plantilla Flippy", precio: 3000, categoria: "verde", imagen: "Flippy pin templates!.jpe", descripcion: "El oso militar Flippy en su estado tierno y modo fiero Fliqpy." },
    { nombre: "Plantilla Mint & Macarons", precio: 3000, categoria: "verde", imagen: "menta.jpe", descripcion: "Repostería estética menta, macarons y Pusheen." },
    { nombre: "Plantilla Alien Cat", precio: 3000, categoria: "verde", imagen: "gato alienigena.jpe", descripcion: "Gatitos verdes espaciales con antenas y burritos espaciales." },
    { nombre: "Plantilla Clover & Retro Green", precio: 3000, categoria: "verde", imagen: "verde.jpe", descripcion: "Tréboles de cuatro hojas, tapitas de Sprite y vinilos retro." },
    { nombre: "Plantilla Kagamine Rin", precio: 3000, categoria: "amarillo", imagen: "broches da Rin_P.jpe", descripcion: "Colección variada de Kagamine Rin con moño blanco y Nendoroid." },
    { nombre: "Plantilla Pompompurin", precio: 3000, categoria: "amarillo", imagen: "ama.jpe", descripcion: "Ilustraciones del adorable perrito Pompompurin con postres." },
    { nombre: "Plantilla Emojis 3D", precio: 3000, categoria: "amarillo", imagen: "125256433380025902.jpe", descripcion: "Iconos retro de emojis en 3D con expresiones cómicas." },
    { nombre: "Plantilla Yellow Sunshine", precio: 3000, categoria: "amarillo", imagen: "pin tamplete yellow.jpe", descripcion: "Diseños con Isabelle y Fauna de Animal Crossing y limones." },
    { nombre: "Plantilla Golden Hour", precio: 3000, categoria: "amarillo", imagen: "free to use _3 (1).jpe", descripcion: "Texturas doradas, panales de abeja y cielo al atardecer." },
    { nombre: "Plantilla Bob Esponja", precio: 3000, categoria: "amarillo", imagen: "bob esponja.jpe", descripcion: "Bob Esponja coquette con tutú rosa, enamorado y memes." },
    { nombre: "Plantilla Eternal Sugar Cookie", precio: 3000, categoria: "rosa", imagen: "Eternal sugar cookie.jpe", descripcion: "Diseños resplandecientes con arpa dorada y tiara." },
    { nombre: "Plantilla Kirby Multiverso", precio: 3000, categoria: "rosa", imagen: "Kirby.jpe", descripcion: "Kirby con gorrito de Mario, Luigi, Link y disfraz de sandía." },
    { nombre: "Plantilla Yami Kawaii", precio: 3000, categoria: "rosa", imagen: "stickers printing.jpe", descripcion: "Estética pastel gore con ojo brillante y cerebro pastel." },
    { nombre: "Plantilla Kasane Teto", precio: 3000, categoria: "rosa", imagen: "teto.jpe", descripcion: "Pines de Kasane Teto con su característico pelo rosa y baguette." },
    { nombre: "Plantilla Megurine Luka", precio: 3000, categoria: "rosa", imagen: "Luka.jpe", descripcion: "Diseños de Megurine Luka con modelos 3D y pulpo Luka." },
    { nombre: "Plantilla Natsuki (DDLC)", precio: 3000, categoria: "rosa", imagen: "Natsuki button pins!.jpe", descripcion: "Pines de Natsuki mostrando expresiones tsundere." },
    { nombre: "Plantilla Madoka Kaname", precio: 3000, categoria: "rosa", imagen: "Madoka pins.jpe", descripcion: "Ilustraciones mágicas de Madoka Magica." },
    { nombre: "Plantilla Kenny McCormick", precio: 3000, categoria: "naranja", imagen: "Kenny.jpe", descripcion: "Kenny disfrazado de Princess Kenny, Miku y tomando Fanta." },
    { nombre: "Plantilla Darwin", precio: 3000, categoria: "naranja", imagen: "darwin.jpe", descripcion: "Las expresiones hiperrealistas más graciosas de Darwin Watterson." },
    { nombre: "Plantilla Roblox Delivery", precio: 3000, categoria: "naranja", imagen: "pizza.jpe", descripcion: "Inspirado en Work at a Pizza Place con avatares divertidos." },
    { nombre: "Plantilla Sunset Orange", precio: 3000, categoria: "naranja", imagen: "free to use _3.jpe", descripcion: "Patrones de atardeceres, lunas naranjas y texturas cítricas." },
    { nombre: "Plantilla Emo & Red Rock", precio: 3000, categoria: "rojo", imagen: "emo pin templates oh yes.jpe", descripcion: "Diseños alternativos en rojo y negro con frases y calaveras." },
    { nombre: "Plantilla Phantom Cats", precio: 3000, categoria: "rojo", imagen: "⋆ highlight covers.jpe", descripcion: "Siluetas de gatitos rebeldes inspiradas en Persona 5." }
];

// Renderizar catálogo con Bucle (Nivel 2)
function renderizarCatalogo(lista) {
    const grid = document.getElementById("grid-stock-dinamico");
    if (!grid) return;
    grid.innerHTML = "";

    lista.forEach(item => {
        const article = document.createElement("article");
        article.className = "card-producto stock-item";
        article.innerHTML = `
            <div class="card-imagen-box"><img src="${item.imagen}" alt="${item.nombre}" class="img-galeria" onclick="abrirLightbox('${item.imagen}')"></div>
            <div class="card-info">
                <span class="badge-categoria">Gama ${item.categoria.toUpperCase()}</span>
                <h3>${item.nombre}</h3>
                <p class="precio">$<span class="numero">${item.precio}</span> ARS</p>
                <p class="texto-card">${item.descripcion}</p>
                <button class="btn-subir-imagen" onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(article);
    });
}

// --- CARRITO DE COMPRAS (NIVEL 3 y 4) ---
let carrito = JSON.parse(localStorage.getItem("pinup_carrito")) || [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    guardarYActualizarCarrito();
    alert(`¡Agregaste "${nombre}" al carrito! 🛒`);
}

function guardarYActualizarCarrito() {
    localStorage.setItem("pinup_carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarritoModal();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("carrito-contador");
    if (contador) contador.textContent = carrito.length;
}

const btnCarritoToggle = document.getElementById("btn-carrito-toggle");
const carritoModal = document.getElementById("carrito-modal");
if (btnCarritoToggle && carritoModal) {
    btnCarritoToggle.addEventListener("click", (e) => {
        e.preventDefault();
        carritoModal.style.display = carritoModal.style.display === "flex" ? "none" : "flex";
        renderizarCarritoModal();
    });
}

function toggleCarrito() {
    if (carritoModal) carritoModal.style.display = "none";
}

function renderizarCarritoModal() {
    const listaDiv = document.getElementById("carrito-items-lista");
    const totalMontoSpan = document.getElementById("carrito-total-monto");
    if (!listaDiv || !totalMontoSpan) return;

    if (carrito.length === 0) {
        listaDiv.innerHTML = "Tu carrito está vacío.";
        totalMontoSpan.textContent = "0";
        return;
    }

    let html = "<ul style='text-align: left; list-style: none; max-height: 150px; overflow-y: auto;'>";
    let total = 0;
    carrito.forEach((prod, index) => {
        total += prod.precio;
        html += `<li style="font-size: 0.85rem; margin-bottom: 5px;">- ${prod.nombre} ($<span class="numero">${prod.precio}</span>) <button onclick="eliminarDelCarrito(${index})" style="color:red; background:none; border:none; cursor:pointer;">❌</button></li>`;
    });
    html += "</ul>";
    listaDiv.innerHTML = html;
    totalMontoSpan.textContent = total;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarYActualizarCarrito();
}

function finalizarCompraWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    let mensaje = "¡Hola! Quiero hacer el siguiente pedido en PinUp!:%0A";
    let total = 0;
    carrito.forEach(p => {
        mensaje += `- ${p.nombre} ($${p.precio})%0A`;
        total += p.precio;
    });
    mensaje += `%0A*Total a pagar: $${total} ARS*`;
    window.open(`https://wa.me/?text=${mensaje}`, "_blank");
}

// CALCULADORA DE PRESUPUESTO EXACTA SEGÚN CANTIDAD
function calcularPresupuesto() {
    const cantidadInput = document.getElementById("calc-cantidad");
    const resultadoSpan = document.getElementById("calc-resultado");
    if (!cantidadInput || !resultadoSpan) return;

    let cant = parseInt(cantidadInput.value) || 1;

    // Validación para que se mantenga entre 1 y 8
    if (cant < 1) cant = 1;
    if (cant > 8) cant = 8;
    cantidadInput.value = cant;

    // Precios exactos fijados para mayor ganancia
    const preciosLista = {
        1: 3000,
        2: 5500,
        3: 8000,
        4: 10500,
        5: 13000,
        6: 15000,
        7: 17000,
        8: 19000
    };

    const total = preciosLista[cant] || 3000;
    resultadoSpan.textContent = total.toLocaleString("es-AR");
}

function agregarCalculoAlCarrito() {
    const cant = document.getElementById("calc-cantidad").value;
    const total = document.getElementById("calc-resultado").textContent.replace(".", "");
    agregarAlCarrito(`Pack Personalizado x${cant} pines`, parseInt(total));
}

function agregarCalculoAlCarrito() {
    const cant = document.getElementById("calc-cantidad").value;
    const total = document.getElementById("calc-resultado").textContent;
    agregarAlCarrito(`Pack Personalizado x${cant} pines`, parseInt(total));
}

// --- LIGHTBOX MODAL (NIVEL 1) ---
function abrirLightbox(src) {
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = src;
    lightboxModal.style.display = "flex";
}

function cerrarLightbox() {
    document.getElementById("lightbox-modal").style.display = "none";
}

// --- VOLVER ARRIBA (NIVEL 1) ---
function volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- CUENTA REGRESIVA PROMO (NIVEL 4) ---
function iniciarCountdown() {
    let tiempoRestante = 2 * 24 * 60 * 60 + 14 * 60 * 60 + 45 * 60; // 2 días, 14h, 45m
    const reloj = document.getElementById("countdown-reloj");
    if (!reloj) return;

    setInterval(() => {
        if (tiempoRestante <= 0) return;
        tiempoRestante--;

        const dias = Math.floor(tiempoRestante / (3600 * 24));
        const horas = Math.floor((tiempoRestante % (3600 * 24)) / 3600);
        const minutos = Math.floor((tiempoRestante % 3600) / 60);
        const segundos = tiempoRestante % 60;

        reloj.innerHTML = `<span class="numero">${dias < 10 ? '0'+dias : dias}</span>d : <span class="numero">${horas < 10 ? '0'+horas : horas}</span>h : <span class="numero">${minutos < 10 ? '0'+minutos : minutos}</span>m : <span class="numero">${segundos < 10 ? '0'+segundos : segundos}</span>s`;
    }, 1000);
}

// --- VALIDACIÓN DE FORMULARIO DE CONTACTO (NIVEL 3) ---
function validarFormularioContacto(event) {
    event.preventDefault();
    const nombre = document.getElementById("contacto-nombre").value.trim();
    const email = document.getElementById("contacto-email").value.trim();
    const mensaje = document.getElementById("contacto-mensaje").value.trim();
    const errorP = document.getElementById("contacto-error");

    errorP.style.display = "block";

    if (nombre === "") {
        errorP.textContent = "⚠️ Por favor, ingresa tu nombre.";
        return;
    }
    if (email === "" || !email.includes("@") || !email.includes(".")) {
        errorP.textContent = "⚠️ Por favor, ingresa un correo electrónico válido.";
        return;
    }
    if (mensaje === "") {
        errorP.textContent = "⚠️ El mensaje no puede estar vacío.";
        return;
    }

    errorP.style.display = "none";
    alert("¡Mensaje enviado con éxito! Te responderemos pronto.");
    document.getElementById("form-contacto").reset();
}

// --- GESTIÓN DE CUENTAS Y USUARIOS (LOCALSTORAGE) ---
function cambiarTab(tipo) {
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    if (tipo === 'login') {
        formLogin.style.display = "flex";
        formRegister.style.display = "none";
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
    } else {
        formLogin.style.display = "none";
        formRegister.style.display = "flex";
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("reg-email").value;
    const username = document.getElementById("reg-username").value;
    const displayname = document.getElementById("reg-displayname").value;
    const password = document.getElementById("reg-password").value;

    const userData = { email, username, displayname, password };
    localStorage.setItem("pinup_user", JSON.stringify(userData));
    alert("¡Cuenta creada con éxito! Ya podés iniciar sesión.");
    cambiarTab('login');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const storedUser = JSON.parse(localStorage.getItem("pinup_user"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        localStorage.setItem("pinup_logged", "true");
        chequearSesion();
        alert("¡Bienvenido de nuevo, " + storedUser.displayname + "!");
    } else {
        alert("Correo o contraseña incorrectos, o la cuenta no existe.");
    }
}

function handleLogout() {
    localStorage.removeItem("pinup_logged");
    chequearSesion();
    alert("Has cerrado sesión correctamente.");
}

function chequearSesion() {
    const isLogged = localStorage.getItem("pinup_logged") === "true";
    const authForms = document.getElementById("auth-forms");
    const userPanel = document.getElementById("user-panel");
    const textoPregunta = document.getElementById("texto-pregunta");
    const btnEnviarPregunta = document.getElementById("btn-enviar-pregunta");
    const avisoLoginPregunta = document.getElementById("aviso-login-pregunta");

    if (isLogged) {
        const storedUser = JSON.parse(localStorage.getItem("pinup_user"));
        if (storedUser) {
            if (authForms) authForms.style.display = "none";
            if (userPanel) userPanel.style.display = "flex";
            document.getElementById("display-name-span").textContent = storedUser.displayname;
            document.getElementById("username-span").textContent = storedUser.username;
            document.getElementById("email-span").textContent = storedUser.email;

            if (textoPregunta) {
                textoPregunta.disabled = false;
                textoPregunta.placeholder = "Escribí tu consulta aquí...";
            }
            if (btnEnviarPregunta) {
                btnEnviarPregunta.disabled = false;
                btnEnviarPregunta.style.opacity = "1";
                btnEnviarPregunta.style.cursor = "pointer";
            }
            if (avisoLoginPregunta) avisoLoginPregunta.style.display = "none";
        }
    } else {
        if (authForms) authForms.style.display = "block";
        if (userPanel) userPanel.style.display = "none";
        if (textoPregunta) {
            textoPregunta.disabled = true;
            textoPregunta.placeholder = "Debes iniciar sesión para preguntar...";
        }
        if (btnEnviarPregunta) {
            btnEnviarPregunta.disabled = true;
            btnEnviarPregunta.style.opacity = "0.5";
            btnEnviarPregunta.style.cursor = "not-allowed";
        }
        if (avisoLoginPregunta) avisoLoginPregunta.style.display = "block";
    }
}

function enviarPregunta(event) {
    event.preventDefault();
    const texto = document.getElementById("texto-pregunta").value;
    if (texto.trim() !== "") {
        alert("¡Pregunta enviada con éxito! Te responderemos a la brevedad.");
        document.getElementById("texto-pregunta").value = "";
    }
}