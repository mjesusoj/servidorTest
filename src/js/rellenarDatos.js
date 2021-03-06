let profesorSeleccionado = '';
let alumnoSeleccionado = '';
let cursoSeleccionado = '';
let nombre2Seleccionado = '';
let temaSeleccionado = '';

$(document).ready(function () {
    $('.editarProfe').click(function () {
        $('#idProfesor').val(this.id);
        profesorSeleccionado = '#' + this.id;
        let contenidoProfesor = '';
        let datosProfesor = [];
        let asignaturas = [];
        let separarAsignaturas = '';
        for (let i=0;i<4;i++){
            contenidoProfesor = $(profesorSeleccionado).parent().parent().children()[i];
            datosProfesor.push(contenidoProfesor.textContent);
        }

        $('.nombreProfesor').val(datosProfesor[0]);
        $('.apellidosProfesor').val(datosProfesor[1]);
        $('.correoProfesor').val(datosProfesor[2]);
        separarAsignaturas = datosProfesor[3].split(',');
        asignaturas.push(separarAsignaturas);
        
        asignaturas.forEach(function(item, i) {
            $('.asignaturasP').val(asignaturas[i]);
        });
    });

    $('.editarAlumno').click(function () {
        $('#idAlumno').val(this.id);
        alumnoSeleccionado = '#' + this.id;
        let contenidoAlumno = '';
        let datosAlumno = [];
        let separarCursos = '';
        for (let i=0;i<4;i++){
            contenidoAlumno = $(alumnoSeleccionado).parent().parent().children()[i];
            datosAlumno.push(contenidoAlumno.textContent);
        }

        $('.nombreAlumno').val(datosAlumno[0]);
        $('.apellidosAlumno').val(datosAlumno[1]);
        $('.correoAlumno').val(datosAlumno[2]);
        separarCursos = datosAlumno[3].split(',');
    });

    $('.editarCurso').click(function () {
        /* Se introduce en el valor del input nombreCurso 
           el id del botón de editarCurso */
        $('#nombreCurso').val(this.id);
        cursoSeleccionado = '#' + this.id;
        let contenidoCurso = $(cursoSeleccionado).parent().children();
        let datosCurso = [];

        for(let i=0;i<contenidoCurso.length;i++){
            datosCurso.push(contenidoCurso[i].textContent);
        }

        $('.editNombreCurso').val(datosCurso[0]);
        $('.descripcionCurso').val(datosCurso[1]);
    });

    $('.editar2').click(function () {
        $('#nombre2').val(this.id);
        nombre2Seleccionado = '#' + this.id;
        
        let contenido = $(nombre2Seleccionado).parent().parent().children()[0];
        let nombre = contenido.textContent;

        $('.nombre2').val(nombre);
    });

    /*    
        $('.editarTema').click(function () {
            $('#nombreTema').val(this.id);
            temaSeleccionado = '#' + this.id;
            
            let contenidoTema = $(temaSeleccionado).parent().parent().children()[0];
            let nombreTema = contenidoTema.textContent;

            $('.newNombreTema').val(nombreTema);
        }); 
    */

    /*     
        $('.borrarCurso').click(function (){
            $('.borrarCurso').parent()
        }); 
    */
});