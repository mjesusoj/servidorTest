const express = require('express');
const bodyParser = require('body-parser');
const modelo = require('./modelo');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    var idProfesor = request.body.idProfesor;
    var nombreProfesor = request.body.nombreP;
    var apellidosProfesor = request.body.apellidosP;
    var correoProfesor = request.body.correoP;
    var asignaturasProfesor = request.body.asignaturasP;

    modelo.editarProfesores(idProfesor, nombreProfesor, apellidosProfesor, correoProfesor, asignaturasProfesor);
    response.redirect('/administrador');
    response.end();
});

module.exports = router;