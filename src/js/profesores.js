const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const edicionProfesor = require('./edicionProfesor');
const nuevoProfesor = require('./nuevoProfesor');
const router = express.Router();
let tipoProfesor = 1;
let idProfesores = [];
let nombreProfesores = [];
let apellidosProfesores = [];
let correoProfesores = [];
let asignaturasProfesores = [];

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    cargar();
    async function cargar() {
        await infProfesores();
        cargarPagina(response);
    }
});

router.get('/', (request, response) => {
    cargar();
    async function cargar() {
        await infProfesores();
        cargarPagina(response);
    }
});

async function infProfesores() {
    datosProfesores = await modelo.mostrarUsuarios(tipoProfesor);
    datosProfesores.forEach(function (item, i) {
        idProfesores.push(item._id);
        nombreProfesores.push(item.nombre);
        apellidosProfesores.push(item.apellidos);
        correoProfesores.push(item.correo);
        asignaturasProfesores.push(item.asignaturas);
    });
}

function cargarPagina(response) {
    response.render('./partials/profesores.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',

        idProfesores: idProfesores,
        nombreProfesores: nombreProfesores,
        apellidosProfesores: apellidosProfesores,
        correoProfesores: correoProfesores,
        asignaturasProfesores: asignaturasProfesores,
    });
    vaciarArrays();
}

function vaciarArrays() {
    idProfesores = [];
    nombreProfesores = [];
    apellidosProfesores = [];
    correoProfesores = [];
    asignaturasProfesores = [];
}

router.use('/edicion', edicionProfesor);
router.use('/nuevo', nuevoProfesor);

module.exports = router;