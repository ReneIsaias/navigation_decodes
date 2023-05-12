// Sistema de procesamiento A
// Navigation
// Josafat Vargas O.
module.exports = 
	{
		entorno:
			{
				tools:null,
				db:null,
				moment:null,
				geotools:null
			},
		init: function(tools, db, moment, geotools)
			{
				this.entorno.tools = tools
				this.entorno.db = db
				this.entorno.moment = moment
				this.entorno.geotools = geotools
				
			},
		procesa: async function(predatos)
			{
				try{
					// Validad que exista información
					if(predatos.unidad == null && predatos.procesado == null)
						return predatos
					// Validad que tenga la unidad PDI y Geo
					if(predatos.unidad.geocercas == null)
						return predatos
					// Validad que tenga una latitud y longitud valida
					if(predatos.procesado.rastreo == null)
						return predatos
					if(predatos.procesado.rastreo.latitud == null && predatos.procesado.rastreo.longitud == null)
						return predatos
					// procesar geocercas
					for(var i_geocerca in predatos.unidad.geocercas){
						var geocerca = predatos.unidad.geocercas[i_geocerca]
						if(geocerca.activo == false)
							continue
						switch (geocerca.tipo) 
							{
								case 1: // Punto de interes 
									{
										var puntoLatLng = [predatos.procesado.rastreo.latitud, predatos.procesado.rastreo.longitud]
										var puntoEstado = this.entorno.geotools.insideCircle(puntoCheck, geocerca.punto, geocerca.radio)
										var geocercaEstado = this.manejaEstadoGeocerca(geocerca.estado, puntoEstado, geocerca)
										if(geocercaEstado != null){ // Grabar actividad
											this.grabarActividadGeocerca(predatos, geocercaEstado)
										}
									}
								break
								case 2: // Poligonal 
									{
										var puntoLatLng = [predatos.procesado.rastreo.latitud, predatos.procesado.rastreo.longitud]
										var puntoEstado = this.entorno.geotools.insidePolygon(puntoCheck, geocerca.puntos, geocerca.radio)
										var geocercaEstado = this.manejaEstadoGeocerca(geocerca.estado, puntoEstado, geocerca)
										if(geocercaEstado != null){ // Grabar actividad
											this.grabarActividadGeocerca(predatos, geocercaEstado)
										}
									}
								break
								default:
									continue
							}
					}
					var proceso = predatos
					if(predatos.updateGeo != null)
						proceso = await updateGeocercaUnidad(predatos)
					return proceso
				}catch(error){
					return {error:error}
				}
			},
		manejaEstadoGeocerca: function(estado, estadoActual, geocerca)
			{
				// Clasificar su estado
				// Tipos de estado
				// 1: fuera
				// 2: entrando
				// 3: dentro
				// 4: saliendo
				if(estadoActual){ // Dentro
					// revisar si estaba dentro anteriormente
					if(estado)
						return {geocerca:geocerca, tipo:3} // Sin actividad
					geocerca.estado = true
					geocerca.registro = new Date(this.entorno.moment())
					return {geocerca:geocerca, tipo:2} // Con actividad
				}else{
					// revisar si estaba fuera anteriormente
					if(!estado)
						return {geocerca:geocerca, tipo:1} // Sin actividad
					geocerca.estado = false
					geocerca.registro = new Date(this.entorno.moment())
					return {geocerca:geocerca, tipo:4} // Con actividad	
				}
				
			},	
		grabarActividadGeocerca: function(predatos, geoInfo)
			{
				switch (geoInfo.tipo) {
						case 1: // No se graba en histórico y tampoco cambio de estado
						break
						case 2: // Se graba histórico y actividad 
							{
								predatos.updateGeo = true
								this.crearArrayGeocercaUnidad(predatos)
								predatos.procesado.geocercas.push(geoInfo.geocerca) // Grabar actividad para histórico
							}
						break
						case 3: // Solo se graba histórico
							{
								this.crearArrayGeocercaUnidad(predatos)
								predatos.procesado.geocercas.push(geoInfo.geocerca) // Grabar actividad para histórico
							}
						break
						case 4: // Se graba histórico y actividad 
							{
								predatos.updateGeo = true
								this.crearArrayGeocercaUnidad(predatos)
								predatos.procesado.geocercas.push(geoInfo.geocerca) // Grabar actividad para histórico
							}
						break
					}
			},
		crearArrayGeocercaUnidad: function(predatos)
			{
				if(predatos.procesado.geocercas == null)
					predatos.procesado.geocercas = []
			},
		updateGeocercaUnidad: function(predatos)
			{
				// Grabados de actividad de Geocerca actividad en la plantilla
				
				
			},
		
	}