// Se define una 'clase', que es como una plantilla o un molde para crear objetos.
// En este caso, cada 'paciente' que creemos será un objeto hecho a partir de esta plantilla.
class Patient {

    // El 'constructor' es una función especial que se ejecuta automáticamente cada vez que creamos un nuevo paciente (ej: new Patient(...)).
    // Recibe todos los datos del formulario como 'parámetros' o 'argumentos'.
    constructor(nombre, apellidoPaterno, apellidoMaterno, rut, edad, sexo, temperatura, presionSistolica, presionDiastolica, pulsaciones, spo2, nivelDolor, alergias, medicamentos, sintomas, diagnostico = '') {
        
        // ---- PROPIEDADES DEL OBJETO PACIENTE ----
        // 'this' se refiere al objeto paciente que se está creando en este momento.

        // Se le asigna un ID único usando la fecha y hora actual en milisegundos. Es una forma simple de asegurar que cada paciente tenga un ID diferente.
        this.id = Date.now(); 
        
        // Se asignan los datos personales recibidos del formulario a las propiedades del objeto.
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.rut = rut;
        this.edad = edad;
        this.sexo = sexo;
        
        // Agrupamos los signos vitales en un sub-objeto para mantener el código más ordenado.
        this.signosVitales = {
            temperatura: temperatura,
            presion: { 
                sistolica: presionSistolica, 
                diastolica: presionDiastolica 
            },
            pulsaciones: pulsaciones,
            spo2: spo2
        };

        // Hacemos lo mismo con la otra información clínica.
        this.informacionClinica = {
            nivelDolor: nivelDolor,
            alergias: alergias,
            medicamentos: medicamentos
        };
        
        // Se guarda el diagnóstico que ingresa el personal médico.
        this.diagnostico = diagnostico;
        
        // Se guarda el arreglo de síntomas que seleccionó el usuario.
        this.sintomas = sintomas;
        
        // ---- ACCIONES AL CREAR EL PACIENTE ----
        
        // Se llama inmediatamente a otro método de esta misma clase para revisar los signos vitales y añadir síntomas si es necesario.
        this.detectarSintomasAutomaticos();
        
        // Se llama al método que clasifica la urgencia y se guarda el resultado (ej: "Roja") en la propiedad 'urgencia'.
        // Es importante que se llame DESPUÉS de detectar síntomas automáticos para que la cuenta sea correcta.
        this.urgencia = this.clasificarUrgencia();
        
        // Se crea una marca de tiempo de cuándo se registró el paciente, formateada para Chile.
        this.fechaRegistro = new Date().toLocaleString('es-CL');
    }

    // Este método revisa los valores de los signos vitales para añadir síntomas que el usuario quizás no mencionó.
    detectarSintomasAutomaticos() {
        // Si la temperatura es mayor a 37.8 Y el síntoma 'Fiebre' no fue ya añadido...
        if (this.signosVitales.temperatura > 37.8 && !this.sintomas.includes('Fiebre')) {
            // ...entonces se añade 'Fiebre' al principio de la lista de síntomas. 'unshift' lo añade al inicio.
            this.sintomas.unshift('Fiebre');
        }
        // Si la presión sistólica es mayor a 140 O la diastólica es mayor a 90...
        if (this.signosVitales.presion.sistolica > 140 || this.signosVitales.presion.diastolica > 90) {
            // ...y el síntoma 'Presión alta' no ha sido añadido...
            if (!this.sintomas.includes('Presión alta')) {
                // ...se añade al principio de la lista.
                this.sintomas.unshift('Presión alta');
            }
        }
        // La misma lógica para la presión baja.
        if (this.signosVitales.presion.sistolica < 90 || this.signosVitales.presion.diastolica < 60) {
            if (!this.sintomas.includes('Presión baja')) {
                this.sintomas.unshift('Presión baja');
            }
        }
    }

    // Este método determina el color de la urgencia basado en la cantidad total de síntomas.
    clasificarUrgencia() {
        // Se obtiene el número total de síntomas del arreglo.
        const numSintomas = this.sintomas.length;

        // 1. Se revisa primero el caso más grave. El orden de los 'if' es crucial.
        // Si tiene 6 o más síntomas, la función devuelve 'Roja' y termina su ejecución aquí.
        if (numSintomas >= 6) {
            return 'Roja';
        }
        
        // 2. Si la condición anterior no se cumplió, se pasa a la siguiente.
        // Si tiene 4 o 5 síntomas, devuelve 'Amarillo' y termina.
        if (numSintomas >= 4) { // No hace falta poner 'numSintomas <= 5' porque el caso de 6 o más ya fue capturado arriba.
            return 'Amarillo';
        }

        // 3. Si ninguna de las condiciones anteriores se cumplió, significa que tiene 3 síntomas o menos.
        // Por descarte, devuelve 'Verde'.
        return 'Verde';
    }
}