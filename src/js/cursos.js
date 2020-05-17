const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();
let datosCursos = '';
let idCursosMod = [];
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];

let idCurso = '';
let datosAsignaturas = '';
let nombreAsignaturas = [];
let nombreAsignatura = '';
let mensajedbVacio = '';
let datosTemas = '';
let nombreTemas = '';

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    cargar();
    async function cargar() {
        await infCursos();
        cargarCursos(response);
    }
});

router.get('/', (request, response) => {
    cargar();
    async function cargar(){
        await infCursos();
        cargarCursos(response);
    }
});

router.post('/curso', (request, response) => {
    idCurso = request.body.idCurso;
    let nombreCurso = request.body.nombreCurso;
    cargar();
    async function cargar(){
        await infAsignaturas();
        cargarAsignaturas(response, nombreCurso);
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

router.post('/curso/nuevo', (request, response) => {
    let newNombreCurso = request.body.newNombreC;
    let newDescripcionCurso = request.body.newDescripcionC;
    let newImgCurso = request.body.newImagenC;
    modelo.newCurso(newNombreCurso, newDescripcionCurso, newImgCurso);
    response.redirect('/administrador/cursos');
});

router.post('/curso/asignatura', (request, response) => {
    nombreAsignatura = request.body.nombre;
    cargar();
    async function cargar(){
        await infTemas();
        cargarTemas(response);
    }
});

async function infCursos() {
    datosCursos = await modelo.mostrarCursos();
    datosCursos.forEach(function (item, i) {
        idCursosMod.push(item._id);
        nombreCursos.push(item.nombre);
        descripcionCursos.push(item.descripcion);
        imgCursos.push(item.img);
    });
}

function cargarCursos(response) {
    response.render('./partials/cursos.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        idCursos: idCursosMod,
        nombreCursos: nombreCursos,
        descripcionCursos: descripcionCursos,
        imgCursos: imgCursos
    });
    vaciarArrays();
}

async function infAsignaturas() {
    datosAsignaturas = await modelo.mostrarAsignaturas(idCurso);
    // Si no hay asignaturas, que salga un mensaje
    try{
        datosAsignaturas.forEach(function (item, i) {
            nombreAsignaturas.push(item.asignaturas.nombre);
        });
    }catch{
        mensajedbVacio = 'No hay asignaturas (Pulsa en "Nueva Asignatura", para añadir una)';
    }
}

function cargarAsignaturas(response, nombreCurso) {
    response.render('./partials/asignaturas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreCurso: nombreCurso,
        nombreAsignaturas: nombreAsignaturas,
        mensajedbVacio: mensajedbVacio
    });
    vaciarArrays();
    mensajedbVacio = '';
}

async function infTemas() {
    datosTemas = await modelo.mostrarTemas(idCurso, nombreAsignatura);
    try{
        datosTemas.forEach(function (item, i) {
            nombreTemas.push(item.asignaturas.temas.nombre);
        });
    }catch{
        mensajedbVacio = 'No hay temas';
    }
}

function cargarTemas(response) {
    response.render('./partials/temas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreAsignatura: nombreAsignatura,
        nombreTemas: nombreTemas,
        mensajedbVacio: mensajedbVacio
    });
    vaciarArrays();
    mensajedbVacio = '';
}

function vaciarArrays() {
    idCursosMod = [];
    nombreCursos = [];
    descripcionCursos = [];
    imgCursos = [];
    nombreCurso = [];
    nombreAsignaturas = [];
    nombreTemas = [];
}

module.exports = router;