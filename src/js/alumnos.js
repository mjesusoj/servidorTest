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
    console.log(alumnoSeleccionado);
    
    modelo.borrarAlumnos(alumnoSeleccionado);
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
}

function cargarPagina(response) {
    response.render('./partials/alumnos.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreAlumnos: nombreAlumnos,
        apellidosAlumnos: apellidosAlumnos,
        correoAlumnos: correoAlumnos,
        cursosAlumnos: cursosAlumnos
    });

    vaciarArrays();
}

function vaciarArrays() {
    nombreAlumnos = [];
    apellidosAlumnos = [];
    correoAlumnos = [];
    cursosAlumnos = [];
}

module.exports = router;