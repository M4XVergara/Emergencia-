// main.js — versión Supabase
// Reemplaza localStorage por llamadas async a la BD en la nube

document.addEventListener('DOMContentLoaded', async () => {

    const ui        = new UI();
    const validator = new Validator();

    // ── PÁGINA DE REGISTRO ────────────────────────────────────────
    if (document.getElementById('registroForm')) {
        const form         = document.getElementById('registroForm');
        const formTitle    = document.getElementById('form-title');
        const submitButton = document.getElementById('submit-button');

        // Validación visual en tiempo real (sin cambios)
        const camposValidables = [
            'nombre', 'apellidoPaterno', 'apellidoMaterno', 'rut', 'edad',
            'sexo', 'temperatura', 'presionSistolica', 'presionDiastolica',
            'pulsaciones', 'spo2', 'nivelDolor', 'alergias', 'medicamentos'
        ];
        camposValidables.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo) return;
            const evento = campo.tagName === 'SELECT' ? 'change' : 'input';
            campo.addEventListener(evento, () => {
                if (campo.value.trim() !== '') campo.classList.remove('input-error');
            });
        });

        // Modo edición
        const patientIdToEdit = sessionStorage.getItem('patientIdToEdit');
        if (patientIdToEdit) {
            formTitle.textContent     = 'Editar Información del Paciente';
            submitButton.textContent  = 'Guardar Cambios';
            submitButton.classList.replace('btn-success', 'btn-primary');

            // Cargar datos del paciente desde Supabase
            submitButton.disabled    = true;
            submitButton.textContent = 'Cargando...';
            const pacientes = await db.getPacientes();
            const patient   = pacientes.find(p => p.id == patientIdToEdit);

            if (patient) {
                document.getElementById('nombre').value            = patient.nombre;
                document.getElementById('apellidoPaterno').value   = patient.apellidoPaterno;
                document.getElementById('apellidoMaterno').value   = patient.apellidoMaterno;
                document.getElementById('rut').value               = patient.rut;
                document.getElementById('edad').value              = patient.edad;
                document.getElementById('sexo').value              = patient.sexo;
                document.getElementById('temperatura').value       = patient.signosVitales.temperatura;
                document.getElementById('presionSistolica').value  = patient.signosVitales.presion.sistolica;
                document.getElementById('presionDiastolica').value = patient.signosVitales.presion.diastolica;
                document.getElementById('pulsaciones').value       = patient.signosVitales.pulsaciones;
                document.getElementById('spo2').value              = patient.signosVitales.spo2;
                document.getElementById('nivelDolor').value        = patient.informacionClinica.nivelDolor;
                document.getElementById('alergias').value          = patient.informacionClinica.alergias;
                document.getElementById('medicamentos').value      = patient.informacionClinica.medicamentos;
                document.getElementById('diagnostico').value       = patient.diagnostico || '';

                patient.sintomas.forEach(sintoma => {
                    const cb = document.querySelector(`input[type="checkbox"][value="${sintoma}"]`);
                    if (cb) cb.checked = true;
                });
            }
            submitButton.disabled    = false;
            submitButton.textContent = 'Guardar Cambios';
        }

        // Formateo en tiempo real (sin cambios)
        const onlyLettersHandler = (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        };
        document.getElementById('nombre').addEventListener('input', onlyLettersHandler);
        document.getElementById('apellidoPaterno').addEventListener('input', onlyLettersHandler);
        document.getElementById('apellidoMaterno').addEventListener('input', onlyLettersHandler);

        const rutInput = document.getElementById('rut');
        rutInput.addEventListener('input', (e) => {
            let rut  = e.target.value.replace(/[^0-9kK]/g, '').slice(0, 10);
            let body = rut.slice(0, -1);
            let dv   = rut.slice(-1);
            if (rut.length > 1) {
                body = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                e.target.value = `${body}-${dv}`;
            } else {
                e.target.value = rut;
            }
        });

        const vitalSignsInputs = ['temperatura', 'presionSistolica', 'presionDiastolica', 'pulsaciones', 'spo2', 'nivelDolor'];
        vitalSignsInputs.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('blur', (e) => {
                const min = parseFloat(e.target.min);
                const max = parseFloat(e.target.max);
                let   val = parseFloat(e.target.value);
                if (!isNaN(val)) e.target.value = Math.min(max, Math.max(min, val));
            });
        });

        const blockInvalidKeys = (e) => {
            if (['e','E','+','-'].includes(e.key)) e.preventDefault();
        };
        ['edad','temperatura','presionSistolica','presionDiastolica','pulsaciones','spo2','nivelDolor']
            .forEach(id => document.getElementById(id)?.addEventListener('keydown', blockInvalidKeys));

        // ── ENVÍO DEL FORMULARIO ──────────────────────────────────
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                nombre:            document.getElementById('nombre').value,
                apellidoPaterno:   document.getElementById('apellidoPaterno').value,
                apellidoMaterno:   document.getElementById('apellidoMaterno').value,
                rut:               document.getElementById('rut').value,
                edad:              document.getElementById('edad').value,
                sexo:              document.getElementById('sexo').value,
                temperatura:       document.getElementById('temperatura').value,
                presionSistolica:  document.getElementById('presionSistolica').value,
                presionDiastolica: document.getElementById('presionDiastolica').value,
                pulsaciones:       document.getElementById('pulsaciones').value,
                spo2:              document.getElementById('spo2').value,
                nivelDolor:        document.getElementById('nivelDolor').value,
                alergias:          document.getElementById('alergias').value,
                medicamentos:      document.getElementById('medicamentos').value,
                diagnostico:       document.getElementById('diagnostico').value
            };

            const validationResult = validator.validateForm(formData);
            if (!validationResult.isValid) {
                document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
                const fieldMap = {
                    'Nombre': 'nombre', 'Apellido Paterno': 'apellidoPaterno', 'Apellido Materno': 'apellidoMaterno',
                    'RUT': 'rut', 'Edad': 'edad', 'Sexo': 'sexo', 'Temperatura': 'temperatura',
                    'Presión Sistólica': 'presionSistolica', 'Presión Diastólica': 'presionDiastolica',
                    'Pulsaciones': 'pulsaciones', 'Nivel de Oxígeno': 'spo2', 'Nivel de Dolor': 'nivelDolor',
                    'Alergias Conocidas': 'alergias', 'Medicamentos Actuales': 'medicamentos'
                };
                validationResult.errors.forEach(error => {
                    const match = error.match(/'(.+?)'/);
                    if (match) {
                        const id = fieldMap[match[1]];
                        if (id) document.getElementById(id)?.classList.add('input-error');
                    }
                });
                alert(validationResult.errors.join('\n'));
                return;
            }

            // Recolectar síntomas
            const sintomas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            const otros    = document.getElementById('otrosSintomas').value.trim();
            if (otros) sintomas.push(...otros.split(',').map(s => s.trim()).filter(Boolean));

            // Deshabilitar botón mientras guarda
            submitButton.disabled    = true;
            submitButton.textContent = 'Guardando...';

            if (patientIdToEdit) {
                // MODO ACTUALIZAR
                const pacientes = await db.getPacientes();
                const existente = pacientes.find(p => p.id == patientIdToEdit);
                if (existente) {
                    existente.nombre           = formData.nombre;
                    existente.apellidoPaterno  = formData.apellidoPaterno;
                    existente.apellidoMaterno  = formData.apellidoMaterno;
                    existente.rut              = formData.rut;
                    existente.edad             = parseInt(formData.edad);
                    existente.sexo             = formData.sexo;
                    existente.signosVitales.temperatura             = parseFloat(formData.temperatura);
                    existente.signosVitales.presion.sistolica       = parseInt(formData.presionSistolica);
                    existente.signosVitales.presion.diastolica      = parseInt(formData.presionDiastolica);
                    existente.signosVitales.pulsaciones             = parseInt(formData.pulsaciones);
                    existente.signosVitales.spo2                   = parseInt(formData.spo2);
                    existente.informacionClinica.nivelDolor         = parseInt(formData.nivelDolor);
                    existente.informacionClinica.alergias           = formData.alergias;
                    existente.informacionClinica.medicamentos       = formData.medicamentos;
                    existente.diagnostico  = formData.diagnostico;
                    existente.sintomas     = sintomas;
                    existente.detectarSintomasAutomaticos?.();
                    existente.urgencia     = clasificarUrgencia(existente.sintomas);
                    await db.updatePaciente(existente);
                }
                sessionStorage.setItem('newMessage', '¡Paciente actualizado con éxito!');
                sessionStorage.removeItem('patientIdToEdit');
            } else {
                // MODO CREAR
                const newPatient = new Patient(
                    formData.nombre, formData.apellidoPaterno, formData.apellidoMaterno, formData.rut,
                    parseInt(formData.edad), formData.sexo,
                    parseFloat(formData.temperatura), parseInt(formData.presionSistolica),
                    parseInt(formData.presionDiastolica), parseInt(formData.pulsaciones),
                    parseInt(formData.spo2), parseInt(formData.nivelDolor),
                    formData.alergias, formData.medicamentos, sintomas, formData.diagnostico
                );
                await db.savePaciente(newPatient);
                sessionStorage.setItem('newMessage', '¡Paciente registrado con éxito!');
            }

            window.location.href = 'pacientes.html';
        });
    }

    // ── PÁGINA DE PACIENTES ───────────────────────────────────────
    if (document.getElementById('lista-pacientes')) {
        sessionStorage.removeItem('patientIdToEdit');

        const newMessage = sessionStorage.getItem('newMessage');
        if (newMessage) {
            ui.showMessage(newMessage, 'alert-success');
            sessionStorage.removeItem('newMessage');
        }

        // Mostrar spinner mientras carga
        document.getElementById('lista-pacientes').innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Cargando pacientes...</p>
            </div>`;

        const pacientes = await db.getPacientes();
        ui.displayPatients(pacientes);

        // Delegación de eventos para Editar / Eliminar
        document.getElementById('lista-pacientes').addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-edit')) {
                event.preventDefault();
                sessionStorage.setItem('patientIdToEdit', event.target.dataset.id);
                window.location.href = event.target.href;
            }

            if (event.target.classList.contains('btn-delete')) {
                if (confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
                    const patientId = event.target.dataset.id;
                    event.target.disabled    = true;
                    event.target.textContent = 'Eliminando...';
                    const ok = await db.deletePaciente(patientId);
                    if (ok) {
                        const actualizados = await db.getPacientes();
                        ui.displayPatients(actualizados);
                        ui.showMessage('Paciente eliminado.', 'alert-info');
                    } else {
                        ui.showMessage('Error al eliminar. Intenta nuevamente.', 'alert-danger');
                    }
                }
            }
        });
    }
});

// Función auxiliar para recalcular urgencia sin instanciar Patient completo
function clasificarUrgencia(sintomas) {
    const n = sintomas.length;
    if (n >= 6) return 'Roja';
    if (n >= 4) return 'Amarillo';
    return 'Verde';
}
