// Herramientas de apoyo para servicios de motor central y comunicación
// Navigation
// Josafat Vargas O.
var extend = require('extend')
var moment = require('moment')
module.exports = 
	{
		toolsConfig:
			{
				lvl_print_log:0 // Desactivado
				//lvl_print_log:1 // + errores
				//lvl_print_log:2 // + advertencias
				//lvl_print_log:3 // + log & info
			},
		ResetServicio: function(motivo){
			this.Log('Reset de servicio motivo:', motivo, 'error')
			process.exit(1)
		},
		Log: function (titulo, contenido = null, tipo = 'log')
			{
				var today = new Date()
				var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
				var dateTime = date+' '+time
				if(this.toolsConfig.lvl_print_log == 0)
					return
				switch (tipo) {
					case 'log':{
						if(this.toolsConfig.lvl_print_log > 2)
							console.log(dateTime+' / '+titulo, (contenido!=null?contenido:'.'))
					}
					break;
					case 'info':{
						if(this.toolsConfig.lvl_print_log > 2)
							console.info(dateTime+' / '+titulo, (contenido!=null?contenido:'.'))
					}
					break;
					case 'alert':{
						if(this.toolsConfig.lvl_print_log > 1)
							console.warn(dateTime+' / '+titulo, (contenido!=null?contenido:'.'))
					}
					break;
					case 'error':{
						if(this.toolsConfig.lvl_print_log > 0)
							console.error(dateTime+' / '+titulo, (contenido!=null?contenido:'.'))
					}
					break;
					case 'time':{
						if(this.toolsConfig.lvl_print_log > 0)
							console.time(titulo)
					}
					break;
					case 'end':{
						if(this.toolsConfig.lvl_print_log > 0)
							console.timeEnd(titulo)
					}
					break;
					default:{
						if(this.toolsConfig.lvl_print_log > 2)
							console.log(dateTime+' / '+titulo, (contenido!=null?contenido:'.'))
					}
				}
			},
		LogError: function (titulo, contenido = null)
			{
				this.Log(titulo, contenido, 'error')
			},
		LogInfo: function (titulo, contenido = null)
			{
				this.Log(titulo, contenido, 'info')
			},
		LogAlert: function (titulo, contenido = null)
			{
				this.Log(titulo, contenido, 'alert')
			},
		seleccionarCentral: function(cliente, wsspuerto, lvl_print_log)
			{
				var config = 
					{
						wsspuerto:wsspuerto,
						host:'',	
						lvl_print_log:lvl_print_log,
						cliente:cliente,
						dbNombre:'navigationdemo',
						dbLink:'mongodb://root:rDz9Lj5FaqmB@3.238.199.209:27017/?retryWrites=true&writeConcern=majority',
						motortipo:'central',
						tmp_mysql_host: '172.31.69.30',
						tmp_mysql_user: 'superoperador',
						tmp_mysql_pass: 'TcYzJZ1swAIjMtZI9oTG',
						tmp_mysql_db: 'motor_navigation',
						tmp_mysql_port: 3310,
						tmp_ws_host:''
					}
				switch (cliente) {
					case 'navigation':{
						config.host = 'central.navigation.com.mx'
					}
					break;
					case 'pyxis':{
						config.host = 'pyx-central.navigation.com.mx'
					}
					break;
					default:{
						config.host = 'central.navigation.com.mx'
					}
					
				}
				return config
			},
		seleccionarMotor: function(motor, cliente, puerto)
			{
				var config = 
					{
						'puerto':0,
						'host':'',
						'motor':motor,
						'modelos':'',
						'cliente':'navigation',
						'hostcentral':'http://127.0.0.1:9100',
						'motortipo':'motorcom'
					}
				if(cliente == 'pyxis')
					config.hostcentral = 'http://127.0.0.1:9100'
					
				var modelosLista = 
					{
						'topflytech':['TLW1', 'TLW2', 'TLP1-SF', 'TLP2', 'TLD1'],
						'suntech':['ST300', 'ST600', 'STUniversal'],
						'concox':['AT6'],
						'queclink':[],
						'meitrack':[]
					}
				switch (motor) {
					case 'topflytech':{
						config.puerto = 10001
						config.host = 'topflytech.navigation.com.mx'
						config.modelos = modelosLista.topflytech
						if(cliente == 'pyxis'){
							config.puerto = 10002
							config.host = 'pyx-topflytech.navigation.com.mx'
						}
					}
					break;
					case 'suntech-old':{
						config.puerto = 1098
						config.host = 'suntech.navigation.com.mx'
						config.modelos = modelosLista.suntech
						if(cliente == 'pyxis'){
							config.puerto = 1096
							config.host = 'motorazteca.navigation.com.mx'
						}
					}
					break;
					case 'suntech':{
						config.puerto = 10003
						config.host = 'suntech.navigation.com.mx'
						config.modelos = modelosLista.suntech
						if(cliente == 'pyxis'){
							config.puerto = 10004
							config.host = 'pyx-suntech.navigation.com.mx'
						}
					}
					break;
					case 'concox':{
						config.puerto = 10005
						config.host = 'concox.navigation.com.mx'
						config.modelos = modelosLista.concox
						if(cliente == 'pyxis'){
							config.puerto = 10006
							config.host = 'pyx-concox.navigation.com.mx'
						}
					}
					break;
					case 'queclink':{
						config.puerto = 10007
						config.host = 'queclink.navigation.com.mx'
						config.modelos = modelosLista.queclink
						if(cliente == 'pyxis'){
							config.puerto = 10008
							config.host = 'pyx-queclink.navigation.com.mx'
						}
					}
					break;
					case 'meitrack':{
						config.puerto = 10009
						config.host = 'meitrack.navigation.com.mx'
						config.modelos = modelosLista.meitrack
						if(cliente == 'pyxis'){
							config.puerto = 10010
							config.host = 'pyx-meitrack.navigation.com.mx'
						}
					}
					break;
					case 'motor-universal':{
						config.puerto = 10100
						config.host = 'universal.navigation.com.mx'
						config.modelos = modelosLista
						if(cliente == 'pyxis'){
							config.puerto = 10101
							config.host = 'pyx-universal.navigation.com.mx'
						}
					}
					break;
					case 'motor-respaldo':{
						config.puerto = 10102
						config.host = 'motorrespaldo.navigation.com.mx'
						config.modelos = modelosLista
						if(cliente == 'pyxis'){
							config.puerto = 10103
							config.host = 'pyx-motorrespaldo.navigation.com.mx'
						}
					}
					break;
					case 'motor-developer':{
						config.puerto = 3002
						config.host = 'motordeveloper.navigation.com.mx'
						config.modelos = modelosLista
						if(cliente == 'pyxis'){
							config.puerto = 3001
							config.host = 'pyx-motordeveloper.navigation.com.mx'
						}
					}
					break;
					default:{
						config.puerto = puerto
						config.host = 'motordeveloper.navigation.com.mx'
						config.modelos = modelosLista
						if(cliente == 'pyxis'){
							config.puerto = puerto
							config.host = 'pyx-motordeveloper.navigation.com.mx'
						}
					}
					
				}
				return config
			},
		seleccionarMotorWSTMP: function(cliente)
		{
			var config = 
				{
					'cliente':'navigation',
					'hostcentral':'http://127.0.0.1:9100',
					'motortipo':'motorws-tmp'
				}
			if(cliente == 'pyxis')
				config.hostcentral = 'http://127.0.0.1:9100'
			return config
		},
		resetFecha: function(fecha)
			{
				if(fecha == null)
					return new Date(moment())
				var fechaRegistro = moment(fecha)
				var fechaMax = moment().add(1, 'days')
				var fechaMin = moment().subtract(1, 'years')
				if(fechaMax < fechaRegistro)
					return new Date(moment())
				if(fechaMin > fechaRegistro)
					return new Date(moment())
				return fecha
			},
		seleccionarNotificaciones: function(cliente = 'navigation')
			{
			var config = 
				{
					'cliente':'navigation',
					'hostcentral':'http://127.0.0.1:9100',
					'motortipo':'notificaciones'
				}
			//config.cliente = cliente
			if(cliente == 'pyxis')
				config.hostcentral = 'http://127.0.0.1:9100'
			
			return config
		},
		organizarInformacion: function(tipo, procesar, unidad = null)
			{
				var organizado = {}
				// TIPOS
				// 0 = nuevo
				// 1 = actualización
				
				if(tipo == 0){
					var nowDate = Date.now()
					var todayDate = new Date(nowDate)
					var nuevo = 
						{
							cliente:0,
							unidad:
								{
									tipo:0,
									eco:procesar.unitid,
									altaRegistro:todayDate
								},
							control:
								{
									activo:false,
									sms:false
								},
							notificacionesSMS:
								{
									panico:false,
									paromotor:false,
									jammer:false,
									bateria:false,
									pdi:false,
									geocercas:false,
									pdip:false,
									ignicion:false
								},
							notificacionesEMAIL:
								{
									panico:false,
									paromotor:false,
									jammer:false,
									bateria:false,
									pdi:false,
									geocercas:false,
									pdip:false,
									ignicion:false
								},
							rastreo:
								{
									ignicion: false
								}
						}
					extend(true, organizado, organizado, nuevo)	
				}
				
				
				/* GPS */
				var gps = {}
				// Serial (adicional)
				// protocolomsn
				this.controlExisteFusion(gps, procesar, 'protocolomsn')
				// serialmsn.[protocolo]
				this.controlExisteFusion(gps, procesar, "serialmsn."+gps.protocolomsn+".serialmsn")
				// registro
				this.controlExisteFusion(gps, procesar, "registro")
				// unitid
				this.controlExisteFusion(gps, procesar, "unitid")
				// imei
				this.controlExisteFusion(gps, procesar, "imei")
				// marcaGPS
				this.controlExisteFusion(gps, procesar, "marcaGPS")
				// modeloGPS
				this.controlExisteFusion(gps, procesar, "modeloGPS")
				// submodeloGPS
				this.controlExisteFusion(gps, procesar, "submodeloGPS")
				// identificadorGPS
				this.controlExisteFusion(gps, procesar, "identificadorGPS")
				// motorcom
				this.controlExisteFusion(gps, procesar, "motorcom")
				// crudo
				this.controlExisteFusion(gps, procesar, "crudo")
				// tipomsn
				this.controlExisteFusion(gps, procesar, "tipomsn")
				// tipomsnExtraInfo
				this.controlExisteFusion(gps, procesar, "tipomsnExtraInfo")
				// tipomsnExtraData
				this.controlExisteFusion(gps, procesar, "tipomsnExtraData")
				// camposExtrasAsignables ACTUALIZAR
				this.controlExisteFusion(gps, procesar, "camposExtrasAsignables")
				// protocolotipo
				this.controlExisteFusion(gps, procesar, "protocolotipo")
				// Guardar
				if(Object.keys(gps).length > 0)
					extend(true, organizado, organizado, {gps:gps})
				
				/* Posición y telemetria */
				var rastreo = {}
				// latitud
				this.controlExisteFusion(rastreo, procesar, "latitud")
				// longitud
				this.controlExisteFusion(rastreo, procesar, "longitud")
				// altitud
				this.controlExisteFusion(rastreo, procesar, "altitud")
				// velocidad
				this.controlExisteFusion(rastreo, procesar, "velocidad")
				// direccion
				this.controlExisteFusion(rastreo, procesar, "direccion")
				// senal
				this.controlExisteFusion(rastreo, procesar, "senal")
				// nosatelites
				this.controlExisteFusion(rastreo, procesar, "nosatelites")
				// odometro
				this.controlExisteFusion(rastreo, procesar, "odometro")
				// Guardar
				if(Object.keys(rastreo).length > 0)
					extend(true, organizado, organizado, {rastreo:rastreo})
				
				/* LBS */
				var lbs = {}
				// lbsBanda
				this.controlExisteFusion(lbs, procesar, "lbsBanda")
				// lbsRegistro
				this.controlExisteFusion(lbs, procesar, "lbsRegistro")
				// lbsMCC
				this.controlExisteFusion(lbs, procesar, "lbsMCC")
				// lbsMNC
				this.controlExisteFusion(lbs, procesar, "lbsMNC")
				// lbsTowers.[0~N]
				this.controlExisteFusion(lbs, procesar, "lbsTowers")
				// Guardar
				if(Object.keys(lbs).length > 0)
					extend(true, organizado, organizado, {lbs:lbs})
				
				/* Energia */
				var energia = {}
				// energiaExternaVol
				this.controlExisteFusion(energia, procesar, "energiaExternaVol")
				// energiaExternaLVL
				this.controlExisteFusion(energia, procesar, "energiaExternaLVL")
				// energiaExternaAct
				this.controlExisteFusion(energia, procesar, "energiaExternaAct")
				// energiaInternaVol
				this.controlExisteFusion(energia, procesar, "energiaInternaVol")
				// energiaInternaLVL
				this.controlExisteFusion(energia, procesar, "energiaInternaLVL")
				// frontLightSensorVoltaje
				this.controlExisteFusion(energia, procesar, "frontLightSensorVoltaje")
				// cargaSolar
				this.controlExisteFusion(energia, procesar, "cargaSolar")
				// solarPanelVoltaje
				this.controlExisteFusion(energia, procesar, "solarPanelVoltaje")
				// energiaADCVol
				this.controlExisteFusion(energia, procesar, "energiaADCVol")
				// Guardar
				if(Object.keys(energia).length > 0)
					extend(true, organizado, organizado, {energia:energia})
				
				/* I/O Digital */
				var iodigital = {}
				// entradasDigital.[0~N]
				this.controlExisteFusion(iodigital, procesar, "entradasDigital")
				// salidasDigital.[0~N]
				this.controlExisteFusion(iodigital, procesar, "salidasDigital")
				if(tipo == 0){
					if(Object.keys(iodigital).length > 0){
						if(iodigital.entradasDigital != null && iodigital.entradasDigital.length > 0){
							var entradasDigital = {}
							for(var i in iodigital.entradasDigital){
								var ioproce = iodigital.entradasDigital[i]
								var ionuevo = {
									estado:ioproce,
									tipo:(i==0?1:0)
								}
								entradasDigital[i] = ionuevo
							}
							iodigital.entradasDigital = entradasDigital
						}
						if(iodigital.salidasDigital != null && iodigital.salidasDigital.length > 0){
							var salidasDigital = {}
							for(var i in iodigital.salidasDigital){
								var ioproce = iodigital.salidasDigital[i]
								var ionuevo = {
									estado:ioproce,
									tipo:(i==0?1:0)
								}
								salidasDigital[i] = ionuevo
							}
							iodigital.salidasDigital = salidasDigital
						}
					}
				}else if(tipo == 1){
					if(Object.keys(iodigital).length > 0){
						if(iodigital.entradasDigital != null && iodigital.entradasDigital.length > 0){
							if(unidad.iodigital != null && unidad.iodigital.entradasDigital != null){
								if(iodigital.entradasDigital.length == unidad.iodigital.entradasDigital.length){
										var entradasDigital = {}
										for(var i in iodigital.entradasDigital){
											var ioproce = iodigital.entradasDigital[i]
											var ioantes = unidad.iodigital.entradasDigital[i]
											ioantes.estado = ioproce
											entradasDigital[i] = ioantes
										}
										iodigital.entradasDigital = entradasDigital
										
									}else{
										var entradasDigital = {}
										for(var i in iodigital.entradasDigital){
											var ioproce = iodigital.entradasDigital[i]
											var ionuevo = {
												estado:ioproce,
												tipo:0
											}
											entradasDigital[i] = ionuevo
										}
										iodigital.entradasDigital = entradasDigital
									}
							}else{
								var entradasDigital = {}
								for(var i in iodigital.entradasDigital){
									var ioproce = iodigital.entradasDigital[i]
									var ionuevo = {
										estado:ioproce,
										tipo:0
									}
									entradasDigital[i] = ionuevo
								}
								iodigital.entradasDigital = entradasDigital
							}
						}
						if(iodigital.salidasDigital != null && iodigital.salidasDigital.length > 0){
							if(unidad.iodigital != null && unidad.iodigital.entradasDigital != null){
								if(iodigital.salidasDigital.length == unidad.iodigital.salidasDigital.length){
										var salidasDigital = {}
										for(var i in iodigital.salidasDigital){
											var ioproce = iodigital.salidasDigital[i]
											var ioantes = unidad.iodigital.salidasDigital[i]
											ioantes.estado = ioproce
											salidasDigital[i] = ioantes
										}
										iodigital.salidasDigital = salidasDigital	
											
									}else{
										var salidasDigital = {}
										for(var i in iodigital.salidasDigital){
											var ioproce = iodigital.salidasDigital[i]
											var ionuevo = {
												estado:ioproce,
												tipo:0
											}
											salidasDigital[i] = ionuevo
										}
										iodigital.salidasDigital = salidasDigital
									}
							}else{
								var salidasDigital = {}
								for(var i in iodigital.salidasDigital){
									var ioproce = iodigital.salidasDigital[i]
									var ionuevo = {
										estado:ioproce,
										tipo:0
									}
									salidasDigital[i] = ionuevo
								}
								iodigital.salidasDigital = salidasDigital
							}
							
						}
					}
				}
				// Guardar
				if(Object.keys(iodigital).length > 0)
					extend(true, organizado, organizado, {iodigital:iodigital})
					
				/* I/O Analogo */
				var ioanaloga = {}
				// entradasAnaloga.[0~N]
				this.controlExisteFusion(ioanaloga, procesar, "entradasAnaloga")
				// salidasAnaloga.[0~N]
				this.controlExisteFusion(ioanaloga, procesar, "salidasAnaloga")
				// Guardar
				if(Object.keys(ioanaloga).length > 0)
					extend(true, organizado, organizado, {ioanaloga:ioanaloga})
				
				/* Información y Estados */
				var estados = {}
				// realtime
				this.controlExisteFusion(estados, procesar, "realtime")
				// lbsEstado
				this.controlExisteFusion(estados, procesar, "lbsEstado")
				// gnnsEstado
				this.controlExisteFusion(estados, procesar, "gnnsEstado")
				// gnssModoDormido
				this.controlExisteFusion(estados, procesar, "gnssModoDormido")
				// paroMotorEstado
				this.controlExisteFusion(estados, procesar, "paroMotorEstado")
				// gpsFixed
				this.controlExisteFusion(estados, procesar, "gpsFixed")
				// modoReporte
				this.controlExisteFusion(estados, procesar, "modoReporte")
				// resetFactoryRegistro
				this.controlExisteFusion(estados, procesar, "resetFactoryRegistro")
				// temperaturaInterna
				this.controlExisteFusion(estados, procesar, "temperaturaInterna")
				// temperaturaInternaPos
				this.controlExisteFusion(estados, procesar, "temperaturaInternaPos")
				// temperaturaInternaMedida
				this.controlExisteFusion(estados, procesar, "temperaturaInternaMedida")
				// reinicioRegistro
				this.controlExisteFusion(estados, procesar, "reinicioRegistro")
				// Guardar
				if(Object.keys(estados).length > 0)
					extend(true, organizado, organizado, {estados:estados})
				
				/* Configuracion */
				var configuracion = {}
				// gpsAct
				this.controlExisteFusion(configuracion, procesar, "gpsAct")
				// tipoIgnicion
				this.controlExisteFusion(configuracion, procesar, "tipoIgnicion")
				// unidadMedida
				this.controlExisteFusion(configuracion, procesar, "unidadMedida")
				// managerStatus
				this.controlExisteFusion(configuracion, procesar, "managerStatus")
				// simLock
				this.controlExisteFusion(configuracion, procesar, "simLock")
				// dispositivoBloqueado
				this.controlExisteFusion(configuracion, procesar, "dispositivoBloqueado")
				// managerActivo
				this.controlExisteFusion(configuracion, procesar, "managerActivo")
				// parkingLock
				this.controlExisteFusion(configuracion, procesar, "parkingLock")
				// modoDormido
				this.controlExisteFusion(configuracion, procesar, "modoDormido")
				// conectPersistente
				this.controlExisteFusion(configuracion, procesar, "conectPersistente")
				// saveBuffer
				this.controlExisteFusion(configuracion, procesar, "saveBuffer")
				// smsLng
				this.controlExisteFusion(configuracion, procesar, "smsLng")
				// alarmaArrastre
				this.controlExisteFusion(configuracion, procesar, "alarmaArrastre")
				// smsSendManager
				this.controlExisteFusion(configuracion, procesar, "smsSendManager")
				// smsSendInput2
				this.controlExisteFusion(configuracion, procesar, "smsSendInput2")
				// numSMSSendInfo
				this.controlExisteFusion(configuracion, procesar, "numSMSSendInfo")
				// volumenBocina
				this.controlExisteFusion(configuracion, procesar, "volumenBocina")
				// simPIN
				this.controlExisteFusion(configuracion, procesar, "simPIN")
				// INTERVALO DE REPORTE (intervaloReporte)
				// intervaloRepIngOn
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloRepIngOn.intervaloRepIngOn")
				// intervaloRepIngOff
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloRepIngOff.intervaloRepIngOff")
				// intervaloReqAngulo
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloReqAngulo.intervaloReqAngulo")
				// intervaloReqDistancia
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloReqDistancia.intervaloReqDistancia")
				// intervaloReqHeartbeat
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloReqHeartbeat.intervaloReqHeartbeat")
				// intervaloRepEmg
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intervaloRepEmg.intervaloRepEmg")
				// intentosAckEmg
				this.controlExisteFusion(configuracion, procesar, "intervaloReporte.intentosAckEmg.intentosAckEmg")
				// REPORTES (reporte)
				// reporteCRR
				this.controlExisteFusion(configuracion, procesar, "reporteCRR")
				// limiteVelocidadAlt
				this.controlExisteFusion(configuracion, procesar, "limiteVelocidadAlt")
				// SENSORES (sensores)
				// frontSensorAct
				this.controlExisteFusion(configuracion, procesar, "frontSensorAct")
				// dispositivoRemovidoAct
				this.controlExisteFusion(configuracion, procesar, "dispositivoRemovidoAct")
				// dispositivoAbiertoAct
				this.controlExisteFusion(configuracion, procesar, "dispositivoAbiertoAct")
				// temperaturaReporteAct
				this.controlExisteFusion(configuracion, procesar, "temperaturaReporteAct")
				// gSensorSensibilidad
				this.controlExisteFusion(configuracion, procesar, "gSensorSensibilidad")
				// sensorGTipo
				this.controlExisteFusion(configuracion, procesar, "sensorGTipo")
				// antitheftActivado
				this.controlExisteFusion(configuracion, procesar, "antitheftActivado")
				// antitheftSensibilidad
				this.controlExisteFusion(configuracion, procesar, "antitheftSensibilidad")
				// VERIFICADORES (verificadores)
				// verificadorEnergiaExterna
				this.controlExisteFusion(configuracion, procesar, "verificadorEnergiaExterna")
				// verificadorAntenaGPS
				this.controlExisteFusion(configuracion, procesar, "verificadorAntenaGPS")
				// verificadorEnergiaExterna
				this.controlExisteFusion(configuracion, procesar, "verificadorEnergiaExterna")
				// verificadorEnergiaExternaAutoOff
				this.controlExisteFusion(configuracion, procesar, "verificadorEnergiaExternaAutoOff")
				// verificadorEnergiaExternaUmbral
				this.controlExisteFusion(configuracion, procesar, "verificadorEnergiaExternaUmbral")
				// VOLATJE (voltaje)
				// voltajeConfigurado
				this.controlExisteFusion(configuracion, procesar, "voltajeConfigurado")
				// voltajeOperacionProtecion12v
				this.controlExisteFusion(configuracion, procesar, "voltajeOperacionProtecion12v")
				// voltajeOperacionProtecion24v
				this.controlExisteFusion(configuracion, procesar, "voltajeOperacionProtecion24v")
				// voltajeIgnicionVirtualOn
				this.controlExisteFusion(configuracion, procesar, "voltajeIgnicionVirtualOn")
				// voltajeIgnicionVirtualOff
				this.controlExisteFusion(configuracion, procesar, "voltajeIgnicionVirtualOff")
				// SOCKETS (io)
				// entradasConfig.[0~N]
				this.controlExisteFusion(configuracion, procesar, "entradasConfig")
				// salidasConfig.[0~N]
				this.controlExisteFusion(configuracion, procesar, "salidasConfig")
				// relayTipo
				this.controlExisteFusion(configuracion, procesar, "relayTipo")
				// JAMMER (jammer)
				// jammerDetection
				this.controlExisteFusion(configuracion, procesar, "jammer.jammerDetection.jammerDetection")
				// jammerTipo
				this.controlExisteFusion(configuracion, procesar, "jammer.jammerTipo.jammerTipo")
				// jammerConfigDistancia
				this.controlExisteFusion(configuracion, procesar, "jammer.jammerConfigDistancia.jammerConfigDistancia")
				// jammerConfigTiempo
				this.controlExisteFusion(configuracion, procesar, "jammer.jammerConfigTiempo.jammerConfigTiempo")
				// jammerRelay
				this.controlExisteFusion(configuracion, procesar, "jammer.jammerRelay.jammerRelay")
				// INFO VERSION (infoversion)
				// firmwareSoftwareVersion
				this.controlExisteFusion(configuracion, procesar, "firmwareSoftwareVersion")
				// hardwareVersion
				this.controlExisteFusion(configuracion, procesar, "hardwareVersion")
				// basicSoftwareVersion
				this.controlExisteFusion(configuracion, procesar, "basicSoftwareVersion")
				// platformSoftwareVersion
				this.controlExisteFusion(configuracion, procesar, "platformSoftwareVersion")
				// modelMcu
				this.controlExisteFusion(configuracion, procesar, "modelMcu")
				// versionMcu
				this.controlExisteFusion(configuracion, procesar, "versionMcu")
				// versionModem
				this.controlExisteFusion(configuracion, procesar, "versionModem")
				// versionModemApp
				this.controlExisteFusion(configuracion, procesar, "versionModemApp")
				// CONECCION (connect)
				// authGPRS
				this.controlExisteFusion(configuracion, procesar, "authGPRS")
				// apn
				this.controlExisteFusion(configuracion, procesar, "apn")
				// apnUser
				this.controlExisteFusion(configuracion, procesar, "apnUser")
				// apnPass
				this.controlExisteFusion(configuracion, procesar, "apnPass")
				// serverIP
				this.controlExisteFusion(configuracion, procesar, "serverIP")
				// serverPort
				this.controlExisteFusion(configuracion, procesar, "serverPort")
				// serverType
				this.controlExisteFusion(configuracion, procesar, "serverType")
				// serverIPBackup
				this.controlExisteFusion(configuracion, procesar, "serverIPBackup")
				// serverPortBackup
				this.controlExisteFusion(configuracion, procesar, "serverPortBackup")
				// serverTypeBackup
				this.controlExisteFusion(configuracion, procesar, "serverTypeBackup")
				// Guardar
				if(Object.keys(configuracion).length > 0)
					extend(true, organizado, organizado, {configuracion:configuracion})
				
				/* OBD */
				var obd = {}
				// obdOdometro
				this.controlExisteFusion(obd, procesar, "obdOdometro")
				// obdCombustible
				this.controlExisteFusion(obd, procesar, "obdCombustible")
				// obdVelocidad
				this.controlExisteFusion(obd, procesar, "obdVelocidad")
				// obdRendimientoInactivo
				this.controlExisteFusion(obd, procesar, "obdRendimientoInactivo")
				// obdTemperaturaMotor
				this.controlExisteFusion(obd, procesar, "obdTemperaturaMotor")
				// obdPresionAceite
				this.controlExisteFusion(obd, procesar, "obdPresionAceite")
				// obdRPM
				this.controlExisteFusion(obd, procesar, "obdRPM")
				// obdCruseroTiempo
				this.controlExisteFusion(obd, procesar, "obdCruseroTiempo")
				// obdDTC.[0~N]
				this.controlExisteFusion(obd, procesar, "obdDTC")
				// obdRelantiTiempo
				this.controlExisteFusion(obd, procesar, "obdRelantiTiempo")
				// obdRendimiento
				this.controlExisteFusion(obd, procesar, "obdRendimiento")
				// Guardar
				if(Object.keys(obd).length > 0)
					extend(true, organizado, organizado, {obd:obd})
				
				/* OBD o ECU */
				var estadoviaje = {}
				// horasManejando
				this.controlExisteFusion(estadoviaje, procesar, "horasManejando")
				// dpaAutoCalibrado
				this.controlExisteFusion(estadoviaje, procesar, "dpaAutoCalibrado")
				// dpaAccX
				this.controlExisteFusion(estadoviaje, procesar, "dpaAccX")
				// dpaAccY
				this.controlExisteFusion(estadoviaje, procesar, "dpaAccY")
				// dpaAccZ
				this.controlExisteFusion(estadoviaje, procesar, "dpaAccZ")
				// Guardar
				if(Object.keys(estadoviaje).length > 0)
					extend(true, organizado, organizado, {estadoviaje:estadoviaje})
			
				/* Drivers ID */
				var driverids = {}
				// driverID
				this.controlExisteFusion(driverids, procesar, "driverID")
				// driverIDReg
				this.controlExisteFusion(driverids, procesar, "driverIDReg")
				// Guardar
				if(Object.keys(driverids).length > 0)
					extend(true, organizado, organizado, {driverids:driverids})
			
				/* I/O Raw (ioraw) */
				var ioraw = {}
				//tempID.[0~N]
				this.controlExisteFusion(ioraw, procesar, "tempID")
				// Guardar
				if(Object.keys(ioraw).length > 0)
					extend(true, organizado, organizado, {ioraw:ioraw})
				
				/* Reporte de Viaje (reporteviaje) */
				var reporteviaje = {}
				// travelReportInfo
				this.controlExisteFusion(reporteviaje, procesar, "travelReportInfo")
				// travelReportDatos
				this.controlExisteFusion(reporteviaje, procesar, "travelReportDatos")
				// Guardar
				if(Object.keys(reporteviaje).length > 0)
					extend(true, organizado, organizado, {reporteviaje:reporteviaje})
			
				/* RS232 (rs232) */
				var rs232 = {}
				// RSMensaje
				this.controlExisteFusion(rs232, procesar, "RSMensaje")
				// RSCodeMensaje
				this.controlExisteFusion(rs232, procesar, "RSCodeMensaje")
				// RSRegistro
				this.controlExisteFusion(rs232, procesar, "RSRegistro")
				// RSBaud
				this.controlExisteFusion(rs232, procesar, "RSBaud")
				// Guardar
				if(Object.keys(rs232).length > 0)
					extend(true, organizado, organizado, {rs232:rs232})
			
				/* CMD Comandos (cmd) */
				var cmd = {}
				// CMDMensaje
				this.controlExisteFusion(cmd, procesar, "CMDMensaje")
				// CMDRegistro
				this.controlExisteFusion(cmd, procesar, "CMDRegistro")
				// CMDEncode
				this.controlExisteFusion(cmd, procesar, "CMDEncode")
				// CMDBanderaSerial
				this.controlExisteFusion(cmd, procesar, "CMDBanderaSerial")
				// Guardar
				if(Object.keys(cmd).length > 0)
					extend(true, organizado, organizado, {cmd:cmd})
				
				/* SIM & Network (network) */
				var network = {}
				// iccid
				this.controlExisteFusion(network, procesar, "iccid")
				// imsi
				this.controlExisteFusion(network, procesar, "imsi")
				// networkName
				this.controlExisteFusion(network, procesar, "networkName")
				// accessTecnologic
				this.controlExisteFusion(network, procesar, "accessTecnologic")
				// bandName
				this.controlExisteFusion(network, procesar, "bandName")
				// Guardar
				if(Object.keys(network).length > 0)
					extend(true, organizado, organizado, {network:network})
			
				/* I/O Bluetooth (iobluetooth) */
				var iobluetooth = {}
				// bleIO
				this.controlExisteFusion(iobluetooth, procesar, "bleIO")
				// Guardar
				if(Object.keys(iobluetooth).length > 0)
					extend(true, organizado, organizado, {iobluetooth:iobluetooth})
			
				return organizado
			},
		controlExisteFusion: function(arreglo, predatos, llaves)
			{
				var llavesArray = llaves.split('.')
				if(predatos[llavesArray[llavesArray.length-1]] == null)
					return
				if(llavesArray.length == 1)
					return extend(true, arreglo, arreglo, {[llaves]:predatos[llaves]})
				// Mas lvl en las llaves
				var llavesCount = llavesArray.length
				var jsonString = '{'
				// graba lvl
				for(var i_llave in llavesArray){
					var llaveSelect = llavesArray[i_llave]
					if (!--llavesCount){
						jsonString = jsonString.slice(0,-1)
						jsonString += (isNaN(predatos[llavesArray[llavesArray.length-1]])?'"'+predatos[llavesArray[llavesArray.length-1]]+'"':predatos[llavesArray[llavesArray.length-1]])
						for(var i_llaveOther in llavesArray){
							if(i_llaveOther < (llavesArray.length-1))
								jsonString += '}'
						}
					}else{
						jsonString += '"'+llaveSelect+'"' + ':{'
					}
				}
				try{
					var agregarArragelo = JSON.parse(jsonString)
					extend(true, arreglo, arreglo, agregarArragelo)
				}catch(error){
					this.LogError('Error codificar JSON', error)
					return
				}
				
			}
	}