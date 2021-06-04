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

    // Autentica al usuario
    const User = req.body;

    connect.then(conn => {
        conn.query(`SELECT * FROM usuario WHERE user_name = ?`, User.user)
            .then(rows => {
                if(rows.length > 0) {
                    // Si existe el usuario en la DB
                    // Comprobamos que la contraseña sea correcta
                    if(rows[0].user_password === User.password) {
                        // Las credenciales son correctas
                        // Damos acceso al sistema
                        res.json({ auth: true , ...rows[0] })
                    }else {
                        // Las credenciales no son correctas 
                        // Negamos el acceso al sistema
                        res.json({ auth: false,error: "Contraseña incorrecta", ...rows[0] })
                    }
                    
                }else {
                    // No existe el usuario en la base de datos
                    // Negamos el acceso al sistema
                    res.json({ auth: false,error: "Usuario y/o contraseña incorrectos", ...rows[0] })
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

app.post('/pullCuest', (req, res) => {
    // Separamos el json en variables
    const nombre = JSON.stringify(req.body.nombre);
    const fecha = JSON.stringify(req.body.fecha);
    const id_categoria = req.body.categoria;
    // Lanzamos el query a la base de datos para guardar el cuestionario
    connect.then((conn) => {
        // Guardamos el cuestionario
        conn.query(`INSERT INTO cuestionario VALUES (NULL,${nombre},${fecha},${id_categoria});`)
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

app.post('/pullQuest', (req, res) => {
    // Lanzamos el query a la base de datos para guardar la pregunta
    connect.then((conn) => {
        // Guardamos el cuestionario
        conn.query(`INSERT INTO pregunta VALUES (NULL,${JSON.stringify(req.body.pregunta)},
            ${JSON.stringify(req.body.respuestaA)},
            ${JSON.stringify(req.body.respuestaB)}, 
            ${JSON.stringify(req.body.respuestaC)}, 
            ${JSON.stringify(req.body.respuestaD)},
            ${JSON.stringify(req.body.respuestaE)}, 
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



app.listen(9000, () => {
    console.log(chalk.bgGreen.black('server is up'));
})