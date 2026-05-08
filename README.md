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




*Gestión de usuarios

  -Registro e inicio de sesión.

  -Administración de perfiles (cliente, restaurante, domiciliario, administrador).

*Gestión de restaurantes/comercios

  -Registro de establecimientos.

  -Administración de menú.

  -Actualización de precios y disponibilidad.

*Gestión de pedidos

  -Creación de pedidos.

  -Confirmación del pedido.

  -Cálculo de totales y costos de envío.

  -Cambio de estado del pedido (pendiente, en preparación, en camino, entregado).

*Asignación de repartidores

  -Asignación automática o manual.

  -Visualización de pedidos disponibles.

  -Confirmación de entrega.

*Seguimiento en tiempo real

  -Ubicación del repartidor.

  -Actualización del estado del pedido.

*Gestión de pagos

  -Procesamiento de pagos digitales.

  -Confirmación de transacciones.
  
¿Qué partes pueden trabajar por separado?

*Servicio de Autenticación

  Maneja usuarios y seguridad. Puede operar sin depender directamente del servicio de pedidos.

*Servicio de Menu

  Gestiona productos y restaurantes. Puede funcionar aunque no haya pedidos activos.

*Servicio de Pedidos

  Administra la lógica principal de creación y seguimiento de órdenes.

*Servicio de Domiciliarios

  Controla disponibilidad, ubicación y asignación.

*Servicio de Pagos

  Procesa transacciones de manera independiente del resto del sistema.

*Servicio de Notificaciones

  Envía notificaciones push o mensajes al usuario cuando cambia el estado del pedido.

  Cada uno puede estar alojado en servidores distintos y comunicarse mediante APIs o eventos.

¿Qué procesos son independientes?
  *Registro e inicio de sesión de usuarios.

  *Actualización del menú por parte del restaurante.

  *Procesamiento de pagos.

  *Seguimiento GPS del repartidor.

  *Envío de notificaciones.

  *Generación de reportes administrativos.

##Comunicacion entre Servicios

¿Qué servicio necesita información de otro?
  *Servicio de Pedidos

    Necesita información de:
    
    Servicio de Usuarios (datos del cliente)
    
    Servicio de Catálogo (productos y precios)
    
    Servicio de Pagos (confirmación del pago)
    
    Servicio de Repartidores (asignación y disponibilidad)

  *Servicio de Repartidores

    Necesita información de:
    
    Servicio de Pedidos (detalle del pedido)
    
    Servicio de Usuarios (dirección del cliente)

  *Servicio de Pagos

    Necesita información de:
    
    Servicio de Pedidos (monto total)
    
    Servicio de Usuarios (datos del cliente)

  *Servicio de Notificaciones

    Necesita información de:
    
    Servicio de Pedidos (cambio de estado)
    
    Servicio de Repartidores (estado de entrega)

¿Quién solicita datos?

-El Servicio de Pedidos solicita:

  Datos del usuario al Servicio de Usuarios.
  
  Información de productos al Servicio de Catálogo.
  
  Confirmación de pago al Servicio de Pagos.

-El Servicio de Repartidores solicita:

  Detalles del pedido al Servicio de Pedidos.

-El Servicio de Notificaciones solicita:

  Información del estado del pedido al Servicio de Pedidos.

¿Quién responde?

-El Servicio de Usuarios responde con:

  Nombre, dirección y datos del cliente.

-El Servicio de Catálogo responde con:

  Productos, precios y disponibilidad.

-El Servicio de Pagos responde con:

  Confirmación o rechazo de la transacción.

-El Servicio de Repartidores responde con:

  Estado de disponibilidad y ubicación.

Pedidos → solicita → Usuarios
Pedidos → solicita → Catálogo
Pedidos → solicita → Pagos
Pedidos → solicita → Repartidores

Pagos → confirma → Pedidos

Repartidores → solicita → Pedidos
Repartidores → actualiza estado → Pedidos

