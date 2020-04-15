const express = require('express');
const fs = require('fs');
const querystring = require('querystring');
const util = require('util');
const md5 = require('blueimp-md5');
const app = express();
const sync = require('synchronize');
const MongoClient = sync.require('mongodb').MongoClient;
const urlMongo = "mongodb://localhost:27017/";
let dataString = '';
let dataObject = '';
let usuario = '';
let fichero = './src/views/login.html';

app.get('/', (request, response) => {
    fs.readFile(fichero, function (error, contenido) {
        if (error) { 
            throw error;
        }
        response.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
        response.write(contenido);
        response.end();
        //response.write(JSON.stringify($("#respuesta").append("<p>Hola</p>")));
    });
    app.use('/css', express.static(__dirname + '/css'));
});

app.post('/', (request, response) => {
    request.on('data', function (data) {
        // Obtenemos los datos en cadena de texto
        dataString += data;
    })
    .on('end', function () {
        // Convertimos la cadena de texto dataString a un objeto
        dataObject = querystring.parse(dataString);
        // Convertimos el objeto a JSON
        let dataJSON = util.inspect(dataObject);
        // Recogemos los datos
        usuario = dataObject.usuario;

        console.log(comprobarDatos(response));
    })
});

// Función para comprobar los datos que introduce el cliente
function comprobarDatos(response){
  let sentencia = {"usuario" : usuario , "password" : md5(dataObject.password)};
  let tipo = 9;
      
  MongoClient.connect(urlMongo, {useUnifiedTopology: true ,fsync: true}, function(error, db) {
    if (error) console.log('Error de Mongo: ' + error);
    db.db("administraciontest").collection("usuarios").find(sentencia).toArray(function(error, result) {
      if (error) throw error;
      try{
          tipo = result[0].tipo;
          console.log("Dentro" + tipo);
      }catch(error){
          paginaError(response);
      }
    })
  });
  console.log("Madre mia willy" + tipo);
  return tipo;
}

function paginaError(response){
    fs.readFile('./src/views/error.html', function (error, contenido) {
      if (error) { 
        throw error;
      }
      response.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
      response.write(contenido);
      response.end();
    });
}

app.listen('8080', () => {
    console.log('Servidor ejecutándose en http://127.0.0.1:8080/');
});