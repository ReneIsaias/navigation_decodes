// MEITRACK T355G/T355V2 GPRS Protocol
/*

                        Formato de comando

1.1 Formato de comando GPRS
    GPRS command sent from the server to the tracker:
        @@<Data identifier><Data length>,<IMEI>,<Command type>,<Command><*Checksum>\r\n
    GPRS command sent from the tracker to the server:
        $$<Data identifier><Data length>,<IMEI>,<Command type>,<Command><*Checksum>\r\n
1.2 Formato de comando del rastreador
    $$ <Identificador de datos> <Longitud de datos>, <IMEI>, <Tipo de comando>, <Código de evento>, <(-) Latitud>, <(-) Longitud>, <Fecha y
    tiempo>, <Estado de posicionamiento>, <Número de satélites>, <Intensidad de la señal GSM>, <Velocidad>, <Dirección>, <Dilución horizontal de precisión
    (HDOP)>, <Altitud>, <Kilometraje>, <Tiempo de ejecución>, <Información de la estación base>, <Estado del puerto de E / S>, <Valor de entrada analógica>, <Evento asistido
    info>, <Datos personalizados>, <Versión del protocolo> <* Suma de comprobación> \ r \ n
    Nota:
        - Se utiliza una coma (,) para separar los caracteres de datos. El tipo de carácter es el Código Estándar Americano de Información Intercambio (ASCII). (El hexadecimal se representa como 0x2C).
        - Los símbolos "<" y ">" no estarán presentes en los datos reales, solo con fines de documentación.
        - Todos los datos multibyte cumplen con la siguiente regla: Los bytes altos son anteriores a los bytes bajos.
        - El tamaño de un paquete de datos GPRS es de aproximadamente 160 bytes.

    Las descripciones sobre los paquetes GPRS del rastreador son las siguientes:

        -@@ => Indica el encabezado del paquete de datos GPRS enviado desde el servidor a el rastreador. El tipo de encabezado es ASCII. (Hexadecimal es representado como 0x40.)
        -$$ => Indica el encabezado del paquete de datos GPRS enviado desde el rastreador a el servidor. El tipo de encabezado es ASCII. (Hexadecimal es representado como 0x24.)
        -Data Identifier(Identificador de datos(Q)) => Contiene 1 byte. El tipo es ASCII y su valor oscila entre 0x41 a 0x7A
        -Data Length(Longitud de datos(25)) => Indica la longitud de los caracteres desde la primera coma (,) hasta \ r \ n. Decimal. Ejemplo: $$ <Identificador de datos> <Longitud de datos>, <IMEI>, <Comando type>, <Command> <* Checksum> \ r \ n
        -IMEI(353358017784062) => Indica el número IMEI del rastreador. El tipo de número es ASCII. Eso generalmente tiene 15 dígitos.
        -Command type(Tipo de comando(AAA)) => Hexadecimal > For details, see chapter 2 and chapter 3.
        -Event code(Codigo de evento(1)) => Decimal > For details, see section 1.3 "Event Code."
        -Latitud =>
            Unidad: grado
            Decimal
            Cuando existe un signo menos (-), el rastreador está en el hemisferio sur. Cuando no existe ningún signo menos (-), el rastreador está en el
            hemisferio norte.
            yy indica el grado.
            dddddd indica la parte decimal

        -Longitud => 
            Unidad: grado
            Decimal
            Cuando existe un signo menos (-), el rastreador está en el oeste.
            hemisferio. Cuando no existe ningún signo menos (-), el rastreador está en el
            hemisferio este.
            xxx indica el grado.
            dddddd indica la parte decimal

        -Fecha y hora =>
            aa indica el año.
            mm indica mes.
            dd indica día.
            HH indica la hora.
            MM indica minuto.
            SS indica segundo.
            Decimal

        -Estado de posicionamiento =>
            Indica el estado de la señal GPS.
            A = válido
            V = inválido

        -Numero de satélites =>
            Indica el número de satélites GPS recibidos.
            Decimal

        -Intensidad de la señal GSM =>
            Valor: 0–31
            Decimal

        -Unidad de velocidad =>
            km / h
            Decimal

        -Dirección =>
            Indica la dirección de conducción. La unidad es el grado. Cuando el
            el valor es 0, la dirección es el norte. El valor va de 0 a
            359.
            Decimal

        -HDOP =>
            El valor varía de 0,5 a 99,9. Cuanto menor sea el valor,
            más la precisión es.
            Decimal
            Cuando el valor de precisión es 0, la señal no es válida.
            0,5–1: perfecto
            2-3: maravilloso
            4-6: bueno
            7-8: medio
            9-20: Inferior al promedio
            21-99,9: deficiente

        -Altitud =>
            Unidad: metro
            Decimal

        -Kilometraje =>
            Unidad: metro
            Decimal
            Indica el kilometraje total. El valor máximo es
            4294967295. Si el valor excede el valor máximo, será
            borrado automáticamente.

        -Tiempo de ejecución =>
            Unidad: segundo
            Decimal
            Indica el tiempo total. El valor máximo es 4294967295. Si
            el valor excede el valor máximo, será automáticamente
            despejado.

        -Información de la estación base =>
            La información de la estación base incluye:
            MCC | MNC | LAC | CI
            MCC y MNC son decimales, mientras que LAC y CI son   
                        
        -Estado del puerto de E / S =>
            Hexadecimal
            Valores de estado de ocho puertos de entrada y ocho puertos de salida:
            Bit0 a Bit7 corresponde al estado de los puertos de salida 1 a 8.
            Bit8 a Bit15 corresponde al estado de los puertos de entrada 1 a 8

        -Valor de entrada analógica =>
            Separado por "|".
            Hexadecimal
            AD1 | AD2 | AD3 | Batería analógica | Alimentación externa analógica
            Nota: Los valores de entrada analógica en un informe de SMS están vacíos.
            AD1, AD2 y AD3: reservado
            Fórmula de voltaje de la batería analógica (AD4):
            T355G / T355V2: AD4 / 100
            Fórmula de voltaje de la fuente de alimentación externa (AD5):
            T355G / T355V2: AD5 / 100

        -Información del evento asistido =>
            Número de geovalla
            32 bits sin firmar Solo disponible por código de evento GPRS 20 o 21.
            Fuente de activación de robo de vehículos
            Código de activación sin firmar de 32 bits de un evento de robo de vehículo
            Bandera generada por el evento 58

        -Datos personalizados =>
            Reservado Todavía existe un separador.

        -Versión del protocolo =>
            Decimal
            1–50: se utiliza para todos los protocolos comunes de Meitrack.
            50–99: Usado para OBD.
            Cuando el protocolo es compatible con el antiguo rastreador, el valor
            está vacío o es 0 por defecto

        -* =>
            Separa los comandos de las sumas de verificación.
            1 byte y ASCII (el hexadecimal se representa como 0x2A)

        -Suma de comprobación =>
            2 bytes. El parámetro indica la suma de todos los datos (excluyendo
            la suma de comprobación y la marca final). Es un carácter hexadecimal.
            Ejemplo: $$ <Identificador de datos> <Longitud de datos>, <IMEI>, <Comando
            type>, <Command> <* Checksum> \ r \ n
    
        -\ r \ n =>
            2 bytes. El parámetro es un carácter final. El tipo es
            ASCII. (Valor hexadecimal: 0x0d 0x0a)
            hexadecimal.
            Nota: la información de la estación base en un SMS está vacía.

    1.3 Código de evento
        Código de evento Encabezado de SMS predeterminado del evento (como máximo 16 bytes)
            A17 => Batería baja || Batería baja
            A19 => El exceso de velocidad
            A20 => Ingrese a la cerca geográfica Ingrese la cerca N (N significa el número de la cerca)
            A21 => Salida Geo-cerca Salida Cerca N (N significa el número de la cerca)
            A24 => Pérdida de señal de GPS Pérdida de señal de GPS
            A25 => Recuperación de señal GPS Recuperación de GPS
            A26 => Entra en reposo Entra en reposo
            A27 => Salir del sueño Salir del sueño
            A28 => Corte de antena GPS Corte de antena GPS
            29 => Reinicio del dispositivo Encendido
            A31 => latidos /
            32 => Curvas Curvas
            33 => Seguimiento por distancia Distancia
            34 => Responder actual (pasivo) ahora
            35 => Intervalo de intervalo de seguimiento por tiempo
            40 => Apagar Apagar
            56 => Armado Armado
            57 => Desarmado Desarmado
            A58 => Robo de vehículos Robo de vehículos
            80 => Instalar Instalar
            81 => Dejar Dejar
    
    
    2 Lista de comandos
    Comando Descripción
        -A10 => Consulta de ubicación en tiempo real
        -A11 => Configuración de un intervalo de informe de paquetes de latidos
        A12 => Seguimiento por intervalo de tiempo
        A13 => Configuración de la función de informe de curvas
        A14 => Seguimiento por distancia
        -A19 => Activación del dispositivo por vibración
        A21 => Configuración de parámetros GPRS
        A23 => Configuración del servidor GPRS en espera
        A70 => Lectura de todos los números de teléfono autorizados
        A71 => Configuración de números de teléfono autorizados
        A73 => Configuración del modo de suspensión inteligente
        AAA => Informe automático de eventos
        AFF => Eliminación de un evento GPRS en el búfer
        B05 => Colocación de una geovalla
        B06 => Eliminación de una geovalla
        -B07 => Configuración de la función de alarma de exceso de velocidad
        B09 => Configuración del nivel de sensibilidad del sensor de vibración 3D
        B21 => Configuración de la función antirrobo
        B34 =>Configuración de un intervalo de registro
        B35 => Configuración de la zona horaria de SMS
        B91 => Configuración de caracteres de eventos SMS
        B99 => Configuración de la autorización de eventos
        C02 => Notificación al rastreador del envío de un SMS
        E91 => Versión de firmware y SN del dispositivo de lectura
        F01 => Reinicio del módulo GSM
        F02 => Reinicio del módulo GPS
        F08 => Configuración del kilometraje y el tiempo de ejecución
        F09 => Eliminación de datos de caché de SMS / GPRS
        F11 => Restauración de la configuración inicial

*/


