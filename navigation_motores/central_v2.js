// Require A
const { MongoClient } = require("mongodb")
const { Server } = require("socket.io")
const IOWSSRV = new Server({ /* options */ })
const IOWSCLI = require("socket.io-client")
//var REQUEST = require('request')
var MOMENT = require('moment')
var GEOTOOLS = require('geolocation-utils')
var TOOLS = require('./tools_v2.js')

var TMP_MYSQL = require('mysql')

// Variables de entorno
const ENV_CLIEN = process.env.cliente || 'navigation'
const ENV_WSPUE = process.env.wsspuerto || 9100
const ENV_LVLLO = process.env.lvllog || 3

// Configuración
const CONFIGURACION = TOOLS.seleccionarCentral(ENV_CLIEN, ENV_WSPUE, ENV_LVLLO)
// Ver configuración
console.log('CONFIGURACION', CONFIGURACION)

TOOLS.toolsConfig.lvl_print_log = CONFIGURACION.lvl_print_log
const IOWSSRVPORT = CONFIGURACION.wsspuerto

// Variables
const _config_limiteConsulta = 5000
const _config_delayConsulta = 1000
const _mongodb_url = CONFIGURACION.dbLink
const _mongodb_name = CONFIGURACION.dbNombre
var _mongodb_db, _mongodb_client
var _mongodb_failIntentos = 0
var _mongodb_dbActive = false
var _socket_motores = []
var _socket_motore_ws_tmp 
var TMP_MYSQL_CX
var PROCESADOR_ACTUALIZADOR = require('./procesadores/actualizador_v2.js')
var PROCESADOR_GEOCERCAS = require('./procesadores/geocercas_v2.js')
var PROCESADOR_PROCESADOR = require('./procesadores/procesador_v2.js')
var PROCESADOR_HISTORICO = require('./procesadores/historico_v2.js')
var tmp_request_guardar_memoria = false
var tmp_request_guardar_memoria_Array = []


// Procesos
/*-------------------------------------------*/
/*----------Sección Base de datos------------*/
/*-------------------------------------------*/
var funcionConectarDB = 
	function(){
		_mongodb_client = null
		_mongodb_client = new MongoClient(_mongodb_url, {useUnifiedTopology: true})
		_mongodb_client.connect()
		_mongodb_db = _mongodb_client.db(_mongodb_name)
		_mongodb_dbActive = true
		if(_mongodb_dbActive){
			setTimeout(function(){
				servidorIOCOM()
			}, 5000)
		}
		TOOLS.LogInfo('MongoDB', "Conectado")
		_mongodb_client.on("serverHeartbeatFailed", event => {
			_mongodb_failIntentos++
			_mongodb_dbActive = false
			TOOLS.LogError('Error (Sección Base de datos)', `${JSON.stringify(event, null, 2)}`)
			if(_mongodb_failIntentos > 10){
				process.exit(1)
			}else{
				TOOLS.LogInfo('Intento de conecxion', _mongodb_failIntentos)
				setTimeout(function(){funcionConectarDB()},1000)
			}
		})
	}
