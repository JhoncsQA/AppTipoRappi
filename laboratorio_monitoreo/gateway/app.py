from flask import Flask, request, jsonify
import requests
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("gateway")

app = Flask(__name__)

URL_PEDIDOS = "http://pedidos:5000"
URL_INVENTARIO = "http://inventario:5000"
URL_PAGOS = "http://pagos:5000"

SERVICIOS = {
    "pedidos": URL_PEDIDOS,
    "inventario": URL_INVENTARIO,
    "pagos": URL_PAGOS
}

MAX_FALLOS = 3
TIEMPO_REINTENTO = 120

cb_estados = {
    "pedidos": {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0},
    "inventario": {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0},
    "pagos": {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0},
}

def cb_permite(servicio):
    estado = cb_estados[servicio]
    if estado["estado"] == "ABIERTO":
        if time.time() - estado["ultimo_fallo"] >= TIEMPO_REINTENTO:
            estado["estado"] = "MEDIO_ABIERTO"
            logger.info("[CB-%s] Circuito pasa a MEDIO_ABIERTO", servicio)
            return True
        return False
    return True

def cb_fallo(servicio):
    estado = cb_estados[servicio]
    estado["fallos"] += 1
    estado["ultimo_fallo"] = time.time()
    logger.warning("[CB-%s] Fallo %d/%d", servicio, estado["fallos"], MAX_FALLOS)
    if estado["fallos"] >= MAX_FALLOS:
        estado["estado"] = "ABIERTO"
        logger.error("[CB-%s] Circuito ABIERTO por %ds", servicio, TIEMPO_REINTENTO)

def cb_exito(servicio):
    estado = cb_estados[servicio]
    if estado["estado"] == "MEDIO_ABIERTO":
        estado["estado"] = "CERRADO"
        estado["fallos"] = 0
        logger.info("[CB-%s] Circuito recuperado, vuelve a CERRADO", servicio)
    elif estado["fallos"] > 0:
        estado["fallos"] = 0
        logger.info("[CB-%s] Contador de fallos reiniciado", servicio)

@app.route("/")
def home():
    return "API GATEWAY MONITOREO FUNCIONANDO"

@app.route("/pedidos", methods=["GET"])
def pedidos_get():
    if not cb_permite("pedidos"):
        logger.warning("[CB-pedidos] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Servicio pedidos no disponible (circuito abierto)"}, 503
    try:
        response = requests.get(f"{SERVICIOS['pedidos']}/pedidos")
        cb_exito("pedidos")
        logger.info("Peticion a pedidos GET exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("pedidos")
        logger.error("Servicio pedidos no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/pedidos/crear", methods=["POST"])
def pedidos_post():
    if not cb_permite("pedidos"):
        logger.warning("[CB-pedidos] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Servicio pedidos no disponible (circuito abierto)"}, 503
    try:
        response = requests.post(f"{SERVICIOS['pedidos']}/pedidos", json=request.json)
        cb_exito("pedidos")
        logger.info("Peticion a pedidos POST exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("pedidos")
        logger.error("Servicio pedidos no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/inventario", methods=["GET"])
def inventario_get():
    if not cb_permite("inventario"):
        logger.warning("[CB-inventario] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Servicio inventario no disponible (circuito abierto)"}, 503
    try:
        response = requests.get(f"{SERVICIOS['inventario']}/inventario")
        cb_exito("inventario")
        logger.info("Peticion a inventario GET exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("inventario")
        logger.error("Servicio inventario no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/inventario/crear", methods=["POST"])
def inventario_post():
    if not cb_permite("inventario"):
        logger.warning("[CB-inventario] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Servicio inventario no disponible (circuito abierto)"}, 503
    try:
        response = requests.post(f"{SERVICIOS['inventario']}/inventario", json=request.json)
        cb_exito("inventario")
        logger.info("Peticion a inventario POST exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("inventario")
        logger.error("Servicio inventario no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/pagos", methods=["GET"])
def pagos_get():
    if not cb_permite("pagos"):
        logger.warning("[CB-pagos] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Servicio pagos no disponible (circuito abierto)"}, 503
    try:
        response = requests.get(f"{SERVICIOS['pagos']}/pagos")
        cb_exito("pagos")
        logger.info("Peticion a pagos GET exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("pagos")
        logger.error("Servicio pagos no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/pagos/crear", methods=["POST"])
def pagos_post():
    if not cb_permite("pagos"):
        logger.warning("[CB-pagos] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Servicio pagos no disponible (circuito abierto)"}, 503
    try:
        response = requests.post(f"{SERVICIOS['pagos']}/pagos", json=request.json)
        cb_exito("pagos")
        logger.info("Peticion a pagos POST exitosa")
        return jsonify(response.json()), response.status_code
    except requests.exceptions.ConnectionError:
        cb_fallo("pagos")
        logger.error("Servicio pagos no disponible")
        return {"error": "Servicio no disponible"}, 503

@app.route("/monitor")
def monitor():
    resultados = {}
    tiempo_total_inicio = time.time()
    for nombre, url in SERVICIOS.items():
        estado_cb = cb_estados[nombre]
        try:
            inicio = time.time()
            r = requests.get(f"{url}/health", timeout=5)
            tiempo_respuesta = round((time.time() - inicio) * 1000, 2)
            datos = r.json()
            resultados[nombre] = {
                "status": "ok",
                "codigo": r.status_code,
                "tiempo_respuesta_ms": tiempo_respuesta,
                "uptime_segundos": datos.get("uptime_segundos", 0),
                "tiempo_servicio_ms": datos.get("tiempo_respuesta_ms", 0),
                "circuit_breaker": {
                    "estado": estado_cb["estado"],
                    "fallos": estado_cb["fallos"]
                }
            }
            logger.info("Monitor: %s OK | Tiempo: %sms | Uptime: %ds",
                nombre, tiempo_respuesta, datos.get("uptime_segundos", 0))
        except requests.exceptions.Timeout:
            cb_fallo(nombre)
            resultados[nombre] = {
                "status": "timeout",
                "codigo": None,
                "tiempo_respuesta_ms": None,
                "uptime_segundos": None,
                "circuit_breaker": {
                    "estado": estado_cb["estado"],
                    "fallos": estado_cb["fallos"]
                }
            }
            logger.warning("Monitor: %s TIMEOUT", nombre)
        except requests.exceptions.ConnectionError:
            cb_fallo(nombre)
            resultados[nombre] = {
                "status": "down",
                "codigo": None,
                "tiempo_respuesta_ms": None,
                "uptime_segundos": None,
                "circuit_breaker": {
                    "estado": estado_cb["estado"],
                    "fallos": estado_cb["fallos"]
                }
            }
            logger.warning("Monitor: %s NO RESPONDE", nombre)
        except Exception as e:
            resultados[nombre] = {
                "status": "error",
                "detalle": str(e),
                "tiempo_respuesta_ms": None,
                "circuit_breaker": {
                    "estado": estado_cb["estado"],
                    "fallos": estado_cb["fallos"]
                }
            }
            logger.error("Monitor: %s error - %s", nombre, e)
    tiempo_total = round((time.time() - tiempo_total_inicio) * 1000, 2)
    todos_ok = all(r["status"] == "ok" for r in resultados.values())
    return jsonify({
        "disponibilidad": "todos operativos" if todos_ok else "fallo detectado",
        "tiempo_total_monitor_ms": tiempo_total,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "servicios": resultados
    })

if __name__ == "__main__":
    logger.info("Gateway de monitoreo iniciado en puerto 5000")
    app.run(host="0.0.0.0", port=5000)
