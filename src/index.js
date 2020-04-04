const express = require('express');
const fs = require('fs');
const app = express();
const fichero = './src/views/login.html';

app.get('/', (peticion, respuesta) => {
  fs.readFile(fichero, function (error, contenido) {
    if (error) {
      throw error;
    }
    respuesta.writeHead(200, {'Content-Type': 'text/html charset=utf-8'});
    respuesta.write(contenido);
    respuesta.end();
  });

  app.use('/css',express.static(__dirname +'/css'));
});

app.listen('8080', () => {
  console.log('Servidor ejecutándose en http://127.0.0.1:8080/');
});