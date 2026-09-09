// ============================================================
// script.js — GameZone | Semana 5 | Manipulación del DOM
// ============================================================

// ─── Constantes de configuración ────────────────────────────
const API_KEY = "7ae8425c52374c608010c58646c51e9a";
const API_URL = "https://api.gamebrain.co/v1/games?limit=6&sort_by=rating";

// ============================================================
// 1. INICIALIZACIÓN — espera a que el DOM esté listo
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    crearSeccionCatalogo();
    configurarEventosProductos();
    configurarFormularioContacto();
    cargarJuegosDesdeAPI();
});

// ============================================================
// 2. MANIPULACIÓN DEL DOM
//    Crea dinámicamente la sección "Descubre más juegos"
// ============================================================
function crearSeccionCatalogo() {
    // Selecciona el contenedor principal donde se insertará la sección
    const main = document.querySelector("main");

    // Crea el elemento section
    const seccion = document.createElement("section");
    seccion.id = "catalogo-api";

    // Agrega el título de la sección
    const titulo = document.createElement("h2");
    titulo.textContent = "Descubre más juegos";
    seccion.appendChild(titulo);

    // Agrega descripción
    const descripcion = document.createElement("p");
    descripcion.textContent = "Juegos cargados en tiempo real desde el catálogo GameBrain:";
    seccion.appendChild(descripcion);

    // Crea el contenedor de cards donde se inyectarán los juegos
    const contenedor = document.createElement("div");
    contenedor.id = "contenedor-api";
    contenedor.className = "row g-4";
    seccion.appendChild(contenedor);

    // Inserta la sección al final del main
    main.appendChild(seccion);
}

// ============================================================
// 3. EVENTOS
// ============================================================

// 3a. MOUSEOVER en cards de productos destacados
//     Resalta la card al pasar el cursor encima
function configurarEventosProductos() {
    const cards = document.querySelectorAll(".card-gamezone");

    cards.forEach(function (card) {
        // Evento mouseover: resalta la card
        card.addEventListener("mouseover", function () {
            card.style.borderColor = "var(--color-acento)";
            card.style.transform = "translateY(-4px)";
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";
        });

        // Evento mouseout: vuelve al estado original
        card.addEventListener("mouseout", function () {
            card.style.borderColor = "";
            card.style.transform = "";
        });
    });

    // Evento CLICK en botones "Ver más": muestra alerta con el nombre del juego
    const botonesVerMas = document.querySelectorAll(".btn-gamezone");

    botonesVerMas.forEach(function (boton) {
        boton.addEventListener("click", function (evento) {
            // Obtiene el título de la card padre
            const titulo = boton
                .closest(".card")
                .querySelector(".card-title")
                .textContent;

            console.log(`Producto seleccionado: ${titulo}`);
        });
    });
}

// 3b. SUBMIT en el formulario de contacto (creado dinámicamente)
//     Valida y muestra un mensaje de confirmación
function configurarFormularioContacto() {
    const footer = document.querySelector("#contacto");

    // Crea el formulario dinámicamente con createElement
    const formulario = document.createElement("form");
    formulario.id = "form-contacto";
    formulario.className = "mt-3";
    formulario.innerHTML = `
        <div class="mb-2">
            <input
                type="text"
                id="input-nombre"
                class="form-control"
                placeholder="Tu nombre"
                style="background:#2a2a3e; color:#e0e0e0; border-color:#3a3a4e;"
            >
        </div>
        <div class="mb-2">
            <input
                type="email"
                id="input-email"
                class="form-control"
                placeholder="Tu correo electrónico"
                style="background:#2a2a3e; color:#e0e0e0; border-color:#3a3a4e;"
            >
        </div>
        <button type="submit" class="btn btn-gamezone">Enviar mensaje</button>
        <p id="mensaje-confirmacion" style="color: var(--color-acento); margin-top: 8px; display: none;">
            ¡Mensaje enviado! Te responderemos pronto.
        </p>
    `;

    // Inserta el formulario antes del cierre del footer
    footer.appendChild(formulario);

    // Evento SUBMIT: valida campos y muestra confirmación
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Evita recarga de la página

        const nombre = document.getElementById("input-nombre").value.trim();
        const email = document.getElementById("input-email").value.trim();
        const mensaje = document.getElementById("mensaje-confirmacion");

        if (nombre === "" || email === "") {
            alert("Por favor completa todos los campos.");
            return;
        }

        // Muestra el mensaje de confirmación y limpia el formulario
        mensaje.style.display = "block";
        formulario.reset();

        // Oculta el mensaje después de 4 segundos
        setTimeout(function () {
            mensaje.style.display = "none";
        }, 4000);
    });
}

