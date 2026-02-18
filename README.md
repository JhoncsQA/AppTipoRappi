# AppTipoRappi

Aplicación tipo **Rappi** para la **gestión de domicilios**, orientada a facilitar el proceso de pedidos, asignación de repartidores y seguimiento de entregas en tiempo real.


Integrantes:

Samir Ausecha - Encargado de documentación
Anderson Avendaño - Encargado tecnico
Nasly de los rios - Encargado de la presentación
Jhon Cabezas - Lider del proyecto


# Arquitectura dle sistema: AppTipoRappi
## Problema que resuelve

1. ¿Qué problema resuelve el sistema?

Resuelve el inconveniente de tener que desplazarme a sitios presencialmente, aprovechando el tiempo en otras cosas mientras mis pedidos llegan a mi ubicación.

2. ¿Quién lo usará?

Tanto el usuario que realiza pedidos como el domiciliario que ejecuta las ordenes y las lleva a su destino.

3. ¿Qué pasaría si no existiera?

el mismo usuario realizaria sus compras, invirtiendo una cantidad de tiempo considerable y mas gastos en cuanto a desplazamientos.

## Servicios del sistema

1. ¿Qué funciones principales tiene el sistema?

la función de permitir mediante una app o escritorio, la realización de pedidos que lleguen al sitio donde me encuentro.

2. ¿Qué partes pueden trabajar por separado?

realizar el registro
navegar en la app
realizar mis pedidos

3. ¿Qué procesos son independientes?

el registro de los usarios puede funcionar sin depender de otro d elos servicios
los usuarios pueden navegar por el aplicativo de forma independiente a los otros servicios

## Comunicacion entre servicio

1. ¿Qué servicio necesita información de otro?

el servicio de realizar el pedido en el rol de usuario, necesita del registro
el servicio de aceptar pedidos en el rol de conductor necesita del registro

2. ¿Quién solicita datos?

Pedidos → solicita → Inventario
Pagos → solicita → datos de usuario
Usuario → solicita → disponibilidad de conductores

3. ¿Quien responde?

Pagos → confirma → Pedidos
inventario → confirma → Pedidos
tienda → cnotifica → conductor

## Tipo de arquitectura
Arquitectura microservicios, ya que la app necesita de muchos modulos

1. ¿Cuántos usuarios tendrá el sistema?
3 roles; usuario, conductor y tiendas

2. ¿Necesita escalar?
sí, horizontal y verticalmente ya que constantemente los picos son altos y suben en ciertos dias y hoarios

3. ¿Es un sistema pequeño o grande?
incia como algo pequeño pero a medida del aumento de lo usuarios va ser un sistema muy grande

## Base de datos
1. ¿Qué información debe guardarse?

los uusarios y su perfiles
el inventario
los pedidos como en el carrito
los pagos

3. ¿Qué datos son críticos?
las ordenes de compra
las direcciones
los datos de acceso


5. ¿Qué pasaría si se pierden?
si se pierden las ordenes afectaria a la tienda al preparar algo y no saber para quien era
si se pierden las direcciones un repartidosr no sabria donde llegar
los datos personales puede tener problemas con la ley

Pregunta clave:
¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?
cada servicio deberia tener su propia base de datos al manejar los microservicios o podria caerse 
## Usuarios del sisetma
el cliente
el conductor o repartidor
las tiendas

Pregunta clave:
¿Todos pueden hacer lo mismo?

no, porque el repartidor por ejemplo podria cancelar un pedido o como cliente ponerme cosas gratis d elas tiendas


## Riesgos y fallas posibles

1. ¿Qué pasaría si falla:
servicio de pagos, el usuario no podria completar la compra
base de datos, no s epodria crear nuevas ordenes
servidor principal nadie podria acceder

Escriban posibles soluciones:

reintentos, podria hacerse cada 15 segundos por ejemplo
notificaciones, avisar al usuario que se presentan problemas
respaldo de datos, deben existir copias en la nube




---

