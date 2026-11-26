// PASO 1: Enlace de tu modelo exportado en Teachable Machine
const URL_MODELO = "https://teachablemachine.withgoogle.com/models/QIsBGkxPG/";

// PASO 2: Nombres EXACTOS de tus clases en Teachable Machine -> id del producto en script.js ("Nada": null)
const clasesIA = {
    "Monika": 1,
    "Kaito": 2,
    "Rin": 3,
    "Sua": 4,
    "Twilight": 5,
    "Bob esponja": 6,
    "Hatsune Miku": 7,
    "Madoka": 8,
    "Kenny": 9,
    "Flippy": 10,
    "Nada": null
};

// PASO 3: Confianza mínima (0.8 = 80%)
const CONFIANZA_MINIMA = 0.8;

// PASO 4: Reseñas por id de producto (poné RESENAS_DE_EJEMPLO en false cuando cargues las tuyas)
const RESENAS_DE_EJEMPLO = true;
const resenasPorProducto = {
    1: [{ autor: "Cliente PinUp!", texto: "¡Quedó re lindo el pin de Monika!" }],
    2: [{ autor: "Cliente PinUp!", texto: "Los tonos azules de Kaito resaltan un montón." }],
    3: [{ autor: "Cliente PinUp!", texto: "Súper nítida la impresión de Rin." }],
    4: [{ autor: "Cliente PinUp!", texto: "El diseño de Sua quedó espectacular." }],
    5: [{ autor: "Cliente PinUp!", texto: "Ideal para fans de Twilight y MLP." }],
    6: [{ autor: "Cliente PinUp!", texto: "El pin de Bob esponja es un golazo." }],
    7: [{ autor: "Cliente PinUp!", texto: "Clásico infaltable de Miku, re buena calidad." }],
    8: [{ autor: "Cliente PinUp!", texto: "Excelente terminación en el diseño de Madoka." }],
    9: [{ autor: "Cliente PinUp!", texto: "Me encantó el pin de Kenny, súper resistente." }],
    10: [{ autor: "Cliente PinUp!", texto: "Muy bueno el pin de Flippy para la mochila." }]
};

let modeloIA = null;
let webcamIA = null;
let camaraActivaIA = false;
let productoDetectadoActual = null;

document.addEventListener("DOMContentLoaded", () => {
    const btnCamara = document.getElementById("ia-btn-camara");
    const btnCapturar = document.getElementById("ia-btn-capturar");
    const btnDetener = document.getElementById("ia-btn-detener");
    const inputFoto = document.getElementById("ia-input-foto");
    const btnSi = document.getElementById("ia-btn-si");
    const btnNo = document.getElementById("ia-btn-no");
    const btnAgregar = document.getElementById("ia-btn-agregar");
    const btnIrProducto = document.getElementById("ia-btn-ir-producto");

    if (btnCamara) btnCamara.addEventListener("click", iniciarCamaraIA);
    if (btnCapturar) btnCapturar.addEventListener("click", sacarFotoYReconocerIA);
    if (btnDetener) btnDetener.addEventListener("click", detenerCamaraIA);
    if (inputFoto) inputFoto.addEventListener("change", manejarFotoSubidaIA);
    if (btnSi) btnSi.addEventListener("click", confirmarPersonajeSi);
    if (btnNo) btnNo.addEventListener("click", rechazarPersonajeNo);
    if (btnAgregar) btnAgregar.addEventListener("click", agregarProductoReconocido);
    if (btnIrProducto) btnIrProducto.addEventListener("click", irAlProductoEnCatalogo);

    verificarConfiguracionModeloIA();
});

function verificarConfiguracionModeloIA() {
    const avisoDemo = document.getElementById("ia-aviso-demo");
    const controles = document.getElementById("ia-controles");

    if (!URL_MODELO || URL_MODELO.includes("abc123XYZ")) {
        if (avisoDemo) avisoDemo.style.display = "block";
        if (controles) controles.style.display = "none";
    } else {
        if (avisoDemo) avisoDemo.style.display = "none";
        if (controles) controles.style.display = "flex";
    }
}

function ocultarConfirmacionYResultado() {
    const confirmBox = document.getElementById("ia-confirmacion");
    const resultadoBox = document.getElementById("ia-resultado");
    if (confirmBox) confirmBox.style.display = "none";
    if (resultadoBox) resultadoBox.style.display = "none";
    productoDetectadoActual = null;
}

