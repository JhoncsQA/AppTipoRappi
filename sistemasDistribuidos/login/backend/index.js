const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

function connectWithRetry() {

    const db = mysql.createConnection({

        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE

    });

    db.connect(err => {

        if (err) {
            console.log("Esperando MySQL Login...");
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log("Login conectado a MySQL");

            app.post('/api/login', (req, res) => {
                const inicio = Date.now();
                const { usuario, password } = req.body;
                db.query(
                    "SELECT * FROM usuarios WHERE usuario=? AND password=?",
                    [usuario, password],

                    (e, r) => {
                        if (e) {
                            console.log("[LOGIN] Error base de datos");
                            console.log(e);
                            return res.status(500).json({
                                ok: false
                            });
                        }

                        const fin = Date.now();
                        console.log(
                            `[LOGIN] Tiempo respuesta: ${fin - inicio} ms`
                        );

                        if (r.length > 0) {
                            console.log(
                                "[LOGIN] Usuario autenticado"
                            );

                            res.json({
                                ok: true
                            });

                        } else {
                            console.log(
                                "[LOGIN] Usuario incorrecto"
                            );

                            res.status(401).json({
                                ok: false
                            });
                        }

                    }

                );

            });


            app.get('/health', (req, res) => {
                db.query(
                    "SELECT 1",

                    (e) => {
                        if (e) {
                            console.log(
                                "[LOGIN] MySQL DOWN"
                            );
                            return res.status(503).json({
                                status: "down",
                                service: "login",
                                database: "down"
                            });
                        }

                        res.json({
                            status: "ok",
                            service: "login",
                            database: "ok"
                        });
                    }
                );
            });
        }
    });
}

connectWithRetry();

app.listen(3000, () => {
    console.log(" Servicio Login corriendo");
});