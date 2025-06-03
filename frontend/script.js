console.log('script de js para hacer la lógica de las valoraciones');
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("listaValoraciones");
  const form = document.getElementById("formValoracion");
  const idInput = document.getElementById("valoracionId");

  // Cargar valoraciones al iniciar 
  cargarValoraciones();

  // Con esto envio el formulario 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const valoracion = {
      usuario: form.usuario.value.trim(),
      comentario: form.comentario.value.trim(),
      puntuacion: parseInt(form.puntuacion.value),
    };

    const id = idInput.value;

    try {
      if (id) {
        // Editar valoración
        await fetch(`http://localhost:3000/valoraciones/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(valoracion),
        });
      } else {
        // Añadir nueva valoración
        await fetch("http://localhost:3000/valoraciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(valoracion),
        });
      }

      form.reset();
      idInput.value = "";//Lo inicializamos con valor vacio
      cargarValoraciones();
    } catch (error) {
      alert("Valoracion no guardadad correctamente");
      console.error(error);
    }
  });

  //Con esta funcion cargamos y mostramos las valoraciones
  async function cargarValoraciones() {
    lista.innerHTML = "";//inicializamos con una lista valores vacia por si acaso ya habia algun otro elemento q pueda dar error

    try {
      const res = await fetch("http://localhost:3000/valoraciones");
      const valoraciones = await res.json();

      valoraciones.forEach((v) => {
        const li = document.createElement("li");
        li.classList.add("valoracion");

        li.innerHTML = `
          <h3>${v.usuario}</h3>
          <p class="comentario">"${v.comentario}"</p>
          <p class="puntuacion">${"⭐".repeat(v.puntuacion)}</p>
          <div class="acciones">
            <button class="editar">Editar</button>
            <button class="borrar">Borrar</button>
          </div>
        `;

        // Editamos las valoraciones al hacer click en el boton editar
        li.querySelector(".editar").addEventListener("click", () => {
          form.usuario.value = v.usuario;
          form.comentario.value = v.comentario;
          form.puntuacion.value = v.puntuacion;
          idInput.value = v.id;
        });

        // Borramos las valoraciones al hacer clic en el boton borrar
        li.querySelector(".borrar").addEventListener("click", async () => {
            //pregunta para confirmar
          if (confirm("¿Seguro de borrarla?")) {
            try {
              await fetch(`http://localhost:3000/valoraciones/${v.id}`, { method: "DELETE" });
              cargarValoraciones();
            } catch (error) {
              alert("Error,valoracion no eliminada");
              console.error(error);
            }
          }
        });

        lista.appendChild(li);
      });
    } catch (error) {
      alert("Error al cargar valoraciones.");
      console.error(error);
    }
  }
});
