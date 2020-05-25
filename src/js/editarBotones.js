$(document).ready(function(){
    let btnCursos = $('.btnCursos');
    let btnProfesores = $('.btnProfesores');
    let btnAlumnos = $('.btnAlumnos');
    let editarCurso = $('.editarCurso');
    let borrarCurso = $('.borrarCurso');
    let volverCurso = $('.volverCurso');

    btnCursos.click(function(){
        btnCursos.addClass('active');
    });
    
    btnProfesores.click(function(){
        btnProfesores.addClass('active');
    });

    btnAlumnos.click(function(){
        btnAlumnos.addClass('active');
    });

    // Editar Curso
    editarCurso.click(function(event){
        event.preventDefault();
    })
});