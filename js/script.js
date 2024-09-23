// Obtener elementos del DOM
const inputBuscar = document.getElementById('inputBuscar')
const botonBuscar = document.getElementById('btnBuscar')
const contenedorListaPeliculas = document.getElementById('lista')

// Inicializar lista de películas filtradas
let listaPeliculasFiltradas = []

// Activar o desactivar el botón de búsqueda basado en el input
inputBuscar.addEventListener('input', () => {
  botonBuscar.disabled = inputBuscar.value.trim() === ''
})

// Función principal para cargar datos y agregar eventos
document.addEventListener('DOMContentLoaded', init)

function init() {
  cargarPeliculas()
}

// Cargar películas desde la API
function cargarPeliculas() {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then((res) => res.json())
    .then((movies) => {
      botonBuscar.addEventListener('click', () => buscarPeliculas(movies))
    })
    .catch((e) => console.error('Error al cargar películas:', e))
}

// Buscar películas basadas en el texto ingresado
function buscarPeliculas(movies) {
  const textoBuscado = inputBuscar.value.trim().toLowerCase()
  listaPeliculasFiltradas = movies.filter((pelicula) => filtrarPeliculas(pelicula, textoBuscado))
  mostrarPeliculas(listaPeliculasFiltradas)
  inputBuscar.value = ''
}

// Filtrar películas según el texto buscado
function filtrarPeliculas(pelicula, textoBuscado) {
  return (
    pelicula.title.toLowerCase().includes(textoBuscado) ||
    pelicula.genres.some((genero) => genero.name.toLowerCase().includes(textoBuscado)) ||
    pelicula.tagline.toLowerCase().includes(textoBuscado) ||
    pelicula.overview.toLowerCase().includes(textoBuscado)
  )
}

// Mostrar las películas filtradas en el contenedor
function mostrarPeliculas(listaPeliculas) {
  contenedorListaPeliculas.innerHTML = ''

  listaPeliculas.forEach((pelicula) => {
    const itemLista = crearElementoLista(pelicula)
    contenedorListaPeliculas.appendChild(itemLista)
  })
}

// Crear el botón de película
function crearElementoLista(pelicula) {
  const itemLista = document.createElement('button')
  itemLista.className = 'list-group-item list-group-item-action flex-column align-items-start bg-dark'
  itemLista.addEventListener('mouseenter', () => itemLista.classList.add('active'))
  itemLista.addEventListener('mouseleave', () => itemLista.classList.remove('active'))

  itemLista.innerHTML = `
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 text-light">${pelicula.title}</h5>
      <div>${generarEstrellas(pelicula.vote_average)}</div>
    </div>
    <p class="mb-1 text-muted fst-italic">${pelicula.tagline}</p>
  `

  // Evento click para mostrar el offcanvas
  itemLista.addEventListener('click', () => mostrarDetalles(pelicula))

  return itemLista
}

// Generar estrellas basadas en la calificación
function generarEstrellas(vote_average) {
  const estrellasRating = Math.round(vote_average / 2)
  let estrellas = ''

  for (let i = 1; i <= 5; i++) {
    estrellas += `<span class="fa fa-star ${ i <= estrellasRating ? 'checked' : 'text-light' }"></span>`
  }

  return estrellas
}

// Mostrar detalles de la película en el offcanvas
function mostrarDetalles(pelicula) {
  document.getElementById('offcanvasTopLabel').textContent = pelicula.title
  document.getElementById('offcanvas-overview').textContent = pelicula.overview
  document.getElementById('offcanvas-genres').textContent = pelicula.genres.map((genero) => genero.name).join(' - ')
  document.getElementById('dropdown-year').textContent = pelicula.release_date.split('-')[0]
  document.getElementById('dropdown-runtime').textContent = `${pelicula.runtime} mins`
  document.getElementById('dropdown-budget').textContent = `$${pelicula.budget}`
  document.getElementById('dropdown-revenue').textContent = `$${pelicula.revenue}`

  const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'))
  offcanvas.show()
}