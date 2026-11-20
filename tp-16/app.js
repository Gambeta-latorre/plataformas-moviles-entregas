// ============================================================
// CONFIGURACIÓN
// ============================================================

// Dirección base de la API. Todas las consultas parten de acá.
const API = "https://pokeapi.co/api/v2/pokemon";

// Cuántos pokémon se cargan al abrir la página (los 151 originales).
const CANTIDAD_INICIAL = 151;

// Cuántos pokémon más se cargan cada vez que se toca "Ver más pokémon".
const CANTIDAD_EXTRA = 30;

// "offset" indica desde qué pokémon empezar a pedir.
// Arranca en 0 y va sumando lo que ya cargamos (151, 181, 211...).
let offset = 0;

// Objeto donde guardamos los datos de cada pokémon ya descargado,
// usando el nombre como clave. Ej: pokemonCargados["pikachu"] = {...}
// Así, al abrir el modal, no hay que volver a pedirlo a la API.
const pokemonCargados = {};

// ============================================================
// ELEMENTOS DEL HTML
// ============================================================
// Buscamos en el HTML los elementos que vamos a modificar desde JS.

const grilla = document.getElementById("grilla");       // contenedor de las cartas
const spinner = document.getElementById("spinner");     // el "cargando..."
const btnMas = document.getElementById("btnMas");       // botón "Ver más pokémon"

// Creamos el modal de Bootstrap para poder abrirlo con modal.show()
const modal = new bootstrap.Modal(document.getElementById("modalPokemon"));
const modalTitulo = document.getElementById("modalTitulo"); // título del modal
const modalCuerpo = document.getElementById("modalCuerpo"); // contenido del modal

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

// Pone la primera letra en mayúscula y cambia los guiones por espacios.
// Ej: "mr-mime" -> "Mr mime"
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/-/g, " ");
}

// Devuelve la URL de la imagen del pokémon.
// Primero intenta con el dibujo oficial (más lindo); si no existe,
// usa el sprite chico; si tampoco hay, devuelve texto vacío.
function obtenerImagen(pokemon) {
    return pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default || "";
}

// Arma las "etiquetas" de colores con los tipos del pokémon.
// pokemon.types es una lista como: [{ type: { name: "fire" } }, ...]
// Por cada tipo creamos un <span> con la clase "tipo-fire", "tipo-water", etc.
// (los colores de cada clase están definidos en style.css)
function crearBadgesTipos(pokemon) {
    return pokemon.types
        .map(function (t) {
            return `<span class="badge tipo tipo-${t.type.name}">${t.type.name}</span>`;
        })
        .join(""); // unimos todos los <span> en un solo texto
}

// ============================================================
// CREAR UNA CARTA
// ============================================================
// Recibe los datos de un pokémon y devuelve un elemento HTML (la carta)
// listo para agregar a la grilla.
function crearCarta(pokemon) {
    // Cada carta va dentro de una columna de Bootstrap ("col")
    const col = document.createElement("div");
    col.className = "col";

    // Contenido de la carta: imagen, número, nombre, tipos y botón.
    // padStart(3, "0") convierte 1 en "001", 25 en "025", etc.
    col.innerHTML = `
        <div class="card card-pokemon h-100 text-center">
            <img src="${obtenerImagen(pokemon)}" class="card-img-top p-2" alt="${pokemon.name}" loading="lazy">
            <div class="card-body d-flex flex-column">
                <span class="numero">#${String(pokemon.id).padStart(3, "0")}</span>
                <h6 class="card-title">${capitalizar(pokemon.name)}</h6>
                <div class="mb-2">${crearBadgesTipos(pokemon)}</div>
                <button class="btn btn-outline-danger btn-sm mt-auto">Ver más</button>
            </div>
        </div>
    `;

    // Al botón "Ver más" de esta carta le decimos que, al hacer clic,
    // abra el modal con la información de este pokémon.
    col.querySelector("button").addEventListener("click", function () {
        mostrarDetalle(pokemon.name);
    });

    return col;
}

