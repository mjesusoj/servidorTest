const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    var idAlumno = request.body.idAlumno;
    var nombreAlumno = request.body.nombreA;
    var apellidosAlumno = request.body.apellidosA;
    var correoAlumno = request.body.correoA;
    var asignaturasAlumno = request.body.asignaturasA;

    modelo.editarAlumnos(idAlumno, nombreAlumno, apellidosAlumno, correoAlumno, asignaturasAlumno);
    response.redirect('/administrador/alumnos');
    response.end();
});

module.exports = router;