const CLAVE_STORAGE = "tareasKanban";

let tareas = [];

const formulario = document.getElementById("formulario-tarea");
const inputId = document.getElementById("id-tarea");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");
const inputPrioridad = document.getElementById("prioridad");
const inputFechaLimite = document.getElementById("fecha-limite");
const inputEstado = document.getElementById("estado");

const botonGuardar = document.getElementById("boton-guardar");
const botonCancelar = document.getElementById("boton-cancelar");
const mensajeError = document.getElementById("mensaje-error");

const filtroEstado = document.getElementById("filtro-estado");
const filtroPrioridad = document.getElementById("filtro-prioridad");
const busqueda = document.getElementById("busqueda");

const columnaPorHacer = document.getElementById("columna-por-hacer");
const columnaEnCurso = document.getElementById("columna-en-curso");
const columnaHecho = document.getElementById("columna-hecho");

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

function iniciarAplicacion() {
    tareas = cargarTareas();

    formulario.addEventListener("submit", guardarDesdeFormulario);
    botonCancelar.addEventListener("click", cancelarEdicion);

    filtroEstado.addEventListener("change", renderizarAplicacion);
    filtroPrioridad.addEventListener("change", renderizarAplicacion);
    busqueda.addEventListener("input", renderizarAplicacion);

    renderizarAplicacion();
}

// Carga las tareas guardadas en localStorage.
function cargarTareas() {
    const datos = localStorage.getItem(CLAVE_STORAGE);

    if (!datos) {
        return [];
    }

    return JSON.parse(datos);
}

// Guarda el array de tareas en localStorage.
function guardarTareas() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

function guardarDesdeFormulario(evento) {
    evento.preventDefault();

    const titulo = inputTitulo.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const prioridad = inputPrioridad.value;
    const fechaLimite = inputFechaLimite.value;
    const estado = inputEstado.value;

    if (titulo === "") {
        mensajeError.textContent = "El título de la tarea es obligatorio.";
        return;
    }

    mensajeError.textContent = "";

    const idEditando = inputId.value;

    if (idEditando) {
        actualizarTarea(idEditando, titulo, descripcion, prioridad, fechaLimite, estado);
    } else {
        crearTarea(titulo, descripcion, prioridad, fechaLimite, estado);
    }

    guardarTareas();
    limpiarFormulario();
    renderizarAplicacion();
}

// Crea un nuevo objeto tarea con los datos del formulario.
function crearTarea(titulo, descripcion, prioridad, fechaLimite, estado) {
    const nuevaTarea = {
        id: Date.now().toString(),
        titulo: titulo,
        descripcion: descripcion,
        prioridad: prioridad,
        fechaLimite: fechaLimite,
        estado: estado,
        creadaEl: new Date().toISOString()
    };

    tareas.push(nuevaTarea);
}

function actualizarTarea(id, titulo, descripcion, prioridad, fechaLimite, estado) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return {
                ...tarea,
                titulo: titulo,
                descripcion: descripcion,
                prioridad: prioridad,
                fechaLimite: fechaLimite,
                estado: estado
            };
        }

        return tarea;
    });
}

function editarTarea(id) {
    const tarea = tareas.find(tarea => tarea.id === id);

    if (!tarea) {
        return;
    }

    inputId.value = tarea.id;
    inputTitulo.value = tarea.titulo;
    inputDescripcion.value = tarea.descripcion;
    inputPrioridad.value = tarea.prioridad;
    inputFechaLimite.value = tarea.fechaLimite;
    inputEstado.value = tarea.estado;

    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.classList.remove("oculto");
}

function eliminarTarea(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");

    if (!confirmar) {
        return;
    }

    tareas = tareas.filter(tarea => tarea.id !== id);

    guardarTareas();
    renderizarAplicacion();
}

function cambiarEstado(id, nuevoEstado) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return {
                ...tarea,
                estado: nuevoEstado
            };
        }

        return tarea;
    });

    guardarTareas();
    renderizarAplicacion();
}

