const MongoClient = require('mongodb').MongoClient;
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
let arrayNombreAsignaturas = [];
let arrayNombreTemas = [];
let datosTests = '';
let palabraRemplazada = '';
let datosTodasAsignaturas = '';
let testsDetalles = '';

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
        datosCursos = await collection.find().toArray();

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
        datosUsuarios = '';
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
            let datos = {
                projection: {
                    '_id': 0,
                    'password': 0
                }
            };
            datosUsuarios = await collection.find(query, datos).toArray();
        } catch (error) {
            console.log(error);
        } finally {
            client.close();
        }
    }
}

async function editarProfesores(nombreProfesor, apellidosProfesor, correoProfesor, asignaturasProfesor) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    remplazarEspacio(nombreProfesor);

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            'nombre': palabraRemplazada,

        };
        let newValues = {
            $set: {
                'nombre': palabraRemplazada,
                'apellidos': apellidosProfesor,
                'correo': correoProfesor
            }
        };
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarProfesores(profesorSeleccionado) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    // Borrar profesor
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        let query = {
            'nombre': profesorSeleccionado
        };
        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close;
    }
}

async function editarAlumnos(nombreAlumno, apellidosAlumno, correoAlumno, cursoAlumno) {
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
            'nombre': nombreAlumno
        };
        let newValues = {
            $set: {
                'nombre': nombreAlumno,
                'apellidos': apellidosAlumno,
                'correo': correoAlumno
            }
        };
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarAlumnos(alumnoSeleccionado) {
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
        let collection = db.collection('usuarios');
        let query = {
            'nombre': alumnoSeleccionado
        };
        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close;
    }
}

async function newProfesor(newUsuarioP, newNombreP, newApellidosP, newPasswordP, newCorreoP, newAsignaturasP) {
    const client = await MongoClient.connect(urlMongo, { useUnifiedTopology: true })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    remplazarEspacio(newNombreP);

    let query1 = '';
    let query2 = '';
    let profesor = '';
    if (newAsignaturasP == undefined) {
        query1 = {
            'tipo': 1,
            'usuario': newUsuarioP,
            'nombre': palabraRemplazada,
            'apellidos': newApellidosP,
            'password': newPasswordP,
            'correo': newCorreoP
        }
    } else {
        query1 = {
            'tipo': 1,
            'usuario': newUsuarioP,
            'nombre': palabraRemplazada,
            'apellidos': newApellidosP,
            'password': newPasswordP,
            'correo': newCorreoP,
            'asignaturas': [
                newAsignaturasP
            ]
        }

        let asignaturaCurso = newAsignaturasP.split(' de ');

        query2 = {
            nombre: asignaturaCurso[0],
            curso: asignaturaCurso[1]
        }

        profesor = {
            $push: {
                profesores: newUsuarioP
            }
        }

        // Asignar asignatura a profesor
        try {
            const db = client.db("administraciontest");
            let collection = db.collection('asignaturas');
            await collection.updateOne(query2, profesor);
        } catch (error) {
            console.log(error);
        }
    }

    // Crear profesor
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        await collection.insertOne(query1);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newAlumno(newUsuarioA, newNombreA, newApellidosA, newPasswordA, newCorreoA, newCursoA) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    remplazarEspacio(newNombreA);

    let query = '';

    if (newCursoA == undefined) {
        query = {
            'tipo': 2,
            'usuario': newUsuarioA,
            'nombre': palabraRemplazada,
            'apellidos': newApellidosA,
            'password': newPasswordA,
            'correo': newCorreoA
        }
    } else {
        query = {
            'tipo': 2,
            'usuario': newUsuarioA,
            'nombre': palabraRemplazada,
            'apellidos': newApellidosA,
            'password': newPasswordA,
            'correo': newCorreoA,
            'cursos': [
                newCursoA
            ]
        }
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('usuarios');
        await collection.insertOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarCurso(nombreCurso, editNombreCurso, descripcionCurso, imgCurso) {
    const client = await MongoClient.connect(urlMongo, { useUnifiedTopology: true })
        .catch(error => { 
            console.log(error); 
        });

    if (!client) { 
        return; 
    }

    remplazarEspacio(editNombreCurso);

    let newValues = '';

    if (nombreCurso != palabraRemplazada) {
        if (imgCurso != '') {
            newValues = {
                $set: {
                    'nombre': palabraRemplazada,
                    'descripcion': descripcionCurso,
                    'img': imgCurso
                }
            };
        } else {
            newValues = {
                $set: {
                    'nombre': palabraRemplazada,
                    'descripcion': descripcionCurso
                }
            };
        }
    } else {
        if (imgCurso != '') {
            newValues = {
                $set: {
                    'descripcion': descripcionCurso,
                    'img': imgCurso
                }
            };
        } else {
            newValues = {
                $set: {
                    'descripcion': descripcionCurso
                }
            };
        }
    }

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == palabraRemplazada) {
                if (nombreCurso != palabraRemplazada) {
                    repetido = true;
                }
            }
        })

        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('cursos');
            let query = {
                'nombre': nombreCurso
            };
            await collection.updateOne(query, newValues);
        }
    } catch (error) {
        console.log(error);
    }

    try {
        let repetido = false;
        
        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == palabraRemplazada) {
                if (nombreCurso != palabraRemplazada) {
                    repetido = true;
                }
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
                    'curso': palabraRemplazada,
                }
            };
            await collection.updateMany(query, newValues);
        }
    } catch (error) {
        console.log(error);
    }

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == palabraRemplazada) {
                if (nombreCurso != palabraRemplazada) {
                    repetido = true;
                }
            }
        })

        if (repetido == false) {

            const db = client.db("administraciontest");
            let collection = db.collection('temas');
            let query = {
                'curso': nombreCurso
            };
            let newValues = '';

            newValues = {
                $set: {
                    'curso': palabraRemplazada,
                }
            };
            await collection.updateMany(query, newValues);
        }
    } catch (error) {
        console.log(error);
    }

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == palabraRemplazada) {
                if (nombreCurso != palabraRemplazada) {
                    repetido = true;
                }
            }
        })

        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('tests');
            let query = {
                'curso': nombreCurso
            };
            let newValues = '';

            newValues = {
                $set: {
                    'curso': palabraRemplazada,
                }
            };
            await collection.updateMany(query, newValues);
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

    remplazarEspacio(newNombreCurso);

    try {
        let repetido = false;

        arrayNombreCurso.forEach(function (item, i) {
            if (arrayNombreCurso[i] == palabraRemplazada) {
                repetido = true;
            }
        })

        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('cursos');
            let query = {
                'nombre': palabraRemplazada,
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
    }

    // Borrar temas
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'curso': cursoSeleccionado
        };
        await collection.deleteMany(query);
    } catch (error) {
        console.log(error);
    }

    // Borrar tests
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
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

