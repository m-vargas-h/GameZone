// CONTACTO — Validación y envío del formulario

document.addEventListener("DOMContentLoaded", function () {
    configurarFormulario();
});

// Configura el evento submit del formulario de contacto
function configurarFormulario() {
    const btnEnviar = document.getElementById("btn-enviar");

    btnEnviar.addEventListener("click", function () {
        if (validarFormulario()) {
            mostrarConfirmacion();
            limpiarFormulario();
        }
    });
}

// Valida los campos del formulario y muestra errores inline
function validarFormulario() {
    let valido = true;

    const nombre = document.getElementById("input-nombre");
    const email = document.getElementById("input-email");
    const motivo = document.getElementById("select-motivo");
    const mensaje = document.getElementById("input-mensaje");

    // Limpia errores previos antes de volver a validar
    limpiarErrores();

    if (nombre.value.trim() === "") {
        mostrarError(nombre, "El nombre es obligatorio.");
        valido = false;
    }

    if (email.value.trim() === "") {
        mostrarError(email, "El correo es obligatorio.");
        valido = false;
    } else if (!formatoEmailValido(email.value.trim())) {
        mostrarError(email, "Ingresa un correo válido.");
        valido = false;
    }

    if (motivo.value === "") {
        mostrarError(motivo, "Selecciona un motivo de contacto.");
        valido = false;
    }

    if (mensaje.value.trim() === "") {
        mostrarError(mensaje, "El mensaje no puede estar vacío.");
        valido = false;
    } else if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres.");
        valido = false;
    }

    return valido;
}

// Muestra un mensaje de error debajo del campo indicado
function mostrarError(campo, mensaje) {
    campo.classList.add("campo-error");

    const error = document.createElement("p");
    error.className = "mensaje-error";
    error.textContent = mensaje;

    campo.parentNode.appendChild(error);
}

// Elimina todos los errores visibles del formulario
function limpiarErrores() {
    document.querySelectorAll(".campo-error").forEach(function (campo) {
        campo.classList.remove("campo-error");
    });
    document.querySelectorAll(".mensaje-error").forEach(function (el) {
        el.remove();
    });
}

// Valida formato básico de email con expresión regular
function formatoEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Muestra el mensaje de confirmación de envío
function mostrarConfirmacion() {
    const confirmacion = document.getElementById("mensaje-enviado");
    confirmacion.style.display = "block";

    // Oculta el mensaje después de 4 segundos
    setTimeout(function () {
        confirmacion.style.display = "none";
    }, 4000);
}

// Limpia todos los campos del formulario tras el envío
function limpiarFormulario() {
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-telefono").value = "";
    document.getElementById("select-motivo").value = "";
    document.getElementById("input-mensaje").value = "";
}