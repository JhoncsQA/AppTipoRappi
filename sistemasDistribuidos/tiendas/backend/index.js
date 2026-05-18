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

            console.log("Esperando MySQL...");

            setTimeout(connectWithRetry, 3000);

        } else {

            console.log("Tiendas conectado a MySQL");


            app.get('/api/data', (req, res) => {

                const inicio = Date.now();

                db.query(

                    "SELECT * FROM tiendas",

                    (e, r) => {

                        if (e) {

                            console.log(

                                "[TIENDAS] Error base de datos"

                            );

                            console.log(e);

                            return res.status(500).json({

                                error: "Error base de datos"

                            });
                        }

                        const fin = Date.now();

                        console.log(

                            `[TIENDAS] Tiempo respuesta: ${fin - inicio} ms`

                        );

                        console.log(

                            "[TIENDAS] Consulta exitosa"

                        );

                        res.json({

                            tiendas: r

                        });

                    }

                );

            });


            app.get('/api/productos/:id', (req, res) => {

                const inicio = Date.now();

                const tiendaId = req.params.id;

                db.query(

                    "SELECT * FROM productos WHERE tienda_id=?",

                    [tiendaId],

                    (e, r) => {

                        if (e) {

                            console.log(

                                "[PRODUCTOS] Error base de datos"

                            );

                            console.log(e);

                            return res.status(500).json({

                                error: "Error base de datos"

                            });
                        }

                        const fin = Date.now();

                        console.log(

                            `[PRODUCTOS] Tiempo respuesta: ${fin - inicio} ms`

                        );

                        console.log(

                            "[PRODUCTOS] Consulta exitosa"

                        );

                        res.json({

                            productos: r

                        });

                    }

                );

            });


            app.post('/api/insert', (req, res) => {

                const inicio = Date.now();

                const { nombre, categoria } = req.body;

                db.query(

                    "INSERT INTO tiendas(nombre,categoria) VALUES(?,?)",

                    [nombre, categoria],

                    (e, r) => {

                        if (e) {

                            console.log(

                                "[TIENDAS] Error insertando"

                            );

                            console.log(e);

                            return res.status(500).json({

                                error: "Error insertando tienda"

                            });
                        }

                        const fin = Date.now();

                        console.log(

                            `[TIENDAS] Tiempo respuesta: ${fin - inicio} ms`

                        );

                        console.log(

                            "[TIENDAS] Tienda creada"

                        );

                        res.json({

                            mensaje: "Tienda creada",
                            id: r.insertId

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

                                "[TIENDAS] MySQL DOWN"

                            );

                            return res.status(503).json({

                                status: "down",
                                service: "tiendas",
                                database: "down"

                            });
                        }

                        res.json({

                            status: "ok",
                            service: "tiendas",
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

    console.log("🚀 Servicio Tiendas corriendo");

});