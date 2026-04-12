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
                db.query("SELECT * FROM pedidos", (e, r) => {
                    res.json({ pedidos: r });
                });
            });
        }
    });
}

connectWithRetry();

app.listen(3000);