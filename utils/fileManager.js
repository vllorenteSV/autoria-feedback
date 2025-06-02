const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../valoraciones.json');

function leerDatos() {
  const raw = fs.readFileSync(DATA_PATH);
  return JSON.parse(raw);
}

function guardarDatos(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = { leerDatos, guardarDatos };