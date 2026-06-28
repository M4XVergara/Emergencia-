// Se define la clase UI (User Interface). Agrupa todos los métodos que manipulan directamente el DOM,
// es decir, todo lo que el usuario ve y con lo que interactúa en la página.
class UI {

    // Método principal para mostrar la lista de pacientes en la página.
    // Recibe como parámetro el arreglo completo de objetos de pacientes.
    displayPatients(patients) {
        // Obtenemos referencias a los elementos del HTML donde vamos a trabajar.
        const list = document.getElementById('lista-pacientes'); // El contenedor donde irán las tarjetas.
        const noPatients = document.getElementById('sin-pacientes'); // El mensaje que se muestra si no hay pacientes.

        // Limpiamos el contenido previo de la lista. Esto es crucial para evitar que se dupliquen las tarjetas cada vez que se actualiza.
        list.innerHTML = '';

        // Comprobamos si el arreglo de pacientes está vacío.
        if (patients.length === 0) {
            // Si no hay pacientes, mostramos el mensaje de "sin pacientes" quitando la clase 'd-none' de Bootstrap.
            noPatients.classList.remove('d-none');
        } else {
            // Si hay pacientes, ocultamos el mensaje de "sin pacientes" añadiendo la clase 'd-none'.
            noPatients.classList.add('d-none');
            // Usamos forEach para recorrer cada objeto 'p' (paciente) dentro del arreglo 'patients'.
            // Por cada paciente, llamamos al método renderPatientCard() para generar su HTML y lo añadimos al contenedor.
            patients.forEach(p => list.innerHTML += this.renderPatientCard(p));
        }
    }

    // Este método toma un ÚNICO objeto de paciente y devuelve un string con todo el HTML de su tarjeta.
    renderPatientCard(patient) {
        // Creamos un objeto 'map' para traducir fácilmente el nivel de urgencia a las clases de color de Bootstrap.
        // Esto es más limpio que tener múltiples if/else.
        const uClasses = {
            'Roja': { bg: 'bg-danger', border: 'border-danger', text: 'Roja (Grave)' },
            'Amarillo': { bg: 'bg-warning', border: 'border-warning', text: 'Amarillo (Moderada)' },
            'Verde': { bg: 'bg-success', border: 'border-success', text: 'Verde (Leve)' }
        };
        // Buscamos las clases correspondientes a la urgencia del paciente.
        // Si por alguna razón la urgencia no existe, se usa un color gris por defecto (|| { ... }).
        const c = uClasses[patient.urgencia] || { bg: 'bg-secondary', border: 'border-secondary', text: 'N/A' };
        
        // Usamos "template literals" (las comillas ` `) para construir el string de HTML de forma más legible.
        // Los valores del objeto 'patient' se insertan directamente en el HTML usando la sintaxis ${...}.
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card mb-4 ${c.border} shadow-sm">
                    <div class="card-header text-white ${c.bg}">Urgencia: ${c.text}</div>
                    <div class="card-body">
                        <h5 class="card-title">${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}</h5>
                        <p class="card-text mb-1"><strong>RUT:</strong> ${patient.rut}</p>
                        <p class="card-text mb-1"><strong>Edad:</strong> ${patient.edad} años</p>
                        <hr>
                        <p class="card-text mb-1"><strong>Nivel Dolor:</strong> ${patient.informacionClinica.nivelDolor}/10</p>
                        <p class="card-text mb-1"><strong>Alergias:</strong> ${patient.informacionClinica.alergias}</p>
                        <p class="card-text mb-1"><strong>Medicamentos:</strong> ${patient.informacionClinica.medicamentos}</p>
                        <hr>
                        <p class="card-text"><strong>Síntomas:</strong> ${patient.sintomas.join(', ') || 'No especificados'}</p>
                        ${patient.diagnostico ? `<p class="card-text"><strong>Diagnóstico:</strong> ${patient.diagnostico}</p>` : ''}
                        <div class="mt-3 d-flex justify-content-end">
                            <a href="registro.html" class="btn btn-sm btn-primary me-2 btn-edit" data-id="${patient.id}">Editar</a>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${patient.id}">Eliminar</button>
                        </div>
                    </div>
                    <div class="card-footer text-muted small">Registrado: ${patient.fechaRegistro}</div>
                </div>
            </div>`;
    }

    // Método genérico para mostrar un mensaje temporal en la parte superior de la página.
    // Recibe el texto del mensaje y la clase CSS para el color (ej: 'alert-success' para verde).
    showMessage(message, cssClass) {
        // 1. Crea un elemento <div> en memoria (aún no es visible).
        const div = document.createElement('div');
        // 2. Le añade las clases de Bootstrap para que se vea como una alerta.
        div.className = `alert ${cssClass} alert-dismissible fade show mt-4`;
        div.setAttribute('role', 'alert'); // Atributo de accesibilidad.
        // 3. Le inserta el contenido del mensaje. Usamos .innerHTML para que pueda renderizar HTML (como listas de errores).
        div.innerHTML = message;
        // 4. Crea el botón de cierre 'X'.
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-close';
        button.setAttribute('data-bs-dismiss', 'alert'); // Atributo de Bootstrap para que el botón funcione.
        div.appendChild(button); // Añade el botón a la alerta.
        // 5. Inserta la alerta completa en la página.
        const container = document.querySelector('.container');
        container.prepend(div); // .prepend() lo añade como el primer hijo del contenedor.
        // 6. Pone un temporizador para que la alerta se borre sola después de 4 segundos.
        setTimeout(() => { if(document.querySelector('.alert')) document.querySelector('.alert').remove() }, 4000);
    }

    // Método especializado para mostrar una lista de errores de validación.
     showErrorList(errors) {
        // Solo hace algo si el arreglo de errores no está vacío.
    //    if (errors.length > 0) {
    //        // Construye un string de HTML con una lista <ul> y un <li> por cada error.
    //        let list = '<ul class="mb-0">';
    //        errors.forEach(e => list += `<li>${e}</li>`);
    //        list += '</ul>';
            // Llama al método showMessage para mostrar esta lista de errores con un fondo rojo ('alert-danger').
     //       this.showMessage(list, 'alert-danger');
     //   }
    }
}