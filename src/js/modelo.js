const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const urlMongo = "mongodb://localhost:27017/";
const md5 = require('blueimp-md5');
const paginaError = require('./error');
let tipoUsuario = '';
let datosCursos = '';
let datosUsuarios = '';
let datosAsignaturas = '';
let datosTemas = '';

async function tipoUsuarioMongo(usuario, password, response) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            paginaError.error(response, error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            'usuario': usuario,
            'password': md5(password)
        };
        let result = await collection.findOne(query);
        tipoUsuario = parseInt(result.tipo);
        loginUsuario(response);
        response.end();
    } catch (error) {
        paginaError.error(response, 'Usuario y/o contraseña incorrectos');
    } finally {
        client.close();
    }
}

function loginUsuario(response) {
    switch (tipoUsuario) {
        case 0:
            response.redirect('/administrador');
            response.end();
            break;
        case 1:
            break;
    }
}

async function infCursos() {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let result = await collection.find().toArray();
        datosCursos = result;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infUsuarios(numero) {
    if (numero == 0) {
        datosUsuarios = 'Te crees muy listo eh';
    } else {
        const client = await MongoClient.connect(urlMongo, {
                useUnifiedTopology: true
            })
            .catch(error => {
                console.log(error);
            });

        if (!client) {
            return;
        }

        try {
            const db = client.db("administraciontest");
            let collection = db.collection('usuarios');
            let query = {
                'tipo': numero
            };
            let result = await collection.find(query).toArray();
            datosUsuarios = result;
        } catch (error) {
            console.log(error);
        } finally {
            client.close();
        }
    }
}

async function editarProfesores(idProfesor, nombreProfesor, apellidosProfesor, correoProfesor, asignaturasProfesor) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            '_id': objectId(idProfesor)
        };
        let newValues = {
            $set: {
                'nombre': nombreProfesor,
                'apellidos': apellidosProfesor,
                'correo': correoProfesor
            }
        };
        let result = await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarAlumnos(idAlumno, nombreAlumno, apellidosAlumno, correoAlumno, cursoAlumno) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            '_id': objectId(idAlumno)
        };
        let newValues = {
            $set: {
                'nombre': nombreAlumno,
                'apellidos': apellidosAlumno,
                'correo': correoAlumno
            }
        };
        let result = await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newProfesor(newUsuarioP, newNombreP, newApellidosP, newPasswordP, newCorreoP, newAsignaturasP) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            'tipo': 1,
            'usuario': newUsuarioP,
            'nombre': newNombreP,
            'apellidos': newApellidosP,
            'password': newPasswordP,
            'correo': newCorreoP,
            'asignaturas': [
                newAsignaturasP
            ]
        };
        let result = await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newAlumno(newUsuarioA, newNombreA, newApellidosA, newPasswordA, newCorreoA, newAsignaturasA) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            'tipo': 2,
            'usuario': newUsuarioA,
            'nombre': newNombreA,
            'apellidos': newApellidosA,
            'password': newPasswordA,
            'correo': newCorreoA,
            'asignaturas': [
                newAsignaturasA
            ]
        };
        let result = await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarCurso(nombreCurso, editNombreCurso, descripcionCurso, imgCurso) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    let re0 = / /gi;
    let newNC = editNombreCurso.replace(re0, '-');

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newValues = '';

        if (imgCurso != '') {
            newValues = {
                $set: {
                    'nombre': newNC,
                    'descripcion': descripcionCurso,
                    'img': imgCurso
                }
            };
        } else {
            newValues = {
                $set: {
                    'nombre': newNC,
                    'descripcion': descripcionCurso
                }
            };
        }

        let result = await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newCurso(newNombreCurso, newDescripcionCurso, newImgCurso) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    let re = / /gi;
    let newNC = newNombreCurso.replace(re, '-');
    console.log(newNC);

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': newNC,
            'descripcion': newDescripcionCurso,
            'img': newImgCurso
        }
        let result = await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarCurso(cursoSeleccionado) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': cursoSeleccionado
        };
        let result = await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infAsignaturas(nombreCurso) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let asignatura = {
            projection: {
                'asignaturas': 1,
                '_id': 0
            }
        };
        let result = await collection.find(query, asignatura).toArray();
        datosAsignaturas = result;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarAsignatura(nombreCurso, nombreAsignatura, editNombreA) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso,
            'asignaturas.nombre': nombreAsignatura
        };
        let newValues = {
            $set:{
                'asignaturas.$.nombre': editNombreA
            }
        }
        let result = await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newAsignatura(nombreCurso, nombre) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso,
        };
        let newAsignatura = {
            $push:{
                'asignaturas': [nombre]
            }
        }
        let result = await collection.updateOne(query, newAsignatura);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infTemas(nombreAsignatura) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'asignaturas.nombre': nombreAsignatura
        };
        let result = await collection.find(query).toArray();
        datosTemas = result;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function mostrarCursos() {
    await infCursos();
    return datosCursos;
}

async function mostrarUsuarios(numero) {
    await infUsuarios(numero);
    return datosUsuarios;
}

async function mostrarAsignaturas(nombreCurso) {
    await infAsignaturas(nombreCurso);
    return datosAsignaturas;
}

async function mostrarTemas(nombreAsignatura) {
    await infTemas(nombreAsignatura);
    return datosTemas;
}

module.exports = {
    "tipoUsuarioMongo": tipoUsuarioMongo,
    "mostrarCursos": mostrarCursos,
    "mostrarUsuarios": mostrarUsuarios,
    "editarProfesores": editarProfesores,
    "editarAlumnos": editarAlumnos,
    "newProfesor": newProfesor,
    "newAlumno": newAlumno,
    "editarCurso": editarCurso,
    "newCurso": newCurso,
    "borrarCurso": borrarCurso,
    "mostrarAsignaturas": mostrarAsignaturas,
    "editarAsignatura": editarAsignatura,
    "newAsignatura": newAsignatura,
    "mostrarTemas": mostrarTemas
}