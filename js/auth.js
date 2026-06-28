// ============ SISTEMA DE AUTENTICACIÓN CON ROLES — ETAPA 2 ============
// Consulta la tabla `usuarios` en Supabase en vez de credenciales hardcodeadas.
// Guarda el rol en sessionStorage para control de acceso por página.

class Auth {
    constructor() {
        this.sessionKey = 'userSession';
    }

    // ── LOGIN: consulta Supabase ────────────────────────────────
    async login(username, password) {
        try {
            const { data, error } = await _supabase
                .from('usuarios')
                .select('username, nombre, rol, activo')
                .eq('username', username)
                .eq('password', password)   // En producción: comparar hash
                .eq('activo', true)
                .single();

            if (error || !data) {
                return { success: false, message: 'Usuario o contraseña incorrectos' };
            }

            const sessionData = {
                username:  data.username,
                nombre:    data.nombre,
                rol:       data.rol,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
            };

            sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            return { success: true, message: 'Sesión iniciada correctamente', rol: data.rol };

        } catch (e) {
            console.error('Error login:', e);
            return { success: false, message: 'Error de conexión. Intenta nuevamente.' };
        }
    }

    // ── LOGOUT ──────────────────────────────────────────────────
    logout() {
        sessionStorage.removeItem(this.sessionKey);
    }

    // ── VERIFICAR SESIÓN ACTIVA ─────────────────────────────────
    isAuthenticated() {
        const session = sessionStorage.getItem(this.sessionKey);
        if (!session) return false;
        try {
            const data = JSON.parse(session);
            if (new Date() > new Date(data.expiresAt)) {
                this.logout();
                return false;
            }
            return true;
        } catch { return false; }
    }

    // ── OBTENER USUARIO ACTUAL ──────────────────────────────────
    getCurrentUser() {
        try {
            const data = JSON.parse(sessionStorage.getItem(this.sessionKey));
            return data || null;
        } catch { return null; }
    }

    // Alias de compatibilidad (main.js lo usa)
    getUsername() {
        return this.getCurrentUser()?.username || null;
    }

    // ── ROL DEL USUARIO ─────────────────────────────────────────
    getRol() {
        return this.getCurrentUser()?.rol || null;
    }

    // ── PROTEGER PÁGINA (requiere login) ───────────────────────
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // ── PROTEGER PÁGINA CON ROL ESPECÍFICO ─────────────────────
    // roles: array de roles permitidos, ej: ['admin', 'medico']
    protectPageByRole(roles) {
        this.protectPage();
        const rol = this.getRol();
        if (!roles.includes(rol)) {
            alert('No tienes permiso para acceder a esta página.');
            window.location.href = 'registro.html';
        }
    }

    // ── VERIFICAR SI TIENE UN ROL ───────────────────────────────
    hasRole(rol) {
        return this.getRol() === rol;
    }

    hasAnyRole(roles) {
        return roles.includes(this.getRol());
    }

    // ── MOSTRAR INFO DE USUARIO EN NAVBAR ───────────────────────
    displayUserInfo() {
        const user = this.getCurrentUser();
        const el   = document.getElementById('user-info');
        if (el && user) {
            const rolLabel = { admin: '🔑 Admin', medico: '🩺 Médico', recepcionista: '🗂️ Recepción' };
            el.innerHTML = `<span class="navbar-text me-3">
                👤 ${user.nombre || user.username}
                <span class="badge bg-light text-primary ms-1">${rolLabel[user.rol] || user.rol}</span>
            </span>`;
        }
    }
}

const auth = new Auth();
