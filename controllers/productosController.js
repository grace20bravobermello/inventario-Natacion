// backend/controllers/productosController.js
import pool from '../config/db.js'; 

// Crear producto
export const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, preciounitario, stock } = req.body;
        
        const formattedPreciounitario = String(preciounitario).replace(',', '.');

        const result = await pool.query(
            'INSERT INTO productos (nombre, descripcion, preciounitario, stock) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, descripcion, formattedPreciounitario, stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error al crear el producto' });
    }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, preciounitario, stock } = req.body;
        const formattedPreciounitario = String(preciounitario).replace(',', '.');

        const result = await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, preciounitario = $3, stock = $4 WHERE id = $5 RETURNING *',
            [nombre, descripcion, formattedPreciounitario, stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};
