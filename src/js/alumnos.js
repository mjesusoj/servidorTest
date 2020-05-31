const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const edicionAlumno = require('./edicionAlumno');
const nuevoAlumno = require('./nuevoAlumno');
const router = express.Router();
let tipoAlumno = 2;
let datosAlumnos = [];
let nombreAlumnos = [];
let apellidosAlumnos = [];
let correoAlumnos = [];
let cursosAlumnos = [];

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    cargar();
    async function cargar() {
        await infAlumnos();
        cargarPagina(response);
    }
});

router.get('/', (request, response) => {
    cargar();
    async function cargar() {
        await infAlumnos();
        cargarPagina(response);
    }
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

router.use('/edicion', edicionAlumno);
router.use('/nuevo', nuevoAlumno);

module.exports = router;