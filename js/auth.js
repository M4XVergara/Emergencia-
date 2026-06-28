// ============ SISTEMA DE AUTENTICACIÓN ============
// Este archivo maneja la autenticación del personal de salud

class Auth {
    constructor() {
        // Usuarios registrados (en producción estarían en una base de datos segura)
        this.users = [
            { username: 'doctor', password: 'clinic123' },
            { username: 'enfermera', password: 'clinic123' },
            { username: 'admin', password: 'admin2026' }
        ];
        
        // Clave para cifrado simple (NO es seguro en producción)
        this.secretKey = 'clinica-bienestar-2026';
    }

    // Método para iniciar sesión
    login(username, password) {
        // Busca si el usuario existe
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }

        // Si el usuario es correcto, guarda la sesión
        const sessionData = {
            username: user.username,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 horas
        };

        // Guarda la sesión en sessionStorage (se borra al cerrar navegador)
        sessionStorage.setItem('userSession', JSON.stringify(sessionData));
        
        return { success: true, message: 'Sesión iniciada correctamente', user: user.username };
    }

    // Método para cerrar sesión
    logout() {
        sessionStorage.removeItem('userSession');
    }

    // Método para verificar si hay sesión activa
    isAuthenticated() {
        const session = sessionStorage.getItem('userSession');
        
        if (!session) {
            return false;
        }

        try {
            const sessionData = JSON.parse(session);
            const expiresAt = new Date(sessionData.expiresAt);
            
            // Si la sesión expiró, eliminarla
            if (new Date() > expiresAt) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    // Método para obtener el usuario actual
    getCurrentUser() {
        const session = sessionStorage.getItem('userSession');
        
        if (!session) {
            return null;
        }

        try {
            const sessionData = JSON.parse(session);
            return sessionData.username;
        } catch (e) {
            return null;
        }
    }

    // Método para proteger páginas (redirige a login si no está autenticado)
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // Método para mostrar nombre del usuario en página
    displayUserInfo() {
        const user = this.getCurrentUser();
        const userDisplay = document.getElementById('user-info');
        
        if (userDisplay && user) {
            userDisplay.innerHTML = `<span class="navbar-text me-3">👤 ${user}</span>`;
        }
    }
}

// Crear instancia global de autenticación
const auth = new Auth();
