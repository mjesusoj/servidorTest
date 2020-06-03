const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const md5 = require('blueimp-md5');
const router = express.Router();
let tipoProfesor = 1;
let nombreProfesores = [];
let apellidosProfesores = [];
let correoProfesores = [];
let asignaturasProfesores = [];
let todasAsignaturas = [];

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (request, response) => {
    cargar();
    async function cargar() {
        await infProfesores();
        await infAsignaturas();
        cargarPagina(response);
    }
});

// Edición
router.post('/edicion', (request, response) => {
    var nombreProfesor = request.body.nombreP;
    var apellidosProfesor = request.body.apellidosP;
    var correoProfesor = request.body.correoP;
    var asignaturasProfesor = request.body.asignaturasP;
    modelo.editarProfesores(nombreProfesor, apellidosProfesor, correoProfesor, asignaturasProfesor);
    response.redirect('/administrador/profesores');
});

// Nuevo
router.post('/nuevo', (request, response) => {
    var newUsuarioP = request.body.newUsuarioP;
    var newNombreP = request.body.newNombreP;
    var newApellidosP = request.body.newApellidosP;
    var newPasswordP = md5(request.body.newPasswordP);
    var newCorreoP = request.body.newCorreoP;
    var newAsignaturasP = request.body.newAsignaturasP;
    modelo.newProfesor(newUsuarioP, newNombreP, newApellidosP, newPasswordP, newCorreoP, newAsignaturasP);
    response.redirect('/administrador/profesores');
});

// Borrar
router.post('/borrar', (request, response) => {
    let profesorSeleccionado = request.body.selectProfesores;
    modelo.borrarProfesores(profesorSeleccionado);
    response.redirect('/administrador/profesores');
});

async function infProfesores() {
    datosProfesores = await modelo.mostrarUsuarios(tipoProfesor);
    datosProfesores.forEach(function (item, i) {
        nombreProfesores.push(item.nombre);
        apellidosProfesores.push(item.apellidos);
        correoProfesores.push(item.correo);
        asignaturasProfesores.push(item.asignaturas);
    });
}

async function infAsignaturas() {
    asignaturas = await modelo.mostrarTodasAsignaturas();
    let todosDatosAsig = Object.values(asignaturas);
    let arrayNombre = [];
    let arrayCurso = [];

    for (let i = 0; i < todosDatosAsig.length; i++) {
        arrayNombre.push(todosDatosAsig[i].nombre);
        arrayCurso.push(todosDatosAsig[i].curso);
    }
    for (let i = 0; i < arrayNombre.length; i++) {
        todasAsignaturas.push(arrayNombre[i] + ' de ' + arrayCurso[i]);
    }
}

function cargarPagina(response) {
    response.render('./partials/profesores.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreProfesores: nombreProfesores,
        apellidosProfesores: apellidosProfesores,
        correoProfesores: correoProfesores,
        asignaturasProfesores: asignaturasProfesores,
        todasAsignaturas: todasAsignaturas
    });
    vaciarArrays();
}

function vaciarArrays() {
    nombreProfesores = [];
    apellidosProfesores = [];
    correoProfesores = [];
    asignaturasProfesores = [];
    todasAsignaturas = [];
}

module.exports = router;