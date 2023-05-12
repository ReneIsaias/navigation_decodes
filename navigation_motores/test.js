/*var extend = require('extend')

var controlExisteFusion = function(arreglo, predatos, llave)
{
	var llavesplit = llave.split('.')
	if( predatos[llavesplit[llavesplit.length-1]] == null)// revisa si el contenido esta vacio
		return
	if(llavesplit.length == 1)
		return extend(true, arreglo, arreglo, {[llave]:predatos[llave]})
	
	let lastcount = llavesplit.length
	var stringjson = '{'
	for(var llav in llavesplit){
		var llaveLoad = llavesplit[llav]
		if (!--lastcount){
			stringjson = stringjson.slice(0,-1)
			stringjson += (isNaN(predatos[llavesplit[llavesplit.length-1]])?'"'+predatos[llavesplit[llavesplit.length-1]]+'"':predatos[llavesplit[llavesplit.length-1]])
			for(var countLlaves in llavesplit){
				if(countLlaves < (llavesplit.length-1))
					stringjson += '}'
			}
		}else{
			stringjson += '"'+llaveLoad+'"' + ':{'
		}
	}
	try{
		var agregarArragelo = JSON.parse(stringjson)
		extend(true, arreglo, arreglo, agregarArragelo)
	}catch(error){
		console.log('Error Json parse', error)
	}
}

var gps = {
	protocolo:'indexprotocolo'
}
var llaves = "intervaloReporte.intervaloRepIngOn.intervaloRepIngOn"
var predatose = 
	{
		intervaloRepIngOn:10
	}
controlExisteFusion(gps, predatose, llaves)
console.log('Paso 1', gps)
*/
var moment = require('moment')
var fechaNow = moment()
var fechaMax = moment().add(1, 'days')
var fechaMin = moment().subtract(1, 'years')

var fechaNormal = moment('2021-11-13T01:59:21.000+00:00')
var fechaFutura = moment('2080-01-06T01:59:21.000+00:00')
var fechaPasada = moment('2017-01-06T01:59:21.000+00:00')

console.log('Moment default: ', fechaNow)
console.log('Moment Maximo: ', fechaMax)
console.log('Moment Minimo: ', fechaMin)
console.log('-----------------')
console.log('Moment Normal: ', fechaNormal)
console.log('Moment Pasada: ', fechaPasada)
console.log('Moment Futura: ', fechaFutura)
console.log('-----------------')
console.log('-----------------')
var registro = new Date(fechaNow)
console.log('NOW: ', fechaNow)
console.log('Registro', registro)
var registroMoment = moment(registro)
console.log('Registromoment', registroMoment)

function controlFechas(fecha){
	var fechaMax = moment().add(1, 'days')
	var fechaMin = moment().subtract(1, 'years')
	if(fechaMax < fecha)
		return {titulo:'Fecha maxima alcanzada: ', date:fecha}
	if(fechaMin > fecha)
		return {titulo:'Fecha minima alcanzada: ', date:fecha}
	return {titulo:'Fecha normal: ', date:fecha}
}

var fechaA = controlFechas(fechaNormal)
console.log(fechaA.titulo, fechaA.date) // Normal

var fechaB = controlFechas(fechaFutura)
console.log(fechaB.titulo, fechaB.date) // Futura

var fechaC = controlFechas(fechaPasada)
console.log(fechaC.titulo, fechaC.date) // Pasada