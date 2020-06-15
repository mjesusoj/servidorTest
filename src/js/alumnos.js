const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const md5 = require('blueimp-md5');
const router = express.Router();
let tipoAlumno = 2;
let datosAlumnos = [];
let nombreAlumnos = [];
let apellidosAlumnos = [];
let correoAlumnos = [];
let cursosAlumnos = [];
let mensajedbVacio = '';
let tipoAlerta = '';

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (request, response) => {
    cargar();
    async function cargar() {
        await infAlumnos();
        cargarPagina(response);
    }
});

// Edición
router.post('/edicion', (request, response) => {
    var nombreAlumno = request.body.nombreA;
    var apellidosAlumno = request.body.apellidosA;
    var correoAlumno = request.body.correoA;
    var asignaturasAlumno = request.body.asignaturasA;
    modelo.editarAlumnos(nombreAlumno, apellidosAlumno, correoAlumno, asignaturasAlumno);
    response.redirect('/administrador/alumnos');
    response.end();
});

// Nuevo
router.post('/nuevo', (request, response) => {
    var newUsuarioA = request.body.newUsuarioA;
    var newNombreA = request.body.newNombreA;
    var newApellidosA = request.body.newApellidosA;
    var newPasswordA = md5(request.body.newPasswordA);
    var newCorreoA = request.body.newCorreoA;
    var newCursosA = request.body.newCursosA;
    modelo.newAlumno(newUsuarioA, newNombreA, newApellidosA, newPasswordA, newCorreoA, newCursosA);
    response.redirect('/administrador/alumnos');
    response.end();
});

// Borrar
router.post('/borrar', (request, response) => {
    let alumnoSeleccionado = request.body.selectAlumnos;
    if (typeof alumnoSeleccionado == 'string') {
        modelo.borrarAlumnos(alumnoSeleccionado);
    } else{
        if (alumnoSeleccionado != undefined){
            for (let i = 0; i < alumnoSeleccionado.length; i++) {
                modelo.borrarAlumnos(alumnoSeleccionado[i]);
            }
        } else {
            mensajedbVacio = 'Tiene que elegir un alumno a borrar';
            tipoAlerta = 'alert alert-danger';
        }
    }
    response.redirect('/administrador/alumnos');
});

async function infAlumnos() {
    datosAlumnos = await modelo.mostrarUsuarios(tipoAlumno);
    datosAlumnos.forEach(function (item, i) {
        nombreAlumnos.push(item.nombre);
        apellidosAlumnos.push(item.apellidos);
        correoAlumnos.push(item.correo);
        cursosAlumnos.push(item.cursos);
    });

    if (nombreAlumnos == ''){
        mensajedbVacio = 'No hay alumnos (Pulsa en "Nuevo Alumno", para añadir uno)';
        tipoAlerta = 'alert alert-warning';
    }    
}

function cargarPagina(response) {
    response.render('./partials/alumnos.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreAlumnos: nombreAlumnos,
        apellidosAlumnos: apellidosAlumnos,
        correoAlumnos: correoAlumnos,
        cursosAlumnos: cursosAlumnos,
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

function vaciarArrays() {
    nombreAlumnos = [];
    apellidosAlumnos = [];
    correoAlumnos = [];
    cursosAlumnos = [];
}

module.exports = router;