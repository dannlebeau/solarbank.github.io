const { Pool } = require('pg');

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'bancosolar',
  password: '3022',
  port: 5432,
};
const pool = new Pool(config);

//Insertar Usuario
const insertarUsuario = async (datos) => {
  // nombre, balance
  const consulta = {
      text: 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
      values: [datos.nombre, datos.balance],
  };
  const result = await pool.query(consulta);
  console.log(result);
  return result;
};

//Consultar Usuario
const consultarUsuarios = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios');
    return result.rows;
  } finally {
    client.release();
  }
};

//Actualizar Usuario
//const actualizarUsuario = async (usuario) => {
//const actualizarUsuario = async (id, datos) => {
//  const client = await pool.connect();
//  try {
    //3 lineas nuevas
    // Validar que usuario.balance sea un número
    //const balance = parseFloat(usuario.balance);
//    if (isNaN(balance)) {
//      throw new Error('El valor de balance no es un número válido');
//    }
//    const result = await client.query('UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *', [usuario.nombre, usuario.balance, usuario.id]);
    //const result = await client.query('UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${id}', [usuario.nombre, usuario.balance, usuario.id]);
//    return result.rows[0];
//  } finally {
//    client.release();
//  }
//};

//Opcion 2
const actualizarUsuario = async (id, datos) => {
  //id
  //name, balance
  const consulta = {
      text: `UPDATE usuarios SET nombre = $1, balance =$2 WHERE id = '${id}'`,
      values: datos,
  }
  const result = await pool.query(consulta);
  return result;
};


//Eliminar Usuario
const eliminarUsuario = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM usuarios WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

const realizarTransferencia = async ({ emisor, receptor, monto }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2', [monto, emisor]);
    await client.query('UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2', [monto, receptor]);
    await client.query('INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [emisor, receptor, monto]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const consultarTransferencias = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM transferencias');
    return result.rows;
  } finally {
    client.release();
  }
};

module.exports = {
  consultarUsuarios,
  insertarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  realizarTransferencia,
  consultarTransferencias,
};
