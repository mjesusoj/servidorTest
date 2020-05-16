const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('blueimp-md5');
const modelo = require('./modelo');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    var newUsuarioA = request.body.newUsuarioA;
    var newNombreA = request.body.newNombreA;
    var newApellidosA = request.body.newApellidosA;
    var newPasswordA = md5(request.body.newPasswordA);
    var newCorreoA = request.body.newCorreoA;
    var newAsignaturasA = request.body.newAsignaturasA;

    modelo.newAlumno(newUsuarioA, newNombreA, newApellidosA, newPasswordA, newCorreoA, newAsignaturasA);
    response.redirect('/administrador/alumnos');
    response.end();
});

module.exports = router;