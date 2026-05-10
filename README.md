# Gestor Kanban de Tareas - DAW06

## Descripción

Esta aplicación web permite gestionar tareas mediante un tablero Kanban dividido en tres columnas: **Por hacer**, **En curso** y **Hecho**.

El proyecto ha sido desarrollado con **HTML5**, **CSS3** y **JavaScript**. Las tareas se guardan en el navegador mediante `localStorage`, por lo que se mantienen aunque se recargue la página.

## Funcionalidades

- Crear nuevas tareas.
- Editar tareas existentes.
- Eliminar tareas con confirmación.
- Cambiar el estado de una tarea.
- Mostrar las tareas en columnas Kanban.
- Filtrar tareas por estado.
- Filtrar tareas por prioridad.
- Buscar tareas por título o descripción.
- Mostrar estadísticas básicas.
- Guardar las tareas en `localStorage`.
- Diseño responsive para pantallas pequeñas.

## Guía rápida de uso

Para crear una tarea, se completa el formulario con el título, descripción, prioridad, fecha límite y estado. Después se pulsa el botón **Guardar tarea**.

Para modificar una tarea, se pulsa el botón **Editar**. Los datos se cargan en el formulario y el botón principal cambia a **Guardar cambios**.

Para eliminar una tarea, se pulsa el botón **Eliminar** y se confirma la acción.

Para cambiar una tarea de columna, se utiliza el selector de estado que aparece dentro de cada tarjeta.

Los filtros permiten mostrar tareas por estado o prioridad. El campo de búsqueda permite localizar tareas por título o descripción. El botón **Limpiar filtros** restablece los filtros y vuelve a mostrar todas las tareas.

## Estadísticas

La aplicación muestra:

- Número total de tareas.
- Número de tareas en estado Por hacer.
- Número de tareas en estado En curso.
- Número de tareas hechas.
- Porcentaje de tareas completadas.

## Estructura del proyecto

```text
kanban-tareas-daw06/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── estilos.css
├── js/
│   └── script.js
└── img/