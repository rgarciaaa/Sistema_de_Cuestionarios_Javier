const express = require('express');
const mariadb = require('mariadb');
const moment = require('moment');
const cors = require('cors');
const chalk = require('chalk');
const path = require('path');

const app = express();

const connect = mariadb.createConnection({
    hots: 'localhost',
    user: 'root',
    database: 'cuestionarios'
});

connect.then((conn) => { console.log(chalk.bgGreen.black('Connected')) })
    .catch((error) => { console.log(chalk.bgRed.black('Not connected')) });

const publicPath = path.resolve(__dirname, '../public/');

app.use(express.static(publicPath));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(publicPath, 'index.html'));
});

app.post('/authUser', (req, res) => {
    console.log(chalk.bgBlue.white("Service required authUser "));
    console.log(req.body);

    // Autentica al usuario
    const { user, password } = req.body;

    connect.then(conn => {
        conn.query(`SELECT * FROM usuario WHERE usuario.user_name = ${JSON.stringify(user)}`)
            .then(rows => {
                if (rows.length > 0) {
                    // Si existe el usuario en la DB
                    // Comprobamos que la contraseña sea correcta
                    if (rows[0].user_password === password) {
                        // Las credenciales son correctas
                        // Damos acceso al sistema
                        res.json({ auth: true, ...rows[0] })
                    } else {
                        // Las credenciales no son correctas 
                        // Negamos el acceso al sistema
                        res.json({ auth: false, error: "Contraseña incorrecta", ...rows[0] })
                    }

                } else {
                    // No existe el usuario en la base de datos
                    // Negamos el acceso al sistema
                    res.json({ auth: false, error: "Usuario y/o contraseña incorrectos", ...rows[0] })
                }
            })
    })
})

app.get('/getAllQuestions', (req, res) => {
    // Lanzamos el query a la base de datos para obtener las preguntas
    connect.then((conn) => {
        conn.query('SELECT * FROM pregunta;')
            .then((rows) => {
                const json = rows.map((pregunta => pregunta))
                //Regresamos las preguntas al cliente
                res.send(json);
            })
    })
})

app.get('/getCat', (req, res) => {
    //Lanzamos el query a la base de datos para obtener las categorias
    connect.then((conn) => {
        conn.query('SELECT * FROM categoria;')
            .then((rows) => {
                const json = rows.map(categoria => categoria);
                //Regresamos las categorias al cliente
                res.send(json);
            })
    })
});

app.post('/saveCuest', (req, res) => {
    // Separamos el JSON en cuestionario y preguntas
    const { nombre, fecha, categoria } = req.body.cuestionario;
    const preguntas = req.body.preguntas;
    // Lanzamos el query a la base de datos para guardar el cuestionario
    connect.then((conn) => {
        // Guardamos el cuestionario
        conn.query(`INSERT INTO cuestionario VALUES (NULL,${JSON.stringify(nombre)},${JSON.stringify(fecha)},${JSON.stringify(categoria)});`)
            .then((rows) => {
                // Recuperamos el id del cuestionario creado
                const cuestionarioID = rows.insertId;
                // Guardamos las preguntas relacionadas al cuestionario
                preguntas.forEach(pregunta => {
                    conn.query(`INSERT INTO cuest_pregunta VALUES (NULL,${JSON.stringify(cuestionarioID)},${JSON.stringify(pregunta.id)});`);
                });
                // Respondemos que las preguntas se guardaron con exito
                res.send({ succeed: true })
            }).catch(error => {
                // Respondemos que las preguntas no se pudieron guardar
                res.send({ succeed: false })
            })
    })
})

app.post('/pullQuest', (req, res) => {
    // Lanzamos el query a la base de datos para guardar la pregunta
    connect.then((conn) => {
        // Guardamos el cuestionario
        conn.query(`INSERT INTO pregunta VALUES (NULL,${JSON.stringify(req.body.pregunta).toUpperCase()},
            ${JSON.stringify(req.body.respuestaA).toUpperCase()},
            ${JSON.stringify(req.body.respuestaB).toUpperCase()}, 
            ${JSON.stringify(req.body.respuestaC).toUpperCase()}, 
            ${JSON.stringify(req.body.respuestaD).toUpperCase()},
            ${JSON.stringify(req.body.respuestaE).toUpperCase()}, 
            ${JSON.stringify(req.body.respuestaCorrecta)});`)
            .then((rows) => {
                // Contestamos que se guardo correctamente
                res.send({ succeed: true })
            })
            .catch((err) => {
                // Contestamos que no se guardo correctamente
                res.send({ succeed: false })
            })
    })
})

