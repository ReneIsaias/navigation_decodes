// Require A
var TOOLS = require('./tools_v2.js')

// Variables de entorno
const ENV_CLIEN = process.env.cliente || 'navigation'
const ENV_LVLLO = process.env.lvllog || 3
const CONFIGURACION = TOOLS.seleccionarMotorWSTMP(ENV_CLIEN)

// Require B
const IO = require("socket.io-client")
const IOWSCLI = IO(CONFIGURACION.hostcentral)

// Configuración
TOOLS.toolsConfig.lvl_print_log = ENV_LVLLO

// variables N
var request = require('request')
const alpas = {"usuario":"appnavandroid-pix","codigo":"Hyd&%hdjkYd834"}
//const alpas = {"usuario":"mobizen@service","codigo":"ByK{L2TWjq=D1VOO"}
var URLRequest = 'http://control.navigation.com.mx/'
var URLPath = 'WSNavMex/geonav/'
const WSPath = {'aut':'autenticacion/autenticar','autv':'autenticacion/autenticado', 'save':'comandos/posicion'}
var peticiones = {}
var tokenbearer = ''
var caducidadbearer = 0
var intentos = 10
var timerIntentos = 5
var timerMenos5
const options_init = {
	method: 'POST',
	body: alpas,
	json: true,
	url: URLRequest+URLPath+WSPath['aut']
}
var optionsSendPOSTforBody = {
	method: 'POST',
	body: {},
	json: true,
	url: URLRequest+URLPath+WSPath['save'],
	headers: {
		'Authorization':''
	}
}
var optionsSendPOST = {
	method: 'POST',
	headers: {
		'Authorization':''
	}
}

IOWSCLI.on("connect", () => {
	TOOLS.LogInfo('WS conectado', IOWSCLI.id)
	TOOLS.LogInfo('WS Iniciando sessión', IOWSCLI.id)
	IOWSCLI.emit('login-motor-ws-tmp', {token:'123456', info:CONFIGURACION})
})
IOWSCLI.on("disconnect", () => {
	TOOLS.LogAlert('WS desconectado', IOWSCLI.id)
	cerrarMotor()
})
IOWSCLI.on("connect_error", (err) => {
	TOOLS.LogError('WS Error', err)
})
IOWSCLI.on("login-motor-ws-tmp", (message) => {
	TOOLS.LogInfo('WS Info login', message)
	if(message.login == true){
		TOOLS.LogInfo('WS login correcto')
		conectar(
			function(){
				// Activar Timer
				timerMenos5 = setInterval(function(){
					caducidadbearer = caducidadbearer-60
					//console.log('caducidadbearer', caducidadbearer)
					if(caducidadbearer < 120){
						conectar()
					}
				}, 60000)
			},
			function(){
				// Error intentar nuevamente
			})
	}
})
IOWSCLI.on("msn-ws-tmp", (posiciones) => {
	
	console.log('posciones', posiciones)
	var nuevoArray = []
	for(var pos in posiciones){
		var posicion = posiciones[pos]
		
	}
	optionsSendPOSTforBody.body = nuevoArray
	request(
		optionsSendPOSTforBody, 
		function(error, response, body){
			if(!error && response.statusCode == 200) {
				console.log('Respuesta SAVE WS:',body)
			}else{
				console.log('ERROR WS', error)
			}
		}
	)
})

function contruyePlano(info, contador){
	var marcaStatus = marcaymodelo(info)
	// Con posicion
	senddata = {
		unitID:data_decode.save.unitid,
		fechaHoraEvento:data_decode.save.registro,
		contadorMensaje:1,
		marca:marcaStatus.marca,
		tipoMensaje:data_decode.save.tipoMensaje,
		modeloUnidad:marcaStatus.modeloUnidad,
		consecutivo:contador,
		latitud:data_decode.save.latitud,
		longitud:data_decode.save.longitud,
		velocidad:data_decode.save.velocidad,
		direccion:data_decode.save.direccion,
		odometro:data_decode.save.odometro,
		bateria:data_decode.save.energiaExternaVol,
		inputs:inputSave,
		motorEncendido:(inputSave[0]==1?true:false)
	}
	// Sin Posicion
	senddata = {
		unitID:data_decode.save.unitid,
		fechaHoraEvento:data_decode.save.registro,
		contadorMensaje:contador,
		marca:marcaStatus.marca,
		tipoMensaje:data_decode.save.tipoMensaje,
		modeloUnidad:marcaStatus.modeloUnidad,
		consecutivo:1
	}
	return senddata
}

function marcaymodelo(info){
	return {modeloUnidad:'', marca:''}
}


function conectar(conectado = null, errorws = null){
	console.log('Conectando a WS...')
	request(options_init, function(error, response, body){
		if(!error && response.statusCode == 200) {
			console.log('Respuesta WS:',body)
			if(body.token){
				tokenbearer = body.token
				caducidadbearer = body.segundosExpiracion
				optionsSendPOSTforBody.headers.Authorization = 'Bearer '+tokenbearer
				if(conectado!=null) conectado()
				console.log('Info Login', optionsSendPOSTforBody)
			}else{
				tokenbearer = ''
				caducidadbearer = 0
				console.log('Error al conectar WS')
				if(errorws!=null) errorws()
			}
		}else{
			tokenbearer = ''
			caducidadbearer = 0
			if(errorws!=null) errorws()
		}
	})
}