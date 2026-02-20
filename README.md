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

______________________________________________________________________________________________



<h1>🌐 Actividad Clase 4</h1>
<h2>Comunicación entre Servicios + REST + Eventos + Service Discovery</h2>

<p><strong>Equipo:</strong> 2</p>
<p><strong>Proyecto:</strong> AppTipoRappi</p>

<div class="section">
<h2>🪜 1. Interacciones entre Servicios</h2>

<p><strong>Interacción 1</strong></p>
<label>Servicio que envía: </label>
<div class="line">inventario</div>
<label>Servicio que recibe:</label>
<div class="line">Recibe la lista de productos para verificar si hay stock y seleccionar los artículos</div>
<label>Información enviada:</label>
<div class="line">Cuántas unidades de cada producto se necesitan</div>
<label>¿Qué sucede si no responde?</label>
<div class="line">si no responde, el sistema no sabe si hay stock</div>

<p><strong>Interacción 2</strong></p>
<label>Servicio que envía: </label>
<div class="line">Pedidos</div>
<label>Servicio que recibe:</label>
<div class="line">Logística</div>
<label>Información enviada:</label>
<div class="line">ID de la Orden, Dirección de origen, Dirección de destino y tamaño del paquete (opcional).</div>
<label>¿Qué sucede si no responde?</label>
<div class="line">El pedido se queda estancado en el restaurante o tienda</div>

<p><strong>Interacción 3</strong></p>
<label>Servicio que envía: </label>
<div class="line">Repartidores</div>
<label>Servicio que recibe:</label>
<div class="line">Notificaciones</div>
<label>Información enviada:</label>
<div class="line">ID del Cliente, Mensaje de estado (como "Tu pedido ha llegado"), y un tipo de alerta (Push Notification).</div>
<label>¿Qué sucede si no responde?</label>
<div class="line">El cliente no se da cuenta de que el repartidor está en su puerta y esto causa retrasos en la entrega y una mala experiencia.</div>


<div class="section">
<h2>🪜 2. REST o Eventos</h2>

<table>
<tr>
<th>Interacción</th>
<th>REST</th>
<th>Evento</th>
<th>¿Por qué?</th>
</tr>
<tr>
<td>1</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>2</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>3</td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</div>

<div class="section">
<h2>🪜 3. Síncrono o Asíncrono</h2>

<table>
<tr>
<th>Interacción</th>
<th>Síncrono</th>
<th>Asíncrono</th>
<th>Justificación</th>
</tr>
<tr>
<td>1 (Pagos)</td>
<td><strong>X</strong></td>
<td></td>
<td>El pago requiere respuesta inmediata para confirmar la compra; el usuario no puede avanzar si el cobro no se valida en el momento.</td>
</tr>
<tr>
<td>2 (Logística)</td>
<td></td>
<td><strong>X</strong></td>
<td>La asignación de repartidores toma tiempo; el servicio de pedidos debe quedar libre para atender a otros usuarios mientras se busca un conductor.</td>
</tr>
<tr>
<td>3 (Notificaciones)</td>
<td></td>
<td><strong>X</strong></td>
<td>Las alertas son procesos informativos de fondo que no deben interrumpir ni bloquear el rendimiento de la aplicación principal.</td>
</tr>
</table>
</div>

<div class="section">
<h2>🪜 4. Eventos Importantes del Sistema</h2>
1️⃣ <strong>Orden_Pagada:</strong> Este evento notifica al restaurante para que inicie la preparación y al servicio de inventario para descontar productos.<br><br>
2️⃣ <strong>Repartidor_Asignado:</strong> Se dispara cuando un conductor acepta el pedido; vincula sus datos con la orden y los envía al cliente.<br><br>
3️⃣ <strong>Entrega_Confirmada:</strong> Finaliza el ciclo de la orden, libera el pago al comercio y activa la encuesta de satisfacción para el usuario.
</div>

<div class="section">
<h2>🪜 5. Análisis de Fallos</h2>
<label>Servicio más crítico:</label> <strong>API Gateway / Servicio de Pedidos</strong>
<div class="line"></div>
<label>¿Qué pasaría si falla?</label> Se bloquearía la creación de nuevas órdenes y la consulta de estados, dejando la aplicación totalmente inoperativa para el negocio.
<div class="line"></div>
<label>¿El sistema debe detenerse o continuar?</label> Debe continuar de forma degradada (solo lectura para ver órdenes en curso), pero detener la recepción de nuevos pedidos.
<div class="line"></div>
<label>¿Cómo podrían manejar este fallo?</label> Implementando <strong>Circuit Breakers</strong> para evitar colapsos en cascada y usando réplicas de los servicios en alta disponibilidad.
<div class="line"></div>
</div>

<div class="section">
<h2>🪜 6. Service Discovery</h2>
<label>¿Qué problema ocurre si cambia la IP de un servicio?</label> Se produce una falla de comunicación; el servicio emisor intentará enviar datos a una dirección que ya no existe o es incorrecta.
<div class="line"></div>
<label>¿Cómo sabría un servicio dónde encontrar otro?</label> Consultando un <strong>Service Registry</strong> (como Eureka o Consul), que funciona como un directorio actualizado con las IPs de cada microservicio.
<div class="line"></div>
<label>¿Por qué sería útil Service Discovery?</label> Permite el escalamiento elástico; si añadimos más servidores de logística por alta demanda, el sistema los encuentra automáticamente sin configuración manual.
<div class="line"></div>
<label>¿Dónde lo aplicarían en su sistema?</label> En la comunicación interna entre el API Gateway y los microservicios de Pagos, Catálogo y Logística.
<div class="line"></div>
</div>

<div class="section">
<h2>🪜 7. Mini Diagrama</h2>
<p>Dibujen:</p>
<p><strong>[Pedidos]</strong> ─── (1. Consulta IP de B) ───> <strong>[Service Discovery]</strong></p>
<p><strong>[Service Discovery]</strong> ─── (2. Retorna IP: 10.0.5.1) ───> <strong>[Pedidos]</strong></p>
<p><strong>[Pedidos]</strong> ─── (3. Envía Datos via REST) ───> <strong>[Pagos (IP: 10.0.5.1)]</strong></p>
</div>




---

