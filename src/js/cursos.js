const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();
let datosCursos = '';
let idCursos = [];
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];
let nombreAsignaturas = [];

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    cargar();
    async function cargar() {
        await infCursos();
        cargarPagina(response);
    }
});

router.get('/', (request, response) => {
    cargar();
    async function cargar(){
        await infCursos();
        cargarPagina(response);
    }
});

router.get('/curso', (request, response) => {
    cargar();
    async function cargar(){
        await infCursos();
        cargarPagina(response);
    }
});

router.post('/curso/edicion', (request, response) => {
    let idCurso = request.body.idCurso;
    let nombreCurso = request.body.nombreC;
    let descripcionCurso = request.body.descripcionC;
    let imgCurso = request.body.imagenC;
    modelo.editarCurso(idCurso, nombreCurso, descripcionCurso, imgCurso);
    response.redirect('/administrador/cursos');
});

async function infCursos() {
    datosCursos = await modelo.mostrarCursos();
    datosCursos.forEach(function (item, i) {
        idCursos.push(item._id);
        nombreCursos.push(item.nombre);
        descripcionCursos.push(item.descripcion);
        imgCursos.push(item.img);
        nombreAsignaturas.push(item.asignaturas.nombre);
    });
}

function cargarPagina(response) {
    response.render('./partials/cursos.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        idCursos: idCursos,
        nombreCursos: nombreCursos,
        descripcionCursos: descripcionCursos,
        imgCursos: imgCursos,
        asignaturas: nombreAsignaturas,
    });
    vaciarArrays();
}

function vaciarArrays() {
    idCursos = [];
    nombreCursos = [];
    descripcionCursos = [];
    imgCursos = [];
    nombreAsignaturas = [];
}

module.exports = router;