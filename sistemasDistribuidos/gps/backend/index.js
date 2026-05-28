const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());


function connectWithRetry() {

    const db = mysql.createConnection({

        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE

    });

    db.connect(err => {

        if (err) {
            console.log("Esperando MySQL GPS...");
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log("GPS conectado a MySQL");
            app.get('/api/data', (req, res) => {
                const inicio = Date.now();
                db.query(
                    "SELECT * FROM gps",
                    (e, r) => {
                        if (e) {
                            console.log(
                                "[GPS] Error base de datos"
                            );

                            console.log(e);
                            return res.status(500).json({
                                error: "Error base de datos"
                            });
                        }

                        const fin = Date.now();

                        console.log(
                            `[GPS] Tiempo respuesta: ${fin - inicio} ms`
                        );

                        console.log(
                            "[GPS] Consulta exitosa"
                        );

                        res.json({
                            gps: r
                        });

                    }

                );

            });

            app.get('/health', (req, res) => {
                db.query(
                    "SELECT 1",
                    (e) => {
                        if (e) {
                            console.log(
                                "[GPS] MySQL DOWN"
                            );

                            return res.status(503).json({
                                status: "down",
                                service: "gps",
                                database: "down"
                            });
                        }

                        res.json({
                            status: "ok",
                            service: "gps",
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
    console.log(" Servicio GPS corriendo");
});