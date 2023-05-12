var CRCITU16 = require('./crc16.js')
module.exports = {
	concox:{
		'AT6':{
			'identificador':'7878',
			'msn':{
				'login_message':{
					'hex': '01',
					'titulo':'Login Message',
					'protocolotipo':0
				},
				'heartbeat_message':{
					'hex': '23',
					'titulo':'Heartbeat Message',
					'protocolotipo':0
				},
				'position_message':{
					'hex': '22',
					'titulo':'Position Message',
					'protocolotipo':1
				},
				'alarm_message':{
					'hex': '26',
					'titulo':'Alarm Message',
					'protocolotipo':1
				},
				'alarm_message_fences':{
					'hex': '27',
					'titulo':'Alarm Message Fences',
					'protocolotipo':1
				},
				'alarm_message_lbs':{
					'hex': '19',
					'titulo':'Alarm Message only LBS',
					'protocolotipo':1
				},
				'comando_res':{
					'hex': '21',
					'titulo':'Resquest CMD',
					'protocolotipo':2
				}
			}
		}
	},
	tipoMensaje: function(mensaje, adicional=null){
		var traductorMensaje = 0
		switch (mensaje) {
			case 'A04':
			case 'A05':
			case 'P09':
			case 'A0A':
			case 'A0B':
			case 'A0D':
			case 'A10':
			case 'A12':
			case 'A14':
			case 'A16':
			case 'A17':
			case 'A24':
			case 'A28':
			case 'A32':
			traductorMensaje = 0
			break;
			
			case 'P01':
			traductorMensaje = 9
			break;
			
			case 'P02':
			case 'P04':
			case 'P05':
			case 'P06':
			case 'P07':
			case 'P08':
			case 'P0A':
			case 'P0D':
			case 'P0E':
			case 'P00':
			case 'A00':
			traductorMensaje = 58
			break;
			
			case 'A01':
			traductorMensaje = 3
			break;
			
			case 'A02':
			traductorMensaje = 46
			break;
			
			case 'A03':
			traductorMensaje = 123
			break;
			
			case 'A09':
			traductorMensaje = 53
			break;
			
			case 'A0C':
			traductorMensaje = 45
			break;
			
			case 'A0E':
			case 'A0F':
			case 'A15':
			case 'A19':
			traductorMensaje = 6
			break;
			
			case 'A11':
			traductorMensaje = 44
			break;
			
			case 'A13':
			traductorMensaje = 83
			break;
			
			case 'A18':
			traductorMensaje = 115
			break;
			
			case 'A20':
			traductorMensaje = 29
			break;
			
			// case 'AAAA':
			// traductorMensaje = 0
			// break;
			
			default:{
				traductorMensaje = parseFloat(mensaje)
			}
		}
		return traductorMensaje
	},
	at6: function (buffer, unitIDMotor = null) {
		var data_return = {}
		data_return.save = {}
		var paquete = 0
		//console.log('BufferSSS', buffer.toString('hex'))
		//console.log('BufferSSS', buffer.slice(0,2).toString('hex'))
		if(buffer.slice(0,2).toString('hex') == '7979'){
			paquete = buffer.slice(2,4).readUInt16BE(0)
			paquete = paquete + 6
		}else{
			paquete = buffer.slice(2,3).readInt8(0)
			paquete = paquete + 5
		}
		var paqueteCount = (buffer.toString('hex').length / 2)
		if(paquete != paqueteCount){
			data_return.error = "Error de paquete, No completo"
			console.log('Error de paquete, No completo', buffer.toString('hex'))	
			return data_return
		}
		var mensaje = ""
		if(buffer.slice(0,2).toString('hex') == '7979'){
			var mensaje = buffer.slice(4,5).toString('hex')
		}else{
			var mensaje = buffer.slice(3,4).toString('hex')
		}
		
		for(var msn_i in this.concox.AT6.msn){	
			var msn = this.concox.AT6.msn[msn_i]
			if(mensaje == msn.hex){
				if(msn.hex == '01'){
					data_return.save.unitid = String(parseInt(buffer.slice(4,12).toString('hex')))
					data_return.identificadorUnitID = parseInt(buffer.slice(4,12).toString('hex'))
				}else{
					data_return.save.unitid = unitIDMotor
				}
				data_return.save.submodeloGPS = ''
				data_return.save.marcaGPS = 'Concox'
				data_return.save.modeloGPS = 'AT6'
				data_return.save.identificadorGPS = 'AT6'
				data_return.save.motorcom = 0
				data_return.save.crudo = buffer.toString('hex')
				data_return.save.protocolomsn = msn_i
				data_return.save.protocolotipo = msn.protocolotipo
				// Variables de ayuda
				var nowDate = Date.now()
				var todayDate = new Date(nowDate)
				// Separador de mensaje
				switch (msn_i) {
					case 'login_message':{
						// Registro json
						data_return.save.tipoMensaje = this.tipoMensaje(143)
						data_return.save.serialmsn = 
						Math.floor(todayDate.getTime() / 1000)
						var registro = new Date(nowDate)
						data_return.save.registro = registro
						data_return.save.realtime = true
						data_return.save.modoReporte = data_return.save.tipoMensaje
						data_return.respuesta = this.at6Res(buffer, [16,18])
					}
					break
					case 'heartbeat_message':{
						// Registro json
						data_return.save.tipoMensaje = this.tipoMensaje(144)
						data_return.save.serialmsn = buffer.slice(10,12).readUInt16BE(0)
						var registro = new Date(nowDate)
						data_return.save.registro = registro
						data_return.save.realtime = true
						data_return.save.modoReporte = data_return.save.tipoMensaje
						data_return.respuesta = this.at6Res(buffer, [10,12])
					}
					break
					case 'position_message':{
						data_return.save.tipoMensaje = this.tipoMensaje('P'+buffer.slice(31,32).toString('hex'))
						data_return.save.serialmsn = buffer.slice(33,35).readUInt16BE(0)
						var registro = new Date(
							'20'+
							("00"+buffer.slice(4,5).readInt8(0)).slice(-2)+'-'+
							("00"+buffer.slice(5,6).readInt8(0)).slice(-2)+'-'+
							("00"+buffer.slice(6,7).readInt8(0)).slice(-2)+'T'+
							("00"+buffer.slice(7,8).readInt8(0)).slice(-2)+':'+
							("00"+buffer.slice(8,9).readInt8(0)).slice(-2)+':'+
							("00"+buffer.slice(9,10).readInt8(0)).slice(-2)
						)
						data_return.save.registro = registro
						var nosatelites = buffer.slice(10,11).toString('hex')
						data_return.save.nosatelites = parseFloat(nosatelites[1])
						var cursostatus1 = this.hex2bin(buffer.slice(20,21).toString('hex'), 8)
						var cursostatus2 = this.hex2bin(buffer.slice(21,22).toString('hex'), 8)
						var direccion = parseInt(cursostatus1[6]+""+cursostatus1[7]+""+cursostatus2[0]+""+cursostatus2[1]+""+cursostatus2[2]+""+cursostatus2[3]+""+cursostatus2[4]+""+cursostatus2[5]+""+cursostatus2[6]+""+cursostatus2[7],2)
						data_return.save.latitud = (cursostatus1[5]=="0"?-Math.abs((buffer.slice(11,15).readInt32BE(0) / 1800000)):(buffer.slice(11,15).readInt32BE(0) / 1800000))
						data_return.save.longitud = (cursostatus1[4]=="1"?-Math.abs((buffer.slice(15,19).readInt32BE(0) / 1800000)):(buffer.slice(15,19).readInt32BE(0) / 1800000))
						data_return.save.velocidad = buffer.slice(19,20).readInt8(0)
						data_return.save.direccion = direccion
						data_return.save.realtime = (cursostatus1[2]=='0'?true:false)
						data_return.save.gpsFixed = (cursostatus1[3]=='1'?true:false)
						data_return.save.entradasDigital =
						[
							(buffer.slice(30,31).toString('hex')=='00'?false:true)
						]
						data_return.save.lbsBanda = '3G'
						data_return.save.lbsRegistro = registro
						data_return.save.lbsMCC = buffer.slice(22,24).readInt16BE(0)
						data_return.save.lbsMNC = buffer.slice(24,25).readInt8(0)
						var ciDecode = "00"+buffer.slice(27,30).toString('hex')
						ciDecode = Buffer.from(ciDecode, 'hex')
						var lacDecode = buffer.slice(25,27).readInt16BE(0)
						data_return.save.lbsTowers = 
							[
								{
									LAC: lacDecode,
									CI: ciDecode.readInt32BE(0)
								}
							]
						data_return.save.modoReporte = data_return.save.tipoMensaje
						data_return.respuesta = "ok"
					}
					break
					case 'alarm_message':
					case 'alarm_message_fences':{
						data_return.save.tipoMensaje = this.tipoMensaje('A'+buffer.slice(34,35).toString('hex'))
						if(mensaje == '27'){
							data_return.save.serialmsn = buffer.slice(37,39).readUInt16BE(0)
						}else{
							data_return.save.serialmsn = buffer.slice(36,38).readUInt16BE(0)
						}
						var registro = new Date(
							'20'+
							("00"+buffer.slice(4,5).readInt8(0)).slice(-2)+'-'+
							("00"+buffer.slice(5,6).readInt8(0)).slice(-2)+'-'+
							("00"+buffer.slice(6,7).readInt8(0)).slice(-2)+'T'+
							("00"+buffer.slice(7,8).readInt8(0)).slice(-2)+':'+
							("00"+buffer.slice(8,9).readInt8(0)).slice(-2)+':'+
							("00"+buffer.slice(9,10).readInt8(0)).slice(-2)
						)
						data_return.save.registro = registro
						var nosatelites = buffer.slice(10,11).toString('hex')
						data_return.save.nosatelites = parseFloat(nosatelites[1])
						var cursostatus1 = this.hex2bin(buffer.slice(20,21).toString('hex'), 8)
						var cursostatus2 = this.hex2bin(buffer.slice(21,22).toString('hex'), 8)
						var direccion = parseInt(cursostatus1[6]+""+cursostatus1[7]+""+cursostatus2[0]+""+cursostatus2[1]+""+cursostatus2[2]+""+cursostatus2[3]+""+cursostatus2[4]+""+cursostatus2[5]+""+cursostatus2[6]+""+cursostatus2[7],2)
						data_return.save.latitud = (cursostatus1[5]=="0"?-Math.abs((buffer.slice(11,15).readInt32BE(0) / 1800000)):(buffer.slice(11,15).readInt32BE(0) / 1800000))
						data_return.save.longitud = (cursostatus1[4]=="1"?-Math.abs((buffer.slice(15,19).readInt32BE(0) / 1800000)):(buffer.slice(15,19).readInt32BE(0) / 1800000))
						data_return.save.velocidad = buffer.slice(19,20).readInt8(0)
						data_return.save.direccion = direccion
						data_return.save.realtime = (cursostatus1[2]=='0'?true:false)
						data_return.save.gpsFixed = (cursostatus1[3]=='1'?true:false)
						var terminalinfo = this.hex2bin(buffer.slice(31,32).toString('hex'), 8)
						data_return.save.entradasDigital =
						[
							(terminalinfo[7]=='0'?false:true)
						]
						var alarmInfo = terminalinfo[2]+''+terminalinfo[3]+''+terminalinfo[4]
						if(alarmInfo == '100')
							data_return.save.tipomsnExtraInfo = '(100) SOS'
						if(alarmInfo == '011')
							data_return.save.tipomsnExtraInfo = '(011) Alarma bateria baja'
						if(alarmInfo == '010')
							data_return.save.tipomsnExtraInfo = '(010) Alarma de corte de energía'
						if(alarmInfo == '001')
							data_return.save.tipomsnExtraInfo = '(001) Alarma de vibración'
							
						data_return.save.lbsBanda = '3G'
						data_return.save.lbsRegistro = registro
						data_return.save.lbsMCC = buffer.slice(23,25).readInt16BE(0)
						data_return.save.lbsMNC = buffer.slice(25,26).readInt8(0)
						var ciDecode = "00"+buffer.slice(28,31).toString('hex')
						ciDecode = Buffer.from(ciDecode, 'hex')
						var lacDecode = buffer.slice(26,28).readInt16BE(0)
						data_return.save.lbsTowers = 
							[
								{
									LAC: lacDecode,
									CI: ciDecode.readInt32BE(0)
								}
							]
						var energiaInternaLVL = parseInt(buffer.slice(32,33).toString('hex'))
						energiaInternaLVL = (energiaInternaLVL * 100) / 6
						data_return.save.energiaInternaLVL = Math.round(energiaInternaLVL)
						var senal = parseInt(buffer.slice(33,34).toString('hex'))
						senal = (senal * 100) / 4
						data_return.save.senal = Math.round(senal)
						data_return.save.modoReporte = data_return.save.tipoMensaje
						if(mensaje == '27'){
							data_return.respuesta = this.at6Res(buffer, [37,39])
						}else{
							data_return.respuesta = this.at6Res(buffer, [36,38])
						}
						
					}
					break
					case 'alarm_message_lbs':{
						data_return.save.tipoMensaje = this.tipoMensaje('A'+buffer.slice(15,17).toString('hex'))
						data_return.save.serialmsn = buffer.slice(17,19).readUInt16BE(0)
						data_return.save.registro = todayDate
						var terminalinfo = this.hex2bin(buffer.slice(12,13).toString('hex'), 8)
						data_return.save.entradasDigital =
						[
							(terminalinfo[7]=='0'?false:true)
						]
						var alarmInfo = terminalinfo[2]+''+terminalinfo[3]+''+terminalinfo[4]
						if(alarmInfo == '100')
							data_return.save.tipomsnExtraInfo = '(100) SOS'
						if(alarmInfo == '011')
							data_return.save.tipomsnExtraInfo = '(011) Alarma bateria baja'
						if(alarmInfo == '010')
							data_return.save.tipomsnExtraInfo = '(010) Alarma de corte de energía'
						if(alarmInfo == '001')
							data_return.save.tipomsnExtraInfo = '(001) Alarma de vibración'
							
						data_return.save.lbsBanda = '3G'
						data_return.save.lbsRegistro = registro
						data_return.save.lbsMCC = buffer.slice(4,6).readInt16BE(0)
						data_return.save.lbsMNC = buffer.slice(6,7).readInt8(0)
						var ciDecode = "00"+buffer.slice(9,12).toString('hex')
						ciDecode = Buffer.from(ciDecode, 'hex')
						var lacDecode = buffer.slice(7,9).readInt16BE(0)
						data_return.save.lbsTowers = 
							[
								{
									LAC: lacDecode,
									CI: ciDecode.readInt32BE(0)
								}
							]
						var energiaInternaLVL = parseInt(buffer.slice(13,14).toString('hex'))
						energiaInternaLVL = (energiaInternaLVL * 100) / 6
						data_return.save.energiaInternaLVL = Math.round(cauculoLvlVoltajeInterno)
						var senal = parseInt(buffer.slice(14,15).toString('hex'))
						senal = (senal * 100) / 4
						data_return.save.senal = Math.round(senal)
						data_return.save.modoReporte = data_return.save.tipoMensaje
						data_return.respuesta = this.at6Res(buffer, [17,19])
						
					}
					break
					case 'comando_res':{
						var limiteMensajeCMD = ((buffer.toString('hex').length / 2) - 6)
						data_return.save.tipoMensaje = this.tipoMensaje(140)
						data_return.save.serialmsn = buffer.slice(limiteMensajeCMD,(limiteMensajeCMD + 2)).readUInt16BE(0)
						data_return.save.registro = todayDate
						data_return.save.CMDBanderaSerial = buffer.slice(5,19).readInt32BE(0)
						data_return.save.CMDEncode = (buffer.slice(9,10).toString('hex')=='01'?'ASCII':'UTF16-BE')
						data_return.save.CMDRegistro = todayDate
						if(buffer.slice(9,10).toString('hex')=='01'){
							data_return.save.CMDMensaje = buffer.slice(10,limiteMensajeCMD).toString('utf8')
						}else{
							data_return.save.CMDMensaje = buffer.slice(10,limiteMensajeCMD).toString('hex')
						}
						data_return.respuesta = "OK"
					}
					break
					default:{
						data_return.save.protocolotipo = 10
						data_return.respuesta = "OK"
					}
					break
				}
			}
			
		}
		return data_return
	},
	at6Res: function (buffer, serialPos, tipo=0){
		var errorCheck = '05'+ buffer.slice(3,4).toString('hex') + buffer.slice(serialPos[0],serialPos[1]).toString('hex')
		errorCheck = CRCITU16(errorCheck)
		errorCheck = ("0000"+errorCheck.toString(16)).slice(-4)
		errorCheck = Buffer.from(errorCheck, 'hex')
		var responder = 
		buffer.slice(0,2).toString('hex') + 
		'05'+
		buffer.slice(3,4).toString('hex') +
		buffer.slice(serialPos[0],serialPos[1]).toString('hex') +
		errorCheck.toString('hex') +
		"0d0a"
		return Buffer.from(responder, 'hex')
	},
	at6CMDConfig: function(unitIDMotor = null, tipo=0){//temporal
		var tiposSMS = [
			//{msn:"736F7323", tamano:"08", tamanoCompleto:"0E"}, // DEMO
			{msn:"54494d45522c31302c313023", tamano:"10", tamanoCompleto:"18"}, // TIMER,10,10#
			{msn:"4842542c322c3223", tamano:"0C", tamanoCompleto:"14"}, // HBT,2,2#
			{msn:"44495354414e43452c32303023", tamano:"11", tamanoCompleto:"19"}, // DISTANCE,200#
			{msn:"414e474c455245502c4f4e2c33302c3523", tamano:"15", tamanoCompleto:"1D"}, // ANGLEREP,ON,30,5#
			{msn:"4d4f44452c312c3330302c33303023", tamano:"13", tamanoCompleto:"1B"}] // MODE,1,300,300#
		if(unitIDMotor == null)
			return Buffer.from("", 'hex')
		//78 78 0E 80 08 00 00 00 00 73 6F 73 23 00 01 6D 6A 0D 0A
		var cmdString = "7878"
		var tamanoMsn = 4 + (parseFloat(tiposSMS[tipo].msn.length) / 2) // 4
		var tamanoInit = 1 + 3 + tamanoMsn + 2 // 8
		// console.log('Tamaño CMD', tamanoMsn)
		// console.log('Tamaño INT', tamanoInit)
		cmdString += tiposSMS[tipo].tamanoCompleto
		cmdString += String("80")
		cmdString += tiposSMS[tipo].tamano
		cmdString += String("00000000")
		cmdString += String(tiposSMS[tipo].msn)
		cmdString += String("0001")
		cmdString += String("0001")
		// ERROR CHECK
		var errorCheck = tiposSMS[tipo].tamanoCompleto + '8000001'
		//console.log('Error Hex', errorCheck)
		//cc10
		errorCheck = CRCITU16(errorCheck)
		errorCheck = ("0000"+errorCheck.toString(16)).slice(-4)
		console.log('errorCheck:', errorCheck)
		errorCheck = Buffer.from(errorCheck, 'hex')
		cmdString += errorCheck.toString('hex') // ERROR CHECK
		cmdString += String("0D0A")
		//cmdString = "78780E800800000000736F732300016D6A0D0A"
		console.log('Comando:', tipo)
		console.log('CMD', cmdString)
		return Buffer.from(cmdString, 'hex')
	},
	hex2bin:function (hex, pad=8){
		return (parseInt(hex, 16).toString(2)).padStart(pad, '0');
	}
}