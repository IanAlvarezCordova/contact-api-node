const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración personalizada de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.startsWith('http://localhost:') || origin === `http://192.168.100.25:${req.socket.localPort}`) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Simulación de base de datos en memoria
let contacts = [
  { id: 1, nombre: 'Ian', empresa: 'Espe', numero: '0967407250', foto: 'https://picsum.photos/200/200' }, // URL de prueba válida
  { id: 2, nombre: 'Juan', empresa: 'X Corp', numero: '123456789', foto: 'https://via.placeholder.com/150' }
];
let nextId = 3;

// Endpoints

// GET /api/contactos - Listar todos los contactos
app.get('/api/contactos', (req, res) => {
  res.json(contacts);
});

// GET /api/contactos/search?query=texto - Buscar contactos por nombre
app.get('/api/contactos/search', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const filteredContacts = contacts.filter(contact => 
    contact.nombre.toLowerCase().includes(query)
  );
  res.json(filteredContacts);
});

// POST /api/contactos - Crear un nuevo contacto
app.post('/api/contactos', (req, res) => {
  const { nombre, empresa, numero, foto } = req.body;
  const newContact = { id: nextId++, nombre, empresa, numero, foto };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PUT /api/contactos/:id - Actualizar un contacto
app.put('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, empresa, numero, foto } = req.body;
  const contactIndex = contacts.findIndex(c => c.id === id);
  if (contactIndex === -1) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  contacts[contactIndex] = { id, nombre, empresa, numero, foto };
  res.json(contacts[contactIndex]);
});

// DELETE /api/contactos/:id - Eliminar un contacto
app.delete('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = contacts.length;
  contacts = contacts.filter(c => c.id !== id);
  if (contacts.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Contacto no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});