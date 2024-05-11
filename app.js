const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const { consultarUsuarios, insertarUsuario, actualizarUsuario, eliminarUsuario, realizarTransferencia, consultarTransferencias } = require('./consultas');
//app.use(bodyParser.json());

// Middlewares to parse POST request data
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post("/usuario", async (req, res) => {
  try {
      const datos = req.body;
      const respuesta = await insertarUsuario(datos);
      res.send(respuesta);
  }
  catch {
      res.status(500).send("Algo salió mal")
  }
});
//consultar usuario
app.get('/usuarios', async (req, res) => {
  try {
    //const usuarios = await consultarUsuarios();
    const respuesta = await consultarUsuarios();
    res.json(respuesta);
    //linea agregada
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});
//actualizar usuario
app.put('/usuario', async (req, res) => {
  try {
    //const usuarioActualizado = await actualizarUsuario(req.body);
    //res.json(usuarioActualizado);
    //3 lineas agragadas
    const { id } = req.query;
        const datos = Object.values(req.body);
        const respuesta = await actualizarUsuario(id, datos);
        res.json(respuesta);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});
//eliminar usuario
app.delete('/usuario', async (req, res) => {
  try {
    //await eliminarUsuario(req.body.id);
    //res.send('Usuario eliminado correctamente');
    //se agrego 3 lineas
        const { id } = req.query;
        const respuesta = await eliminarUsuario(id);
        res.json(respuesta);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/transferencia', async (req, res) => {
  try {
    //await realizarTransferencia(req.body);
    //res.send('Transferencia realizada correctamente');
    //se agrega 3 lineas
        const datos = req.body;
        const respuesta = await realizarTransferencia(datos);
        res.json(respuesta);
  } catch (error) {
    console.error('Error al realizar transferencia:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/transferencias', async (req, res) => {
  try {
    const respuesta = await consultarTransferencias();
    res.json(respuesta);
    //const respuesta = await consultarTransferencias();
    //res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
