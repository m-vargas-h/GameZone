# GameZone - Tienda de Videojuegos

Sitio web responsivo desarrollado en HTML5, CSS3, Bootstrap 5 y JavaScript.

## Descripción

GameZone es una tienda de videojuegos en línea que presenta productos destacados, categorías disponibles y un formulario de contacto. El sitio implementa manipulación del DOM, eventos y consumo de API externa mediante JavaScript vanilla.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, Flexbox, media queries)
- Bootstrap 5.3.3 (navbar, carousel, grid system, cards, utilidades Flexbox)
- JavaScript ES6 (manipulación del DOM, eventos, Fetch API)
- GameBrain API (carga dinámica de juegos)
- GitHub Pages (despliegue)

## Características

- Navbar responsiva con colapso en móvil (botón hamburguesa)
- Carrusel de 5 imágenes con transición automática cada 3 segundos
- Grid de productos con 10 títulos organizados en cards Bootstrap
- Columna lateral con categorías disponibles
- Sección "Descubre más juegos" generada dinámicamente con Fetch API
- Eventos mouseover y click en cards de productos
- Página de contacto dedicada con formulario validado por JavaScript
- Variables CSS para paleta de colores coherente
- Accesibilidad básica con `:focus-visible` en links y botones

## Vista previa

### Escritorio
![Vista escritorio](screenshots/vista_pc.png)

### Tablet
![Vista tablet](screenshots/vista_tablet.png)

### Móvil
![Vista móvil](screenshots/vista_movil.png)

## Estructura del proyecto
```
├── css
│   └── styles.css
├── img
│   ├── baldurs-gate-3.jpg
│   ├── banner-baldurs-gate-3.jpg
│   ├── banner-black-myth-wukong.jpg
│   ├── banner-cities-skylines-2.jpg
│   ├── banner-ea-fc-25.jpg
│   ├── banner-nba-2k25.jpg
│   ├── black-myth-wukong.jpg
│   ├── cities-skylines-2.jpg
│   ├── cyberpunk-2077.jpg
│   ├── ea-fc-25.jpg
│   ├── elden-ring.jpg
│   ├── nba-2k25.jpg
│   ├── spider-man2.jpg
│   ├── the-sims-4.jpg
│   └── zelda-totk.jpg
├── js
│   ├── contacto.js
│   └── script.js
├── screenshots
│   ├── validacion.png
│   ├── vista_movil.jpg
│   ├── vista_movil.png
│   ├── vista_pc.png
│   └── vista_tablet.png
├── .gitattributes
├── README.md
├── contacto.html
└── index.html
```

## Validación

El documento HTML fue validado mediante [W3C Markup Validation Service](https://validator.w3.org/).

![Resultado de validación W3C](screenshots/validacion.png)

### Decisiones de marcado

Los títulos del carrusel y las cards usan `<h3 class="h5">` en lugar de `<h5>` directamente.
El nivel semántico `<h3>` mantiene la jerarquía correcta dentro del documento (h1 → h2 → h3),
mientras que la clase utilitaria `h5` de Bootstrap preserva el tamaño visual original.
Esta combinación evita saltos de nivel detectados por el validador sin alterar el diseño.