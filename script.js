// frontend/script.js

const API_URL = 'http://localhost:3000/api'; // cambia si usas ngrok

function mostrarLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
}

function mostrarRegistro() {
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
}

async function registrarUsuario(e) {
  e.preventDefault();

  const nombre = document.getElementById('registerNombre').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registro exitoso. Ahora inicia sesión.');
      mostrarLogin();
    } else {
      alert(data.message || 'Error en el registro.');
    }
  } catch (err) {
    console.error(err);
    alert('Error en el servidor.');
  }
}

async function loginUsuario(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      alert('Inicio de sesión exitoso');
      window.location.href = 'dashboard.html'; // vamos a crearla luego
    } else {
      alert(data.message || 'Credenciales inválidas');
    }
  } catch (err) {
    console.error(err);
    alert('Error en el servidor.');
  }
}
