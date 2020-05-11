const express = require('express');
const router = express.Router();
const modelo = require('./modelo');
let datosCursos = '';
let nombreCursos = [];
let descripcionCursos = [];
let imgCursos = [];
let nombreAsignaturas = [];

let tipoProfesor = 1;
let tipoAlumno = 2;
let datosAlumnos = [];
let idAlumnos = [];
let nombreAlumnos = [];
let apellidosAlumnos = [];
let correoAlumnos = [];
let cursosAlumnos = [];
let datosProfesores = [];
let idProfesores = [];
let nombreProfesores = [];
let apellidosProfesores = [];
let correoProfesores = [];
let asignaturasProfesores = [];

router.get('/', (request, response) => {
  cargar();
  async function cargar() {
    await infCursos();
    await infProfesores();
    await infAlumnos();
    cargarPagina();
  }

  function cargarPagina() {
    response.render('admin.html', {
      usuarioPerfil: 'administrador',
      correoPerfil: 'administrador@admin.com',
      nombreCursos: nombreCursos,
      descripcionCursos: descripcionCursos,
      imgCursos: imgCursos,
      asignaturas: nombreAsignaturas,

      idProfesores: idProfesores,
      nombreProfesores: nombreProfesores,
      apellidosProfesores: apellidosProfesores,
      correoProfesores: correoProfesores,
      asignaturasProfesores: asignaturasProfesores,
      idAlumnos: idAlumnos,
      nombreAlumnos: nombreAlumnos,
      apellidosAlumnos: apellidosAlumnos,
      correoAlumnos: correoAlumnos,
      cursosAlumnos: cursosAlumnos
    });

    vaciarArrays();
  }

  async function infCursos() {
    datosCursos = await modelo.mostrarCursos();
    datosCursos.forEach(function (item, i) {
      nombreCursos.push(item.nombre);
      descripcionCursos.push(item.descripcion);
      imgCursos.push(item.img);
      nombreAsignaturas.push(item.asignaturas.nombre);
    });
  }

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

  async function infAlumnos() {
    datosAlumnos = await modelo.mostrarUsuarios(tipoAlumno);
    datosAlumnos.forEach(function (item, i) {
      idAlumnos.push(item._id);
      nombreAlumnos.push(item.nombre);
      apellidosAlumnos.push(item.apellidos);
      correoAlumnos.push(item.correo);
      cursosAlumnos.push(item.cursos);
    });
  }

  function vaciarArrays() {
    nombreCursos = [];
    descripcionCursos = [];
    imgCursos = [];
    nombreAsignaturas = [];
    idAlumnos = [];
    nombreAlumnos = [];
    apellidosAlumnos = [];
    correoAlumnos = [];
    cursosAlumnos = [];
    idProfesores = [];
    nombreProfesores = [];
    apellidosProfesores = [];
    correoProfesores = [];
    asignaturasProfesores = [];
  }
});

module.exports = router;