Notificaciones → solicita → Pedidos
Notificaciones → notifica → Usuario

Restaurantes → actualiza → Catálogo

Administrador → consulta → Reportes
Reportes → obtiene datos → Pedidos

##Tipo de Arquitectura

La arquitectura que se manejara para esta aplicacion seria Basada en Microservicios

¿Cuántos usuarios tendrá el sistema?

  El sistema está pensado para atender una gran cantidad de usuarios simultáneos, incluyendo:
  
  Clientes que realizan pedidos.
  
  Restaurantes que gestionan menús.
  
  Repartidores activos.
  
  Administradores del sistema.

  Inicalmente unos 1000 usuarios con posibilidad de crecimiento, en un escenario real, podría escalar dependiendo la demanda del negocio o la app

¿Necesita escalar?

  Si ya que en horas pico o al demandar mas trafico de usuarios se requiere un incremento en la capacidad de los servidores

¿Es un sistema pequeño o grande?

  Es un sistema que inicialmete es pequeño pero a medida que el negocio crezca se debe ir incrementando su capacidad o funcionalidades nuevas segun requiera, esta arquitectura nos ayuda a futuro
  poder generar mejoras sin afectar los modulos o servicios previamente implementados

##Base de Datos

¿Qué información debe guardarse?

-Datos de usuarios

  Nombre completo
  
  Correo electrónico
  
  Número de teléfono
  
  Dirección de entrega
  
  Contraseña cifrada
  
  Historial de pedidos

-Datos de restaurantes

  Nombre del establecimiento
  
  Dirección
  
  Menú (productos, precios, disponibilidad)
  
  Horarios de atención

-Datos de pedidos

  ID del pedido
  
  Cliente que realizó el pedido
  
  Productos seleccionados
  
  Total a pagar
  
  Estado del pedido (pendiente, en preparación, en camino, entregado)
  
  Fecha y hora

-Datos de repartidores

  Nombre
  
  Número de contacto
  
  Estado (disponible/no disponible)
  
  Ubicación en tiempo real
  
  Historial de entregas

-Datos de pagos

  ID de transacción
  
  Método de pago
  
  Estado del pago (aprobado/pndiente/rechazado)
  
  Fecha y monto

¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?

  Cada Servicio tiene su propia base de datos ya que a pesar de que trabajan para un fin comun o un resultado, todas deben manejar una Base de Datos
  Independiente ya que esto nos permite una autonomia entre servicios pero se debe garantizar la sincronización entre los mismos

##Usuarios del Sistema

¿Quién usará el sistema?

  Usuario
  Restaurante
  Domiciliario
  Administrador
  
¿Todos pueden hacer lo mismo?

No, cada usuario tiene roles y permisos diferentes dentro del sistema.

El sistema debe implementar:

  -Control de acceso por roles.
  
  -Permisos específicos según el tipo de usuario.
  
  -Restricciones para evitar acciones no autorizadas.

Por ejemplo:

  -Un cliente no puede modificar el menú.
  
  -Un repartidor no puede acceder a reportes administrativos.
  
  -Un restaurante no puede gestionar otros restaurantes.
  
  -Solo el administrador tiene control total del sistema.

##Riesgos y fallas posibles

¿Qué pasaría si falla el servicio de pagos?

-Posibles consecuencias:

  No se pueden procesar pagos.
  
  Pedidos quedan en estado pendiente.
  
  Usuarios abandonan la compra.
  
  Pérdida de ingresos.
  
  Desconfianza en la plataforma.

*Posibles soluciones:

  Reintentos automáticos de la transacción.
  
  Guardar el pedido como “pendiente de pago”.
  
  Notificación al usuario indicando el problema.
  
  Integración con un segundo proveedor de pagos (servicio alternativo).
  
  Registro de errores para auditoría.


¿Qué pasaría si falla la base de datos?

-Posibles consecuencias:

  No se pueden consultar usuarios ni pedidos.
  
  Se pierde acceso a información crítica.
  
  Interrupción total del servicio.
  
  Riesgo de pérdida de datos.