funcionConectarDB() // Arrancando Servicio
/*-------------------------------------------*/
/*--------Encender servidor WebSocket--------*/
/*-------------------------------------------*/
// Recibe conexión
IOWSSRV.on("connection",
	(socket) => {
		TOOLS.Log('WS Conecxión cliente')
		socket.on("disconnect", () => {
				TOOLS.Log('WS Desconectado', socket.id)
				borrarIODesconectado(socket.id)
			})
		socket.on("login-motor", (message) => {
			TOOLS.Log('WS Login', message)
			try{
				//JSON.parse(message)
				if(message.token != '123456')
					socket.disconnect()
				TOOLS.Log('WS Login', "OK")
				var socket_session = {'socket':socket, 'socketId':socket.id, 'motor':message.info, 'unidades':[]}
				_socket_motores.push(socket_session)
				TOOLS.Log('Motor identificado', _socket_motores)
				socket.emit('login-motor', {login:true})
			}catch(err){
				socket.emit('login-motor', "JSON INVALIDO")
				TOOLS.LogAlert('WS Login', "JSON INVALIDO")
				socket.disconnect()
			}
			
			})
		socket.on("login-motor-ws-tmp", (message) => {
			TOOLS.Log('WS Login TMP', message)
			try{
				//JSON.parse(message)
				if(message.token != '123456')
					socket.disconnect()
				TOOLS.Log('WS Login', "OK")
				_socket_motore_ws_tmp = {'socket':socket, 'socketId':socket.id, 'motor':message.info}
				TOOLS.Log('Motor identificado', _socket_motore_ws_tmp)
				socket.emit('login-motor-ws-tmp', {login:true})
			}catch(err){
				socket.emit('login-motor-ws-tmp', "JSON INVALIDO")
				TOOLS.LogAlert('WS Login', "JSON INVALIDO")
				socket.disconnect()
			}
			if(!tmp_request_guardar_memoria){
				console.log('WSMOTO RUN')
				tmp_request_guardar()
				tmp_request_guardar_memoria = true
			}
				
			
			})
		socket.on("motor-procesar", (procesar)=>{
				TOOLS.Log('WS Motor sin procesar', procesar)
				try{
					// TMP
					if(procesar.procesar.tipoMensaje != null)
						if(procesar.procesar.tipoMensaje == 140)
							tmp_mysql_guardarCMD(procesar.procesar)
					procesador(procesar)
				}catch(error){
					TOOLS.LogError('Error WS Procesador', error)
				}
			})
		socket.on("motor-com", (comunicacion)=>{
				TOOLS.Log('WS Motor com', comunicacion)
				try{
					switch (comunicacion.tipocom) {
						case 0:{
							for(var motor of _socket_motores){
								if(motor.socketId == socket.id)
									motor.unidades = comunicacion.unidades
							}
							TOOLS.Log('WS Motor com (act unidades)', _socket_motores.unidades)
						}
						break
						default:{
							TOOLS.LogError('WS Motor com (error)', 'Comunicación no definida')
						}
				}
				}catch(error){
					
				}
			})
		socket.on("motor-cmd", (cmd)=>{
				TOOLS.Log('WS Delete CMD', cmd)
				try{
					tmp_mysql_eliminarEnviados(cmd.id)
				}catch(error){
					TOOLS.LogAlert('WS Delete CMD (error)', error)
				}
			})
	})
// Desconexión 
// IOWSSRV.on("login",
// 	(socket) => {
// 		TOOLS.Log('WS Login', )
// 	})
var borrarIODesconectado = 
	function(socketId){
		var socket_motores = []
		for(var socket_session of _socket_motores){
			if(socket_session.socketId != socketId)
				socket_motores.push(socket_session)
		}
		_socket_motores = null
		_socket_motores = socket_motores
		TOOLS.Log('Ajuste de motores', _socket_motores)
	}
var servidorIOCOM = 
	function(){
		TOOLS.Log('Iniciando servicio')
		if(_mongodb_dbActive == true){
			tmp_mysql_conectar()
			IOWSSRV.listen(IOWSSRVPORT)
			PROCESADOR_ACTUALIZADOR.init(TOOLS, _mongodb_db, MOMENT)
			PROCESADOR_GEOCERCAS.init(TOOLS, _mongodb_db, MOMENT, GEOTOOLS)
			//PROCESADOR_HISTORICO.init(TOOLS, _mongodb_db, MOMENT)
			setTimeout(function(){tmp_mysql_findCMD();},5000)
			TOOLS.Log('WS server iniciado')
			//procesador({info:'control'})
		}
	}
/*-------------------------------------------*/
/*--------------PROCESAR DATOS---------------*/
/*-------------------------------------------*/
var procesador = async function(datos){
	tmp_request_guardar_memoria_Array.push(datos)
	var proceso = await PROCESADOR_ACTUALIZADOR.procesa(datos) // Proceso A (Registrar y actualizar estado de Unidad)
	if(proceso.error){
		TOOLS.LogError('Proceso detenido (PROCESADOR_ACTUALIZADOR)', proceso.error)
		return
	}
	proceso = await PROCESADOR_GEOCERCAS.procesa(proceso) // Proceso B (Validad PDI)
	if(proceso.error){
		TOOLS.LogError('Proceso detenido (PROCESADOR_GEOCERCAS)', proceso.error)
		return
	}
	//console.log('Final Proceso', proceso)
	
	// unitid: '100000000000001',
	// procesar: {
	// 	unitid: '100000000000001',
	// 	imei: 100000000000001,
	// 	marcaGPS: 'topflytech',
	// 	motorcom: 0,
	// 	crudo: '252501001500020100000000000001103456250322',
	// 	protocolomsn: 'login_message',
	// 	protocolotipo: 0,
	// 	serialmsn: 2,
	// 	modeloGPS: 'TLW1',
	// 	identificadorGPS: 'TLW1',
	// 	submodeloGPS: 'TLW1-Series',
	// 	firmwareSoftwareVersion: '4.5.6',
	// 	hardwareVersion: '2.2',
	// 	basicSoftwareVersion: '1.0.3',
	// 	platformSoftwareVersion: '2503',
	// 	tipoMensaje: 143,
	// 	realtime: true,
	// 	modoReporte: 143,
	// 	registro: '2021-10-28T05:47:50.670Z'
	// }
}
	
