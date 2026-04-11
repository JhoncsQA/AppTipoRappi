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

            db.query(`DROP TABLE IF EXISTS tiendas`);

            db.query(`
            CREATE TABLE tiendas(
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50),
            categoria VARCHAR(50)
            )`);

            db.query(`
            INSERT INTO tiendas(nombre,categoria) VALUES
            ('Pizza Place','Comida'),
            ('Burger House','Rapida'),
            ('Sushi Bar','Asiatica')
            `);

            app.get('/api/data', (req, res) => {
                db.query("SELECT * FROM tiendas", (e, r) => {
                    res.json({ tiendas: r });
                });
            });
        }
    });
}

connectWithRetry();

app.listen(3000, () => {
    console.log("Servicio Tiendas corriendo");
});