from flask import Flask, request, jsonify
import json
import os
import time
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("pedidos")

app = Flask(__name__)
app.config["START_TIME"] = time.time()
ARCHIVO = "pedidos.json"

MAX_FALLOS = 3
TIEMPO_REINTENTO = 120

cb_estado = {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0}

def cb_permite():
    global cb_estado
    if cb_estado["estado"] == "ABIERTO":
        if time.time() - cb_estado["ultimo_fallo"] >= TIEMPO_REINTENTO:
            cb_estado["estado"] = "MEDIO_ABIERTO"
            logger.info("[CB-pedidos] Circuito pasa a MEDIO_ABIERTO")
            return True
        return False
    return True

def cb_fallo():
    global cb_estado
    cb_estado["fallos"] += 1
    cb_estado["ultimo_fallo"] = time.time()
    logger.warning("[CB-pedidos] Fallo %d/%d", cb_estado["fallos"], MAX_FALLOS)
    if cb_estado["fallos"] >= MAX_FALLOS:
        cb_estado["estado"] = "ABIERTO"
        logger.error("[CB-pedidos] Circuito ABIERTO por %ds", TIEMPO_REINTENTO)

def cb_exito():
    global cb_estado
    if cb_estado["estado"] == "MEDIO_ABIERTO":
        cb_estado["estado"] = "CERRADO"
        cb_estado["fallos"] = 0
        logger.info("[CB-pedidos] Circuito recuperado, vuelve a CERRADO")
    elif cb_estado["fallos"] > 0:
        cb_estado["fallos"] = 0
        logger.info("[CB-pedidos] Contador de fallos reiniciado")

def leer_pedidos():
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r") as f:
        return json.load(f)

def guardar_pedidos(data):
    with open(ARCHIVO, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/pedidos", methods=["GET"])
def listar_pedidos():
    if not cb_permite():
        logger.warning("[CB-pedidos] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Pedidos no disponible (circuito abierto)"}, 503
    try:
        pedidos = leer_pedidos()
        cb_exito()
        logger.info("Se consultaron los pedidos. Total: %d", len(pedidos))
        return jsonify(pedidos)
    except Exception as e:
        cb_fallo()
        logger.error("Error al leer pedidos: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/pedidos", methods=["POST"])
def crear_pedido():
    if not cb_permite():
        logger.warning("[CB-pedidos] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Pedidos no disponible (circuito abierto)"}, 503
    try:
        data = request.json
        pedidos = leer_pedidos()
        nuevo = {
            "id": len(pedidos) + 1,
            "producto": data["producto"],
            "cantidad": data["cantidad"],
            "total": data["total"],
            "estado": "pendiente",
            "creado": datetime.now().isoformat()
        }
        pedidos.append(nuevo)
        guardar_pedidos(pedidos)
        cb_exito()
        logger.info("Pedido creado: %d - %s x %d = $%s", nuevo["id"], nuevo["producto"], nuevo["cantidad"], nuevo["total"])
        return jsonify(nuevo), 201
    except Exception as e:
        cb_fallo()
        logger.error("Error al crear pedido: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/health")
def health():
    start_time = time.time()
    tiempo_respuesta = round((time.time() - start_time) * 1000, 2)
    uptime = time.time() - app.config.get("START_TIME", time.time())
    return jsonify({
        "status": "ok",
        "service": "pedidos",
        "tiempo_respuesta_ms": tiempo_respuesta,
        "uptime_segundos": int(uptime),
        "circuit_breaker": {
            "estado": cb_estado["estado"],
            "fallos": cb_estado["fallos"]
        }
    })

if __name__ == "__main__":
    logger.info("Servicio de pedidos iniciado en puerto 5000")
    app.run(host="0.0.0.0", port=5000)