module.exports = {
    meitrack: {
        'T355G': {
            'identificador': '4040',
            'msn': {
                'position_message': {
                    'hex': 'A10',
                    'titulo': 'Position Message',
                    'protocolotipo': 0,
                },
                'heartbeat_message': {
                    'hex': 'A11',
                    'titulo': 'Heartbeat Message',
                    'protocolotipo': 0,
                },
                'monitoring_by_time_interval': {
                    'hex': 'A12',
                    'titulo': 'Seguimiento por intervalo de tiempo',
                    'protocolotipo': X,
                },
                'setting_the_cornering_report_function': {
                    'hex': 'A13',
                    'titulo': 'Configuracion de la funcion de curvas',
                    'protocolotipo': X,
                },
                'tracking_by_distance': {
                    'hex': 'A14',
                    'titulo': 'Seguimiento por distancia',
                    'protocolotipo': X,
                },
                'waking_the_device_up_by_vibration': {
                    'hex': 'A19',
                    'titulo': 'Activacion del dispositivo por vibracion',
                    'protocolotipo': X,
                },
                'settings_gprs_parameters': {
                    'hex': 'A21',
                    'titulo': 'Configuracion de parametros GPRS',
                    'protocolotipo': X,
                },
                'setting_the_standby_gprs_server': {
                    'hex': 'A23',
                    'titulo': 'Configuracion del servidor gprs en espera',
                    'protocolotipo': X,
                },
                'reading_all_authorized_phone_numbers': {
                    'hex': 'A70',
                    'titulo': 'Lectura de todos los numeros de telefono autorizados',
                    'protocolotipo': X,
                },
                'setting_authorized_phone_numbers': {
                    'hex': 'A71',
                    'titulo': 'Configuracion de numeros de telefono autorizados',
                    'protocolotipo': X,
                },
                'setting_the_smart_sleep_mode': {
                    'hex': 'A73',
                    'titulo': 'Configuracion del modo de suspension inteligente',
                    'protocolotipo': X,
                },
                'automatic_event_report': {
                    'hex': 'AAA',
                    'titulo': 'Informe automatico de eventos',
                    'protocolotipo': X,
                },
                'deleting_a_gprs_event_in_the_buffer': {
                    'hex': 'AFF',
                    'titulo': 'Eliminacion de un evento GPRS en el bufer',
                    'protocolotipo': X,
                },
                'setting_a_geofence': {
                    'hex': 'B05',
                    'titulo': 'Colocacion de una geovalla(geocerca)',
                    'protocolotipo': X,
                },
                'deleting_a_geofence': {
                    'hex': 'B06',
                    'titulo': 'Eliminacion de una geovalla(geocerca)',
                    'protocolotipo': X,
                },
                'setting_the_speeding_alarm_function': {
                    'hex': 'B07',
                    'titulo': 'Configuracion de la alarma de exceso de velocidad',
                    'protocolotipo': X,
                },
                'setting_the_sensitivity-level_of_the_3D_vibration_sensor': {
                    'hex': 'B09',
                    'titulo': 'Configuracion del nivel de sensibilidad del sensor de vibracion 3D',
                    'protocolotipo': X,
                },

            }
        }
    }
};