*Posibles soluciones:

  Respaldo de base de datos.
  
  Base de datos en alta disponibilidad (cluster).
    
  Alertas automáticas al equipo técnico.


¿Qué pasaría si falla el servidor principal?

-Posibles consecuencias:

  La aplicación deja de funcionar.
  
  Usuarios no pueden ingresar.
  
  Pedidos activos se interrumpen.
  
  Pérdida temporal del servicio.

*Posibles soluciones:

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




// TALLER CORTE 3

FASE 1 – OBSERVAR (sin modificar código)
Servicios activos

<img width="921" height="136" alt="image" src="https://github.com/user-attachments/assets/d72b96ce-3dff-4234-8717-a0c08f838eda" />

Bajo el servicio 

<img width="845" height="98" alt="image" src="https://github.com/user-attachments/assets/fc66cb6e-627d-445a-b8d0-8db800447274" />

Verifico

<img width="921" height="90" alt="image" src="https://github.com/user-attachments/assets/6b07304a-6b12-4648-bdf8-aa3222dba10e" />

Logs 

<img width="921" height="200" alt="image" src="https://github.com/user-attachments/assets/d94ce267-13d6-457b-892c-8c81cbf7de56" />

Apago mascotas

<img width="855" height="109" alt="image" src="https://github.com/user-attachments/assets/747fd709-06a8-4172-be3f-e7ec6d269146" />

<img width="921" height="94" alt="image" src="https://github.com/user-attachments/assets/65def07c-058b-4165-a6c0-41966f6402d8" />

<img width="456" height="195" alt="image" src="https://github.com/user-attachments/assets/687767d4-f28e-41c3-975f-1851e84ca662" />

FASE 2 – APLICAR (Extensión del Circuit Breaker)
En esta fase se decidió aplicar el comportamiento del Circuit Breaker no solamente al endpoint de mascotas, sino también a los demás servicios del gateway como /usuarios y /resumen.
La idea principal fue evitar que el gateway siguiera intentando conectarse infinitamente a un servicio que ya se encontraba caído, ya que esto generaba muchos errores repetitivos y hacía que el sistema fuera menos eficiente.
Para implementar esto, se creó una lógica donde cada servicio tiene su propio estado y control de fallos. De esta manera, el gateway puede identificar qué servicio está presentando problemas sin afectar completamente a los demás.

<img width="420" height="585" alt="image" src="https://github.com/user-attachments/assets/634e5609-2523-4c1e-b492-c7ec9b9f6d98" />

<img width="394" height="538" alt="image" src="https://github.com/user-attachments/assets/4208e148-091c-4ace-ba5a-8c759ca47892" />

¿Cada servicio debe tener su propio contador de fallos?
Sí. Se decidió manejar un contador independiente para cada servicio porque cada uno funciona de manera separada y puede fallar en momentos distintos.
Por ejemplo, el servicio de mascotas puede estar caído mientras el de usuarios sigue funcionando correctamente. Si todos compartieran el mismo contador, un fallo en un servicio podría terminar afectando a los otros aunque realmente estuvieran funcionando bien.
Por esa razón, se manejaron contadores independientes para:
•	usuarios 
•	backend de mascotas 
Esto permitió tener un mejor control sobre el estado real de cada microservicio.

¿El circuito debe abrirse de forma independiente por servicio?
Sí. Cada servicio tiene su propio circuito.
Se tomó esta decisión porque no tendría sentido bloquear completamente el gateway cuando solamente uno de los servicios presenta fallos.
En la implementación realizada:
•	si falla mascotas, solamente se abre el circuito de mascotas 
•	si falla usuarios, solamente se abre el circuito de usuarios 
Así el sistema sigue respondiendo parcialmente en lugar de dejar de funcionar completamente.
Esto mejora la tolerancia a fallos y hace que el gateway sea más estable.

