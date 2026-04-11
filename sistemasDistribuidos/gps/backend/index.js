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

            db.query(`DROP TABLE IF EXISTS gps`);

            db.query(`
            CREATE TABLE gps(
            id INT AUTO_INCREMENT PRIMARY KEY,
            conductor VARCHAR(50),
            ubicacion VARCHAR(50)
            )`);

            db.query(`
            INSERT INTO gps(conductor,ubicacion) VALUES
            ('Juan','Centro'),
            ('Pedro','Norte'),
            ('Luis','Sur')
            `);

            app.get('/api/data', (req, res) => {
                db.query("SELECT * FROM gps", (e, r) => {
                    res.json({ gps: r });
                });
            });
        }
    });
}

connectWithRetry();

app.listen(3000, () => {
    console.log("Servicio GPS corriendo");
});