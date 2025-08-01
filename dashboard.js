
const API_URL = 'http://localhost:3000/api';

// 1. Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Si no hay token, redirigir al login
        alert('No autorizado. Por favor, inicia sesión.');
        window.location.href = 'index.html'; 
    } else {
        // Si hay token, cargar los productos
        cargarProductos();
    }
});

// 2. Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('usuario'); // Eliminar cualquier otro dato del usuario
    alert('Sesión cerrada correctamente.');
    window.location.href = 'index.html'; // Redirigir al login
}

// Hacer la función globalmente accesible desde el HTML
window.cerrarSesion = cerrarSesion;


// 3. Función para cargar y mostrar los productos
async function cargarProductos() {
    const tablaProductos = document.getElementById('tablaProductos');
    tablaProductos.innerHTML = ''; // Limpiar la tabla antes de cargar

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de autenticación. Inicia sesión.');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token en la cabecera
            }
        });

        if (!response.ok) {
            // Manejar errores de respuesta HTTP (ej: 401 Unauthorized, 404 Not Found, 500 Internal Server Error)
            const errorData = await response.json();
            throw new Error(errorData.mensaje || `Error al cargar productos: ${response.statusText}`);
        }

        const productos = await response.json();

        if (productos.length === 0) {
            tablaProductos.innerHTML = '<tr><td colspan="5">No hay productos registrados.</td></tr>';
            return;
        }

 productos.forEach(producto => {
            const row = tablaProductos.insertRow();

            // Lógica para formatear Precio Unitario (ya la tienes y funciona)
            let precioFormateado = '0.00';
            let precioNumerico = 0;
            if (producto.preciounitario !== null && typeof producto.preciounitario !== 'undefined') {
                const precioString = String(producto.preciounitario).replace(',', '.');
                precioNumerico = parseFloat(precioString);
                if (!isNaN(precioNumerico)) {
                    precioFormateado = precioNumerico.toFixed(2);
                }
            }

            // Cálculo del Precio Total
            const stockNumerico = parseInt(producto.stock);
            let precioTotalFormateado = '0.00';
            if (!isNaN(precioNumerico) && !isNaN(stockNumerico)) {
                const precioTotal = precioNumerico * stockNumerico;
                precioTotalFormateado = precioTotal.toFixed(2);
            }

            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.stock}</td>
                <td>$${precioFormateado}</td>
                <td>$${precioTotalFormateado}</td> 
                <td>
                    <button onclick="editarProducto(${producto.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button onclick="eliminarProducto(${producto.id})" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        });

    } catch (error) {
        console.error('Error al cargar productos:', error); // Mostrar el error detallado en la consola
        alert('Error al cargar productos: ' + error.message); // Mostrar un mensaje de error al usuario
    }
}


// 4. Función para guardar un producto (crear o actualizar)
async function guardarProducto(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de la forma tradicional

    const productoId = document.getElementById('productoId').value;
    // === CORRECCIÓN DE IDS AQUÍ ===
    const nombre = document.getElementById('nombre').value; 
    const descripcion = document.getElementById('descripcion').value; 
    const stock = parseInt(document.getElementById('stock').value); 
    const preciounitario = parseFloat(document.getElementById('preciounitario').value); 
    
    // Validación básica de campos
    if (!nombre || !descripcion || isNaN(stock) || isNaN(preciounitario)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de autenticación. Inicia sesión.');
        window.location.href = 'index.html';
        return;
    }

    const productoData = { nombre, descripcion, stock, preciounitario };
    let method = 'POST';
    let url = `${API_URL}/productos`;

    // Si hay un productoId, estamos editando
    if (productoId) {
        method = 'PUT';
        url = `${API_URL}/productos/${productoId}`;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || `Error al guardar producto: ${response.statusText}`);
        }

        const result = await response.json();
        alert(`Producto ${productoId ? 'actualizado' : 'creado'} con éxito: ${result.producto ? result.producto.nombre : result.mensaje}`);

        // Limpiar el formulario y recargar productos
        document.getElementById('productoForm').reset();
        document.getElementById('productoId').value = ''; // Limpiar ID oculto
        document.getElementById('formTitle').innerText = 'Registrar Producto'; // Restaurar título
        cargarProductos();

    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error al guardar el producto: ' + error.message);
    }
}

// Hacer la función globalmente accesible desde el HTML
window.guardarProducto = guardarProducto;


// 5. Función para eliminar un producto
async function eliminarProducto(id) {
    // 1. Confirmación del usuario
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return; // Si el usuario cancela, no hacemos nada
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de autenticación. Inicia sesión.');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || `Error al eliminar producto: ${response.statusText}`);
        }

        // Si la eliminación fue exitosa (ej. 204 No Content o 200 OK)
        alert('Producto eliminado con éxito.');
        cargarProductos(); // Recargar la tabla para mostrar los productos actualizados

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto: ' + error.message);
    }
}
window.eliminarProducto = eliminarProducto; // Asegúrate de que siga siendo global

// 6. Función para editar un producto (precarga el formulario)
async function editarProducto(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No hay token de autenticación. Inicia sesión.');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Obtener los datos del producto por su ID
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || `Error al obtener producto para editar: ${response.statusText}`);
        }

        const producto = await response.json();

        // Precargar el formulario con los datos del producto
        document.getElementById('productoId').value = producto.id; // Guarda el ID en el input oculto
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('stock').value = producto.stock;

        // Manejar el preciounitario con la misma lógica de coma/punto
        let precioParaInput = '';
        if (producto.preciounitario !== null && typeof producto.preciounitario !== 'undefined') {
            const precioString = String(producto.preciounitario).replace(',', '.');
            const precioNumerico = parseFloat(precioString);
            if (!isNaN(precioNumerico)) {
                precioParaInput = precioNumerico; 
            }
        }
        document.getElementById('preciounitario').value = precioParaInput;

        // Cambiar el título del formulario para indicar que estamos editando
        document.getElementById('formTitle').innerText = `Editar Producto (ID: ${producto.id})`;

        // Desplazarse al formulario para que el usuario lo vea
        document.getElementById('productoForm').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar producto para editar:', error);
        alert('Error al cargar el producto para editar: ' + error.message);
    }
}
window.editarProducto = editarProducto; 
