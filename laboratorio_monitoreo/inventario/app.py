from flask import Flask, request, jsonify
import json
import os
import time
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("inventario")

app = Flask(__name__)
app.config["START_TIME"] = time.time()
ARCHIVO = "inventario.json"

MAX_FALLOS = 3
TIEMPO_REINTENTO = 120

cb_estado = {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0}

def cb_permite():
    global cb_estado
    if cb_estado["estado"] == "ABIERTO":
        if time.time() - cb_estado["ultimo_fallo"] >= TIEMPO_REINTENTO:
            cb_estado["estado"] = "MEDIO_ABIERTO"
            logger.info("[CB-inventario] Circuito pasa a MEDIO_ABIERTO")
            return True
        return False
    return True

def cb_fallo():
    global cb_estado
    cb_estado["fallos"] += 1
    cb_estado["ultimo_fallo"] = time.time()
    logger.warning("[CB-inventario] Fallo %d/%d", cb_estado["fallos"], MAX_FALLOS)
    if cb_estado["fallos"] >= MAX_FALLOS:
        cb_estado["estado"] = "ABIERTO"
        logger.error("[CB-inventario] Circuito ABIERTO por %ds", TIEMPO_REINTENTO)

def cb_exito():
    global cb_estado
    if cb_estado["estado"] == "MEDIO_ABIERTO":
        cb_estado["estado"] = "CERRADO"
        cb_estado["fallos"] = 0
        logger.info("[CB-inventario] Circuito recuperado, vuelve a CERRADO")
    elif cb_estado["fallos"] > 0:
        cb_estado["fallos"] = 0
        logger.info("[CB-inventario] Contador de fallos reiniciado")

def leer_inventario():
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r") as f:
        return json.load(f)

def guardar_inventario(data):
    with open(ARCHIVO, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/inventario", methods=["GET"])
def listar_inventario():
    if not cb_permite():
        logger.warning("[CB-inventario] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Inventario no disponible (circuito abierto)"}, 503
    try:
        inventario = leer_inventario()
        cb_exito()
        logger.info("Inventario consultado. %d productos disponibles", len(inventario))
        return jsonify(inventario)
    except Exception as e:
        cb_fallo()
        logger.error("Error al leer inventario: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/inventario", methods=["POST"])
def agregar_producto():
    if not cb_permite():
        logger.warning("[CB-inventario] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Inventario no disponible (circuito abierto)"}, 503
    try:
        data = request.json
        inventario = leer_inventario()
        nuevo = {
            "id": len(inventario) + 1,
            "producto": data["producto"],
            "cantidad": data["cantidad"]
        }
        inventario.append(nuevo)
        guardar_inventario(inventario)
        cb_exito()
        logger.info("Producto agregado al inventario: %s (cantidad: %d)", nuevo["producto"], nuevo["cantidad"])
        return jsonify(nuevo), 201
    except Exception as e:
        cb_fallo()
        logger.error("Error al agregar producto: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/inventario/<int:id>", methods=["PUT"])
def actualizar_stock(id):
    if not cb_permite():
        logger.warning("[CB-inventario] Peticion PUT bloqueada, circuito ABIERTO")
        return {"error": "Inventario no disponible (circuito abierto)"}, 503
    try:
        data = request.json
        inventario = leer_inventario()
        for item in inventario:
            if item["id"] == id:
                item["cantidad"] = data["cantidad"]
                guardar_inventario(inventario)
                cb_exito()
                logger.info("Stock actualizado: %s ahora tiene %d unidades", item["producto"], item["cantidad"])
                return jsonify(item)
        logger.warning("Producto con id %d no encontrado", id)
        return jsonify({"error": "Producto no encontrado"}), 404
    except Exception as e:
        cb_fallo()
        logger.error("Error al actualizar stock: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/health")
def health():
    start_time = time.time()
    tiempo_respuesta = round((time.time() - start_time) * 1000, 2)
    uptime = time.time() - app.config.get("START_TIME", time.time())
    return jsonify({
        "status": "ok",
        "service": "inventario",
        "tiempo_respuesta_ms": tiempo_respuesta,
        "uptime_segundos": int(uptime),
        "circuit_breaker": {
            "estado": cb_estado["estado"],
            "fallos": cb_estado["fallos"]
        }
    })

if __name__ == "__main__":
    logger.info("Servicio de inventario iniciado en puerto 5000")
    app.run(host="0.0.0.0", port=5000)
