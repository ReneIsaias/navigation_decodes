module.exports = {
	lista_marcas:{
		topflytech:
			[
				{marca:'topflytech', modelo:'TLW1', submodelo:'TLW1 Series', identificador:'2525', idDecode:0},
				{marca:'topflytech', modelo:'TLD1', submodelo:'TLD1-A', identificador:'2626', idDecode:1},
				{marca:'topflytech', modelo:'TLP1', submodelo:'TLP1-LM', identificador:'2727', idDecode:2}
			],
		suntech:
		[
			{marca:'suntech', modelo:'ST600', submodelo:'ST600?', identificador:'5354363030', idDecode:10},
			{marca:'suntech', modelo:'ST300', submodelo:'ST300?', identificador:'5354333030', idDecode:11},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5354543b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'414c543b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'414c563b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5545583b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5452563b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5245533b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5245513b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5250523b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'4552523b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5250523b', idDecode:12},
			{marca:'suntech', modelo:'Universal', submodelo:'ST?', identificador:'5252453b', idDecode:12}
		],
		concox:
		[
			{marca:'concox', modelo:'AT6', submodelo:'AT6', identificador:'7878', idDecode:100},
			{marca:'concox', modelo:'AT6', submodelo:'AT6', identificador:'7979', idDecode:100}
		]
	},
	detectar: function (data) {
		var gps = {}
		gps.bufferData = []
		gps.cmdSend = false
		if(Buffer.isBuffer(data)){ // HEX
			var buffer = Buffer.from(data, 'hex')
			var identificador
			if(identificador = buffer.slice(0,5).toString('hex')){
				var findModelo = false
				
				// Check Topflytech
				if(!findModelo)
					identificador = buffer.slice(0,2).toString('hex')
				for(var i_modelo in this.lista_marcas.topflytech){
					var modelo = this.lista_marcas.topflytech[i_modelo]
					if(modelo.identificador == identificador){
						var paquete = buffer.slice(3,5).readInt16BE(0)
						var paqueteCount = (buffer.toString('hex').length / 2)
						findModelo = true
						if(paquete != paqueteCount){
							//console.log('Unidad con mas data', buffer.toString('hex'))
							var arrayData = []
							var cuenta = 0
							//buffer.slice(67,68)
							var IniCount = {0:3,1:5}
							var paqueteIni = buffer.slice(IniCount[0],IniCount[1]).readInt16BE(0)
							while(cuenta<paqueteCount){
								//console.log('Cuenta:'+cuenta)
								//console.log('paqueteIni:'+paqueteIni)
								var extracionBuffer = Buffer.from(buffer.slice(cuenta,paqueteIni), 'hex')
								//console.log('extracionBuffer', extracionBuffer)
								
								var paqueteContable = extracionBuffer.slice(3,5).readInt16BE(0)
								if(paqueteContable == (extracionBuffer.toString('hex').length / 2)){
									var dataSingle = 
									{
										modelo:modelo,
										data:extracionBuffer
									}
									gps.bufferData.push(dataSingle)
									cuenta = cuenta + paqueteContable
									paqueteIni += paqueteContable
								}else{
									cuenta = paqueteCount + 1
								}
							}
							
						}else{
							var dataSingle = 
								{
									modelo:modelo,
									data:buffer
								}
							gps.bufferData.push(dataSingle)
						}
					}
				}
					
				// Check Suntech
				if(!findModelo)
					identificador = buffer.slice(0,5).toString('hex')
				for(var i_modelo in this.lista_marcas.suntech){
					if(findModelo)
						continue
					var modelo = this.lista_marcas.suntech[i_modelo]
					if(modelo.identificador == identificador){
						var paquete = buffer.toString('hex')
						paquete = paquete.split("0d")
						delete paquete[(paquete.length - 1)]
						findModelo = true
						if(paquete.length != 1){
							for(var i_paquete in paquete){
								var dataSingle = 
								{
									modelo:modelo,
									data:paquete[i_paquete]
								}
								gps.bufferData.push(dataSingle) 
							}
						}else{
							var dataSingle = 
								{
									modelo:modelo,
									data:paquete
								}
							gps.bufferData.push(dataSingle)
						}
					}
				}
				
				// Check Suntech Universal
				if(!findModelo)
					identificador = buffer.slice(0,4).toString('hex')
				for(var i_modelo in this.lista_marcas.suntech){
					if(findModelo)
						continue
					var modelo = this.lista_marcas.suntech[i_modelo]
					if(modelo.identificador == identificador){
						var paquete = buffer.toString('hex')
						paquete = paquete.split("0d")
						delete paquete[(paquete.length - 1)]
						findModelo = true
						if(paquete.length != 1){
							for(var i_paquete in paquete){
								var dataSingle = 
								{
									modelo:modelo,
									data:paquete[i_paquete]
								}
								gps.bufferData.push(dataSingle) 
							}
						}else{
							var dataSingle = 
								{
									modelo:modelo,
									data:paquete
								}
							gps.bufferData.push(dataSingle)
						}
					}
				}
				
				// Check Concox
				if(!findModelo)
					identificador = buffer.slice(0,2).toString('hex')
				for(var i_modelo in this.lista_marcas.concox){
					var modelo = this.lista_marcas.concox[i_modelo]
					if(modelo.identificador == identificador){
						var paquete = 0
						if(identificador == '7979'){
							paquete = buffer.slice(2,4).readUInt16BE(0)
							paquete = paquete + 6
						}else{
							paquete = buffer.slice(2,3).readInt8(0)
							paquete = paquete + 5
						}
						var paqueteCount = (buffer.toString('hex').length / 2)
						findModelo = true
						if(paquete != paqueteCount){
							//console.log('Paquete no concuerda')
							//console.log('Unidad con mas data', buffer.toString('hex'))
							var arrayData = []
							var cuenta = 0
							//buffer.slice(67,68)
							var IniCount = {0:3,1:5}
							var separadosS = buffer.toString('hex').split("0d0a")
							delete separadosS[(separadosS.length - 1)]
							if(separadosS.length != 1){
								for(var i_paquete in separadosS){
									var superbuffer = Buffer.from(separadosS[i_paquete]+"0d0a", 'hex')
									var dataSingle = 
									{
										modelo:modelo,
										data:superbuffer
									}
									gps.bufferData.push(dataSingle) 
								}
							}
							
							//console.log('separados', separadosS)
							// var paqueteIni = buffer.slice(IniCount[0],IniCount[1]).readInt16BE(0)
							// while(cuenta<paqueteCount){
							// 	//console.log('Cuenta:'+cuenta)
							// 	//console.log('paqueteIni:'+paqueteIni)
							// 	var extracionBuffer = Buffer.from(buffer.slice(cuenta,paqueteIni), 'hex')
							// 	//console.log('extracionBuffer', extracionBuffer)
							// 	var paqueteContable
							// 	var paqueteContableidentificador = extracionBuffer.slice(0,2).toString('hex')
							// 	
							// 	if(paqueteContableidentificador == '7979'){
							// 		paqueteContable = extracionBuffer.slice(2,4).readUInt16BE(0)
							// 		paqueteContable = paquete + 6
							// 	}else{
							// 		paqueteContable = extracionBuffer.slice(2,3).readInt8(0)
							// 		paqueteContable = paquete + 5
							// 	}
							// 	
							// 	if(paqueteContable == (extracionBuffer.toString('hex').length / 2)){
							// 		var dataSingle = 
							// 		{
							// 			modelo:modelo,
							// 			data:extracionBuffer
							// 		}
							// 		gps.bufferData.push(dataSingle)
							// 		cuenta = cuenta + paqueteContable
							// 		paqueteIni += paqueteContable
							// 	}else{
							// 		cuenta = paqueteCount + 1
							// 	}
							// }
							
							//console.log('gps.bufferData', gps.bufferData)
						}else{
							var dataSingle = 
								{
									modelo:modelo,
									data:buffer
								}
							gps.bufferData.push(dataSingle)
						}
					}
				}	
				
			}else{
				
			}
		}else{
			
		}
		if(gps.bufferData.length == 0){
			gps.error = 'Modelo de GPS no registrado'
			var buffera = Buffer.from(data, 'hex')
			gps.crudostring = buffera.toString('hex')
		}
		return gps
	}
}