const express = require('express');
const bodyParser = require('body-parser');
const { consultarUsuarios, agregarUsuario, actualizarUsuario, eliminarUsuario, realizarTransferencia, consultarTransferencias } = require('./consultas');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/usuario', async (req, res) => {
  try {
    const nuevoUsuario = await agregarUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await consultarUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/usuario', async (req, res) => {
  try {
    const usuarioActualizado = await actualizarUsuario(req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/usuario', async (req, res) => {
  try {
    await eliminarUsuario(req.body.id);
    res.send('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/transferencia', async (req, res) => {
  try {
    await realizarTransferencia(req.body);
    res.send('Transferencia realizada correctamente');
  } catch (error) {
    console.error('Error al realizar transferencia:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/transferencias', async (req, res) => {
  try {
    const transferencias = await consultarTransferencias();
    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
