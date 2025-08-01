// backend/server.js
import 'dotenv/config'; // Para cargar las variables de entorno
import express from 'express'; // El framework Express
import cors from 'cors'; // Para permitir solicitudes desde el frontend

// Importar los routers de rutas
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productosRoutes.js';


// 2. INICIALIZAR LA APLICACIÓN DE EXPRESS
const app = express();

// 3. MIDDLEWARES GLOBALES 
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

// 4. RUTAS DE PRUEBA Y DE LA API

// RUTA DE PRUEBA GET a la raíz (/) - para verificar que el servidor está vivo
app.get('/', (req, res) => {
    console.log('Solicitud GET recibida en la raíz (/)');
    res.send('¡Hola desde tu servidor Express! (Ruta raíz)');
});


app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);


// 5. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
