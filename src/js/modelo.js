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
let resultadoCurso = '';
let arrayNombreCurso = [];

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

        arrayNombreCurso = [];
        datosCursos.forEach(function (item, i) {
            arrayNombreCurso.push(item.nombre);
        })
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
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == newNC) {
                repetido = true;
            }
        })

        if (repetido == false) {

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
            await collection.updateOne(query, newValues);
        } else {
            console.log('Repetido');
        }
    } catch (error) {
        console.log(error);
    }

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == newNC) {
                repetido = true;
            }
        })

        if (repetido == false) {

            const db = client.db("administraciontest");
            let collection = db.collection('asignaturas');
            let query = {
                'curso': nombreCurso
            };
            let newValues = '';

            newValues = {
                $set: {
                    'curso': newNC,
                }
            };
            await collection.updateMany(query, newValues);
        } else {
            console.log('Repe');
        }
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

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == newNC) {
                repetido = true;
            }
        })

        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('cursos');
            let query = {
                'nombre': newNC,
                'descripcion': newDescripcionCurso,
                'img': newImgCurso
            }
            await collection.insertOne(query);
        } else {
            resultadoCurso = 'El nombre del curso está repetido';
            cursoRepetido(resultadoCurso);
        }
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

    // Borrar curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': cursoSeleccionado
        };
        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    }

    // Borrar asignaturas
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'curso': cursoSeleccionado
        };
        await collection.deleteMany(query);
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

    let re = / /gi;
    let newNA = editNombreA.replace(re, '-');

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newValues = {
            $set: {
                'asignaturas': {
                    $in: [newNA]
                }
            }
        }
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': nombreAsignatura,
            'curso': nombreCurso
        };
        let newValues = {
            $set: {
                'nombre': newNA
            }
        }
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newAsignatura(nombreCurso, nombreAsignatura) {
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
    let newNC = nombreAsignatura.replace(re, '-');

    // Le insertamos una nueva asignatura al curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newAsignatura = {
            $push: {
                'asignaturas': newNC
            }
        }

        await collection.updateOne(query, newAsignatura);
    } catch (error) {
        console.log(error);
    }

    // Insertamos en la colección asignaturas una nueva, identificado con el curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': newNC,
            'curso': nombreCurso,
        };

        await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarAsignatura(nombreCurso, nombreAsignatura) {
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
    let newNA = nombreAsignatura.replace(re, '-');

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newAsignatura = {
            $pull: {
                'asignaturas': {
                    $in: [newNA]
                }
            }
        }

        await collection.updateOne(query, newAsignatura);
    } catch (error) {
        console.log(error);
    }

    // Insertamos en la colección asignaturas una nueva, identificado con el curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': newNA,
            'curso': nombreCurso
        };

        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infTemas(nombreCurso, nombreAsignatura) {
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
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': nombreAsignatura,
            'curso': nombreCurso,
        };
        let tema = {
            projection: {
                'temas': 1,
                '_id': 0
            }
        }
        let result = await collection.find(query, tema).toArray();
        datosTemas = result;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarTema(nombreCurso, nombreTema, editNombreT) {
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
    let newNA = editNombreT.replace(re, '-');

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newValues = {
            $set: {
                'asignaturas': {
                    $in: [newNA]
                }
            }
        }
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': nombreTema,
            'curso': nombreCurso
        };
        let newValues = {
            $set: {
                'nombre': newNA
            }
        }
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newTema(nombreCurso, nombreAsignatura, nombreTema) {
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
    let newNT = nombreTema.replace(re, '-');

    // Le insertamos una nueva asignatura al curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': nombreAsignatura,
            'curso': nombreCurso
        };
        let newTema = {
            $push: {
                'temas': newNT
            }
        }

        await collection.updateOne(query, newTema);
    } catch (error) {
        console.log(error);
    }

    // Le insertamos una nueva asignatura al curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'nombre': newNT,
            'asignatura': nombreAsignatura
        };

        await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarTema(nombreCurso, temaSeleccionado) {
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
    let newNA = temaSeleccionado.replace(re, '-');

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': temaSeleccionado,
            'curso': nombreCurso
        };
        let newAsignatura = {
            $pull: {
                'asignaturas': {
                    $in: [newNA]
                }
            }
        }

        await collection.updateOne(query, newAsignatura);
    } catch (error) {
        console.log(error);
    }

    // Insertamos en la colección asignaturas una nueva, identificado con el curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': newNA,
            'curso': nombreCurso
        };

        await collection.deleteOne(query);
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

async function mostrarTemas(nombreCurso, nombreAsignatura) {
    await infTemas(nombreCurso, nombreAsignatura);
    return datosTemas;
}

function cursoRepetido() {
    return resultadoCurso;
};

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
    "borrarAsignatura": borrarAsignatura,
    "mostrarTemas": mostrarTemas,
    "newTema": newTema,
    "cursoRepetido": cursoRepetido
}