function cancelarEdicion() {
    limpiarFormulario();
}

function limpiarFormulario() {
    formulario.reset();
    inputId.value = "";
    mensajeError.textContent = "";
    botonGuardar.textContent = "Guardar tarea";
    botonCancelar.classList.add("oculto");
}

function obtenerTareasFiltradas() {
    const estadoSeleccionado = filtroEstado.value;
    const prioridadSeleccionada = filtroPrioridad.value;
    const textoBusqueda = busqueda.value.trim().toLowerCase();

    return tareas.filter(tarea => {
        const coincideEstado =
            estadoSeleccionado === "todos" || tarea.estado === estadoSeleccionado;

        const coincidePrioridad =
            prioridadSeleccionada === "todas" || tarea.prioridad === prioridadSeleccionada;

        const coincideBusqueda =
            tarea.titulo.toLowerCase().includes(textoBusqueda) ||
            tarea.descripcion.toLowerCase().includes(textoBusqueda);

        return coincideEstado && coincidePrioridad && coincideBusqueda;
    });
}

function renderizarAplicacion() {
    const tareasFiltradas = obtenerTareasFiltradas();

    renderizarTablero(tareasFiltradas);
    actualizarEstadisticas();
}

function renderizarTablero(listaTareas) {
    columnaPorHacer.innerHTML = "";
    columnaEnCurso.innerHTML = "";
    columnaHecho.innerHTML = "";

    listaTareas.forEach(tarea => {
        const tarjeta = crearTarjetaTarea(tarea);

        if (tarea.estado === "porHacer") {
            columnaPorHacer.appendChild(tarjeta);
        } else if (tarea.estado === "enCurso") {
            columnaEnCurso.appendChild(tarjeta);
        } else if (tarea.estado === "hecho") {
            columnaHecho.appendChild(tarjeta);
        }
    });
}

function crearTarjetaTarea(tarea) {
    const tarjeta = document.createElement("article");
    tarjeta.className = `tarjeta prioridad-${tarea.prioridad}`;

    const fecha = tarea.fechaLimite ? tarea.fechaLimite : "Sin fecha";

    tarjeta.innerHTML = `
        <h4>${tarea.titulo}</h4>
        <p>${tarea.descripcion}</p>
        <p><strong>Prioridad:</strong> ${capitalizar(tarea.prioridad)}</p>
        <p><strong>Fecha límite:</strong> ${fecha}</p>

        <div class="acciones-tarea">
            <select onchange="cambiarEstado('${tarea.id}', this.value)">
                <option value="porHacer" ${tarea.estado === "porHacer" ? "selected" : ""}>Por hacer</option>
                <option value="enCurso" ${tarea.estado === "enCurso" ? "selected" : ""}>En curso</option>
                <option value="hecho" ${tarea.estado === "hecho" ? "selected" : ""}>Hecho</option>
            </select>

            <button type="button" class="boton-editar" onclick="editarTarea('${tarea.id}')">Editar</button>
            <button type="button" class="boton-eliminar" onclick="eliminarTarea('${tarea.id}')">Eliminar</button>
        </div>
    `;

    return tarjeta;
}

function actualizarEstadisticas() {
    const total = tareas.length;
    const totalPorHacer = tareas.filter(tarea => tarea.estado === "porHacer").length;
    const totalEnCurso = tareas.filter(tarea => tarea.estado === "enCurso").length;
    const totalHecho = tareas.filter(tarea => tarea.estado === "hecho").length;

    const porcentaje = total === 0 ? 0 : Math.round((totalHecho / total) * 100);

    document.getElementById("total-tareas").textContent = total;
    document.getElementById("total-por-hacer").textContent = totalPorHacer;
    document.getElementById("total-en-curso").textContent = totalEnCurso;
    document.getElementById("total-hecho").textContent = totalHecho;
    document.getElementById("porcentaje-hecho").textContent = `${porcentaje}%`;
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}