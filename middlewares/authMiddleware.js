// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken'; // Necesitas jsonwebtoken para verificar los tokens

export const verificarToken = (req, res, next) => {
    // 1. Obtener el token del encabezado de la solicitud
   
    const authHeader = req.headers['authorization'];
    
    // Si no hay encabezado de autorización, no hay token
    if (!authHeader) {
        return res.status(403).json({ msg: 'Acceso denegado: No se proporcionó token' });
    }


    const token = authHeader.split(' ')[1];

    // Si después de dividir, no hay un token, es un error
    if (!token) {
        return res.status(403).json({ msg: 'Acceso denegado: Formato de token inválido' });
    }

    try {
        // 2. Verificar el token
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Si el token es válido, adjuntamos la información decodificada (por ejemplo, el ID del usuario)
        // al objeto 'request' para que las rutas subsiguientes puedan acceder a ella.
        req.usuario = verified; 
        
        // 3. Continuar a la siguiente función de middleware o a la función de la ruta
        next(); 

    } catch (err) {
        // 4. Manejar errores de verificación del token
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Acceso denegado: Token expirado' });
        }
        // Para cualquier otro error (token inválido, malformado, etc.)
        return res.status(401).json({ msg: 'Acceso denegado: Token inválido' });
    }
};
