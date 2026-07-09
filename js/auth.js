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
            const selectFields = 'username, nombre, rol, activo, rut';
            const cleanRut = username.replace(/[^0-9kK]/gi, '').toUpperCase();
            const formattedRut = cleanRut.length > 1
                ? `${cleanRut.slice(0, -1).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}-${cleanRut.slice(-1)}`
                : cleanRut;

            let { data, error } = await _supabase
                .from('usuarios')
                .select(selectFields)
                .eq('username', username)
                .eq('password', password)
                .eq('activo', true)
                .single();

            if (!data && formattedRut && formattedRut !== username) {
                const secondTry = await _supabase
                    .from('usuarios')
                    .select(selectFields)
                    .eq('username', formattedRut)
                    .eq('password', password)
                    .eq('activo', true)
                    .single();
                data = secondTry.data;
                error = secondTry.error;
            }

            if (!data) {
                try {
                    const fallback = await _supabase
                        .from('usuarios')
                        .select(selectFields)
                        .eq('rut', username)
                        .eq('password', password)
                        .eq('activo', true)
                        .single();
                    data = fallback.data;
                    error = fallback.error;
                } catch (fallbackError) {
                    console.warn('Login fallback por rut no disponible:', fallbackError.message);
                }
            }

            if (error || !data) {
                return { success: false, message: 'Usuario o contraseña incorrectos' };
            }

            const sessionData = {
                username:  data.username,
                nombre:    data.nombre,
                rol:       data.rol,
                rut:       data.rut || null,
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
            // Sesión vieja sin rol (de versiones anteriores del sistema) → forzar logout
            const rolesValidos = ['admin', 'medico', 'recepcionista', 'cliente'];
            if (!data.rol || !rolesValidos.includes(data.rol)) {
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

    getRut() {
        return this.getCurrentUser()?.rut || null;
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
            const rolLabel = { admin: '🔑 Admin', medico: '🩺 Médico', recepcionista: '🗂️ Recepción', cliente: '👤 Paciente' };
            el.innerHTML = `<span class="navbar-text me-3">
                👤 ${user.nombre || user.username}
                <span class="badge bg-light text-primary ms-1">${rolLabel[user.rol] || user.rol}</span>
            </span>`;
        }
    }
}

const auth = new Auth();
