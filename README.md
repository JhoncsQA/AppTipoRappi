# Arquitectura del Sistema: AppTipoRappi

Aplicación tipo **Rappi** para la **gestión de domicilios**, orientada a facilitar el proceso de pedidos, asignación de repartidores y seguimiento de entregas en tiempo real.


Integrantes:

Samir Ausecha - Encargado de documentación
Anderson Avendaño - Encargado tecnico
Nasly de los rios - Encargado de la presentación
Jhon Cabezas - Lider del proyecto

Link Git:
https://github.com/JhoncsQA/AppTipoRappi.git

## Problema que resuelve

ENTENDER EL PROBLEMA

1. ¿Qué problema resuelve el sistema?
  El aplicativo nos ayuda a realizar domicilios de manera facil, efectiva y de manera autonoma por medio del telefono movil
  sin depender de usuario intermedios que nos tomen la orden o nos limiten en al menu siendo poco claros con el pedido

2. ¿Quién lo usará?

  personas adultas y jovenes que requieran realizar un pedido pr medio de un App en un rango de edad entre 15 años a 50 años

3. ¿Qué pasaría si no existiera?

  Se realizarian domicilios de manera tradicional por llamada o mensajes de texto o whatsapp, pero limitaria mucho la experiencia del usuario
  el conocimeinto completo del menu y generaria problemas de tiempo y errores de entendimeinto al realizar o tomar una orden

## Servicios del sistema

IDENTIFICAR LOS SERVICIOS

¿Qué funciones principales tiene el sistema?

# Arquitectura dle sistema: AppTipoRappi
## Problema que resuelve

## EL PROYECTO SE LLAMARA "DOMI'S YA"


## 1 ENTENDER EL PROBLEMA

## ¿Qué problema resuelve el sistema?
Resuelve el problema de compra y envios de paqueteria local. 
## ¿Quién lo usará?
La usara cualquier tipo de persona, que desee comprar o vender cualquier tipo de producto
## ¿Qué pasaría si no existiera?
Si no existiera las personas seguirian utilizando aplicaciones existentos donde el cobro por envio de productos es muy costoso.


## 2 IDENTIFICAR LOS SERVICIOS

## ¿Qué funciones principales tiene el sistema?
El sistema tiene como principales funciones, filtros personalizados para la busqueda de productos, tarjetas de descuentos, envios gratis, plan padrino(para apadrinar tus familiares.)
## ¿Qué partes pueden trabajar por separado?
sistema de pagos, sistema de gps, sistema de manejo de usuarios. 
## ¿Qué procesos son independientes?
pasarela de pagos, login, compras, ventas, notificaciones. 


## 3 ¿CÓMO SE COMUNICAN?

## ¿Qué servicio necesita información de otro?
login 
## ¿Quién solicita datos?
login - solicita - datos de usuarios
## ¿Quién responde?
login - responde - usuario y contraseña OK

## ¿Qué servicio necesita información de otro?
Pasarela de pagos 
## ¿Quién solicita datos?
pago - solicita - producto y saldo a favor 
## ¿Quién responde?
pago - responde - producto y saldo OK

## 4 ELEGIR LA ARQUITECTURA

Arquitectura de microservicios.

## ¿Cuántos usuarios tendrá el sistema?
el sistema inicialmente, emepzara con los estudiantes de la universidad.
## ¿Necesita escalar?
se necesita escalar
## ¿Es un sistema pequeño o grande?
en el momento iniciara grande, pero periodicamente va a ir aumentando la capacidad para manejas mas clientes. 

## 5 BASE DE DATOS

## ¿Qué información debe guardarse?
Se deben tener varias tablas para el almacenamiento de la informacion, entre ellas usuarios, productos, tiendas, pagos, pedidos. 
## ¿Qué datos son críticos?
los datos criticos son, todos los datos personales. 
## ¿Qué pasaría si se pierden?
primero se perderia la confianza de los clientes. 

## 6 FALLAS Y RIESGOS

En el sistema podras registrarte tato como vendedor como comprados, ademas de esto tendra un usuario administrador, supervisor y otro de soporte. 

Respuesta de ejemplo:
```json
{
  "gateway": "ok",
  "timestamp": "2026-05-28T15:52:13.935Z",
  "servicios": {
    "login": {
      "estado": "ok",
      "tiempo_respuesta_ms": 20,
      "circuito": "cerrado",
      "fallos": 0,
      "tiempo_caido_ms": 0
    },
    "tiendas": {
      "estado": "ok",
      "tiempo_respuesta_ms": 12,
      "circuito": "cerrado",
      "fallos": 0,
      "tiempo_caido_ms": 0
    },
    "pedidos": {
      "estado": "ok",
      "tiempo_respuesta_ms": 11,
      "circuito": "cerrado",
      "fallos": 0,
      "tiempo_caido_ms": 0
    },
    "gps": {
      "estado": "ok",
      "tiempo_respuesta_ms": 11,
      "circuito": "cerrado",
      "fallos": 0,
      "tiempo_caido_ms": 0
    }
  }
}
```

## Circuit Breaker

Para evitar que un servicio caído afecte a los demás, se implementó un Circuit Breaker 
en el Gateway con las siguientes reglas:

- Si un servicio falla 3 veces seguidas, el circuito se abre y deja de enviarle peticiones
- Después de 5 segundos, intenta reconectarse automáticamente
- Si responde bien, el circuito se cierra y vuelve a la normalidad

---

## Base de datos

Se manejan las siguientes tablas: usuarios, productos, tiendas, pagos y pedidos.
Los datos personales son considerados críticos y deben estar protegidos en todo momento.

---

## Roles del sistema

El sistema maneja los siguientes tipos de usuario:

- Comprador
- Vendedor  
- Soporte

---

## Escalabilidad

Ya que al ser construido en una arquitectura distribuida el sistema puede escalar por servicio de
manera individual sin afectar el funcionamiento global, ayudando a actualizaciones futuras con menor impacto
