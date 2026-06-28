// Se define la clase Validator, que agrupa toda la lógica para validar los datos del formulario.
// Su responsabilidad es únicamente revisar datos y reportar errores, no interactúa con la página directamente.
class Validator {

    // Este es el método principal y público de la clase. Recibe un objeto 'formData' con todos los datos del formulario.
    validateForm(formData) {
        // Se reinicia el arreglo de errores. Esto es MUY IMPORTANTE para que los errores de un envío anterior no se acumulen con los del nuevo envío.
        this.errors = [];
        
        // Se utiliza "desestructuración de objetos" para extraer cómodamente todas las propiedades del objeto 'formData' en constantes individuales.
        const { nombre, apellidoPaterno, apellidoMaterno, rut, edad, sexo, temperatura, presionSistolica, presionDiastolica, pulsaciones, spo2, nivelDolor, alergias, medicamentos, diagnostico } = formData;

        // --- BLOQUE 1: REVISIÓN DE CAMPOS OBLIGATORIOS ---
        // Se llama al método auxiliar _checkRequired para cada campo que no puede estar vacío.
        this._checkRequired('Nombre', nombre);
        this._checkRequired('Apellido Paterno', apellidoPaterno);
        this._checkRequired('Apellido Materno', apellidoMaterno);
        this._checkRequired('RUT', rut);
        this._checkRequired('Edad', edad);
        this._checkRequired('Sexo', sexo);
        this._checkRequired('Temperatura', temperatura);
        this._checkRequired('Presión Sistólica', presionSistolica);
        this._checkRequired('Presión Diastólica', presionDiastolica);
        this._checkRequired('Pulsaciones', pulsaciones);
        this._checkRequired('Nivel de Oxígeno', spo2);
        this._checkRequired('Nivel de Dolor', nivelDolor);
        this._checkRequired('Alergias Conocidas', alergias);
        this._checkRequired('Medicamentos Actuales', medicamentos);
        
        // --- BLOQUE OPCIONAL: REVISIÓN DE DIAGNÓSTICO ---
        // El diagnóstico es opcional pero si se ingresa, se valida su extensión.
        if (diagnostico && diagnostico.trim().length > 500) {
            this.errors.push('El diagnóstico no puede exceder 500 caracteres.');
        }
        
        // --- BLOQUE 2: REVISIÓN DE TIPO NUMÉRICO ---
        // Se llama al método auxiliar _checkIsNumber para verificar que los campos correspondientes contengan solo números.
        this._checkIsNumber('Edad', edad);
        this._checkIsNumber('Temperatura', temperatura);
        this._checkIsNumber('Presión Sistólica', presionSistolica);
        this._checkIsNumber('Presión Diastólica', presionDiastolica);
        this._checkIsNumber('Pulsaciones', pulsaciones);
        this._checkIsNumber('Nivel de Oxígeno', spo2);
        this._checkIsNumber('Nivel de Dolor', nivelDolor);

        // --- BLOQUE 3: REVISIÓN DE RANGOS VÁLIDOS ---
        // Se verifica que los valores numéricos estén dentro de los rangos lógicos y clínicamente aceptables.
        this._checkGreaterThan('Edad', edad, 0); // La edad debe ser mayor que 0.
        this._checkInRange('Temperatura', temperatura, 30, 45); // La temperatura debe estar entre 30 y 45.
        this._checkInRange('Presión Sistólica', presionSistolica, 50, 250);
        this._checkInRange('Presión Diastólica', presionDiastolica, 30, 150);
        this._checkInRange('Pulsaciones', pulsaciones, 30, 220);
        this._checkInRange('Nivel de Oxígeno', spo2, 70, 100);
        this._checkInRange('Nivel de Dolor', nivelDolor, 0, 10);

        // Al final, la función devuelve un objeto con dos propiedades:
        // 1. 'isValid': será 'true' solo si el arreglo de errores está vacío (length === 0), o 'false' si se encontró al menos un error.
        // 2. 'errors': el arreglo que contiene todos los mensajes de error que se generaron.
        return { isValid: this.errors.length === 0, errors: this.errors };
    }

    // --- MÉTODOS AUXILIARES ("privados") ---
    // El guion bajo (_) es una convención para indicar que estos métodos son para uso interno de la clase.

    // Revisa si un valor (v) está vacío o nulo. Si lo está, añade un mensaje de error al arreglo 'this.errors'.
    // 'f' es el nombre del campo para el mensaje, 'v' es el valor.
    _checkRequired(f, v) { if (!v) this.errors.push(`El campo '${f}' es obligatorio.`); }
    
    // Revisa si un valor (v), en caso de que exista, NO es un número (isNaN = Is Not a Number).
    _checkIsNumber(f, v) { if (v && isNaN(v)) this.errors.push(`'${f}' debe ser un valor numérico.`); }
    
    // Revisa si un valor (v) está fuera del rango entre 'min' y 'max'.
    _checkInRange(f, v, min, max) { if (v && !isNaN(v) && (parseFloat(v) < min || parseFloat(v) > max)) this.errors.push(`El valor para '${f}' debe estar entre ${min} y ${max}.`); }
    
    // Revisa si un valor (v) es menor o igual a un 'limit'e.
    _checkGreaterThan(f, v, limit) { if (v && !isNaN(v) && parseFloat(v) <= limit) this.errors.push(`'${f}' debe ser mayor que ${limit}.`); }
}