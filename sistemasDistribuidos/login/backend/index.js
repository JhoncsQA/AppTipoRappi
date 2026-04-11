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
            console.log("Esperando MySQL Login...");
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log("Login conectado a MySQL");

            db.query(`
            CREATE TABLE IF NOT EXISTS usuarios(
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(50),
            password VARCHAR(50)
            )`);

            db.query(`
            INSERT INTO usuarios(usuario,password)
            SELECT * FROM(
            SELECT 'admin','123456'
            )tmp
            WHERE NOT EXISTS(SELECT 1 FROM usuarios LIMIT 1)`);

            app.post('/api/login', (req, res) => {
                const { usuario, password } = req.body;

                db.query(
                    "SELECT * FROM usuarios WHERE usuario=? AND password=?",
                    [usuario, password],
                    (e, r) => {
                        if (r && r.length > 0) {
                            res.json({ login: "ok" });
                        } else {
                            res.status(401).json({ login: "fail" });
                        }
                    }
                );
            });
        }
    });
}

connectWithRetry();

app.listen(3000, () => {
    console.log("Servicio Login corriendo");
});