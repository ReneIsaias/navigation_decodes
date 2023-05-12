// Require A
var TOOLS = require('./tools_v2.js')
// DECODES
var CRCITU16 = require('./decodes/crc16.js') // CRC-16
var SEPARADOR_MARCAS = require('./decodes/separador_v2.js') //	SEPARADOR DE MARCAS
var DECODE_TOPFLYTECH = require('./decodes/topflytech_v2.js') //	TOPFLYTECH
var DECODE_SUNTECH = require('./decodes/suntech_v2.js') //	SUNTECH
var DECODE_CONCOX = require('./decodes/concox_v2.js') //	CONCOX


// Variables de entorno
const ENV_MOTOR = process.env.motor || 'topflytech'
const ENV_CLIEN = process.env.cliente || 'navigation'
const ENV_PUERT = process.env.puerto || 10001
const ENV_LVLLO = process.env.lvllog || 3
const CONFIGURACION = TOOLS.seleccionarMotor(ENV_MOTOR, ENV_CLIEN, ENV_PUERT)
var UNIDADES = []
//console.log('puerto', ENV_PUERT)
//console.log('CONFIGURACION', CONFIGURACION)

// Require B
const IO = require("socket.io-client")
const IOWSCLI = IO(CONFIGURACION.hostcentral)
var NET = require('net')
var MOTOR = NET.createServer()
	
// Configuración
TOOLS.toolsConfig.lvl_print_log = ENV_LVLLO
MOTOR.maxConnections = 5000
var _timeoutClear = 1000*60*30 // 30 min

IOWSCLI.on("connect", () => {
	TOOLS.LogInfo('WS conectado', IOWSCLI.id)
	TOOLS.LogInfo('WS Iniciando sessión', IOWSCLI.id)
	IOWSCLI.emit('login-motor', {token:'123456', info:CONFIGURACION})
})
IOWSCLI.on("disconnect", () => {
	TOOLS.LogAlert('WS desconectado', IOWSCLI.id)
	cerrarMotor()
})
IOWSCLI.on("connect_error", (err) => {
	TOOLS.LogError('WS Error', err)
})
IOWSCLI.on("login-motor", (message) => {
	TOOLS.LogInfo('WS Info login', message)
	if(message.login == true){
		TOOLS.LogInfo('WS login correcto')
		abrirMotor()
		if(UNIDADES.length > 0)
			actualizarUnidadesCentral()
			
	}
})
IOWSCLI.on("motor-cmd", (comando) => {
	TOOLS.LogInfo('WS Envia comando', comando)
	try{
		for(var unidad of UNIDADES){
			if(unidad.unitid == comando.unidad.unitid){
				TOOLS.LogInfo('MOTOR Unidad find cmd', comando.cmd.cmd_msn)
				var cmdEncode = crearComando(comando.cmd, comando.unidad)
				unidad.socket.write(cmdEncode)
				IOWSCLI.emit('motor-cmd', {id:comando.cmd.id})
				break
				break
			}
		}
	}catch(error){
		TOOLS.LogAlert('Error al envia comando', error)
	}	
})
var cerrarMotor = function()
	{
		MOTOR.close()
		resetUnidadesLista()
	}
var abrirMotor = function()
	{
		TOOLS.LogInfo('Motor Socket Abierto')
		MOTOR.maxConnections = 5000
		MOTOR.on('connection', 
			function(socket) {
				try {
					socket.infosocket = {"unitid":null}
					socket.setTimeout(_timeoutClear)
					socket.on('timeout', 
						() => {
							TOOLS.Log('Socket TimeOut', socket.infosocket)
							socket.end()
							socket.destroy()
						})
					socket.on("error", 
						(err) => {
							TOOLS.Log('Socket Error', socket.infosocket)
							borarUnidadLista(socket)
							socket.destroy()
						})
						
					socket.on('data', 
						async (data) => {
							var dataBufferHex = Buffer.from(data, 'hex')
							//TOOLS.Log('DATA-HEX', dataBufferHex)
							var separador = SEPARADOR_MARCAS.detectar(data)
							if(separador.error){
								TOOLS.LogError('Marca no detectado', dataBufferHex)
							}else{
								// Procesar información
								for(var i_buffer in separador.bufferData){
									var buffer = separador.bufferData[i_buffer]
									//console.log('Procesar')
									procesarBuffer(buffer, socket)
								}
							}
						})
				}catch (error) {
					TOOLS.LogAlert('Motor mensaje error', error)
				}
		}).listen(CONFIGURACION.puerto)
		
	}