/*-------------------------------------------*/
/*---------------TMP ADICIONAL---------------*/
/*-------------------------------------------*/
var tmp_mysql_conectar = function()
	{
		TMP_MYSQL_CX = 
			TMP_MYSQL.createConnection({
				host: CONFIGURACION.tmp_mysql_host,
				user: CONFIGURACION.tmp_mysql_user,
				password: CONFIGURACION.tmp_mysql_pass,
				database: CONFIGURACION.tmp_mysql_db,
				port: CONFIGURACION.tmp_mysql_port
			})
			tmp_mysql_desconecxion(TMP_MYSQL_CX)
			TMP_MYSQL_CX.connect(
				function(error){
					if(error){
						TOOLS.LogError('DB:Error al conectar', error)
					}else{
						TOOLS.LogInfo('DB:Conectado OK')
					}
			})
	}
var tmp_mysql_desconecxion = function(cliente)
	{
		cliente.on('error', 
			function (error) {
				if (!error.fatal) return
				if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err
				TOOLS.LogInfo('DB: Conectando..')
				TMP_MYSQL_CX = TMP_MYSQL.createConnection(cliente.config)
				tmp_mysql_desconecxion(TMP_MYSQL_CX)
				TMP_MYSQL_CX.connect()
			})
	}
var tmp_mysql_findCMD = function()
	{
		TOOLS.LogInfo('Buscando Comandos')
		var query = "SELECT a.id, b.r01 AS unitid, a.c02 AS cmd_msn, a.c03 AS fecha FROM t015 AS a CROSS JOIN t004 AS b ON b.id = a.r01 WHERE a.c04 = 1;"
		TMP_MYSQL_CX.query(query,
			function(error, results, fields){
				if (error) throw error
				//TOOLS.LogInfo('Comandos find', _socket_motores)
				if(results.length != 0){
					for(var i_cmd in results){
						var cmd = results[i_cmd]
						// Busca motores
						for(var motor of _socket_motores){
							// Busca unidades en motores
							//TOOLS.LogInfo('Comandos Motor', motor)
							for(var i_unidad in motor.unidades){
								var unidad = motor.unidades[i_unidad]
								//TOOLS.LogInfo('Comandos Unidad', unidad)
								if(unidad.unitid == String(cmd.unitid)){
									// Enviar comando al motor
									TOOLS.LogInfo('Unidad CMD', cmd)
									motor.socket.emit('motor-cmd', {cmd:cmd, unidad:unidad})
								}
							}
						}
					}
				}
				setTimeout(
					function(){tmp_mysql_findCMD()},
					10000
				)
			}
		)
	}
var tmp_mysql_eliminarResagados = function()
	{
		
	}
var tmp_mysql_eliminarEnviados = function(id)
	{
		TOOLS.LogInfo('Eliminando Comando', id)
		var query = "DELETE FROM t015 WHERE (id = "+id+")"
		TMP_MYSQL_CX.query(query,
			function(error, results, fields){
				if (error) throw error
				//TOOLS.LogInfo('Comando Eliminado', results)
			}
		)
	}
var tmp_mysql_guardarCMD = function(datos)
	{
		TOOLS.LogInfo('Guardando comando por equipo')
		var query = 'INSERT INTO t016 (r01, c02, c03, c04, c05, c06) VALUES ((select id from t004 where r01="'+datos.unitid+'"), "'+datos.CMDMensaje+'", NOW(), 1, 0, 0);'
		TMP_MYSQL_CX.query(query,
			function(error, results, fields){
				if (error) throw error
				TOOLS.LogInfo('Comandos guardado', datos.CMDMensaje)
			}
		)
		
	}
var tmp_request_guardar = function()
	{
		console.log('Emitiendo', tmp_request_guardar_memoria_Array.length)
		//tmp_request_guardar_memoria_Array
		var memoriaTMP = tmp_request_guardar_memoria_Array
		tmp_request_guardar_memoria_Array = []
		// Send Request
		_socket_motore_ws_tmp.socket.emit('msn-ws-tmp', memoriaTMP)
		setTimeout(
			function(){
				tmp_request_guardar()
			},5000
		)
	}
