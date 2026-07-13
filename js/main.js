// Este evento se dispara cuando todo el documento HTML ha sido cargado y analizado por el navegador.
// Ponemos todo nuestro código dentro de este evento para asegurarnos de que los elementos HTML (como botones y formularios) ya existen antes de intentar manipularlos.
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN INICIAL ---

    // Creamos una 'instancia' de nuestra clase UI. Esto es como crear un objeto 'ui' que tiene acceso a todos los métodos que definimos en ui.js (como displayPatients, showMessage, etc.).
    const ui = new UI();
    // Hacemos lo mismo con nuestra clase Validator.
    const validator = new Validator();

    // --- FUNCIONES AUXILIARES (HELPERS) ---

    // Función para obtener la lista de pacientes desde Supabase.
    const getPatients = async () => {
        try {
            return await db.getPacientes();
        } catch (err) {
            console.error('Error al obtener pacientes desde Supabase:', err);
            ui.showMessage('No se pudieron cargar los pacientes. Intenta nuevamente más tarde.', 'alert-danger');
            return [];
        }
    };

    // --- LÓGICA ESPECÍFICA PARA LA PÁGINA DE REGISTRO ---

    // Este 'if' revisa si en la página actual existe un elemento con el ID 'registroForm'.
    // Esto nos permite tener un solo archivo main.js que ejecuta código diferente dependiendo de si estamos en registro.html o pacientes.html.
    if (document.getElementById('registroForm')) {
        // Obtenemos referencias a los elementos del formulario que vamos a manipular.
        const form = document.getElementById('registroForm');

        // --- INICIO: NUEVA LÓGICA PARA ERRORES VISUALES ---
        // Se crea un arreglo con los IDs de todos los campos que se van a validar.
        const camposValidables = [
            'nombre', 'apellidoPaterno', 'apellidoMaterno', 'rut', 'edad',
            'sexo', 'temperatura', 'presionSistolica', 'presionDiastolica',
            'pulsaciones', 'spo2', 'nivelDolor', 'alergias', 'medicamentos'
        ];

        // Se recorre cada ID del arreglo para añadirle un 'listener'.
        camposValidables.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                // Se determina si el campo es un 'select' o un 'input' para usar el evento correcto ('change' o 'input').
                const evento = campo.tagName === 'SELECT' ? 'change' : 'input';
                // Se añade un listener que se activa cuando el usuario escribe o cambia el valor.
                campo.addEventListener(evento, () => {
                    // Si el campo ya no está vacío, se le quita la clase de error. Esto mejora la experiencia del usuario.
                    if (campo.value.trim() !== '') {
                        campo.classList.remove('input-error');
                    }
                });
            }
        });
        // --- FIN: NUEVA LÓGICA PARA ERRORES VISUALES ---

        const formTitle = document.getElementById('form-title');
        const submitButton = document.getElementById('submit-button');

        // --- LÓGICA DE "MODO EDICIÓN" ---
        // Al cargar la página de registro, revisamos si se guardó un ID en sessionStorage.
        // sessionStorage es como localStorage, pero se borra cuando se cierra la pestaña del navegador. Es perfecto para pasar información temporal entre páginas.
        const patientIdToEdit = sessionStorage.getItem('patientIdToEdit');
        console.log(patientIdToEdit); // Una línea de depuración para ver el ID en la consola.

        // Si se encontró un ID, significa que venimos de presionar un botón "Editar".
        if (patientIdToEdit) {
            (async () => {
                // Se cambia la UI para que refleje el modo edición.
                formTitle.textContent = 'Editar Información del Paciente';
                submitButton.textContent = 'Guardar Cambios';
                submitButton.classList.remove('btn-success'); // Quitamos el color verde.
                submitButton.classList.add('btn-primary');    // Añadimos el color azul.

                const patients = await getPatients();
                const patient = patients.find(p => p.id == patientIdToEdit);

                if (!patient) {
                    ui.showMessage('No se encontró el paciente que intentas editar.', 'alert-warning');
                    return;
                }

                document.getElementById('nombre').value = patient.nombre;
                document.getElementById('apellidoPaterno').value = patient.apellidoPaterno;
                document.getElementById('apellidoMaterno').value = patient.apellidoMaterno;
                document.getElementById('rut').value = patient.rut;
                document.getElementById('edad').value = patient.edad;
                document.getElementById('sexo').value = patient.sexo;
                document.getElementById('temperatura').value = patient.signosVitales.temperatura;
                document.getElementById('presionSistolica').value = patient.signosVitales.presion.sistolica;
                document.getElementById('presionDiastolica').value = patient.signosVitales.presion.diastolica;
                document.getElementById('pulsaciones').value = patient.signosVitales.pulsaciones;
                document.getElementById('spo2').value = patient.signosVitales.spo2;
                document.getElementById('nivelDolor').value = patient.informacionClinica.nivelDolor;
                document.getElementById('alergias').value = patient.informacionClinica.alergias;
                document.getElementById('medicamentos').value = patient.informacionClinica.medicamentos;
                // Nota: el diagnóstico ya no se edita aquí, ahora vive en atencion.html

                patient.sintomas.forEach(sintoma => {
                    const checkbox = document.querySelector(`input[type="checkbox"][value="${sintoma}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            })();
        }

        // --- LISTENERS DE FORMATO Y VALIDACIÓN EN TIEMPO REAL ---
        // (Esta sección no ha cambiado y sigue aplicando formatos mientras el usuario escribe)
        const onlyLettersHandler = (event) => { event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); };
        document.getElementById('nombre').addEventListener('input', onlyLettersHandler);
        document.getElementById('apellidoPaterno').addEventListener('input', onlyLettersHandler);
        document.getElementById('apellidoMaterno').addEventListener('input', onlyLettersHandler);
        const rutInput = document.getElementById('rut');
        rutInput.addEventListener('input', (event) => { let rut = event.target.value.replace(/[^0-9kK]/g, ''); rut = rut.slice(0, 10); let body = rut.slice(0, -1); let dv = rut.slice(-1); if (rut.length > 1) { body = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); event.target.value = `${body}-${dv}`; } else { event.target.value = rut; } });
        const vitalSignsInputs = ['temperatura', 'presionSistolica', 'presionDiastolica', 'pulsaciones', 'spo2', 'nivelDolor'];
        vitalSignsInputs.forEach(id => { const input = document.getElementById(id); if (input) { input.addEventListener('blur', (event) => { const field = event.target; const min = parseFloat(field.min); const max = parseFloat(field.max); let value = parseFloat(field.value); if (!isNaN(value)) { if (value < min) field.value = min; else if (value > max) field.value = max; } }); } });
        const numberInputsToSanitize = ['edad', 'temperatura', 'presionSistolica', 'presionDiastolica', 'pulsaciones', 'spo2', 'nivelDolor'];
        const blockInvalidKeysHandler = (event) => { if (['e', 'E', '+', '-'].includes(event.key)) { event.preventDefault(); } };
        numberInputsToSanitize.forEach(id => { const input = document.getElementById(id); if (input) { input.addEventListener('keydown', blockInvalidKeysHandler); } });

        // --- LISTENER PRINCIPAL DEL FORMULARIO (AL ENVIAR) ---
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                nombre: document.getElementById('nombre').value,
                apellidoPaterno: document.getElementById('apellidoPaterno').value,
                apellidoMaterno: document.getElementById('apellidoMaterno').value,
                rut: document.getElementById('rut').value,
                edad: document.getElementById('edad').value,
                sexo: document.getElementById('sexo').value,
                temperatura: document.getElementById('temperatura').value,
                presionSistolica: document.getElementById('presionSistolica').value,
                presionDiastolica: document.getElementById('presionDiastolica').value,
                pulsaciones: document.getElementById('pulsaciones').value,
                spo2: document.getElementById('spo2').value,
                nivelDolor: document.getElementById('nivelDolor').value,
                alergias: document.getElementById('alergias').value,
                medicamentos: document.getElementById('medicamentos').value,
                diagnostico: '' // El diagnóstico se asigna posteriormente en atencion.html
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
                        const label = match[1];
                        const id = fieldMap[label];
                        if (id) {
                            const field = document.getElementById(id);
                            if (field) field.classList.add('input-error');
                        }
                    }
                });

                ui.showMessage(`<ul>${validationResult.errors.map(e => `<li>${e}</li>`).join('')}</ul>`, 'alert-danger');
                return;
            }

            const sintomas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            const otrosSintomas = document.getElementById('otrosSintomas').value.trim();
            if (otrosSintomas) {
                sintomas.push(...otrosSintomas.split(',').map(s => s.trim()).filter(s => s));
            }

            try {
                if (patientIdToEdit) {
                    const patients = await getPatients();
                    const patientIndex = patients.findIndex(p => p.id == patientIdToEdit);
                    if (patientIndex > -1) {
                        const patientToUpdate = patients[patientIndex];
                        patientToUpdate.nombre = formData.nombre;
                        patientToUpdate.apellidoPaterno = formData.apellidoPaterno;
                        patientToUpdate.apellidoMaterno = formData.apellidoMaterno;
                        patientToUpdate.rut = formData.rut;
                        patientToUpdate.edad = parseInt(formData.edad);
                        patientToUpdate.sexo = formData.sexo;
                        patientToUpdate.signosVitales.temperatura = parseFloat(formData.temperatura);
                        patientToUpdate.signosVitales.presion.sistolica = parseInt(formData.presionSistolica);
                        patientToUpdate.signosVitales.presion.diastolica = parseInt(formData.presionDiastolica);
                        patientToUpdate.signosVitales.pulsaciones = parseInt(formData.pulsaciones);
                        patientToUpdate.signosVitales.spo2 = parseInt(formData.spo2);
                        patientToUpdate.informacionClinica.nivelDolor = parseInt(formData.nivelDolor);
                        patientToUpdate.informacionClinica.alergias = formData.alergias;
                        patientToUpdate.informacionClinica.medicamentos = formData.medicamentos;
                        patientToUpdate.sintomas = sintomas;
                        patientToUpdate.detectarSintomasAutomaticos();
                        patientToUpdate.urgencia = patientToUpdate.clasificarUrgencia();

                        const ok = await db.updatePaciente(patientToUpdate);
                        if (!ok) throw new Error('No se pudo actualizar el paciente.');
                        sessionStorage.setItem('newMessage', '¡Paciente actualizado con éxito!');
                        sessionStorage.removeItem('patientIdToEdit');
                    } else {
                        throw new Error('Paciente no encontrado para actualizar.');
                    }
                } else {
                    const newPatient = new Patient(
                        formData.nombre, formData.apellidoPaterno, formData.apellidoMaterno, formData.rut,
                        parseInt(formData.edad), formData.sexo,
                        parseFloat(formData.temperatura), parseInt(formData.presionSistolica),
                        parseInt(formData.presionDiastolica), parseInt(formData.pulsaciones),
                        parseInt(formData.spo2), parseInt(formData.nivelDolor),
                        formData.alergias, formData.medicamentos, sintomas, formData.diagnostico
                    );

                    const savedPatient = await db.savePaciente(newPatient);
                    if (!savedPatient) throw new Error('No se pudo registrar al paciente.');
                    sessionStorage.setItem('newMessage', '¡Paciente registrado con éxito!');
                }

                window.location.href = 'pacientes.html';
            } catch (err) {
                console.error(err);
                ui.showMessage(`Error al guardar el paciente: ${err.message}`, 'alert-danger');
            }
        });
    }

    // --- LÓGICA ESPECÍFICA PARA LA PÁGINA DE PACIENTES ---
    if (document.getElementById('lista-pacientes')) {
        sessionStorage.removeItem('patientIdToEdit');

        // Se revisa si hay un mensaje de éxito para mostrarlo.
        const newMessage = sessionStorage.getItem('newMessage');
        if (newMessage) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({ icon: 'success', title: '¡Éxito!', text: newMessage, timer: 2000, showConfirmButton: false });
            } else {
                alert(newMessage); // Muestra el mensaje de éxito en una ventana emergente.
            }
            sessionStorage.removeItem('newMessage');
        }

        // Se muestra la lista de pacientes al cargar la página.
        ui.displayPatients(getPatients());

        // Se usa delegación de eventos para manejar los clics en los botones de "Editar" y "Eliminar".
        document.getElementById('lista-pacientes').addEventListener('click', async (event) => {
            // Lógica para el botón Editar
            if (event.target.classList.contains('btn-edit')) {
                event.preventDefault();
                const patientId = event.target.dataset.id;
                sessionStorage.setItem('patientIdToEdit', patientId);
                window.location.href = event.target.href;
            }

            // Lógica para el botón Eliminar
            if (event.target.classList.contains('btn-delete')) {
                let confirmed = false;
                if (typeof Swal !== 'undefined') {
                    const res = await Swal.fire({ icon: 'warning', title: 'Confirmar eliminación', text: '¿Estás seguro de que deseas eliminar a este paciente?', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar' });
                    confirmed = res.isConfirmed;
                } else {
                    confirmed = confirm('¿Estás seguro de que deseas eliminar a este paciente?');
                }
                if (confirmed) {
                    const patientId = event.target.dataset.id;
                    let patients = getPatients();
                    patients = patients.filter(p => p.id != patientId);
                    savePatients(patients);
                    ui.displayPatients(patients);
                    ui.showMessage('Paciente eliminado.', 'alert-info'); // Aquí se sigue usando la UI para el mensaje de eliminación.
                }
            }
        });
    }
});