const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db_tiendas:27017/tiendas_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log("Servicio Tiendas conectado a su DB"))
    .catch(err => console.error("Error en DB Tiendas:", err));

const TiendaSchema = new mongoose.Schema({
    nombre: String,
    categoria: String,
    abierto: { type: Boolean, default: true }
});
const Tienda = mongoose.model('Tienda', TiendaSchema);

app.get('/api/data', (req, res) => {
    res.json({
        servicio: "Catálogo de Tiendas",
        status: "Online",
        id_contenedor: process.env.HOSTNAME,
        tiendas: [
            { id: 101, nombre: "Pizzería Nápoles", categoria: "Italiana" },
            { id: 102, nombre: "Burger Master", categoria: "Rápida" },
            { id: 103, nombre: "Sushi Roll", categoria: "Asiática" }
        ],
        mensaje: "Catálogo cargado correctamente"
    });
});

app.listen(3000, () => console.log("Servicio de Tiendas corriendo en puerto 3000"));