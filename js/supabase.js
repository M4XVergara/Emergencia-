// ============ CLIENTE SUPABASE ============
// Reemplaza el localStorage. Todos los datos viven en la nube.
//
// PASO DE CONFIGURACIÓN:
//   1. Ve a https://supabase.com → New project
//   2. Copia tu "Project URL" y "anon public key" desde:
//      Project Settings → API
//   3. Pega los valores en las constantes de abajo
//   4. Crea las tablas ejecutando el SQL que está en /sql/schema.sql

const SUPABASE_URL      = 'https://szdsjfmsmtezamzllmee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZHNqZm1zbXRlemFtemxsbWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDA2NTcsImV4cCI6MjA5ODIxNjY1N30.rqMg0S0PPnQpSGQywfkxI9Sigy5Ht4k6mUxNnXCbORs';

// Importar el cliente de Supabase (versión CDN, se carga en los HTML)
// En los HTML debes agregar ANTES de supabase.js:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ API DE PACIENTES ============

const db = {

    // Obtener todos los pacientes ordenados por fecha (más nuevos primero)
    async getPacientes() {
        const { data, error } = await _supabase
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al obtener pacientes:', error.message);
            return [];
        }
        // Convertir el formato plano de la BD al formato de objeto Patient que usa la app
        return data.map(fila => dbRowToPatient(fila));
    },

    // Guardar un nuevo paciente
    async savePaciente(patient) {
        const fila = patientToDbRow(patient);
        const { data, error } = await _supabase
            .from('pacientes')
            .insert([fila])
            .select()
            .single();

        if (error) {
            console.error('Error al guardar paciente:', error.message);
            return null;
        }
        return dbRowToPatient(data);
    },

    // Actualizar un paciente existente por su ID original (Date.now())
    async updatePaciente(patient) {
        const fila = patientToDbRow(patient);
        const { error } = await _supabase
            .from('pacientes')
            .update(fila)
            .eq('patient_id', patient.id);

        if (error) {
            console.error('Error al actualizar paciente:', error.message);
            return false;
        }
        return true;
    },

    // Eliminar un paciente por su ID original
    async deletePaciente(patientId) {
        const { error } = await _supabase
            .from('pacientes')
            .delete()
            .eq('patient_id', patientId);

        if (error) {
            console.error('Error al eliminar paciente:', error.message);
            return false;
        }
        return true;
    },

    // ============ API DE SOLICITUDES DE HORA ============

    async saveSolicitud(solicitud) {
        const { data, error } = await _supabase
            .from('solicitudes_hora')
            .insert([{
                solicitud_id:     solicitud.id,
                nombre:           solicitud.nombre,
                apellido_paterno: solicitud.apellidoPaterno,
                apellido_materno: solicitud.apellidoMaterno,
                rut:              solicitud.rut,
                edad:             solicitud.edad,
                sexo:             solicitud.sexo,
                comuna:           solicitud.comuna,
                consultorio:      solicitud.consultorio,
                distancia_km:     solicitud.distancia,
                tiempo_espera_min:    solicitud.tiempoEsperaMin,
                tiempo_espera_max:    solicitud.tiempoEsperaMax,
                tiempo_espera_promedio: solicitud.tiempoEsperaPromedio,
                telefono:         solicitud.telefono,
                email:            solicitud.email,
                motivo:           solicitud.motivo
            }])
            .select()
            .single();

        if (error) {
            console.error('Error al guardar solicitud:', error.message);
            return null;
        }
        return data;
    },

    async getSolicitudes() {
        const { data, error } = await _supabase
            .from('solicitudes_hora')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al obtener solicitudes:', error.message);
            return [];
        }
        return data;
    }
};

// ============ FUNCIONES DE CONVERSIÓN ============
// Traducen entre el objeto Patient (camelCase) y la fila de BD (snake_case)

function patientToDbRow(p) {
    return {
        patient_id:          p.id,
        nombre:              p.nombre,
        apellido_paterno:    p.apellidoPaterno,
        apellido_materno:    p.apellidoMaterno,
        rut:                 p.rut,
        edad:                p.edad,
        sexo:                p.sexo,
        temperatura:         p.signosVitales.temperatura,
        presion_sistolica:   p.signosVitales.presion.sistolica,
        presion_diastolica:  p.signosVitales.presion.diastolica,
        pulsaciones:         p.signosVitales.pulsaciones,
        spo2:                p.signosVitales.spo2,
        nivel_dolor:         p.informacionClinica.nivelDolor,
        alergias:            p.informacionClinica.alergias,
        medicamentos:        p.informacionClinica.medicamentos,
        diagnostico:         p.diagnostico || '',
        sintomas:            p.sintomas,      // Supabase guarda arrays JSON nativamente
        urgencia:            p.urgencia,
        fecha_registro:      p.fechaRegistro
    };
}

function dbRowToPatient(fila) {
    // Reconstruye el objeto con la misma estructura que espera la app
    return {
        id:              fila.patient_id,
        nombre:          fila.nombre,
        apellidoPaterno: fila.apellido_paterno,
        apellidoMaterno: fila.apellido_materno,
        rut:             fila.rut,
        edad:            fila.edad,
        sexo:            fila.sexo,
        signosVitales: {
            temperatura: fila.temperatura,
            presion: {
                sistolica:  fila.presion_sistolica,
                diastolica: fila.presion_diastolica
            },
            pulsaciones: fila.pulsaciones,
            spo2:        fila.spo2
        },
        informacionClinica: {
            nivelDolor:   fila.nivel_dolor,
            alergias:     fila.alergias,
            medicamentos: fila.medicamentos
        },
        diagnostico:    fila.diagnostico,
        sintomas:       fila.sintomas || [],
        urgencia:       fila.urgencia,
        fechaRegistro:  fila.fecha_registro
    };
}
