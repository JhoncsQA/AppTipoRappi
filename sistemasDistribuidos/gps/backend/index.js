const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/ubicacion', (req, res) => {
    res.json({
        unidad: "Camión de Reparto #42",
        lat: 2.4419,
        lng: -76.6063,
        timestamp: new Date().toISOString()
    });
});

app.listen(3000, () => console.log("Servicio GPS en puerto 3000"));