app.get('/estadisticas', (req, res) => {
    // Recuperamos el numero de alumnos inscritos por cuestionario
    connect.then(conn => {
        // Cuestionario A
        conn.query(`SELECT COUNT(*) totalA, SUM(cal_cuestionario) calificacionA FROM ins_per_cuest WHERE id_cuestionario = 58;`)
            .then(rows => {
                const { totalA, calificacionA } = rows[0];
                conn.query('SELECT COUNT(*) aciertosA FROM resp_per_cuest NATURAL INNER JOIN cuest_pregunta WHERE valor = 1 AND id_cuestionario = 58;')
                    .then(rows => {
                        const aciertosA = rows[0].aciertosA
                        // Cuestionario B
                        conn.query(`SELECT COUNT(*) totalB, SUM(cal_cuestionario) calificacionB FROM ins_per_cuest WHERE id_cuestionario = 59;`)
                            .then(rows => {
                                const { totalB, calificacionB } = rows[0];
                                conn.query('SELECT COUNT(*) aciertosB FROM resp_per_cuest NATURAL INNER JOIN cuest_pregunta WHERE valor = 1 AND id_cuestionario = 59;')
                                    .then(rows => {
                                        const aciertosB = rows[0].aciertosB
                                        // Cuestionario C
                                        conn.query(`SELECT COUNT(*) totalC, SUM(cal_cuestionario) calificacionC FROM ins_per_cuest WHERE id_cuestionario = 60;`)
                                            .then(rows => {
                                                const { totalC, calificacionC } = rows[0];
                                                conn.query('SELECT COUNT(*) aciertosC FROM resp_per_cuest NATURAL INNER JOIN cuest_pregunta WHERE resp_per_cuest.valor = 1 AND id_cuestionario = 60;')
                                                    .then(rows => {
                                                        const aciertosC = rows[0].aciertosC
                                                        // Empaquetamos y enviamos
                                                        const json = {
                                                            cuestA: {
                                                                totalA,
                                                                calificacionA,
                                                                aciertosA
                                                            },
                                                            cuestB: {
                                                                totalB,
                                                                calificacionB,
                                                                aciertosB
                                                            },
                                                            cuestC: {
                                                                totalC,
                                                                calificacionC,
                                                                aciertosC
                                                            }
                                                        };
                                                        res.send(json);
                                                    })

                                            })
                                    })

                            })

                    })
            })
    })
})

app.get('/getCuest', (req, res) => {
    //Lanzamos el query a la base de datos para recuperar todos los cuestionarios
    connect.then(conn => {
        conn.query('SELECT cuestionario.id_cuestionario AS id, cuestionario.nom_cuestionario AS nombre, cuestionario.fec_elaboracion AS fecha, categoria.nom_categoria AS categoria FROM cuestionario JOIN categoria WHERE cuestionario.id_categoria = categoria.id_categoria;')
            .then((rows) => {
                // Guardamos los cuestionarios recuperados
                const cuestionarios = rows.map(cuestionario => {
                    return { id: cuestionario.id, nombre: cuestionario.nombre, fecha: cuestionario.fecha, categoria: cuestionario.categoria }
                })
                // Regresamos los cuestionarios
                res.send(cuestionarios);
            })
    })
})

app.get('/getStudents', (req, res) => {
    //Lanzamos el query a la base de datos para recuperar todos los primeros 100 alumnos
    connect.then(conn => {
        conn.query('SELECT id_persona as id, nom_persona as nombre, app_persona as app, apm_persona as apm FROM alumno LIMIT 100;')
            .then(rows => {
                // Guardamos los alumnos recuperados
                const alumnos = rows.map(alumno => {
                    return { id: alumno.id, nombre: alumno.nombre, app: alumno.app, apm: alumno.apm }
                })
                // Regresamos los alumnos
                res.send(alumnos)
            })
    })
})

app.post('/getEstudiantes', (req, res) => {

    // Recuperamos el cuerpo de la peticion
    const nombre = req.body.nombre;

    // Lanzamos el query a la DB para recuperar las primeras 100 coincidencias
    connect.then(conn => {
        conn.query(`SELECT id_persona as id, nom_persona as nombre, app_persona as app, apm_persona as apm FROM alumno WHERE CONCAT(nom_persona, ' ', app_persona, ' ', apm_persona) LIKE '%${nombre}%' LIMIT 100;`)
            .then(rows => {
                // Empaquetamos los resultados en un JSON
                const alumnos = rows.map(alumno => {
                    return { ...alumno }
                })
                // Regresamos los alumnos
                res.send(alumnos)
            })
    })
})

