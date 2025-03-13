$(document).ready(function() {
  const $flipbook = $("#flipbook");

  // Inicializar flipbook
  if ($flipbook.length) {
    $flipbook.turn({
      width: 720,
      height: 600,
      autoCenter: true,
      duration: 1000,
      display: "double",
      page: 1  // Iniciar mostrando la página 2 (spread 2-3)
    });

    // Navegación
    $("#prevPage").click(() => $flipbook.turn("previous"));
    $("#nextPage").click(() => $flipbook.turn("next"));

    // Teclado
    $(document).keydown((e) => {
      if (e.key === "ArrowLeft") $flipbook.turn("previous");
      if (e.key === "ArrowRight") $flipbook.turn("next");
    });
  }

  // Función para animar el texto de una página
  function animarTexto(paginaSelector) {
    const $parrafo = $(paginaSelector + " p");
    if (!$parrafo.length) return;

    // Si ya se animó, no hacer nada
    if ($parrafo.attr("data-animado") === "true") return;

    // Guardar el HTML original si no se ha guardado
    if (!$parrafo.attr("data-original")) {
      $parrafo.attr("data-original", $parrafo.html());
    }

    const htmlOriginal = $parrafo.attr("data-original");

    // Separar el texto por saltos de línea, preservando <br>
    const partes = htmlOriginal.split(/(<br\s*\/?>)/i);
    let contenidoFinal = "";
    let delayIndex = 0; // Contador global para el delay

    partes.forEach((parte) => {
      if (parte.match(/<br\s*\/?>/i)) {
        // Insertar <br> con margen (se aplican estilos vía CSS)
        contenidoFinal += "<br>";
      } else {
        // Dividir la parte por espacios para preservar palabras
        const palabras = parte.split(/(\s+)/);
        palabras.forEach((palabra) => {
          if (palabra.trim() === "") {
            contenidoFinal += palabra; // Espacio
          } else {
            // Envolver cada palabra en span con animación
            contenidoFinal += `<span class="animar-palabra" style="animation-delay: ${delayIndex * 0.15}s">${palabra}</span>`;
            delayIndex++;
          }
        });
      }
    });

    $parrafo.html(contenidoFinal);
    // Marcar como animado para no reanimarlo en futuras visitas
    $parrafo.attr("data-animado", "true");
  }

  // Función para reiniciar la animación en un párrafo (quitar la marca)
  function reiniciarAnimacion(paginaSelector) {
    const $parrafo = $(paginaSelector + " p");
    if (!$parrafo.length) return;
    $parrafo.removeAttr("data-animado");
    $parrafo.html($parrafo.attr("data-original"));
    // Opcional: Puedes reiniciar la animación llamando a animarTexto nuevamente
    animarTexto(paginaSelector);
  }

  // Control de páginas: en modo "double" se muestran dos páginas
  // Suponiendo que páginas 2 y 3 están juntas, y luego 4 y 5, etc.
  $flipbook.bind("turned", function(event, page, view) {
    // view es un array con las páginas visibles (por ejemplo, [2,3])
    view.forEach(function(pagina) {
      // Si la página tiene texto (definida en nuestras clases), animamos
      if (pagina === 2) animarTexto(".pagina-2");
      if (pagina === 3) animarTexto(".pagina-3");
      if (pagina === 4) animarTexto(".pagina-4");
      if (pagina === 5) animarTexto(".pagina-5");
      // Agregar más según la numeración
    });
  });

  // Animación inicial para la vista actual (página 2 y 3)
  animarTexto(".pagina-2");
  animarTexto(".pagina-3");

  // Botón de reinicio: Al hacer clic, reinicia la animación de las páginas activas.
  $("#resetAnimaciones").click(function() {
    // Aquí reiniciamos las páginas 2 y 3 (ajusta según la vista actual)
    reiniciarAnimacion(".pagina-2");
    reiniciarAnimacion(".pagina-3");
  });
  function animarTexto(paginaSelector) {
    const $parrafo = $(paginaSelector + " p");
    if (!$parrafo.length) return;
    
    // Si ya se animó, no se vuelve a animar
    if ($parrafo.data("animado") === true) return;
    
    // Guardar el HTML original si no se ha guardado
    if (!$parrafo.attr("data-original")) {
      $parrafo.attr("data-original", $parrafo.html());
    }
    
    const htmlOriginal = $parrafo.attr("data-original");
    // Separar el texto por saltos de línea y espacios
    const partes = htmlOriginal.split(/(<br>| )/);
    let nuevoHTML = "";
    let delayIndex = 0; // Contador para el delay acumulado
    
    partes.forEach((parte) => {
      if (parte === "<br>") {
        nuevoHTML += "<br>"; // Se respeta el salto de línea
      } else if (parte.trim() === "") {
        nuevoHTML += " "; // Mantener los espacios
      } else {
        // Envolver cada palabra en un span con retraso progresivo
        nuevoHTML += `<span style="opacity: 0; display: inline-block; animation: fadeIn 0.5s forwards; animation-delay: ${delayIndex * 0.15}s">${parte}</span> `;
        delayIndex++;
      }
    });
    
    $parrafo.html(nuevoHTML);
    // Marcar como ya animado para evitar reanimación
    $parrafo.data("animado", true);
  }
  
});