/*
position_message: {
    descripcion: AAA,(34),(-)Latitude,(-)Longitude,Date and time,Positioning status,Number of satellites,GSM signal strength,Speed,Direction,HDOP,Altitude,Mileage,Run time,Base station info,I/O port status,Analog input value
        extra: (34) indica el código de evento del comando GPRS.

    envio: @@Q25,353358017784062,A10*6A\r\n
           @@Q25,353358017784062,A10*6A\r\n
    hex: 40 40 51 32 35 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 30 2a 36 41 5c 72 5c 6e

    resp: $$Q128,353358017784062,AAA,34,22,543176,114,078448,100313093738,A,5,22,2,205,5,-14,0,60,0|0|10133|4110,0000,149|153|173|2707|914,*91\r\n
    hex: 24 24 51 31 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 33 34 2c 32 32 2c 35 34 33 31 37 36 2c 31 31 34 2c 30 37 38 34 34 38 2c 31 30 30 33 31 33 30 39 33 37 33 38 2c 41 2c 35 2c 32 32 2c 32 2c 32 30 35 2c 35 2c 2d 31 34 2c 30 2c 36 30 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 34 39 7c 31 35 33 7c 31 37 33 7c 32 37 30 37 7c 39 31 34 2c 2a 39 31 5c 72 5c 6e
}

heartbeat_message: {
    descripcion: La función de paquete de latido se utiliza para mantener abierta la conexión del Protocolo de control de
        transmisión (TCP) cuando el intervalo de informes GPRS programados es largo.
        Intervalo = 0: función deshabilitada (por defecto).
        Intervalo = [1… 65535]: función habilitada. Unidad: minuto.
        La función de latido está disponible solo junto con el modo de sueño profundo. Cuando el dispositivo ingresa al
        modo de suspensión profunda, los informes de latidos se enviarán en el intervalo especificado. Un informe de
        latidos sirve para confirmar que el dispositivo está en línea, pero los datos de posicionamiento no son válidos
    
        envio: @@S28,353358017784062,A11,10*FD\r\n
    hex: 40 40 53 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 31 2c 31 30 2a 46 44 5c 72 5c 6e

    resp: $$S28,353358017784062,A11,OK*FE\r\n
    hex: 24 24 53 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 31 2c 4f 4b 2a 46 45 5c 72 5c 6e

    doc: Después de que el comando anterior se ejecute correctamente, el rastreador enviará el siguiente paquete de latidos GPRS a la plataforma cada 10 minutos en modo de suspensión:
    respAdici: $$a131,353358017784062,AAA,31,22.913458,114.083183,080229123628,V,9,23,21,83,1,18,1350,127,0|0|10133|4110,0000,169|181|184|2714|919,*60
    hexAdici: 24 24 61 31 33 31 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 33 31 2c 32 32 2e 39 31 33 34 35 38 2c 31 31 34 2e 30 38 33 31 38 33 2c 30 38 30 32 32 39 31 32 33 36 32 38 2c 56 2c 39 2c 32 33 2c 32 31 2c 38 33 2c 31 2c 31 38 2c 31 33 35 30 2c 31 32 37 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 36 39 7c 31 38 31 7c 31 38 34 7c 32 37 31 34 7c 39 31 39 2c 2a 36 30
}

monitoring_by_time_interval: {
    descripcion: Unidad: x10 segundos
        Intervalo = 0: función deshabilitada.
        El intervalo de tiempo máximo es 65535 x 10 segundos.
        Se recomiendan 6 x 10 segundos.

    envio: @@V27,353358017784062,A12,6*D5\r\n
    hex: 40 40 56 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 32 2c 36 2a 44 35 5c 72 5c 6e

    resp: $$V28,353358017784062,A12,OK*02\r\n
    hex: 24 24 56 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 32 2c 4f 4b 2a 30 32 5c 72 5c 6e

    docAdici: Después de que el comando anterior se ejecute correctamente, el rastreador enviará el siguiente paquete
    de datos GPRS a la plataforma cada 1 minuto:
    respAdici: $$W129,353358017784062,AAA,35,22.540113,114.076141,100313094354,A,5,22,1,174,4,129,0,435,0|0|10133|4110,0000,166|224|193|2704|916,*BE\r\n
    hexAdici: 24 24 57 31 32 39 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 33 35 2c 32 32 2e 35 34 30 31 31 33 2c 31 31 34 2e 30 37 36 31 34 31 2c 31 30 30 33 31 33 30 39 34 33 35 34 2c 41 2c 35 2c 32 32 2c 31 2c 31 37 34 2c 34 2c 31 32 39 2c 30 2c 34 33 35 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 36 36 7c 32 32 34 7c 31 39 33 7c 32 37 30 34 7c 39 31 36 2c 2a 42 45 5c 72 5c 6e
}

setting_the_cornering_report_function: {
    descripcion: Cuando el ángulo de conducción excede el valor preestablecido, el rastreador enviará un paquete de
        datos GPRS con información de ubicación al servidor, lo que asegura una ruta más fluida en la
        plataforma.
        Ángulo = 0: función deshabilitada (por defecto).
        Ángulo = [1… 359]: función habilitada. Valor recomendado:30.

    envio: @@X29,353358017784062,A13,120*37\r\n
    hex: 40 40 58 32 39 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 33 2c 31 32 30 2a 33 37 5c 72 5c 6e

    resp: $$X28,353358017784062,A13,OK*05\r\n
    hex: 24 24 58 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 33 2c 4f 4b 2a 30 35 5c 72 5c 6e

    docAdic: Después de ejecutar correctamente el comando anterior, si el ángulo de giro es superior a 120
    grados, el rastreador enviará el siguiente paquete de datos GPRS al servidor
    resAdic: $$Y129,353358017784062,AAA,32,22.540968,114.077455,100313094534,A,4,22,1,166,3,175,0,534,0|0|10133|4110,0000,141|138|159|2691|904,*D9\r\n
    hexAdic: 24 24 59 31 32 39 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 33 32 2c 32 32 2e 35 34 30 39 36 38 2c 31 31 34 2e 30 37 37 34 35 35 2c 31 30 30 33 31 33 30 39 34 35 33 34 2c 41 2c 34 2c 32 32 2c 31 2c 31 36 36 2c 33 2c 31 37 35 2c 30 2c 35 33 34 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 34 31 7c 31 33 38 7c 31 35 39 7c 32 36 39 31 7c 39 30 34 2c 2a 44 39 5c 72 5c 6e
}

tracking_by_distance: {
    descripcion: Distancia = 0: función desactivada (por defecto). Distancia = [1…65535]: función habilitada. Unidad: metro.
        Nota: Cuando tanto el intervalo de tiempo GPRS como las funciones de seguimiento de distancia están habilitadas,
        se aplicará la regla de "primer informe de primer alcance". Por ejemplo, establezca el intervalo de tiempo en 6 x 10
        segundos y la distancia en 200 metros. Si la carretera está despejada, se informará primero de un paquete de
        datos de distancia; si hay mucho tráfico en la carretera, se informará primero de un paquete de datos de intervalo
        de tiempo. Entonces, tanto el contador de intervalo de tiempo como el de distancia se restablecerán a 0.
        300 es recomendado.
    
    envio: @@D30,353358017784062,A14,1000*4A\r\n
    hex: 40 40 44 33 30 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 34 2c 31 30 30 30 2a 34 41 5c 72 5c 6e

    resp: $$D28,353358017784062,A14,OK*F2\r\n
    hex: 24 24 44 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 34 2c 4f 4b 2a 46 32 5c 72 5c 6e

    docAdicio: Después de ejecutar correctamente el comando anterior, si la distancia de conducción alcanza los 1000 m, el
        rastreador enviará un paquete de datos al servido
    resAdi: $$D131,353358017784062,AAA,33,22.547271,114.047405,080310080929,A,8,21,13,89,1,12,8525,561,0|0|10133|4110,0000,163|185|186|2712|939,*31\r\n
    hexAdici: 24 24 44 31 33 31 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 33 33 2c 32 32 2e 35 34 37 32 37 31 2c 31 31 34 2e 30 34 37 34 30 35 2c 30 38 30 33 31 30 30 38 30 39 32 39 2c 41 2c 38 2c 32 31 2c 31 33 2c 38 39 2c 31 2c 31 32 2c 38 35 32 35 2c 35 36 31 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 36 33 7c 31 38 35 7c 31 38 36 7c 32 37 31 32 7c 39 33 39 2c 2a 33 31 5c 72 5c 6e
}

waking_the_device_up_by_vibration: {
    descripcion: Esta función se utiliza para determinar si el dispositivo se despertará por vibración en modo profundo
        X = 0: el dispositivo no se activará con vibraciones. X = 1: el dispositivo se activará por vibración (predeterminado).

    envio: @@H27,353358017784062,A19,1*C9\r\n
    hex: 40 40 48 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 39 2c 31 2a 43 39 5c 72 5c 6e

    resp: $$H28,353358017784062,A19,OK*F8\r\n
    hex: 24 24 48 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 31 39 2c 4f 4b 2a 46 38 5c 72 5c 6e
}

settings_gprs_parameters: {
    descripcion: A21,Modo de conexión,dirección IP,Puerto,APN,Nombre de usuario de APN,Contraseña APN
        Modo de conexión = 0: función deshabilitada.
        Modo de conexión = 1: función habilitada; utilice el modo de informes TCP / IP.
        Modo de conexión = 2: función habilitada; utilice el modo de informes UDP.
        Dirección IP: dirección IP o nombre de dominio. Se admite un máximo de 32 bytes.
        Puerto: un máximo de 5 dígitos.
        APN / APN nombre de usuario / contraseña APN: un máximo de 32 bytes respectivamente. Si
        no se requiere un nombre de usuario y contraseña, déjelos en blanco.
        Nota:
        1. Si desea cambiar un parámetro (llamado A), el parámetro antes A no puede estar vacío.
        2. Si no desea cambiar los parámetros después A, no se requieren comas cuando edita el comando.
        3. Si desea borrar los parámetros después A, se requieren comas cuando edita el comando.
        Por ejemplo, si solo desea cambiar la dirección IP y el puerto, envíe
        A21,1,192.168.1.1,8800.

    envio: @@H48,353358017784062,A21,1,67.203.13.26,8800,,,*C9
    hex: 40 40 48 34 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 32 31 2c 31 2c 36 37 2e 32 30 33 2e 31 33 2e 32 36 2c 38 38 30 30 2c 2c 2c 2a 43 39

    resp: $$H28,353358017784062,A21,OK*F4\r\n
    hex: 24 24 48 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 32 31 2c 4f 4b 2a 46 34 5c 72 5c 6e
}

setting_the_standby_gprs_server: {
    descripcion: Dirección IP: un máximo de 32 bytes
        Puerto: un máximo de 5 dígitos
        Cuando el rastreador no puede enviar datos al servidor activo configurado por el comando A21, los datos se
        envían automáticamente al servidor en espera para evitar la pérdida de datos
    
    envio: @@S43,353358017784062,A23,67.203.13.26,8800*F0
    hex: 40 40 53 34 33 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 32 33 2c 36 37 2e 32 30 33 2e 31 33 2e 32 36 2c 38 38 30 30 2a 46 30

    resp: $$S28,353358017784062,A23,OK*01\r\n
    hex: 24 24 53 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 32 33 2c 4f 4b 2a 30 31 5c 72 5c 6e
}

reading_all_authorized_phone_numbers: {
    descripcion: Descripción Lea todos los números de teléfono autorizados.
        A70,Número de teléfono SOS 1,SOS número de teléfono 2,SOS número de teléfono 3,Número de teléfono de
        escucha 1,Número de teléfono de escucha 2

    envio: @@T25,353358017784062,A70*93\r\n
    hex: 40 40 54 32 35 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 30 2a 39 33 5c 72 5c 6e

    resp: $$T85,353358017784062,A70,13811111111,13822222222,13833333333,13844444444,13855555555*21\r\n
    hex: 24 24 54 38 35 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 30 2c 31 33 38 31 31 31 31 31 31 31 31 2c 31 33 38 32 32 32 32 32 32 32 32 2c 31 33 38 33 33 33 33 33 33 33 33 2c 31 33 38 34 34 34 34 34 34 34 34 2c 31 33 38 35 35 35 35 35 35 35 35 2a 32 31 5c 72 5c 6e
}

setting_authorized_phone_numbers: {
    descripcion: Número de teléfono: un número de teléfono tiene un máximo de 16 bytes. Si no se configuran números de teléfono, déjelos
        en blanco. Los números de teléfono están vacíos de forma predeterminada.
        Número de teléfono 1: número de teléfono SOS. Cuando llame al rastreador usando el número de
        teléfono, recibirá una notificación por SMS sobre la ubicación, la alarma de geovalla y la alarma de baja potencia.
        Cuando se presiona el botón SOS, el rastreador marcará los números de teléfono 1, 2 y 3 en secuencia. El
        rastreador deja de marcar cuando responde un número de teléfono.

    envio: @@U61,353358017784062,A71,13811111111,13822222222,13833333333*7D\r\n
    hex: 40 40 55 36 31 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 31 2c 31 33 38 31 31 31 31 31 31 31 31 2c 31 33 38 32 32 32 32 32 32 32 32 2c 31 33 38 33 33 33 33 33 33 33 33 2a 37 44 5c 72 5c 6e

    resp: $$U28,353358017784062,A71,OK*06\r\n
    hex: 24 24 55 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 31 2c 4f 4b 2a 30 36 5c 72 5c 6e
}

setting_the_smart_sleep_mode: {
    descripcion: Nivel de sueño = 1: sueño normal. El módulo 2G / 3G siempre funciona y el módulo GPS funciona ocasionalmente a
        intervalos de 5 minutos. Puede configurar los parámetros del dispositivo mediante Meitrack Manager para
        habilitar o deshabilitar el modo de suspensión normal. La configuración sobre la desactivación del modo entrará
        en vigor después de cinco minutos, mientras que la configuración sobre la desactivación del modo entrará en vigor inmediatamente.
        Nota: este modo no se recomienda para el seguimiento de intervalos cortos; esto afectará la precisión de la ruta.
        Nivel de sueño = 2: sueño profundo (valor predeterminado). Si no se activa ningún evento (caída / llamada
        entrante / SMS / vibración) después de cinco minutos, el rastreador entrará en modo de suspensión
        profunda y los módulos GPS y 2G / 3G dejarán de funcionar. De esta manera, un evento desencadenante
        (caída / vibración) puede despertar el dispositivo y luego el dispositivo entrará en modo de trabajo.
        Los módulos GPS y 2G / 3G se pueden habilitar de forma inteligente según el estado del vehículo, lo que ahorra energía.
        En el modo de sueño profundo, el rastreador se puede despertar solo cuando el rastreador cae o vibra. Si
        se activa un evento de vibración, se habilitará el nivel de suspensión 0. En el modo de funcionamiento del
        dispositivo, el nivel de suspensión 0 o 2 se habilitará alternativamente. En el modo de suspensión, las
        funciones de seguimiento programado y de distancia se desactivarán. Si se activa un evento de caída, el
        modo de suspensión se desactivará. El dispositivo no ingresa al modo de suspensión profunda hasta que
        se instala nuevamente en el vehículo.
        Nota: Cuando el dispositivo se desconecta del vehículo durante más de cinco segundos, se generará una
        alarma de caída y el dispositivo entrará en el modo de funcionamiento normal en lugar del modo de
        suspensión. El dispositivo enviará datos en el intervalo de tiempo específico hasta que se agote la energía
        de la batería.

    envio: @@W27,353358017784062,A73,2*D9\r\n
    hex: 40 40 57 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 33 2c 32 2a 44 39 5c 72 5c 6e

    resp: $$W28,353358017784062,A73,OK*0A\r\n
    hex: 24 24 57 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 37 33 2c 4f 4b 2a 30 41 5c 72 5c 6e
}

automatic_event_report: {
    descripcion: Cuando ocurre un evento, el rastreador informa automáticamente el evento al servidor.
        AAA,Tipo de comando, (-)Latitud, (-)Longitud,Fecha y hora,Estado de posicionamiento,Numero de satélites,Intensidad de la
        señal GSM,Velocidad,Dirección,HDOP,Altitud,Kilometraje,Tiempo de ejecución,Información de la estación base,Estado del
        puerto de E / S,Valor de entrada analógica
        Cuando presione el botón SOS, el rastreador enviará la siguiente información al servidor:
    
    resp: $$G127,353358017784062,AAA,1,22.538169,114.075958,100313095653,A,3,21,4,46,5,581,0,148,0|0|10133|4172,0000,166|204|205|2709|878,*77\r\n
    hex: 24 24 47 31 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 31 2c 32 32 2e 35 33 38 31 36 39 2c 31 31 34 2e 30 37 35 39 35 38 2c 31 30 30 33 31 33 30 39 35 36 35 33 2c 41 2c 33 2c 32 31 2c 34 2c 34 36 2c 35 2c 35 38 31 2c 30 2c 31 34 38 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 37 32 2c 30 30 30 30 2c 31 36 36 7c 32 30 34 7c 32 30 35 7c 32 37 30 39 7c 38 37 38 2c 2a 37 37 5c 72 5c 6e
}

deleting_a_gprs_event_in_the_buffer: {
    descripcion: Número de eventos GPRS eliminados: hexadecimal. En general, el número es 1. Número
        de caché restante: indica el número de eventos en el búfer; hexadecimal.
        AFF,Número de caché restante,Tipo de comando, (-)Latitud, (-)Longitud,Datos y tiempo,
        Estado de posicionamiento,Numero de satélites,Señal GSM
        fuerza,Velocidad,Dirección,HDOP,Altitud,Kilometraje,Tiempo de ejecución,Información de la estación base,Estado del puerto de E /
        S,Valor de entrada analógica

    envio: @@h27,353358017784062,AFF,1*0B\r\n
    hex: 40 40 68 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 46 46 2c 31 2a 30 42 5c 72 5c 6e

    resp: $$h28,353358017784062,AFF,OK*3D\r\n
    hex: 24 24 68 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 46 46 2c 4f 4b 2a 33 44 5c 72 5c 6e
}

setting_a_geofence: {
    descripcion: Número de geovalla: 1–8. Se pueden configurar un máximo de ocho geovallas.
        Latitud: latitud del centro de la geovalla; decimal; con una precisión de 6 dígitos después del punto
        decimal. Si solo hay 4 dígitos después del punto decimal, agregue dos dígitos 0. De lo contrario, el
        comando no se puede utilizar correctamente.
        Longitud: longitud del centro de la geovalla; decimal; con una precisión de 6 dígitos después del
        punto decimal. Si solo hay 4 dígitos después del punto decimal, agregue dos dígitos 0. De lo
        contrario, el comando no se puede utilizar correctamente.
        Radio: el valor varía de 1 a 4294967295. La unidad es el metro. IN Alarma
        de geovalla = 0: función deshabilitada.
        EN Alarma de geovalla = 1: función habilitada. OUT
        Alarma de geovalla = 0: función deshabilitada.
        SALIDA Alarma de geovalla = 1: función habilitada.

    envio: @@H57,353358017784062,B05,1,22.913191,114.079882,1000,0,1*96\r\n
    hex: 40 40 48 35 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 35 2c 31 2c 32 32 2e 39 31 33 31 39 31 2c 31 31 34 2e 30 37 39 38 38 32 2c 31 30 30 30 2c 30 2c 31 2a 39 36 5c 72 5c 6e

    resp: $$H28,353358017784062,B05,OK*F7\r\n
    hex: 24 24 48 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 35 2c 4f 4b 2a 46 37 5c 72 5c 6e

    docOfic: Cuando el rastreador sale de la geovalla (latitud: 22.913191; longitud: 114.079882; radio:
        1000m), enviará el siguiente paquete de datos GPRS al servidor:
    respAdic: $$J132,353358017784062,AAA,21,22.918046,114.089726,080229123812,A,10,22,12,32,1,21,6667,847,0|0|10133|4110,0000,124|181|183|2714|922,*5A\r\n
    hexAdic: 24 24 4a 31 33 32 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 32 31 2c 32 32 2e 39 31 38 30 34 36 2c 31 31 34 2e 30 38 39 37 32 36 2c 30 38 30 32 32 39 31 32 33 38 31 32 2c 41 2c 31 30 2c 32 32 2c 31 32 2c 33 32 2c 31 2c 32 31 2c 36 36 36 37 2c 38 34 37 2c 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 32 34 7c 31 38 31 7c 31 38 33 7c 32 37 31 34 7c 39 32 32 2c 2a 35 41 5c 72 5c 6e
}

deleting_a_geofence: {
    descripcion: Número de geovalla: 1–8. Solo se puede eliminar una valla geográfica cada vez mediante un comando SMS o GPRS

    envio: @@J27,353358017784062,B06,1*C8\r\n
    hex: 40 40 4a 32 37 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 36 2c 31 2a 43 38 5c 72 5c 6e

    resp: $$J28,353358017784062,B06,OK*FA\r\n
    hex: 24 24 4a 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 36 2c 4f 4b 2a 46 41 5c 72 5c 6e

    docOfic: Después de que el comando anterior se ejecute correctamente, se eliminará la primera geovalla.
}

setting_the_speeding_alarm_function: {
    descripcion: Velocidad de conducción = 0: función desactivada (por defecto).
        Velocidad de conducción = [1… 255]: función habilitada. Unidad: km / h. Cuando la velocidad de conducción alcanza el valor
        preestablecido, se generará una alarma de exceso de velocidad

    envio: @@P28,353358017784062,B07,60*05\r\n
    hex: 40 40 50 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 37 2c 36 30 2a 30 35 5c 72 5c 6e

    resp: $$P28,353358017784062,B07,OK*01\r\n
    hex: 24 24 50 32 38 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 42 30 37 2c 4f 4b 2a 30 31 5c 72 5c 6e

    docAdi: Cuando la velocidad de conducción del rastreador alcance los 60 km / h, enviará la siguiente información al servidor:
    respAdic: $$k134,353358017784062,AAA,19,22.916675,114.088813,080229123718,A,10,22,61,31,1,21,6635,395,460|0|10133|4110,0000,164|185|181|2712|915,*F7\r\n
    hexAdic: 24 24 6b 31 33 34 2c 33 35 33 33 35 38 30 31 37 37 38 34 30 36 32 2c 41 41 41 2c 31 39 2c 32 32 2e 39 31 36 36 37 35 2c 31 31 34 2e 30 38 38 38 31 33 2c 30 38 30 32 32 39 31 32 33 37 31 38 2c 41 2c 31 30 2c 32 32 2c 36 31 2c 33 31 2c 31 2c 32 31 2c 36 36 33 35 2c 33 39 35 2c 34 36 30 7c 30 7c 31 30 31 33 33 7c 34 31 31 30 2c 30 30 30 30 2c 31 36 34 7c 31 38 35 7c 31 38 31 7c 32 37 31 32 7c 39 31 35 2c 2a 46 37 5c 72 5c 6e
}

level_of_the_3D_vibration_sensor: {
    descripcion: Nivel de sensibilidad = [0… 100]: cuanto menor es el valor, más sensible es el sensor de vibración
        3D. El valor predeterminado es 10.
        Nivel de sensibilidad = [101… 110]: indica los tiempos de vibración en un
        segundo. Por ejemplo,101 indica que el sensor vibra 1 vez en un segundo y 110
        indica que el sensor vibra 10 veces en un segundo.
}

*/