app.post('/saveEstudiantesInscritos', (req, res) => {

    // Recuperamos el cuerpo de la peticion
    const { cuestionario, alumnos, fecha } = req.body;

    // Lanzamos el query para inscribir a los estudiantes al cuestionario
    connect.then(conn => {
        // Inscribe a cada alumno al cuestionario seleccionado
        alumnos.forEach(alumno => {
            conn.query(`INSERT INTO ins_per_cuest VALUES(null, ${alumno.id}, ${cuestionario.id}, ${JSON.stringify(fecha)}, null);`)
        });
        res.send({ succeed: true })
    })
});

app.post('/getCuestionario', (req, res) => {
    // Recuperamos el id del usuario al que se inscribio
    const alumno = req.body.id

    connect.then(conn => {
        // Recupero el id de la inscripcion al cuestionario
        conn.query(`SELECT ins_per_cuest.id_ins_per_cuest as 'id_insc', ins_per_cuest.id_cuestionario as 'id_cuest', 
        cuestionario.nom_cuestionario as 'nom_cuest' FROM ins_per_cuest NATURAL INNER JOIN cuestionario WHERE ${alumno} = ins_per_cuest.id_persona;`)
            .then(rows => {
                // Guardo el id de la inscripcion y cuestionario
                const { id_insc, id_cuest, nom_cuest } = rows[0];
                // Obtengo los id del registro de pregunta con cuestionario
                conn.query(`SELECT cuest_pregunta.id_cuest_pregunta as 'id_cq', pregunta.pregunta, pregunta.respA, pregunta.respB, pregunta.respC, pregunta.respD, pregunta.respE,
                 pregunta.respCorrecta FROM cuest_pregunta NATURAL INNER JOIN pregunta WHERE cuest_pregunta.id_cuestionario = ${id_cuest};`)
                    .then(rows => {
                        const json = {
                            id_ins_per_cuest: id_insc,
                            nom_cuest,
                            preguntas: rows.map(pregunta => pregunta)
                        }
                        res.send(json)
                    })
            })
    })
})

app.post('/getRevision', (req, res) => {
    // obtengo el id del alumno a revisar
    const alumno = req.body.id;

    connect.then(conn => {
        // Recupero el cuestionario al que esta inscrito
        conn.query(`SELECT cuestionario.id_cuestionario as 'id_cuest', cuestionario.nom_cuestionario as 'nom_cuest', 
        ins_per_cuest.id_ins_per_cuest as 'id_insc' FROM cuestionario NATURAL INNER JOIN ins_per_cuest WHERE id_persona = ${alumno};`)
            .then(rows => {
                const { id_cuest, nom_cuest, id_insc } = rows[0];
                // Recupero todas las preguntas de ese cuestionario 
                conn.query(`SELECT pregunta.pregunta, pregunta.respCorrecta FROM cuest_pregunta NATURAL INNER JOIN pregunta WHERE id_cuestionario = ${id_cuest};`)
                    .then(rows => {
                        const preguntas = rows.map(pregunta => pregunta);
                        // Recuperamos las respuestas 
                        conn.query(`SELECT respuesta from resp_per_cuest where id_ins_per_cuest = ${id_insc};`)
                            .then(rows => {
                                const respuestas = rows.map(respuesta => respuesta)
                                // Empaquetamos todo en un JSON
                                const json = {
                                    nom_cuest,
                                    preguntas,
                                    respuestas
                                }
                                res.send(json);
                            })
                    })
            })
    })
})

app.post('/saveRespuestas', (req, res) => {
    // Guardamos el cuerpo del Request
    const { id_ins_per_cuest, id_cuest_pregunta, respuestas, valor } = req.body;
    // Calculamos la calificacion del cuestionario
    let score = 0;
    valor.forEach(calf => { score = score + calf })
    // Lanzamos el query para guardar las repuestas del cuestionario
    connect.then(conn => {
        // Guardamos las respuestas del cuestionario
        id_cuest_pregunta.forEach((id, index) => {
            conn.query(`INSERT INTO resp_per_cuest VALUES(null, ${id_ins_per_cuest}, ${id}, ${JSON.stringify(respuestas[index])}, ${valor[index]})`)
        })
        // Actaulizamos la calificacion en el registro de inscripcion
        conn.query(`UPDATE ins_per_cuest SET cal_cuestionario = ${score / 2} WHERE id_ins_per_cuest = ${id_ins_per_cuest};`)
            .then(rows => {
                // Respondemos que las preguntas se guardaron con exito
                res.send({ succeed: true })
            })
    })
})

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(publicPath, 'index.html'));
});

app.listen(9000, () => {
    console.log(chalk.bgGreen.black('server is up'));
})