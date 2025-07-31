// backend/routes/productosRoutes.js
import express from 'express';
const router = express.Router();
import { verificarToken } from '../middlewares/authMiddleware.js'; // Asegúrate de la ruta correcta

// Importamos las funciones del controlador de productos (la versión que usa pool)
import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
}
 from '../controllers/productosController.js';

// Definir las rutas
router.post('/', verificarToken, crearProducto);
router.get('/', verificarToken, obtenerProductos);
router.get('/:id', verificarToken, obtenerProductoPorId);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

export default router;