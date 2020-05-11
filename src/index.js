const express = require('express');
const loginRouter = require('./js/login');
const edicionProfesor = require('./js/edicionProfesor');
const fs = require('fs');
const app = express();
let fichero = __dirname + '/views/login.html';

app.disable('x-powered-by');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    fs.readFile(fichero, function (error, contenido) {
        if (error) { 
            throw error;
        }
        response.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
        response.write(contenido);
        response.end();
    }); 

    app.use('/', loginRouter);
    app.use('/administrador/edicionProfesor', edicionProfesor);
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

app.listen('8080', () => {
    console.log('Servidor ejecutándose en http://127.0.0.1:8080/');
});