const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();
let datosCursos = '';
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];

let nombreCurso = '';
let datosA = '';
let nombreAsignaturas = [];
let nombreAsignatura = '';
let mensajedbVacio = '';
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

// Borrar curso
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

// Nueva asignatura
router.get('/curso/asignatura/nueva', (request, response) => {
    let newNombreAsignatura = request.query.newNombre;
    modelo.newAsignatura(nombreCurso, newNombreAsignatura);
    response.redirect('/administrador/cursos/curso');
});

// Editar las asignaturas de los cursos
router.get('/curso/asignatura/edicion', (request, response) => {
    let nombreAsignatura = request.query.nombreAsignatura;
    let editNombreA = request.query.editNombre;
    modelo.editarAsignatura(nombreCurso, nombreAsignatura, editNombreA);
    response.redirect('/administrador/cursos/curso');
});

// Borrar asignatura
router.get('/curso/asignatura/borrar', (request, response) => {
    let asignaturaSeleccionada = request.query.selectAsignaturas;
    modelo.borrarAsignatura(nombreCurso, asignaturaSeleccionada);
    response.redirect('/administrador/cursos/curso');
});

// Nuevo tema
router.get('/curso/asignatura/tema/nuevo', (request, response) => {
    let newNombreTema = request.query.newNombre;
    modelo.newTema(nombreCurso, nombreAsignatura, newNombreTema);
    response.redirect('/administrador/cursos/curso/asignatura');
});

// Editar los temas de las asignaturas
router.get('/curso/asignatura/tema/edicion', (request, response) => {
    let nombreTema = request.query.nombreTema;
    let editNombreT = request.query.editNombreA;
    modelo.editarTema(nombreCurso, nombreTema, editNombreT);
    response.redirect('/administrador/cursos/curso/asignatura');
});

// Borrar tema
router.get('/curso/asignatura/tema/borrar', (request, response) => {
    let temaSeleccionado = request.query.selectTemas;
    modelo.borrarTema(nombreCurso, temaSeleccionado);
    response.redirect('/administrador/cursos/curso/asignatura');
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
    datosA = await modelo.mostrarAsignaturas(nombreCurso);
    let datosAsig = Object.values(datosA)[0];
    let datosAsignaturas = Object.values(datosAsig)[0];

    // Si no hay asignaturas, que salga un mensaje
    try{
        for (let i=0; i<datosAsignaturas.length; i++){
            nombreAsignaturas.push(datosAsignaturas[i]);
        }
    }catch{
        mensajedbVacio = 'No hay asignaturas (Pulsa en "Nueva Asignatura", para añadir una)';
    }
}

function cargarAsignaturas(response, nombreCurso) {
    response.render('./partials/asignaturas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombre1: nombreCurso,
        nombre2: nombreAsignaturas,
        mensajedbVacio: mensajedbVacio,
        tituloEdicion: 'Edición de Asignatura',
        tituloNew: 'Nueva Asignatura',
        tituloBorrar: 'Borrar Asignatura',
        direccionJSEdicion: '/administrador/cursos/curso/asignatura/edicion',
        direccionJSNueva: '/administrador/cursos/curso/asignatura/nueva',
        direccionJSBorrar: '/administrador/cursos/curso/asignatura/borrar'
    });
    vaciarArrays();
    mensajedbVacio = '';
}

async function infTemas() {
    let datos = await modelo.mostrarTemas(nombreCurso, nombreAsignatura);
    let datosTem = Object.values(datos)[0];
    let datosTemas = Object.values(datosTem)[0];

    try{
        for (let i=0; i<datosTemas.length; i++){
            nombreTemas.push(datosTemas[i]);
        }

        console.log(datosTem);
        console.log(nombreTemas);
    }catch{
        mensajedbVacio = 'No hay asignaturas (Pulsa en "Nueva Asignatura", para añadir una)';
    }
}

function cargarTemas(response) {
    response.render('./partials/asignaturas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        nombre1: nombreAsignatura,
        nombre2: nombreTemas,
        mensajedbVacio: mensajedbVacio,
        tituloEdicion: 'Edición de Tema',
        tituloNew: 'Nuevo Tema',
        tituloBorrar: 'Borrar Tema',
        direccionJSEdicion: '/administrador/cursos/curso/asignatura/tema/edicion',
        direccionJSNueva: '/administrador/cursos/curso/asignatura/tema/nuevo',
        direccionJSBorrar: '/administrador/cursos/asignatura/tema/borrar'
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