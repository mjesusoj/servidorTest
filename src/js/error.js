function paginaError(response, error){
      response.render('error.html', { titulo: error } );
      response.end();
}

module.exports = {
    "error": paginaError
}