// ============================================================
// MOSTRAR INFORMACIÓN ADICIONAL (MODAL)
// ============================================================
// Busca el pokémon guardado, arma el contenido y abre el modal.
function mostrarDetalle(nombre) {
    // Tomamos los datos que ya habíamos descargado (no se vuelve a pedir a la API)
    const pokemon = pokemonCargados[nombre];

    // Lista de habilidades: un <li> por cada una.
    // Si la habilidad es oculta (is_hidden), le agregamos "(oculta)".
    const habilidades = pokemon.abilities
        .map(function (a) {
            return `<li>${capitalizar(a.ability.name)}${a.is_hidden ? " (oculta)" : ""}</li>`;
        })
        .join("");

    // Lista de movimientos: tomamos solo los primeros 4 con slice(0, 4).
    const movimientos = pokemon.moves
        .slice(0, 4)
        .map(function (m) {
            return `<li>${capitalizar(m.move.name)}</li>`;
        })
        .join("");

    // Título del modal: número y nombre
    modalTitulo.textContent = `#${String(pokemon.id).padStart(3, "0")} ${capitalizar(pokemon.name)}`;

    // Cuerpo del modal: foto, tipos, altura/peso, habilidades y movimientos.
    // La API da la altura en decímetros y el peso en hectogramos,
    // por eso dividimos por 10 para pasarlos a metros y kilos.
    modalCuerpo.innerHTML = `
        <div class="text-center">
            <img src="${obtenerImagen(pokemon)}" class="img-detalle" alt="${pokemon.name}">
            <div class="my-2">${crearBadgesTipos(pokemon)}</div>
            <p class="text-muted mb-3">
                Altura: ${pokemon.height / 10} m &nbsp;|&nbsp; Peso: ${pokemon.weight / 10} kg
            </p>
        </div>
        <div class="row">
            <div class="col-6">
                <h6>Habilidades</h6>
                <ul>${habilidades}</ul>
            </div>
            <div class="col-6">
                <h6>Movimientos</h6>
                <ul>${movimientos || "<li>Sin datos</li>"}</ul>
            </div>
        </div>
    `;

    // Abrimos el modal
    modal.show();
}

// ============================================================
// CARGAR POKÉMON DESDE LA API
// ============================================================
// "async" permite usar "await" adentro: esperar la respuesta
// de la API sin congelar la página.
async function cargarPokemon(cantidad) {
    // 1) Mostramos el spinner y desactivamos el botón para que
    //    no lo toquen mil veces mientras carga.
    spinner.classList.remove("d-none");
    btnMas.disabled = true;

    try {
        // 2) Pedimos la LISTA de pokémon.
        //    Ej: .../pokemon?limit=151&offset=0
        //    La respuesta trae { next, results: [{ name, url }, ...] }
        const respuesta = await fetch(`${API}?limit=${cantidad}&offset=${offset}`);
        const datos = await respuesta.json(); // convertimos la respuesta a objeto JS

        // 3) La lista solo trae nombre y URL, pero necesitamos imagen y tipos.
        //    Por eso pedimos el DETALLE de cada uno (su URL).
        //    Promise.all hace todos los pedidos a la vez y espera a que terminen.
        const detalles = await Promise.all(
            datos.results.map(function (p) {
                return fetch(p.url).then(function (r) { return r.json(); });
            })
        );

        // 4) Por cada pokémon: lo guardamos y agregamos su carta a la grilla.
        detalles.forEach(function (pokemon) {
            pokemonCargados[pokemon.name] = pokemon;
            grilla.appendChild(crearCarta(pokemon));
        });

        // 5) Actualizamos el offset para que la próxima carga
        //    siga desde donde quedamos.
        offset += cantidad;

        // 6) Si la API dice que no hay más (next es null), ocultamos el botón.
        if (!datos.next) {
            btnMas.classList.add("d-none");
        }
    } catch (error) {
        // Si algo falla (sin internet, API caída...), mostramos un aviso.
        console.error(error);
        grilla.insertAdjacentHTML(
            "beforeend",
            `<div class="col-12"><div class="alert alert-danger">No se pudieron cargar los pokémon. Intentá de nuevo.</div></div>`
        );
    } finally {
        // "finally" se ejecuta siempre, haya salido bien o mal:
        // ocultamos el spinner y reactivamos el botón.
        spinner.classList.add("d-none");
        btnMas.disabled = false;
    }
}

// ============================================================
// INICIO
// ============================================================

// Al tocar "Ver más pokémon", cargamos 30 más.
btnMas.addEventListener("click", function () {
    cargarPokemon(CANTIDAD_EXTRA);
});

// Al abrir la página, cargamos los primeros 151.
cargarPokemon(CANTIDAD_INICIAL);