// ============================================================
// 4. FETCH API
//    Carga juegos desde GameBrain y los muestra dinámicamente
// ============================================================
function cargarJuegosDesdeAPI() {
    const contenedor = document.getElementById("contenedor-api");

    // Muestra indicador de carga mientras llega la respuesta
    contenedor.innerHTML = `<p style="color: var(--color-texto-secundario);">Cargando juegos...</p>`;

    fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        }
    })
        .then(function (respuesta) {
            // Verifica que la respuesta sea exitosa
            if (!respuesta.ok) {
                throw new Error(`Error al conectar con la API: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            mostrarJuegosEnDOM(datos);
        })
        .catch(function (error) {
            // Muestra el error en pantalla si la carga falla
            console.error("Error al cargar los juegos:", error);
            contenedor.innerHTML = `
                <p style="color: #ff6b6b;">
                    No se pudieron cargar los juegos. Intenta más tarde.
                </p>`;
        });
}

// ============================================================
// 5. RENDERIZADO
//    Genera las cards de juegos con los datos de la API
// ============================================================
function mostrarJuegosEnDOM(datos) {
    const contenedor = document.getElementById("contenedor-api");
    contenedor.innerHTML = "";

    // Muestra la estructura completa en consola para identificar los campos
    console.log("Respuesta API:", datos);

    const juegos = datos.results || datos.games || datos || [];

    if (juegos.length === 0) {
        contenedor.innerHTML = `<p style="color: var(--color-texto-secundario);">No se encontraron juegos.</p>`;
        return;
    }

    // Muestra el primer juego para ver sus campos exactos
    console.log("Primer juego:", juegos[0]);

    juegos.forEach(function (juego) {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        const imagen = juego.cover_image || juego.thumbnail || juego.background_image || juego.image || juego.cover || "https://placehold.co/400x240?text=GameZone";
        const nombre = juego.name || juego.title || "Sin título";
        const genero = juego.genre || juego.genres?.[0]?.name || "Videojuego";
        const plataforma = juego.platform || juego.platforms?.[0]?.name || "";
        const rating = juego.rating?.mean ? (juego.rating.mean * 10).toFixed(1) : "";
        const url = "https://gamebrain.co/game/" + juego.link.split("/game/").pop();

        col.innerHTML = `
            <div class="card h-100 card-gamezone">
                <img src="${imagen}" class="card-img-top" alt="Portada de ${nombre}"
                     onerror="this.src='https://placehold.co/400x240?text=GameZone'">
                <div class="card-body d-flex flex-column">
                    <h3 class="h5 card-title">${nombre}</h3>
                    <p class="card-text">${genero}${plataforma ? " — " + plataforma : ""}${rating ? " · ★ " + rating : ""}</p>
                    <a href="${url}" target="_blank" rel="noopener noreferrer"
                       class="btn btn-gamezone mt-auto">Ver más</a>
                </div>
            </div>
        `;

        contenedor.appendChild(col);
    });

    aplicarEventosCardsAPI();
}

// ============================================================
// 6. EVENTOS EN CARDS DE LA API
//    Aplica el mismo efecto hover a las cards cargadas dinámicamente
// ============================================================
function aplicarEventosCardsAPI() {
    const cardsAPI = document.querySelectorAll("#contenedor-api .card-gamezone");

    cardsAPI.forEach(function (card) {
        card.addEventListener("mouseover", function () {
            card.style.borderColor = "var(--color-acento)";
            card.style.transform = "translateY(-4px)";
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";
        });

        card.addEventListener("mouseout", function () {
            card.style.borderColor = "";
            card.style.transform = "";
        });
    });
}