const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();
let datosCursos = '';
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];

let nombreCurso = '';
let imgCurso = '';
let datosA = '';
let nombreAsignaturas = [];
let nombreAsignatura = '';
let mensajedbVacio = '';
let nombreTema = '';
let nombreTemas = [];
let nombreTests = [];
let tituloTest = '';
let numPreguntasTest = 1;
let duracionTest = 3;
let datosT = '';
let testDatos = '';
let duracionTestDatos = '';
let enunciadosTest = [];
let correctasTest = [];
let incorrectasTest = [];
let breadPaginas = [];
let tipoAlerta = '';

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (request, response) => {
    if (request.query.seccion != undefined) {
        breadPaginas.push('./');
        cargar();
    } else {
        breadPaginas.push('../');
        cargar();
    }
    
    async function cargar() {
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
    if (typeof cursoSeleccionado == 'string') {
        modelo.borrarCurso(cursoSeleccionado);
    } else {
        if (cursoSeleccionado != undefined){
            for (let i = 0; i < cursoSeleccionado.length; i++) {
                modelo.borrarCurso(cursoSeleccionado[i]);
            }
        } else {
            mensajedbVacio = 'Tiene que elegir un curso a borrar';
            tipoAlerta = 'alert alert-danger';
        }
    }
    response.redirect('/administrador/cursos');
});

router.get('/curso', (request, response) => {
    if (request.query.nombre != undefined) {        
        nombreCurso = request.query.nombre;
        imgCurso = request.query.img;
        breadPaginas.push('../');
        breadPaginas.push('./');
        cargar();
    } else {
        breadPaginas.push('../../');
        breadPaginas.push('../');
        cargar();
    }

    async function cargar() {
        await infAsignaturas();
        cargarAsignaturas(response, nombreCurso);
        nombreAsignaturas = [];
    }
});

