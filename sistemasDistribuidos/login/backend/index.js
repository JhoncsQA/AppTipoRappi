const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth', (req, res) => {
    const { user, password } = req.body;
    // Simulación de validación
    if (user === "admin" && password === "1234") {
        res.json({ mensaje: "¡Bienvenido, administrador!", token: "abc-123" });
    } else {
        res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
});

app.listen(3000, () => console.log("Servicio LOGIN en puerto 3000"));