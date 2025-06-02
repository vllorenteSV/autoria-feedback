const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta raíz con mensaje simple
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  // O si quieres solo JSON:
  // res.json({ mensaje: 'API funcionando correctamente' });
});

const DATA_FILE = path.join(__dirname, 'valoraciones.json');

function leerDatos() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function guardarDatos(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Obtener todas las valoraciones
app.get('/valoraciones', (req, res) => {
  const valoraciones = leerDatos();
  res.json(valoraciones);
});

// Crear una valoración nueva
app.post('/valoraciones', (req, res) => {
  const { usuario, comentario, puntuacion } = req.body;
  if (!usuario || !comentario || !puntuacion) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const valoraciones = leerDatos();
  const nuevaValoracion = { id: uuidv4(), usuario, comentario, puntuacion };
  valoraciones.push(nuevaValoracion);
  guardarDatos(valoraciones);
  res.status(201).json(nuevaValoracion);
});

// Editar valoración por id
app.put('/valoraciones/:id', (req, res) => {
  const { id } = req.params;
  const { usuario, comentario, puntuacion } = req.body;
  if (!usuario || !comentario || !puntuacion) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const valoraciones = leerDatos();
  const index = valoraciones.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Valoración no encontrada' });
  }
  valoraciones[index] = { id, usuario, comentario, puntuacion };
  guardarDatos(valoraciones);
  res.json(valoraciones[index]);
});

// Eliminar valoración por id
app.delete('/valoraciones/:id', (req, res) => {
  const { id } = req.params;
  let valoraciones = leerDatos();
  const nuevaLista = valoraciones.filter(v => v.id !== id);
  if (nuevaLista.length === valoraciones.length) {
    return res.status(404).json({ error: 'Valoración no encontrada' });
  }
  guardarDatos(nuevaLista);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
