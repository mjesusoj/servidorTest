const express = require('express');
/* const querystring = require('querystring'); */
const bodyParser = require('body-parser');
const adminRouter = require('./admin');
const modelo = require('./modelo');
const router = express.Router();
/* let dataString = '';
let dataObject = ''; */

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    let usuario = request.body.usuario;
    let password = request.body.password;
    modelo.tipoUsuarioMongo(usuario, password, response);
    /* request.on('data', function (data) {
        // Obtenemos los datos en cadena de texto
        dataString += data;
    })
    .on('end', function () {
        // Convertimos la cadena de texto dataString a un objeto
        dataObject = querystring.parse(dataString);
        modelo.tipoUsuarioMongo(dataObject, response);
    })  */
});

router.use('/administrador', adminRouter);

module.exports = router;