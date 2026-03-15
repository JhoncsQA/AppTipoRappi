const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db_pedidos:27017/pedidos_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log("Servicio de Pedidos conectado a su DB"))
    .catch(err => console.error("Error en DB Pedidos:", err));

const PedidoSchema = new mongoose.Schema({
    producto: String,
    precio: Number,
    estado: { type: String, default: "Procesando" },
    fecha: { type: Date, default: Date.now }
});
const Pedido = mongoose.model('Pedido', PedidoSchema);

app.get('/api/data', (req, res) => {
    res.json({
        servicio: "Gestión de Pedidos",
        status: "Online",
        id_contenedor: process.env.HOSTNAME,
        resumen: {
            pedidos_hoy: 15,
            ultimo_pedido: "Hamburguesa Doble Carne",
            total_ventas: "$450.000 COP"
        },
        mensaje: "Historial de transacciones actualizado"
    });
});

app.listen(3000, () => console.log("Servicio de Pedidos corriendo en puerto 3000"));