async function cargarModeloSiHaceFalta() {
    if (modeloIA) return true;

    const estadoEl = document.getElementById("ia-estado");
    if (typeof tmImage === "undefined") {
        if (estadoEl) estadoEl.textContent = "No se pudo cargar la librería de Teachable Machine. Revisá el orden de los scripts.";
        return false;
    }

    if (estadoEl) estadoEl.textContent = "Cargando modelo de IA...";
    const baseURL = URL_MODELO.endsWith("/") ? URL_MODELO : URL_MODELO + "/";
    const modelURL = baseURL + "model.json";
    const metadataURL = baseURL + "metadata.json";

    try {
        modeloIA = await tmImage.load(modelURL, metadataURL);
        if (estadoEl) estadoEl.textContent = "Modelo listo.";
        return true;
    } catch (error) {
        if (estadoEl) estadoEl.textContent = "Error al cargar el modelo. Verificá que el enlace sea correcto.";
        return false;
    }
}

async function iniciarCamaraIA() {
    const ok = await cargarModeloSiHaceFalta();
    if (!ok) return;

    const visor = document.getElementById("ia-visor");
    const estadoEl = document.getElementById("ia-estado");
    const btnCapturar = document.getElementById("ia-btn-capturar");
    const btnDetener = document.getElementById("ia-btn-detener");

    ocultarConfirmacionYResultado();

    try {
        detenerCamaraIA();
        webcamIA = new tmImage.Webcam(260, 260, true);
        await webcamIA.setup();
        await webcamIA.play();

        if (visor) {
            visor.innerHTML = "";
            visor.appendChild(webcamIA.canvas);
        }

        camaraActivaIA = true;
        if (btnCapturar) btnCapturar.style.display = "inline-block";
        if (btnDetener) btnDetener.style.display = "inline-block";
        if (estadoEl) estadoEl.textContent = "Cámara activa — ubicá el personaje y tocá «Sacar foto».";

        window.requestAnimationFrame(loopVistaPreviaCamara);
    } catch (err) {
        if (estadoEl) estadoEl.textContent = "No se pudo encender la cámara. Revisá los permisos del navegador o probá en GitHub Pages.";
    }
}

function loopVistaPreviaCamara() {
    if (!camaraActivaIA || !webcamIA) return;
    webcamIA.update();
    window.requestAnimationFrame(loopVistaPreviaCamara);
}

async function sacarFotoYReconocerIA() {
    if (!camaraActivaIA || !webcamIA || !modeloIA) return;

    webcamIA.update();
    const fotoCanvas = document.createElement("canvas");
    fotoCanvas.width = webcamIA.canvas.width;
    fotoCanvas.height = webcamIA.canvas.height;
    const ctx = fotoCanvas.getContext("2d");
    ctx.drawImage(webcamIA.canvas, 0, 0);

    // Detener el stream de video y mostrar la foto capturada fija
    camaraActivaIA = false;
    if (webcamIA) {
        webcamIA.stop();
        webcamIA = null;
    }

    const visor = document.getElementById("ia-visor");
    const btnCapturar = document.getElementById("ia-btn-capturar");
    const btnDetener = document.getElementById("ia-btn-detener");
    const estadoEl = document.getElementById("ia-estado");

    if (btnCapturar) btnCapturar.style.display = "none";
    if (btnDetener) btnDetener.style.display = "none";

    if (visor) {
        visor.innerHTML = "";
        visor.appendChild(fotoCanvas);
    }
    if (estadoEl) estadoEl.textContent = "Reconociendo personaje en la foto...";

    await evaluarElementoIA(fotoCanvas);
}

function detenerCamaraIA() {
    camaraActivaIA = false;
    if (webcamIA) {
        webcamIA.stop();
        webcamIA = null;
    }
    const btnCapturar = document.getElementById("ia-btn-capturar");
    const btnDetener = document.getElementById("ia-btn-detener");
    if (btnCapturar) btnCapturar.style.display = "none";
    if (btnDetener) btnDetener.style.display = "none";
}

async function manejarFotoSubidaIA(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    detenerCamaraIA();
    ocultarConfirmacionYResultado();

    const ok = await cargarModeloSiHaceFalta();
    if (!ok) return;

    const visor = document.getElementById("ia-visor");
    const estadoEl = document.getElementById("ia-estado");
    const lector = new FileReader();

    lector.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
            if (visor) {
                visor.innerHTML = "";
                visor.appendChild(img);
            }
            if (estadoEl) estadoEl.textContent = "Reconociendo personaje en la foto...";
            await evaluarElementoIA(img);
        };
        img.src = e.target.result;
    };
    lector.readAsDataURL(archivo);
}

