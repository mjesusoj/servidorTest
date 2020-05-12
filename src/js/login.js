const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./admin');
const modelo = require('./modelo');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (request, response) => {
    let usuario = request.body.usuario;
    let password = request.body.password;
    modelo.tipoUsuarioMongo(usuario, password, response);
});

router.use('/administrador', adminRouter);

module.exports = router;