# Imaginary Scents — sitio web

Catálogo de decants (nicho, diseñador y árabes) con buscador, filtro por
colección, quiz de perfil olfativo y pedido directo por WhatsApp.

## Estructura

- `index.html` — toda la página (estructura, estilos y funcionalidad).
- `data.js` — las 65 fragancias: nombre, descripción, precios y perfil.
  **Este es el único archivo que se edita para el día a día.**
- `img/` — 66 fotos en formato `.webp` con fondo transparente.

No hay backend ni build: es un sitio estático puro, se despliega tal cual.

## Cómo editar un precio

1. Abre `data.js` en GitHub (ícono de lápiz, arriba a la derecha del archivo).
2. Busca la fragancia y cambia el número, ej. `p:{3:50, 5:85, 10:120}`.
3. Comité el cambio ("Commit changes"). Netlify publica la versión nueva
   automáticamente en 1-2 minutos, sin que tengas que hacer nada más.

## Cómo ocultar una fragancia sin stock

Agrega `off:true,` justo después de su `id` en `data.js`.

## WhatsApp

El número está en la línea 10 de `data.js`: `const WHATSAPP = "51946078711";`
