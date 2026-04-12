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
            console.log("Esperando MySQL Tiendas...");
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log("Tiendas conectado a MySQL");

            app.get('/api/data', (req, res) => {
                db.query("SELECT * FROM tiendas", (e, r) => {
                    res.json({ tiendas: r });
                });
            });

            app.post('/api/insert', (req, res) => {
                const { nombre, categoria } = req.body;

                db.query(
                    "INSERT INTO tiendas(nombre,categoria) VALUES(?,?)",
                    [nombre, categoria],
                    (e, r) => {
                        if (e) {
                            return res.status(500).json({ error: "Error insertando" });
                        }

                        res.json({
                            mensaje: "Tienda creada",
                            id: r.insertId
                        });
                    }
                );
            });
        }
    });
}

connectWithRetry();

app.listen(3000);