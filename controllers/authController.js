// backend/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const generarToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registrarUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    console.log('Intentando registrar usuario...');
    console.log('Datos de registro:', { nombre, email, rol });
    try {
        // Prueba de conexión a la DB antes de la consulta real
        const client = await pool.connect(); // Intenta obtener un cliente de la pool
        console.log('Conexión a la base de datos exitosa para registro.');
        client.release(); // Libera el cliente de vuelta a la pool inmediatamente

        const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        console.log('Consulta de existencia ejecutada. Filas:', existe.rows.length);
        if (existe.rows.length > 0) return res.status(400).json({ mensaje: 'Ya existe el usuario' });

        const hashed = await bcrypt.hash(password, 10);
        const nuevo = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashed, rol || 'usuario']
        );
        const token = generarToken(nuevo.rows[0].id, nuevo.rows[0].rol);
        res.status(201).json({ token, usuario: nuevo.rows[0] });
    } catch (err) {
        // Este catch capturará errores de conexión a la DB también
        console.error('Error en registrarUsuario:', err.stack); // Usar err.stack para más detalles
        res.status(500).json({ mensaje: 'Error en el servidor al registrar usuario', error: err.message });
    }
};


export const loginUsuario = async (req, res) => {
    console.log('Intentando iniciar sesión...');
    const { email, password } = req.body;
    console.log('Email recibido para login:', email);
    try {
        // Prueba de conexión a la DB antes de la consulta real
        const client = await pool.connect(); // Intenta obtener un cliente de la pool
        console.log('Conexión a la base de datos exitosa para login.');
        client.release(); // Libera el cliente de vuelta a la pool inmediatamente

        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        console.log('Consulta de usuario para login ejecutada. Filas:', resultado.rows.length);
        if (resultado.rows.length === 0) {
            console.log('Usuario no encontrado para login:', email);
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = resultado.rows[0];
        console.log('Usuario encontrado, verificando contraseña...');
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            console.log('Contraseña incorrecta para:', email);
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = generarToken(usuario.id, usuario.rol);
        console.log('Login exitoso para:', email);
        res.status(200).json({ token, usuario });
    } catch (err) {
        console.error('Error CRÍTICO en loginUsuario:', err.stack); // ¡err.stack para ver la pila completa!
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: err.message });
    }
};