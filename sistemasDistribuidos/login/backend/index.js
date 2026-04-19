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

            // LOGIN
            app.post('/api/login', (req, res) => {
                const { usuario, password } = req.body;

                db.query(
                    "SELECT * FROM usuarios WHERE usuario=? AND password=?",
                    [usuario, password],
                    (e, r) => {
                        if (e) {
                            console.log(e);
                            return res.status(500).json({ ok: false });
                        }

                        if (r.length > 0) {
                            res.json({ ok: true });
                        } else {
                            res.status(401).json({ ok: false });
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