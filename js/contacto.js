// ============================================================
// contacto.js — GameZone | Validación del formulario de contacto
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    crearSeccionCatalogo();
    configurarEventosProductos();
    cargarJuegosDesdeAPI();
});

/**
 * Configura el evento de envío del formulario de contacto.
 * Valida los campos obligatorios y muestra confirmación.
 */
function configurarFormulario() {
    const btnEnviar = document.getElementById("btn-enviar");

    btnEnviar.addEventListener("click", function () {
        const nombre = document.getElementById("input-nombre").value.trim();
        const email = document.getElementById("input-email").value.trim();
        const motivo = document.getElementById("select-motivo").value;
        const mensaje = document.getElementById("input-mensaje").value.trim();
        const confirmacion = document.getElementById("mensaje-enviado");

        // Validación de campos obligatorios
        if (nombre === "" || email === "" || motivo === "" || mensaje === "") {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        // Muestra el mensaje de confirmación
        confirmacion.style.display = "block";
        limpiarFormulario();

        // Oculta el mensaje después de 5 segundos
        setTimeout(function () {
            confirmacion.style.display = "none";
        }, 5000);
    });
}

/**
 * Limpia todos los campos del formulario tras el envío.
 */
function limpiarFormulario() {
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-telefono").value = "";
    document.getElementById("select-motivo").value = "";
    document.getElementById("input-mensaje").value = "";
}