async function todasAsignaturas() {
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
        datosTodasAsignaturas = await collection.find().toArray();
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
        datosAsignaturas = await collection.find(query, asignatura).toArray();
        arrayNombreAsignaturas = [];
        if ((Object.values(datosAsignaturas[0])).length != 0) {
            let array = [];
            datosAsignaturas.forEach(function (item, i) {
                array.push(item.asignaturas);
            })
            arrayNombreAsignaturas = array[0];
        }
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

    remplazarEspacio(editNombreA);

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso,
            'asignaturas': nombreAsignatura
        };
        let newValues = {
            $set: {
                'asignaturas.$': palabraRemplazada
            }
        };
        
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
                'nombre': palabraRemplazada
            }
        };

        await collection.updateMany(query, newValues);
    } catch (error) {
        console.log(error);
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'curso': nombreCurso,
            'asignatura': nombreAsignatura
        };
        let newValues = {
            $set: {
                'asignatura': palabraRemplazada
            }
        };

        await collection.updateMany(query, newValues);
    } catch (error) {
        console.log(error);
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
        let query = {
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let newValues = {
            $set: {
                'asignatura': palabraRemplazada
            }
        };

        await collection.updateMany(query, newValues);
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

    remplazarEspacio(nombreAsignatura);
    if (arrayNombreAsignaturas != undefined){
        let repetido = comprobarRepetido(arrayNombreAsignaturas, palabraRemplazada);
        // Le insertamos una nueva asignatura al curso
        try {
            if (repetido == false) {
                const db = client.db("administraciontest");
                let collection = db.collection('cursos');
                let query = {
                    'nombre': nombreCurso
                };
                let newAsignatura = {
                    $push: {
                        'asignaturas': palabraRemplazada
                    }
                }
                await collection.updateOne(query, newAsignatura);
            }
        } catch (error) {
            console.log(error);
        }

        // Insertamos en la colección asignaturas una nueva, identificado con el curso
        try {
            if (repetido == false) {
                const db = client.db("administraciontest");
                let collection = db.collection('asignaturas');
                let query = {
                    'nombre': palabraRemplazada,
                    'curso': nombreCurso,
                };
                await collection.insertOne(query);
            }
        } catch (error) {
            console.log(error);
        } finally {
            client.close();
        }
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

    remplazarEspacio(nombreAsignatura);

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('cursos');
        let query = {
            'nombre': nombreCurso
        };
        let newAsignatura = {
            $pull: {
                'asignaturas': {
                    $in: [palabraRemplazada]
                }
            }
        }
        await collection.updateOne(query, newAsignatura);
    } catch (error) {
        console.log(error);
    }

    // Borramos la asignatura
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': palabraRemplazada,
            'curso': nombreCurso
        };
        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    }

    // Borrar temas
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'curso': nombreCurso,
            'asignatura': palabraRemplazada
        };
        await collection.deleteMany(query);
    } catch (error) {
        console.log(error);
    }
    
    // Borrar tests
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
        let query = {
            'curso': nombreCurso,
            'asignatura': palabraRemplazada
        };
        await collection.deleteMany(query);
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
        datosTemas = await collection.find(query, tema).toArray();
        arrayNombreTemas = [];
        if ((Object.values(datosTemas[0])).length != 0) {
            let array = [];
            datosTemas.forEach(function (item, i) {
                array.push(item.temas);
            })
            arrayNombreTemas = array[0];
        }
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function editarTema(nombreCurso, nombreAsignatura, nombreTema, editNombreT) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    remplazarEspacio(editNombreT);

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('asignaturas');
        let query = {
            'nombre': nombreAsignatura,
            'curso': nombreCurso,
            "temas": nombreTema
        };
        let newValues = {
            $set: {
                'temas.$': palabraRemplazada
            }
        };
        console.log(query)
        console.log(newValues)
        await collection.updateOne(query, newValues);
    } catch (error) {
        console.log(error);
    } 

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'nombre': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let newValues = {
            $set: {
                'nombre': palabraRemplazada
            }
        };

        console.log(newValues)
        await collection.updateMany(query, newValues);
    } catch (error) {
        console.log(error);
    }

    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
        let query = {
            'tema': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let newValues = {
            $set: {
                'tema': palabraRemplazada
            }
        };

        console.log(newValues)
        await collection.updateMany(query, newValues);
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

    remplazarEspacio(nombreTema);

    let repetido = comprobarRepetido(arrayNombreTemas, palabraRemplazada);
    // Le insertamos una nueva asignatura al curso
    try {
        let repetido = false;

        arrayNombreTemas.forEach(function (item, i) {
            if (arrayNombreTemas[i] == palabraRemplazada) {
                repetido = true;
            }
        })

        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('asignaturas');
            let query = {
                'nombre': nombreAsignatura,
                'curso': nombreCurso
            };
            let newTema = {
                $push: {
                    'temas': palabraRemplazada
                }
            }
            await collection.updateOne(query, newTema);
        }
    } catch (error) {
        console.log(error);
    }

    // Le insertamos una nueva asignatura al curso
    try {
        if (repetido == false) {
            const db = client.db("administraciontest");
            let collection = db.collection('temas');
            let query = {
                'nombre': palabraRemplazada,
                'asignatura': nombreAsignatura,
                'curso': nombreCurso
            };
            await collection.insertOne(query);
        }
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarTema(nombreCurso, nombreAsignatura, temaSeleccionado) {
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
            'curso': nombreCurso
        };
        let tema = {
            $pull: {
                'temas': {
                    $in: [temaSeleccionado]
                }
            }
        }

        await collection.updateOne(query, tema);
    } catch (error) {
        console.log(error);
    }

    // Insertamos en la colección asignaturas una nueva, identificado con el curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'nombre': temaSeleccionado,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };

        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infTests(nombreAsignatura, nombreTema) {
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
        let collection = db.collection('temas');
        let query = {
            'nombre': nombreTema,
            'asignatura': nombreAsignatura,
        };
        let temas = {
            projection: {
                '_id': 0,
                'tests': 1
            }
        }
        let result = await collection.find(query, temas).toArray();
        datosTests = result;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function newTest(nombreCurso, nombreAsignatura, nombreTema, tituloTest, duracionTest, enunciados, correctas, incorrectas) {
    const client = await MongoClient.connect(urlMongo, {
            useUnifiedTopology: true
        })
        .catch(error => {
            console.log(error);
        });

    if (!client) {
        return;
    }

    remplazarEspacio(tituloTest);

    // Le insertamos una nueva asignatura al curso
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('temas');
        let query = {
            'nombre': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let newTest = {
            $push: {
                'tests': palabraRemplazada
            }
        }

        await collection.updateOne(query, newTest);
    } catch (error) {
        console.log(error);
    }

    // Le insertamos los tests
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
        let query = {
            'nombre': palabraRemplazada,
            'tema': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso,
            'duracion': duracionTest
        };
        await collection.insertOne(query);

        for (let i = 0; i < enunciados.length; i++){
            let newTest = {
                $push: {
                    'enunciado': enunciados[i],
                    'correctas': correctas[i],
                    'incorrectas': incorrectas[i]
                }
            }
            await collection.updateMany(query, newTest);
        }
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function borrarTest(nombreCurso, nombreAsignatura, nombreTema, testSeleccionado) {
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
        let collection = db.collection('temas');
        let query = {
            'nombre': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let asignatura = {
            $pull: {
                'tests': {
                    $in: [testSeleccionado]
                }
            }
        }

        await collection.updateOne(query, asignatura);
    } catch (error) {
        console.log(error);
    }

    // Eliminar de la colección tests
    try {
        const db = client.db("administraciontest");
        let collection = db.collection('tests');
        let query = {
            'nombre': testSeleccionado,
            'tema': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };

        await collection.deleteOne(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

async function infTestDetalles(tituloTest, nombreTema, nombreAsignatura, nombreCurso) {
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
        let collection = db.collection('tests');
        let query = {
            'nombre': tituloTest,
            'tema': nombreTema,
            'asignatura': nombreAsignatura,
            'curso': nombreCurso
        };
        let tests = {
            projection: {
                '_id': 0,
                'duracion': 1,
                'correctas': 1,
                'enunciado': 1,
                'incorrectas': 1
            }
        }
        testsDetalles = await collection.find(query, tests).toArray();
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

function comprobarRepetido(array, palabraRemplazada) {
    let repetido = false;
    array.forEach(function (item, i) {
        if (array[i] == palabraRemplazada) {
            repetido = true;
        }
    })
    return repetido;
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

async function mostrarTodasAsignaturas() {
    await todasAsignaturas();
    return datosTodasAsignaturas;
}

async function mostrarTemas(nombreCurso, nombreAsignatura) {
    await infTemas(nombreCurso, nombreAsignatura);
    return datosTemas;
}

async function mostrarTests(nombreCurso, nombreAsignatura, nombreTema) {
    await infTests(nombreCurso, nombreAsignatura, nombreTema);
    return datosTests;
}

async function mostrarTestDetalles(tituloTest, nombreTema, nombreAsignatura, nombreCurso) {
    await infTestDetalles(tituloTest, nombreTema, nombreAsignatura, nombreCurso);
    return testsDetalles;
}

/*
    Función para remplazar el espacio por guiones,
    para el funcionamiento correcto de la aplicación
*/
function remplazarEspacio(palabra) {
    let re = / /gi;
    palabraRemplazada = palabra.replace(re, '-');
}

function cursoRepetido() {
    return resultadoCurso;
};

module.exports = {
    "tipoUsuarioMongo": tipoUsuarioMongo,
    "mostrarCursos": mostrarCursos,
    "mostrarUsuarios": mostrarUsuarios,
    "editarProfesores": editarProfesores,
    "borrarProfesores": borrarProfesores,
    "editarAlumnos": editarAlumnos,
    "borrarAlumnos": borrarAlumnos,
    "newProfesor": newProfesor,
    "newAlumno": newAlumno,
    "editarCurso": editarCurso,
    "newCurso": newCurso,
    "borrarCurso": borrarCurso,
    "mostrarAsignaturas": mostrarAsignaturas,
    "mostrarTodasAsignaturas": mostrarTodasAsignaturas,
    "editarAsignatura": editarAsignatura,
    "newAsignatura": newAsignatura,
    "borrarAsignatura": borrarAsignatura,
    "mostrarTemas": mostrarTemas,
    "editarTema": editarTema,
    "newTema": newTema,
    "borrarTema": borrarTema,
    "mostrarTests": mostrarTests,
    "newTest": newTest,
    "borrarTest": borrarTest,
    "mostrarTestDetalles": mostrarTestDetalles,
    "cursoRepetido": cursoRepetido
}