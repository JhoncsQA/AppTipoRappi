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
            console.log("Esperando MySQL Pedidos...");
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log("Pedidos conectado a MySQL");

            app.get('/api/data', (req, res) => {
                const inicio = Date.now();
                db.query(
                    "SELECT * FROM pedidos",
                    (e, r) => {
                        if (e) {
                            console.log(
                                "[PEDIDOS] Error en base de datos"
                            );
                            console.log(e);
                            return res.status(500).json({
                                error: "Error base de datos"
                            });
                        }

                        const fin = Date.now();
                        console.log(
                            `[PEDIDOS] Tiempo respuesta: ${fin - inicio} ms`
                        );

                        console.log(
                            "[PEDIDOS] Consulta exitosa"
                        );


                        res.json({
                            pedidos: r
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
                                "[PEDIDOS] MySQL DOWN"
                            );
                            return res.status(503).json({
                                status: "down",
                                service: "pedidos",
                                database: "down"
                            });
                        }

                        res.json({

                            status: "ok",
                            service: "pedidos",
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
    console.log("🚀 Servicio Pedidos corriendo");
});