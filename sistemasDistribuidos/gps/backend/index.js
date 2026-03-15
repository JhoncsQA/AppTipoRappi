const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
// Servir el frontend del GPS
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a MongoDB (la URL viene del docker-compose)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://db_gps:27017/gps_db';
mongoose.connect(MONGO_URI)
    .then(() => console.log("GPS conectado a su base de datos"))
    .catch(err => console.error("Error en DB GPS:", err));

const UbicacionSchema = new mongoose.Schema({
    repartidorId: String,
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
});
const Ubicacion = mongoose.model('Ubicacion', UbicacionSchema);

app.get('/api/data', async (req, res) => {
    res.json({
        servicio: "Geoposicionamiento (GPS)",
        status: "Online",
        id_contenedor: process.env.HOSTNAME,
        coordenadas: { lat: 2.4419, lng: -76.6063 }, 
        mensaje: "Ubicación del repartidor obtenida con éxito"
    });
});

app.listen(3000, () => console.log("Servicio GPS operando en puerto 3000"));