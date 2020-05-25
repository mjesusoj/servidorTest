const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();
let datosCursos = '';
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];

let nombreCurso = '';
let datosAsignaturas = '';
let nombreAsignaturas = [];
let asignaturas = [];
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

// Edición de cursos
router.post('/edicion', (request, response) => {
    let nombreCurso = request.body.nombreCurso;
    let editNombreCurso = request.body.editNombreC;
    let descripcionCurso = request.body.descripcionC;
    let imgCurso = request.body.imagenC;
    modelo.editarCurso(nombreCurso, editNombreCurso, descripcionCurso, imgCurso);
    response.redirect('/administrador/cursos');
});

// Nuevo curso
router.post('/nuevo', (request, response) => {
    let newNombreCurso = request.body.newNombreC;
    let newDescripcionCurso = request.body.newDescripcionC;
    let newImgCurso = request.body.newImagenC;
    modelo.newCurso(newNombreCurso, newDescripcionCurso, newImgCurso);
    response.redirect('/administrador/cursos');
});

router.post('/borrar', (request, response) => {
    let cursoSeleccionado = request.body.selectCursos;
    modelo.borrarCurso(cursoSeleccionado);
    response.redirect('/administrador/cursos');
});

router.get('/curso', (request, response) => {
    if (request.query.nombre != undefined){
        nombreCurso = request.query.nombre;
        cargar();
    }else{
        cargar();
    }
    
    async function cargar(){
        await infAsignaturas();
        cargarAsignaturas(response, nombreCurso);
        nombreAsignaturas = [];
    }
});

// Cargar los temas
router.get('/curso/asignatura', (request, response) => {
    nombreAsignatura = request.query.nombre;
    cargar();
    async function cargar(){
        await infTemas();
        cargarTemas(response);
    }
});

// Editar las asignaturas de los cursos
router.get('/curso/asignatura/edicion', (request, response) => {
    let nombreAsignatura = request.query.nombreAsignatura;
    let editNombreA = request.query.editNombreA;
    
    modelo.editarAsignatura(nombreCurso, nombreAsignatura, editNombreA);
    response.redirect('/administrador/cursos/curso');
});

// Nueva asignatura
router.get('/curso/asignatura/nueva', (request, response) => {
    let newNombreAsignatura = request.query.newNombreA;
    modelo.newAsignatura(nombreCurso, newNombreAsignatura);
    response.redirect('/administrador/cursos/curso');
});

async function infCursos() {
    datosCursos = await modelo.mostrarCursos();
    datosCursos.forEach(function (item, i) {
        nombreCursos.push(item.nombre);
        descripcionCursos.push(item.descripcion);
        imgCursos.push(item.img);
    });
}

function cargarCursos(response) {
    response.render('./partials/cursos.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombreCursos: nombreCursos,
        descripcionCursos: descripcionCursos,
        imgCursos: imgCursos
    });
    vaciarArrays();
}

async function infAsignaturas() {
    datosAsignaturas = await modelo.mostrarAsignaturas(nombreCurso);
    // Si no hay asignaturas, que salga un mensaje
    try{
        let object = {};
        object = datosAsignaturas;
        console.log(object.ObjectName.asignaturas);
        
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
    datosTemas = await modelo.mostrarTemas(nombreAsignatura);
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
    nombreCursos = [];
    descripcionCursos = [];
    imgCursos = [];
    nombreTemas = [];
}

module.exports = router;