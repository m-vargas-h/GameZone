// CONFIGURACIÓN
const API_KEY = "7ae8425c52374c608010c58646c51e9a";
const API_URL = "https://api.gamebrain.co/v1/games?limit=6&sort_by=rating";
const JSON_URL = "./assets/data/productos.json";

// Estado del carrito
let carrito = [];

// Todos los productos cargados desde el JSON (para filtros y búsqueda)
let todosLosProductos = [];

// Filtro activo por plataforma y género
let filtroPlataforma = "Todos";
let filtroGenero = "Todos";


// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", function () {
    cargarProductosDesdeJSON();
    cargarJuegosDesdeAPI();
    configurarBusqueda();
    configurarFiltros();
});


// FETCH API — JSON LOCAL

// Carga el JSON local y dispara el renderizado de destacados y catálogo
function cargarProductosDesdeJSON() {
    fetch(JSON_URL)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo de productos.");
            }
            return respuesta.json();
        })
        .then(function (productos) {
            todosLosProductos = productos;
            renderizarDestacados(productos);
            renderizarCatalogo(productos);
        })
        .catch(function (error) {
            console.error("Error al cargar productos:", error);
            mostrarErrorCarga("contenedor-destacados");
            mostrarErrorCarga("contenedor-catalogo");
        });
}

// Muestra mensaje de error amigable en el contenedor indicado
function mostrarErrorCarga(idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = `
        <p class="texto-error">
            No se pudieron cargar los productos. Por favor, intenta más tarde.
        </p>`;
}


// RENDERIZADO — DESTACADOS (5 juegos)

function renderizarDestacados(productos) {
    const contenedor = document.getElementById("contenedor-destacados");
    contenedor.innerHTML = "";

    // Filtra solo los marcados como destacado
    const destacados = productos.filter(function (p) {
        return p.destacado === true;
    });

    destacados.forEach(function (producto) {
        const col = crearCardProducto(producto);
        contenedor.appendChild(col);
    });
}


// RENDERIZADO — CATÁLOGO COMPLETO

function renderizarCatalogo(productos) {
    const contenedor = document.getElementById("contenedor-catalogo");
    contenedor.innerHTML = "";

    // Aplica filtro de plataforma si no es "Todos"
    let filtrados = productos.filter(function (p) {
        const coincidePlataforma = filtroPlataforma === "Todos" ||
            p.plataformas.includes(filtroPlataforma);
        const coincideGenero = filtroGenero === "Todos" ||
            p.categoria === filtroGenero;
        return coincidePlataforma && coincideGenero;
    });

    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <p class="texto-secundario">
                No hay juegos disponibles para el filtro seleccionado.
            </p>`;
        return;
    }

    filtrados.forEach(function (producto) {
        const col = crearCardProducto(producto);
        contenedor.appendChild(col);
    });
}


// CREACIÓN DE CARDS

// Genera y retorna una columna con la card de un producto
function crearCardProducto(producto) {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    // Formatea el precio en CLP o muestra "Gratis"
    const precioFormateado = producto.precio === 0
        ? "Gratis"
        : "$" + producto.precio.toLocaleString("es-CL");

    col.innerHTML = `
        <div class="card h-100 card-gamezone" data-id="${producto.id}">
            <img src="${producto.imagen}" class="card-img-top"
                 alt="Portada de ${producto.nombre}"
                 onerror="this.src='https://placehold.co/400x240?text=GameZone'">
            <div class="card-body d-flex flex-column">
                <h3 class="h5 card-title">${producto.nombre}</h3>
                <p class="card-text">${producto.descripcion}</p>
                <p class="precio-card">${precioFormateado}</p>
                <div class="mt-auto d-flex gap-2">
                    <a href="${producto.url}" target="_blank" rel="noopener noreferrer"
                       class="btn btn-gamezone flex-grow-1">Ver más</a>
                    <button class="btn btn-carrito" data-id="${producto.id}">
                        + Carrito
                    </button>
                </div>
            </div>
        </div>`;

    // Evento click en botón "Agregar al carrito"
    col.querySelector(".btn-carrito").addEventListener("click", function () {
        agregarAlCarrito(producto);
    });

    // Evento mouseover / mouseout en la card
    const card = col.querySelector(".card-gamezone");
    card.addEventListener("mouseover", function () {
        card.style.borderColor = "var(--color-acento)";
        card.style.transform = "translateY(-4px)";
        card.style.transition = "transform 0.2s ease, border-color 0.2s ease";
    });
    card.addEventListener("mouseout", function () {
        card.style.borderColor = "";
        card.style.transform = "";
    });

    return col;
}


// CARRITO

// Agrega un producto al carrito o aumenta su cantidad si ya existe
function agregarAlCarrito(producto) {
    const existente = carrito.find(function (item) {
        return item.id === producto.id;
    });

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

// Elimina un producto del carrito por su id
function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (item) {
        return item.id !== id;
    });
    actualizarCarrito();
}

// Re-renderiza el resumen del carrito y actualiza el total
function actualizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const spanTotal = document.getElementById("total-carrito");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="texto-secundario">Tu carrito está vacío.</p>`;
        spanTotal.textContent = "$0";
        return;
    }

    // Construye la lista de items del carrito
    const lista = document.createElement("ul");
    lista.className = "lista-carrito-items";

    let total = 0;

    carrito.forEach(function (item) {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.className = "carrito-item";
        li.innerHTML = `
            <span class="carrito-nombre">${item.nombre}</span>
            <span class="carrito-cantidad">x${item.cantidad}</span>
            <span class="carrito-subtotal">${item.precio === 0 ? "Gratis" : "$" + subtotal.toLocaleString("es-CL")}</span>
            <button class="btn-eliminar" data-id="${item.id}">✕</button>`;

        // Evento click para eliminar el item
        li.querySelector(".btn-eliminar").addEventListener("click", function () {
            eliminarDelCarrito(item.id);
        });

        lista.appendChild(li);
    });

    contenedor.appendChild(lista);
    spanTotal.textContent = "$" + total.toLocaleString("es-CL");
}


