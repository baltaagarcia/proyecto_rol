// Obtén el canvas y el contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensiones del mapa
const mapaWidth = 1600; // Ancho total del mapa
const mapaHeight = 1200; // Alto total del mapa

// Inicializa datos del personaje
const personaje = {
    nombre: 'Heroe',
    clase: 'Guerrero',
    salud: 100,
    img: new Image(),
    x: 100,
    y: 100,
    velocidad: 5,
    rangoVisibilidad: 150 // Rango de visión
};

// Inicializa datos del enemigo
const enemigo = {
    nombre: 'Enemigo',
    salud: 50,
    img: new Image(),
    x: 400,
    y: 300,
};

// Carga las imágenes
personaje.img.src = './recursos/personaje_guerrero1.png';
enemigo.img.src = './recursos/personaje_ogro.png';

// Mapa para registrar áreas visitadas
const mapaVisitado = [];

// Muestra información del personaje
function mostrarInfo() {
    document.getElementById('nombre').innerText = `Nombre: ${personaje.nombre}`;
    document.getElementById('clase').innerText = `Clase: ${personaje.clase}`;
    document.getElementById('salud').innerText = `Salud: ${personaje.salud}`;
}

// Lógica de ataque (solo un ejemplo simple)
document.getElementById('atacarBtn').addEventListener('click', () => {
    alert(`${personaje.nombre} ataca!`);
});

// Inicializa el juego
function iniciarJuego() {
    mostrarInfo();
    dibujar();
}

// Función para dibujar en el canvas
function dibujar() {
    // Dibuja el mapa (puedes personalizar el fondo del mapa aquí)
    ctx.fillStyle = 'lightgreen'; // Color de fondo del mapa
    ctx.fillRect(0, 0, mapaWidth, mapaHeight); // Dibuja el mapa

    // Dibuja las áreas visitadas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Color de las áreas visitadas
    for (let area of mapaVisitado) {
        ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    // Crea una "máscara" que cubre el canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Nube de guerra
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Cubre todo el canvas

    // Crea un área visible en forma de círculo
    ctx.clearRect(personaje.x - personaje.rangoVisibilidad, personaje.y - personaje.rangoVisibilidad, personaje.rangoVisibilidad * 2, personaje.rangoVisibilidad * 2); // Desbloquea el área de visión

    // Agrega el área desbloqueada al mapaVisitado
    agregarAreaVisitada();

    // Dibuja el personaje
    ctx.drawImage(personaje.img, personaje.x, personaje.y, 50, 50);
    
    // Dibuja el enemigo solo si está en el área visible
    if (estaEnAreaVisible(enemigo)) {
        ctx.drawImage(enemigo.img, enemigo.x, enemigo.y, 50, 50);
    }
}

// Función para agregar área visitada
function agregarAreaVisitada() {
    const xInicio = Math.floor(personaje.x - personaje.rangoVisibilidad);
    const yInicio = Math.floor(personaje.y - personaje.rangoVisibilidad);
    const area = {
        x: xInicio,
        y: yInicio,
        width: personaje.rangoVisibilidad * 2,
        height: personaje.rangoVisibilidad * 2
    };

    // Agrega el área solo si no existe ya
    const existe = mapaVisitado.some(a => 
        a.x === area.x && a.y === area.y && a.width === area.width && a.height === area.height
    );

    if (!existe) {
        mapaVisitado.push(area);
    }
}

// Función para comprobar si un objeto está en el área visible
function estaEnAreaVisible(objeto) {
    return (
        objeto.x + 50 > personaje.x - personaje.rangoVisibilidad &&
        objeto.x < personaje.x + personaje.rangoVisibilidad &&
        objeto.y + 50 > personaje.y - personaje.rangoVisibilidad &&
        objeto.y < personaje.y + personaje.rangoVisibilidad
    );
}

// Manejo de eventos de teclado
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            personaje.y -= personaje.velocidad;
            break;
        case 'ArrowDown':
            personaje.y += personaje.velocidad;
            break;
        case 'ArrowLeft':
            personaje.x -= personaje.velocidad;
            break;
        case 'ArrowRight':
            personaje.x += personaje.velocidad;
            break;
    }
    dibujar();
});

// Espera a que las imágenes se carguen antes de dibujar
let imagenesCargadas = 0;

personaje.img.onload = () => {
    imagenesCargadas++;
    if (imagenesCargadas === 2) iniciarJuego(); // Inicia el juego cuando ambas imágenes estén listas
};

enemigo.img.onload = () => {
    imagenesCargadas++;
    if (imagenesCargadas === 2) iniciarJuego();
};
