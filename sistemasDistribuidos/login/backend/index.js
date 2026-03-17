const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db_login:27017/login_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log("Login conectado a su DB independiente"))
    .catch(err => console.error("Error en DB Login:", err));

const UsuarioSchema = new mongoose.Schema({
    username: String,
    pass: String, 
    email: String
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    console.log(`Intento de login para: ${user}`);

    if (user === 'anderson' && pass === '1234') {
        return res.json({
            status: "success",
            usuario: "Anderson_User",
            mensaje: "Sesión válida"
        });
    }

    res.status(401).json({ status: "error", mensaje: "Credenciales inválidas" });
});

app.get('/api/data', (req, res) => {
    res.json({
        servicio: "Autenticación (Login)",
        status: "Online",
        id_contenedor: process.env.HOSTNAME
    });
});

app.listen(3000, () => console.log("Servicio de Login listo en puerto 3000"));