async function evaluarElementoIA(elemento) {
    if (!modeloIA) return;
    const predicciones = await modeloIA.predict(elemento);

    let mejorPrediccion = predicciones[0];
    predicciones.forEach((pred) => {
        if (pred.probability > mejorPrediccion.probability) {
            mejorPrediccion = pred;
        }
    });

    procesarPrediccionIA(mejorPrediccion);
}

function procesarPrediccionIA(prediccion) {
    const estadoEl = document.getElementById("ia-estado");
    const confirmBox = document.getElementById("ia-confirmacion");
    const preguntaTexto = document.getElementById("ia-pregunta-texto");

    ocultarConfirmacionYResultado();

    if (prediccion.probability < CONFIANZA_MINIMA) {
        if (estadoEl) estadoEl.textContent = "No estoy seguro de qué personaje es. Probá sacar otra foto con mejor luz o más cerca.";
        return;
    }

    const idProducto = clasesIA[prediccion.className];

    if (idProducto === undefined) {
        if (estadoEl) estadoEl.textContent = `La clase "${prediccion.className}" no está configurada en clasesIA.`;
        return;
    }

    if (idProducto === null) {
        if (estadoEl) estadoEl.textContent = "No se detectó ningún personaje en la foto.";
        return;
    }

    const producto = typeof buscarProducto === "function" ? buscarProducto(idProducto) : null;
    if (!producto) {
        if (estadoEl) estadoEl.textContent = `El personaje apunta al id ${idProducto}, pero no figura en el catálogo.`;
        return;
    }

    productoDetectadoActual = producto;
    if (estadoEl) estadoEl.textContent = "Listo.";
    if (preguntaTexto) {
        preguntaTexto.textContent = `¿Tu personaje es ${prediccion.className}?`;
    }
    if (confirmBox) {
        confirmBox.style.display = "block";
    }
}

function confirmarPersonajeSi() {
    if (!productoDetectadoActual) return;

    const confirmBox = document.getElementById("ia-confirmacion");
    const resultadoBox = document.getElementById("ia-resultado");
    const tituloEl = document.getElementById("ia-prod-nombre");
    const precioEl = document.getElementById("ia-prod-precio");
    const descEl = document.getElementById("ia-prod-desc");
    const resenasEl = document.getElementById("ia-resenas-lista");

    if (confirmBox) confirmBox.style.display = "none";
    if (!resultadoBox) return;

    const idProd = productoDetectadoActual.id;
    tituloEl.textContent = productoDetectadoActual.nombre;
    precioEl.innerHTML = typeof formatearPrecio === "function"
        ? formatearPrecio(productoDetectadoActual.precio)
        : `$${productoDetectadoActual.precio} ARS`;
    descEl.textContent = productoDetectadoActual.descripcion;

    const listaResenas = resenasPorProducto[idProd] || [];
    if (listaResenas.length === 0) {
        resenasEl.innerHTML = "<p class='texto-card'>Todavía no hay reseñas para este producto.</p>";
    } else {
        resenasEl.innerHTML = listaResenas.map(r => `
            <div class="ia-resena-item">
                <strong>${r.autor}:</strong> "${r.texto}"
            </div>
        `).join("");
    }

    resultadoBox.style.display = "block";
}

function rechazarPersonajeNo() {
    ocultarConfirmacionYResultado();
    const estadoEl = document.getElementById("ia-estado");
    if (estadoEl) {
        estadoEl.textContent = "Entendido. Podés tocar «Usar cámara» para sacar otra foto o «Subir foto» con otra imagen.";
    }
}

function agregarProductoReconocido() {
    if (!productoDetectadoActual || typeof agregarAlCarrito !== "function") return;
    agregarAlCarrito(productoDetectadoActual.nombre, productoDetectadoActual.precio);
}

function irAlProductoEnCatalogo() {
    if (!productoDetectadoActual) return;

    const buscador = document.getElementById("buscador-input");
    const seccionStock = document.getElementById("stock");

    if (buscador && typeof productosStock !== "undefined" && typeof renderizarCatalogo === "function") {
        buscador.value = productoDetectadoActual.nombre;
        const filtrados = productosStock.filter(p =>
            p.nombre.toLowerCase().includes(productoDetectadoActual.nombre.toLowerCase())
        );
        renderizarCatalogo(filtrados.length > 0 ? filtrados : productosStock);
    }

    if (seccionStock) {
        seccionStock.scrollIntoView({ behavior: "smooth" });
    }
}