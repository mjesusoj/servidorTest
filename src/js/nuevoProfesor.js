const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('blueimp-md5');
const modelo = require('./modelo');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    var newUsuarioP = request.body.newUsuarioP;
    var newNombreP = request.body.newNombreP;
    var newApellidosP = request.body.newApellidosP;
    var newPasswordP = md5(request.body.newPasswordP);
    var newCorreoP = request.body.newCorreoP;
    var newAsignaturasP = request.body.newAsignaturasP;
    modelo.newProfesor(newUsuarioP, newNombreP, newApellidosP, newPasswordP, newCorreoP, newAsignaturasP);
    response.redirect('/administrador/profesores');
});

module.exports = router;