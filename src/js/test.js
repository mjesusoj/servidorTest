$(document).ready(function () {
    let implementarCambios = $('.implementarCambios');
    let formGuardar = $('#formGuardar');
    let btnPreguntas = $('.btnPreguntas');
    let formPreguntas = $('.formPreguntas');
    implementarCambios.click(function () {
        // Recoger los valores de los input duraciónTest y número de preguntas
        let duracionTest = $('#duracionTest').val();
        let numPreguntasTest = $('#numPreguntasTest').val();

        // Guardar en los input del form guardarCambios los valores
        $('#duracionT').val(duracionTest);
        $('#numPreguntasT').val(numPreguntasTest);
    });

    formGuardar.submit(function () {
        btnPreguntas.click();
    });

    formPreguntas.submit(function (event) {
        // Se recogen los datos
        let enunciadoPregunta = $('.enunciadoPregunta');
        let correctas = $('.correctas');
        let incorrectas = $('.incorrectas');
        let arrayEnunciados = [];
        let arrayCorrectas = [];
        let arrayIncorrectas = [];
        // Bucle enunciados
        for (let i = 0; i < enunciadoPregunta.length; i++) {
            arrayEnunciados.push(enunciadoPregunta[i].value);
        }

        // Bucle preguntas correctas
        for (let i = 0; i < correctas.length; i++) {
            arrayCorrectas.push(correctas[i].value);
        }

        // Bucle preguntas incorrectas
        for (let i = 0; i < incorrectas.length; i++) {
            arrayIncorrectas.push(incorrectas[i].value);
        }

        let respuestasCorrectas = valores(arrayCorrectas);
        let respuestasIncorrectas = valores(arrayIncorrectas);
        
        comaEnunciado(arrayEnunciados);
        comaCorrecta(respuestasCorrectas);
        comaIncorrecta(respuestasIncorrectas);

        $('#enunciadosTest').val(arrayEnunciados);
        $('#correctasTest').val(respuestasCorrectas);
        $('#incorrectasTest').val(respuestasIncorrectas);

        function comaEnunciado(texto) {
            let re = /,/gi;
            for (let i = 0; i < texto.length; i++) {
                arrayEnunciados[i] = texto[i].replace(re, '_');
            }
        }
        function comaCorrecta(texto) {
            let re = /,/gi;
            for (let i = 0; i < texto.length; i++) {
                respuestasCorrectas[i] = texto[i].replace(re, '_');
            }
        }
        function comaIncorrecta(texto) {
            let re = /,/gi;
            for (let i = 0; i < texto.length; i++) {
                respuestasIncorrectas[i] = texto[i].replace(re, '_');
            }
        }

        function valores(array) {
            let arrayFinal = [];
            let respuestas = '';
            let j = 1;
            for (let i = 0; i < array.length; i++) {
                respuestas += array[i] + '|';
                if (j > 3) {
                    arrayFinal.push(respuestas);
                    j = 0;
                    respuestas = '';
                }
                j++;
            }
            return arrayFinal;
        }
        
        event.preventDefault();
    });
});