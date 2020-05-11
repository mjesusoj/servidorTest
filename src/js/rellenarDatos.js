let profesorSeleccionado = '';
let alumnoSeleccionado = '';

$(document).ready(function () {
    $('.2º-DAW').click(function () {
        $('#2º-DAW').tab('show');
        $('.cursos').hide();
    });

    $('#list-profesores button').click(function () {
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

    $('#list-alumnos button').click(function () {
        $('#idAlumno').val(this.id);
        alumnoSeleccionado = '#' + this.id;
        let contenidoAlumno = '';
        let datosAlumno = [];
        let cursos = [];
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
});