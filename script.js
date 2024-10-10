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
    rangoVisibilidad: 150, // Rango de visión
    inventario: [] // Inventario del personaje
};

// Inicializa datos del enemigo
const enemigo = {
    nombre: 'Enemigo',
    salud: 50,
    img: new Image(),
    x: 400,
    y: 300,
};

// Inicializa datos de la poción
const pocion = {
    img: new Image(),
    x: Math.random() * mapaWidth, // Posición aleatoria en el mapa
    y: Math.random() * mapaHeight,
    width: 30,
    height: 30
};

// Carga las imágenes
personaje.img.src = './recursos/personaje_guerrero1.png';;
enemigo.img.src = './recursos/personaje_ogro.png';
pocion.img.src = './recursos/item_corazon.png';

// Mapa para registrar áreas visitadas
const mapaVisitado = [];

// Muestra información del personaje
function mostrarInfo() {
    document.getElementById('nombre').innerText = `Nombre: ${personaje.nombre}`;
    document.getElementById('clase').innerText = `Clase: ${personaje.clase}`;
    document.getElementById('salud').innerText = `Salud: ${personaje.salud}`;
    
    const inventarioDiv = document.getElementById('inventario');
    inventarioDiv.innerHTML = 'Inventario: ';
    
    personaje.inventario.forEach((item, index) => {
        const potionButton = document.createElement('button');
        potionButton.innerText = item;
        potionButton.onclick = usarPocion; // Asocia la función al botón
        inventarioDiv.appendChild(potionButton);
    });
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
    ctx.fillStyle = 'rgba(200, 255, 200, 0.5)'; // Color de las áreas visitadas
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

    // Dibuja la poción si está visible
    ctx.drawImage(pocion.img, pocion.x, pocion.y, pocion.width, pocion.height);
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
/**
 * 
 * @param {*} objeto 
 * @returns 
 */
function estaEnAreaVisible(objeto) {
    return (
        objeto.x + 50 > personaje.x - personaje.rangoVisibilidad &&
        objeto.x < personaje.x + personaje.rangoVisibilidad &&
        objeto.y + 50 > personaje.y - personaje.rangoVisibilidad &&
        objeto.y < personaje.y + personaje.rangoVisibilidad
    );
}

// Función para comprobar si el personaje recoge la poción
function recogerPocion() {
    if (
        personaje.x < pocion.x + pocion.width &&
        personaje.x + 50 > pocion.x &&
        personaje.y < pocion.y + pocion.height &&
        personaje.y + 50 > pocion.y
    ) {
        personaje.inventario.push('Poción'); // Agrega la poción al inventario
        // Reubica la poción en una nueva posición aleatoria
        pocion.x = Math.random() * (mapaWidth - pocion.width);
        pocion.y = Math.random() * (mapaHeight - pocion.height);
        mostrarInfo(); // Actualiza la información del inventario
    }
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
    recogerPocion(); // Verifica si recoge la poción después de moverse
    dibujar();
});

// Espera a que las imágenes se carguen antes de dibujar
let imagenesCargadas = 0;

personaje.img.onload = () => {
    imagenesCargadas++;
    if (imagenesCargadas === 3) iniciarJuego(); // Inicia el juego cuando todas las imágenes estén listas
};

enemigo.img.onload = () => {
    imagenesCargadas++;
    if (imagenesCargadas === 3) iniciarJuego();
};

pocion.img.onload = () => {
    imagenesCargadas++;
    if (imagenesCargadas === 3) iniciarJuego();
};
function usarPocion() {
    if (personaje.inventario.includes('Poción')) {
        personaje.salud += 20; // Aumenta la salud en 20
        personaje.inventario.splice(personaje.inventario.indexOf('Poción'), 1); // Elimina una poción del inventario
        mostrarInfo(); // Actualiza la información en pantalla
    }
}

document.getElementById('confirmarNombreBtn').addEventListener('click', () => {
    const nombreUsuario = document.getElementById('nombreInput').value;
    if (nombreUsuario) {
        personaje.nombre = nombreUsuario; // Asigna el nombre ingresado
        document.getElementById('nombreForm').style.display = 'none'; // Oculta el formulario
        document.getElementById('container').style.display = 'flex'; // Muestra el juego
        mostrarInfo(); // Muestra la información del personaje
        dibujar(); // Inicia el juego
    } else {
        alert("Por favor, ingresa un nombre."); // Mensaje de error si el nombre está vacío
    }
});
