// frontend/historial.js
const API_URL = 'http://localhost:3000/api'; 
const token = localStorage.getItem('token');

// Redirigir si no hay token (usuario no autenticado)
if (!token) {
  window.location.href = 'index.html';
}

const tablaHistorial = document.getElementById('tablaHistorial');

/**
 * Carga y muestra el historial de movimientos de productos.
 */
async function cargarHistorial() {
  try {
    const res = await fetch(`${API_URL}/movimientos`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      }
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const movimientos = await res.json();

    tablaHistorial.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    if (movimientos.length === 0) {
      tablaHistorial.innerHTML = '<tr><td colspan="4">No hay movimientos registrados.</td></tr>';
      return;
    }

    movimientos.forEach(mov => {
      // Ajusta los nombres de las propiedades según la respuesta de tu backend
      // Por ejemplo, si tu backend devuelve 'producto.nombre' en lugar de 'nombreProducto'
      tablaHistorial.innerHTML += `
        <tr>
          <td>${mov.nombreProducto || 'N/A'}</td>
          <td>${mov.tipoMovimiento || 'N/A'}</td>
          <td>${mov.cantidad || 'N/A'}</td>
          <td>${new Date(mov.fecha).toLocaleString()}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error al cargar el historial de movimientos:', error);
    alert('Error al cargar el historial de movimientos. Por favor, inténtalo de nuevo.');
  }
}

// Cargar el historial al cargar la página
cargarHistorial();

