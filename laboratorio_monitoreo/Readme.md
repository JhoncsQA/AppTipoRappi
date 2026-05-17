# Sistema de Microservicios con API Gateway

Sistema de microservicios implementado con patrón API Gateway utilizando Docker Compose.

## Arquitectura

- **Gateway**
  - Punto de entrada principal
  - Enruta las solicitudes a los diferentes servicios

- **Servicios Independientes**
  - Pedidos
  - Inventario
  - Pagos

Cada servicio cuenta con persistencia en archivos JSON.

---

# Monitoreo Implementado

## 1. Circuit Breaker

Implementado tanto en el Gateway como en cada microservicio.

### Funcionamiento

```text
CERRADO → ABIERTO → MEDIO_ABIERTO → CERRADO
```

### Características

- Después de 3 fallos consecutivos:
  - El servicio se bloquea durante 120 segundos
- Reintento automático:
  - Cuando entra en estado `MEDIO_ABIERTO`

---

## 2. Endpoint `/monitor`

Disponible en el Gateway.

### Funcionalidades

- Consulta el endpoint `/health` de cada servicio
- Reporta:
  - Estado
  - Código HTTP
  - Tiempo de respuesta
  - Uptime
  - Estado del Circuit Breaker

---

## 3. Endpoint `/health`

Disponible en cada servicio.

### Retorna

- Estado del servicio
- Uptime
- Tiempo de respuesta
- Estado del Circuit Breaker

---

# Resultados Observados

Consultando:

```http
GET http://localhost:5000/monitor
```

Se obtiene:

- Disponibilidad global del sistema
- Estado de todos los servicios
- Tiempo total de verificación
- Tiempo de respuesta por servicio
- Uptime
- Fallos acumulados

---

# Características del Sistema

El sistema permite:

- Detectar servicios caídos automáticamente
- Aislar fallos mediante Circuit Breaker
- Evitar cascadas de errores
- Monitorear el estado general de la arquitectura
- Mejorar la tolerancia a fallos

---

# Tecnologías Utilizadas

- Docker Compose
- API Gateway
- Microservicios
- JSON Persistence
- Circuit Breaker Pattern
- HTTP Monitoring