// BÚSQUEDA (evento submit)

function configurarBusqueda() {
    const form = document.getElementById("form-busqueda");
    const inputBusqueda = document.getElementById("input-busqueda");
    const resultadoContenedor = document.getElementById("resultado-busqueda");

    // Evento submit real sobre el formulario
    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        ejecutarBusqueda(inputBusqueda, resultadoContenedor);
    });
}

function ejecutarBusqueda(input, contenedor) {
    const termino = input.value.trim().toLowerCase();
    contenedor.innerHTML = "";

    if (termino === "") {
        contenedor.innerHTML = `<p class="texto-secundario">Ingresa un término para buscar.</p>`;
        return;
    }

    const resultados = todosLosProductos.filter(function (p) {
        return p.nombre.toLowerCase().includes(termino) ||
               p.categoria.toLowerCase().includes(termino);
    });

    if (resultados.length === 0) {
        contenedor.innerHTML = `<p class="texto-secundario">No se encontraron juegos para "<strong>${termino}</strong>".</p>`;
        return;
    }

    const fila = document.createElement("div");
    fila.className = "row g-4";

    resultados.forEach(function (producto) {
        fila.appendChild(crearCardProducto(producto));
    });

    contenedor.appendChild(fila);
}


// FILTROS (plataforma y género)

function configurarFiltros() {
    // Delegación de eventos en el grupo de plataforma
    document.getElementById("filtros-plataforma").addEventListener("click", function (evento) {
        const boton = evento.target.closest(".btn-filtro");
        if (!boton) return;

        // Actualiza el pill activo del grupo
        document.querySelectorAll("#filtros-plataforma .btn-filtro").forEach(function (b) {
            b.classList.remove("active");
        });
        boton.classList.add("active");

        filtroPlataforma = boton.dataset.valor;
        renderizarCatalogo(todosLosProductos);
    });

    // Delegación de eventos en el grupo de género
    document.getElementById("filtros-genero").addEventListener("click", function (evento) {
        const boton = evento.target.closest(".btn-filtro");
        if (!boton) return;

        document.querySelectorAll("#filtros-genero .btn-filtro").forEach(function (b) {
            b.classList.remove("active");
        });
        boton.classList.add("active");

        filtroGenero = boton.dataset.valor;
        renderizarCatalogo(todosLosProductos);
    });
}


// FETCH API — API EXTERNA (GameBrain)

function cargarJuegosDesdeAPI() {
    const contenedor = document.getElementById("contenedor-api");
    contenedor.innerHTML = `<p class="texto-secundario">Cargando juegos...</p>`;

    fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        }
    })
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error(`Error al conectar con la API: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            mostrarJuegosAPI(datos);
        })
        .catch(function (error) {
            console.error("Error al cargar los juegos:", error);
            contenedor.innerHTML = `
                <p class="texto-error">
                    No se pudieron cargar los juegos. Intenta más tarde.
                </p>`;
        });
}

function mostrarJuegosAPI(datos) {
    const contenedor = document.getElementById("contenedor-api");
    contenedor.innerHTML = "";

    const juegos = datos.results || datos.games || datos || [];

    if (juegos.length === 0) {
        contenedor.innerHTML = `<p class="texto-secundario">No se encontraron juegos.</p>`;
        return;
    }

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
            </div>`;

        // Hover en cards de la API
        const card = col.querySelector(".card-gamezone");
        card.addEventListener("mouseover", function () {
            card.style.borderColor = "var(--color-acento)";
            card.style.transform = "translateY(-4px)";
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";
        });
        card.addEventListener("mouseout", function () {
            card.style.borderColor = "";
            card.style.transform = "";
        });

        contenedor.appendChild(col);
    });
}