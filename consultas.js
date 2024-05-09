const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bancosolar',
  password: '3022',
  port: 5432,
});

const consultarUsuarios = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM usuarios');
    return result.rows;
  } finally {
    client.release();
  }
};

const agregarUsuario = async (usuario) => {
  const client = await pool.connect();
  try {
    const result = await client.query('INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *', [usuario.nombre, usuario.balance]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const actualizarUsuario = async (usuario) => {
  const client = await pool.connect();
  try {
    //3 lineas nuevas
    // Validar que usuario.balance sea un número
    const balance = parseFloat(usuario.balance);
    if (isNaN(balance)) {
      throw new Error('El valor de balance no es un número válido');
    }

    const result = await client.query('UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *', [usuario.nombre, usuario.balance, usuario.id]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

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
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  realizarTransferencia,
  consultarTransferencias,
};