// Cargar los temas
router.get('/curso/asignatura', (request, response) => {
    if (request.query.nombre != undefined) {
        nombreAsignatura = request.query.nombre;        
        breadPaginas.push('../../');
        breadPaginas.push('../');
        breadPaginas.push('.');
        cargar();
    } else {
        breadPaginas.push('../../../');
        breadPaginas.push('../../');
        breadPaginas.push('../');
        cargar();
    }

    async function cargar() {
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
    let nombreAsignatura = request.query.nombre2;
    let editNombreA = request.query.editNombre2;
    modelo.editarAsignatura(nombreCurso, nombreAsignatura, editNombreA);
    response.redirect('/administrador/cursos/curso');
});

// Borrar asignatura
router.get('/curso/asignatura/borrar', (request, response) => {
    let asignaturaSeleccionada = request.query.select;
    if (typeof asignaturaSeleccionada == 'string') {
        modelo.borrarAsignatura(nombreCurso, asignaturaSeleccionada);
    } else {
        if (asignaturaSeleccionada != undefined){
            for (let i = 0; i < asignaturaSeleccionada.length; i++) {
                modelo.borrarAsignatura(nombreCurso, asignaturaSeleccionada[i]);
            }
        } else {
            mensajedbVacio = 'Tiene que elegir una asignatura a borrar';
            tipoAlerta = 'alert alert-danger';
        }
    }
    response.redirect('/administrador/cursos/curso');
});

// Ver el contenido de los temas
router.get('/curso/asignatura/tema', (request, response) => {
    if (request.query.nombre != undefined) {
        nombreTema = request.query.nombre;
        breadPaginas.push('../../../');
        breadPaginas.push('../../');
        breadPaginas.push('../');
        breadPaginas.push('.');
        cargar();
    } else {
        breadPaginas.push('../../../../');
        breadPaginas.push('../../../');
        breadPaginas.push('../../');
        breadPaginas.push('../');
        cargar();
    }

    async function cargar() {
        await infTests();
        cargarTests(response, nombreTema);
        nombreTests = [];
        breadPaginas = [];
    }
});

// Nuevo tema
router.get('/curso/asignatura/tema/nuevo', (request, response) => {
    let newNombreTema = request.query.newNombre;
    modelo.newTema(nombreCurso, nombreAsignatura, newNombreTema);
    response.redirect('/administrador/cursos/curso/asignatura');
});

// Editar los temas de las asignaturas
router.get('/curso/asignatura/tema/edicion', (request, response) => {
    let nombreTema = request.query.nombre2;
    let editNombreT = request.query.editNombre2;
    modelo.editarTema(nombreCurso, nombreAsignatura, nombreTema, editNombreT);
    response.redirect('/administrador/cursos/curso/asignatura');
});

// Borrar tema
router.get('/curso/asignatura/tema/borrar', (request, response) => {
    let temaSeleccionado = request.query.select;
    if (typeof temaSeleccionado == 'string') {
        modelo.borrarTema(nombreCurso, nombreAsignatura, temaSeleccionado);
    } else {
        if (temaSeleccionado != undefined){
            for (let i = 0; i < temaSeleccionado.length; i++) {
                modelo.borrarTema(nombreCurso, nombreAsignatura, temaSeleccionado[i]);
            }
        } else {
            mensajedbVacio = 'Tiene que elegir un tema a borrar';
            tipoAlerta = 'alert alert-danger';
        }
    }
    response.redirect('/administrador/cursos/curso/asignatura');
});

// Test
router.get('/curso/asignatura/tema/test', (request, response) => {
    cargarPaginaTest(response);
});

// Nuevo test
router.get('/curso/asignatura/tema/test/nuevo', (request, response) => {
    tituloTest = request.query.newNombre;
    numPreguntasTest = request.query.numPreguntas;
    duracionTest = request.query.duracionTest;

    if (numPreguntasTest < 1) {
        numPreguntasTest = 1;
    }
    if (duracionTest > 360) {
        duracionTest = 360;
    } else if (duracionTest < 3) {
        duracionTest = 3;
    }

    response.redirect('/administrador/cursos/curso/asignatura/tema/test');
});

// Guardar test
router.get('/curso/asignatura/tema/test/guardar', (request, response) => {
    let enunciadosTest = request.query.enunciados;
    let correctasTest = request.query.correctas;
    let incorrectasTest = request.query.incorrectas;

    let enunciados = recoger(enunciadosTest);
    let correctas = recoger(correctasTest);
    let incorrectas = recoger(incorrectasTest);

    function recoger(valorTest) {
        let devolver = [];
        let string = '';
        for (let i = 0; i < valorTest.length; i++) {
            if (valorTest[i] != ',') {
                string += valorTest[i];
            } else {
                devolver.push(string);
                string = '';
            }
        }
        devolver.push(string);
        return devolver;
    }

    modelo.newTest(nombreCurso, nombreAsignatura, nombreTema, tituloTest, duracionTest, enunciados, correctas, incorrectas);
    response.redirect('/administrador/cursos/curso/asignatura/tema');
})

// Editar los tests de las temas
router.get('/curso/asignatura/tema/test/editNumPreguntas', (request, response) => {
    // Cambiar valores antiguos por los nuevos
    duracionTest = request.query.duracionT;
    numPreguntasTest = request.query.numPreguntasT;
    if (numPreguntasTest < 1) {
        numPreguntasTest = 1;
    } else if (numPreguntasTest > 1000) {
        numPreguntasTest = 1000;
    }
    
    if (duracionTest > 360) {
        duracionTest = 360;
    } else if (duracionTest < 3) {
        duracionTest = 3;
    }
    response.redirect('/administrador/cursos/curso/asignatura/tema/test');
});

// Borrar tests
router.get('/curso/asignatura/tema/test/borrar', (request, response) => {
    let testSeleccionado = request.query.select;
    if (typeof testSeleccionado == 'string') {
        modelo.borrarTest(nombreCurso, nombreAsignatura, nombreTema, testSeleccionado);
    } else {
        if (testSeleccionado != undefined){
            for (let i = 0; i < testSeleccionado.length; i++) {
                modelo.borrarTest(nombreCurso, nombreAsignatura, nombreTema, testSeleccionado[i]);
            }
        } else {
            mensajedbVacio = 'Tiene que elegir un test a eliminar';
            tipoAlerta = 'alert alert-danger';
        }
    }
    response.redirect('/administrador/cursos/curso/asignatura/tema');
});

// Detalles de los tests
router.get('/curso/asignatura/tema/test/detalles', (request, response) => {
    let nombreTest = request.query.nombre;
    breadPaginas.push('../../../../../');
    breadPaginas.push('../../../../');
    breadPaginas.push('../../../');
    breadPaginas.push('../../');
    breadPaginas.push('..');
    cargar();
    async function cargar() {
        breadPaginas.push('../../../../../');
        breadPaginas.push('../../../../');
        breadPaginas.push('../../../');
        breadPaginas.push('../../');
        breadPaginas.push('../');
        await infTestDetalles(nombreTest);
        cargarPaginaTestDetalles(response, nombreTest);
    }
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
        breadPaginas: breadPaginas,
        nombreCursos: nombreCursos,
        descripcionCursos: descripcionCursos,
        imgCursos: imgCursos,
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

async function infAsignaturas() {
    datosA = await modelo.mostrarAsignaturas(nombreCurso);
    let datosAsig = Object.values(datosA)[0];
    let datosAsignaturas = Object.values(datosAsig)[0];

    // Si no hay asignaturas, que salga un mensaje
    try {
        for (let i = 0; i < datosAsignaturas.length; i++) {
            nombreAsignaturas.push(datosAsignaturas[i]);
        }
    } catch {
        mensajedbVacio = 'No hay asignaturas (Pulsa en "Nueva Asignatura", para añadir una)';
        tipoAlerta = 'alert alert-warning';
    }
}

function cargarAsignaturas(response, nombreCurso) {
    response.render('./partials/asignaturas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        breadPaginas: breadPaginas,
        paginaActual: 'Asignaturas',
        breadActual: './breadAsignaturas.html',
        nombre1: nombreCurso,
        nombre2: nombreAsignaturas,
        tituloEdicion: 'Edición de Asignatura',
        tituloNew: 'Nueva Asignatura',
        tituloBorrar: 'Borrar Asignatura',
        direccionJSNuevaPag: '/administrador/cursos/curso/asignatura',
        direccionJSEdicion: '/administrador/cursos/curso/asignatura/edicion',
        direccionJSNueva: '/administrador/cursos/curso/asignatura/nueva',
        direccionJSBorrar: '/administrador/cursos/curso/asignatura/borrar',  
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta,
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

async function infTemas() {
    let datos = await modelo.mostrarTemas(nombreCurso, nombreAsignatura);
    let datosTem = Object.values(datos)[0];
    let datosTemas = Object.values(datosTem)[0];

    try {
        for (let i = 0; i < datosTemas.length; i++) {
            nombreTemas.push(datosTemas[i]);
        }
    } catch {
        mensajedbVacio = 'No hay temas (Pulsa en "Nuevo Tema", para añadir uno)';
        tipoAlerta = 'alert alert-warning';
    }
}

function cargarTemas(response) {
    response.render('./partials/asignaturas.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        breadPaginas: breadPaginas,
        paginaActual: 'Temas',
        breadActual: './breadTemas.html',
        nombre1: nombreAsignatura,
        nombre2: nombreTemas,
        tituloEdicion: 'Edición de Tema',
        tituloNew: 'Nuevo Tema',
        tituloBorrar: 'Borrar Tema',
        direccionJSNuevaPag: '/administrador/cursos/curso/asignatura/tema',
        direccionJSEdicion: '/administrador/cursos/curso/asignatura/tema/edicion',
        direccionJSNueva: '/administrador/cursos/curso/asignatura/tema/nuevo',
        direccionJSBorrar: '/administrador/cursos/curso/asignatura/tema/borrar',    
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta,
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

async function infTests() {
    datosT = await modelo.mostrarTests(nombreAsignatura, nombreTema);
    let datosTest = Object.values(datosT)[0];
    let datosTests = Object.values(datosTest)[0];

    try {
        for (let i = 0; i < datosTests.length; i++) {
            nombreTests.push(datosTests[i]);
        }
    } catch {
        mensajedbVacio = 'No hay tests (Pulsa en "Nuevo test", para añadir uno)';
        tipoAlerta = 'alert alert-warning';
    }
}

function cargarTests(response) {
    response.render('./partials/tests.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        breadPaginas: breadPaginas,
        paginaActual: 'Tests',
        breadActual: './breadTests.html',
        nombre1: nombreTema,
        nombre2: nombreTests,
        tituloEdicion: 'Edición de Test',
        tituloNew: 'Nuevo Test',
        tituloBorrar: 'Borrar Test',
        direccionJSNuevaPag: '/administrador/cursos/curso/asignatura/tema/test',
        direccionJSNueva: '/administrador/cursos/curso/asignatura/tema/test/nuevo',
        direccionJSBorrar: '/administrador/cursos/curso/asignatura/tema/test/borrar',  
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta,
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

function cargarPaginaTest(response) {
    response.render('./partials/test.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        breadPaginas: breadPaginas,
        nombreCurso: nombreCurso,
        nombreAsignatura: nombreAsignatura,
        nombreTema: nombreTema,
        tituloTest: tituloTest,
        imgTest: imgCurso,
        numPreguntasTest: numPreguntasTest,
        duracionTest: duracionTest,
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

async function infTestDetalles(nombreTest) {
    testDatos = await modelo.mostrarTestDetalles(nombreTest, nombreTema, nombreAsignatura, nombreCurso);
    let et = [];
    let ct = [];
    let it = []; 
    testDatos.forEach(function (item, i) {
        duracionTestDatos = item.duracion;
        et.push(item.enunciado);
        ct.push(item.correctas);
        it.push(item.incorrectas);
    })
    enunciadosTest = et[0];
    correctasTest = ct[0];
    incorrectasTest = it[0];
}

function cargarPaginaTestDetalles(response, nombreTest) {
    response.render('./partials/testDetalles.html', {
        usuarioPerfil: 'administrador',
        correoPerfil: 'administrador@admin.com',
        breadPaginas: breadPaginas,
        nombreCurso: nombreCurso,
        nombreAsignatura: nombreAsignatura,
        nombreTema: nombreTema,
        nombreTest: nombreTest,
        imgTest: imgCurso,
        duracionTest: duracionTestDatos,
        enunciadosTest: enunciadosTest,
        correctasTest: correctasTest,
        incorrectasTest: incorrectasTest,
        mensajedbVacio: mensajedbVacio,
        tipoAlerta: tipoAlerta
    });
    vaciarArrays();
    mensajedbVacio = '';
    tipoAlerta = '';
}

function vaciarArrays() {
    nombreCursos = [];
    descripcionCursos = [];
    imgCursos = [];
    nombreTemas = [];
    nombreTests = [];
    breadPaginas = [];
}

module.exports = router;