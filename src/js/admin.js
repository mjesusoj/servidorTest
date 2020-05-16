const express = require('express');
const router = express.Router();
const cursos = require('./cursos');
const profesores = require('./profesores');
const alumnos = require('./alumnos');

router.get('/', (request, response) => {
  cargarPagina();
  function cargarPagina() {
    response.render('admin.html', {
      usuarioPerfil: 'administrador',
      correoPerfil: 'administrador@admin.com'
    });
  }
});

router.use('/cursos', cursos);
router.use('/profesores', profesores);
router.use('/alumnos', alumnos);

module.exports = router;