var procesarBuffer = function(buffer, socket)
	{
		var procesado = {}
		var agregarUnidad = false
		console.log('DataInfoSocket', socket.infosocket.unitid)
		if(socket.infosocket.unitid == null)
			agregarUnidad = true
		switch (buffer.modelo.idDecode) {
			case 0:{
				procesado = DECODE_TOPFLYTECH.tlw1(buffer.data, socket.infosocket.unitid)					
			}
			break
			// case 1:{
			// 	procesado = DECODE_TOPFLYTECH.tlp1(buffer.data, socket.infosocket.unitid)
			// }
			// break
			case 2:{
				procesado = DECODE_TOPFLYTECH.tlp1(buffer.data, socket.infosocket.unitid)
			}
			break
			case 10:{
				procesado = DECODE_SUNTECH.st600(buffer.data, socket.infosocket.unitid)
			}
			break
			case 11:{
				procesado = DECODE_SUNTECH.st300(buffer.data, socket.infosocket.unitid)
			}
			break
			case 12:{
				procesado = DECODE_SUNTECH.universal(buffer.data, socket.infosocket.unitid)
			}
			break
			case 100:{
				procesado = DECODE_CONCOX.at6(buffer.data, socket.infosocket.unitid)
			}
			break
			default:{
				TOOLS.LogAlert('Marca no registrada', buffer)
				agregarUnidad = false
			}
		}
		if(agregarUnidad)
			console.log('InfoSaveiD')
			socket.infosocket.unitid = procesado.save.unitid
		try{
			// Final enviar datos para ser procesados
			if(IOWSCLI.connected){
				//console.log('Enviando mensaje')
				IOWSCLI.emit('motor-procesar', {unitid:socket.infosocket.unitid, procesar:procesado.save})
				if(procesado.respuesta != null)
					socket.write(procesado.respuesta)
				//socket.write(Buffer.from('25258100100001086528404041508901474f4f474c4523', 'hex'))
			}
		}catch(error){
			TOOLS.LogAlert('Error al procesar (b)', error)
		}
		console.log('agregarUnidad', agregarUnidad)
		//if(agregarUnidad)
		agregarUnidadLista(socket, procesado)
	}
var agregarUnidadLista = function(socket, procesado)
	{
		console.log('Agregando Unidad')
		if(procesado.save.unitid == null){
			TOOLS.LogAlert('Unidad sin unitid', procesado)
			return
		}
		var unidadFind = false
		for(var i_unidad in UNIDADES){ // reemplazar
			var unidad = UNIDADES[i_unidad]
			if(unidad.unitid == procesado.save.unitid){
				UNIDADES[i_unidad].socket = socket
				unidadFind = true
				break
			}
		}
		console.log('unidadFind', unidadFind)
		// Condicion para agregar la unidad
		if(unidadFind == false)
			UNIDADES.push({socket:socket, unitid:procesado.save.unitid, modeloidentificador: procesado.save.identificadorGPS || null})
		if(unidadFind == false)
			actualizarUnidadesCentral()
	}
var borarUnidadLista = function(socket)
	{
		var UNIDADES_TMP = []
		for(var unidad of UNIDADES){
			if(unidad.socket != socket){
				UNIDADES_TMP.push(unidad)
			}
		}
		UNIDADES = []
		UNIDADES = UNIDADES_TMP
		UNIDADES_TMP = null
		actualizarUnidadesCentral()
	}
var enviarCMDUnidadLista = function()
	{
		
	}
var resetUnidadesLista = function()
	{
		UNIDADES = []
	}
var actualizarUnidadesCentral = function()
	{
		console.log('Agrenado a Central')
		if(IOWSCLI.connected){
			var UNIDADESACT = []
			for(var unidad of UNIDADES){
				UNIDADESACT.push({unitid:unidad.unitid, modeloidentificador: unidad.modeloidentificador})
			}
			IOWSCLI.emit('motor-com', {tipocom:0, unidades:UNIDADESACT})
		}
	}
var crearComando = function(cmd, unidad)
	{
		var cmdmsn
		switch (unidad.modeloidentificador) {
			case 'TLW1':
			case 'TLW2':
			case 'TLP1':{
				cmd.cmd_msn = cmd.cmd_msn.substring(21)
				if(unidad.modeloidentificador == 'TWL2'){
					if(cmd.cmd_msn == 'DOUT2,0#')
						cmd.cmd_msn = 'DOUT,1,0#'
					if(cmd.cmd_msn == 'DOUT2,1#')
						cmd.cmd_msn = 'DOUT,1,1#'
				}
				cmdmsn = DECODE_TOPFLYTECH.tlw1CMD({cmd:cmd.cmd_msn, serial:1}, unidad.unitid)
			}
			break
			case 'ST300':
			case 'ST600':
			case 'suntech-universal':{
				cmdmsn = cmd.cmd_msn
			}
			break
			case 'AT6':{
				cmdmsn = cmd.cmd_msn
			}
			break
		}
		return cmdmsn
	}