¿Qué pasa si falla un servicio pero el otro sigue funcionando?
Cuando un servicio falla, el otro puede seguir respondiendo normalmente porque los circuitos funcionan de manera independiente.
Por ejemplo:
•	si el backend de mascotas se apaga, el endpoint /usuarios continúa funcionando 
•	pero /mascotas devuelve un mensaje indicando que el circuito está abierto o que el servicio no está disponible

FASE 3 – INVESTIGAR (Half-Open)
¿Qué significa “half-open”?
El estado “half-open” significa que el circuito intenta verificar si el servicio ya volvió a funcionar después de haber estado caído.
¿Cuándo se vuelve a intentar una llamada?
La llamada se vuelve a intentar después del tiempo de espera configurado en el sistema. En nuestro caso, el gateway espera 10 segundos antes de volver a probar la conexión.
¿Qué pasa si el servicio vuelve a fllar?
Si el servicio vuelve a fallar, el circuito se abre nuevamente para evitar seguir haciendo solicitudes innecesarias al servicio caído.
 
FASE 4 – IMPLEMENTAR (Recuperación)
Espera controlada
En nuestro sistema se implementó una espera controlada de 10 segundos. Cuando un servicio falla varias veces y el circuito se abre, el gateway deja de hacer solicitudes durante ese tiempo para evitar seguir generando errores innecesarios.

Nuevo intento de conexión
Después de los 10 segundos, el sistema pasa al estado “half-open” y realiza un nuevo intento de conexión para comprobar si el servicio ya volvió a funcionar.

Decisión del circuito
Si el servicio responde correctamente, el circuito se cierra nuevamente y el contador de fallos se reinicia.
Si el servicio sigue fallando, el circuito se vuelve a abrir automáticamente y el sistema continúa bloqueando las solicitudes hasta el siguiente tiempo de espera.

FASE 5 – VALIDAR

Probamos el servicio http://localhost:5000/usuarios

<img width="584" height="363" alt="image" src="https://github.com/user-attachments/assets/adc8f40c-ffa0-438f-ba56-ab53ccbc23a2" />

Bajamos el servicio 

<img width="561" height="223" alt="image" src="https://github.com/user-attachments/assets/49ede2e2-334b-4c99-9378-db331365effe" />

Pero después de varios fallos consecutivos, el Circuit Breaker abrió automáticamente el circuito para evitar seguir intentando conexiones innecesarias al servicio caído.

<img width="558" height="238" alt="image" src="https://github.com/user-attachments/assets/a8ca9a6d-d598-483e-aa3f-692e55cad039" />


Pasamos a recuperar el servicio 

<img width="909" height="114" alt="image" src="https://github.com/user-attachments/assets/41549c89-9337-48df-bb46-95cb56580a2d" />

Recuperamos el sistema 

<img width="519" height="364" alt="image" src="https://github.com/user-attachments/assets/c10146ec-a0bf-449b-ae00-535be26b02b0" />

<img width="921" height="441" alt="image" src="https://github.com/user-attachments/assets/e1fd3063-1fcf-4b72-bbf6-037885edd8cd" />

¿Qué cambió en el comportamiento del sistema?
Antes de implementar el Circuit Breaker, el gateway intentaba conectarse continuamente a los servicios aunque estuvieran caídos, generando muchos errores repetitivos. Después de la implementación, el sistema ahora puede detectar fallos, abrir el circuito y detener temporalmente las solicitudes hasta intentar nuevamente la conexión.

¿Qué decisiones tomaron en la implementación?
Se decidió manejar un circuito independiente para cada servicio, junto con contadores de fallos separados. También se implementó un tiempo de espera de 10 segundos antes de volver a intentar una conexión usando el estado “half-open”.

¿Qué dificultades encontraron?
Una de las principales dificultades fue entender cómo controlar el estado del circuito sin afectar los demás servicios. También fue necesario probar diferentes escenarios apagando y levantando contenedores para verificar que el sistema realmente pudiera recuperarse automáticamente.

