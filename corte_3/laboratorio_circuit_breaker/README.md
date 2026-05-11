# Fase 1 – Observar y Analizar

---

## ¿Qué hace el sistema actualmente?

La arquitectura se basa en un **API Gateway** centralizado que actúa como el único punto de entrada para las solicitudes del cliente. Su función principal es el enrutamiento inteligente hacia los microservicios de backend.

* **Gestión de flujo positivo:** Cuando los servicios están operativos, el Gateway actúa como un puente transparente, entregando la data procesada al usuario.
* **Gestión de excepciones:** En presencia de latencia, caídas de servidor o errores de red, el sistema interviene. En lugar de permitir que el error colapse la experiencia del usuario, el Gateway registra la incidencia, actualiza sus contadores internos de fallos y responde con un código **HTTP 503**, manteniendo la integridad de la comunicación.

---

## ¿Se protege o insiste?

El diseño del sistema prioriza la **autoprotección** sobre la insistencia ciega. Aunque inicialmente intenta establecer el enlace, implementa una política de "punto de ruptura".

Al acumularse **3 fallos consecutivos**, se ejecutan las siguientes acciones de seguridad:

1.  **Activación del Disyuntor:** El estado del componente cambia a **OPEN** (`circuito_abierto = True`).
2.  **Cese de peticiones:** El Gateway bloquea de inmediato cualquier intento de conexión futuro hacia ese nodo específico.

Esta estrategia es vital para prevenir la saturación de recursos y evitar que un fallo local se convierta en una caída total del sistema (fallos en cascada).

---

# Fase 2 - Preguntas de Análisis y Decisiones

---

## ¿Cada servicio debe tener su propio contador de fallos?

Definitivamente. En una arquitectura de microservicios, la autonomía es clave. Cada unidad (Mascotas, Usuarios, etc.) opera de forma aislada, por lo que el Gateway debe monitorearlos de manera individual.

Implementamos rastreadores separados como:
* `fallos_mascotas`
* `fallos_usuarios`

Tener métricas independientes permite que, si un servicio entra en crisis, el resto de la plataforma siga prestando soporte al usuario sin interrupciones innecesarias.

---

## ¿El circuito debe abrirse de forma independiente por servicio?

Sí. La independencia de los circuitos es lo que garantiza la **resiliencia parcial** del sistema. 

Si el parámetro `circuito_abierto_usuarios` se activa, el Gateway detiene el tráfico hacia el microservicio de Usuarios, pero mantiene las rutas de Mascotas totalmente funcionales. Esto aísla el error y evita que un problema de base de datos en un módulo inhabilite todo el ecosistema de la aplicación.

---

## ¿Qué pasa si falla un servicio pero el otro sigue funcionando?

El Gateway entra en un modo de **Degradación Controlada**. En lugar de fallar por completo, el sistema entrega una respuesta híbrida.

El flujo es el siguiente:
1.  Se recolecta la información de los servicios estables.
2.  Se marca técnicamente el servicio inaccesible dentro de un objeto de errores.
3.  Se devuelve un paquete de datos útil al cliente, notificando qué partes del sistema están "Bloqueadas".

```json
{
  "data": {
    "usuarios": [{"id": 1, "nombre": "Ana"}]
  },
  "errores": {
    "mascotas": "Bloqueado"
  }
}
