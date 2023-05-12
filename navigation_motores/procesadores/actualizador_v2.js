// Sistema de procesamiento A
// Navigation
// Josafat Vargas O.
module.exports = 
	{
		entorno:
			{
				tools:null,
				db:null,
				moment:null
			},
		init: function(tools, db, moment)
			{
				this.entorno.tools = tools
				this.entorno.db = db
				this.entorno.moment = moment
				
			},
		procesa: async function(predatos)
			{
				try{
					var unidadesColl =  this.entorno.db.collection('unidades')
					var opcionesQuery = {limit:1}
					var resultado = await unidadesColl.findOne({'gps.unitid':predatos.unitid}, opcionesQuery)
					var returnProcesado = {procesado:null, unidadid:null, unidad:null}
					this.reprocesarFecha(predatos)
					if(resultado==null){
						var preRegistro = await this.nuevaUnidad(predatos.procesar)
						returnProcesado.unidadid = preRegistro.unidadid
						returnProcesado.unidad = preRegistro.info
						returnProcesado.procesado = preRegistro.info
					}else{
						var preRegistro = await this.registradaUnidad(predatos.procesar, resultado)
						returnProcesado.unidadid = preRegistro.unidadid
						returnProcesado.unidad = preRegistro.unidad
						returnProcesado.procesado = preRegistro.info
					}
					 
					return returnProcesado
				}catch(error){
					return {error:error}
				}
			},
		nuevaUnidad: async function(procesar)
			{
				var returnProcesado = {info:null, unidadid:null}
				returnProcesado.info = this.entorno.tools.organizarInformacion(0, procesar)
				try{
					var unidadesColl =  this.entorno.db.collection('unidades')
					var nuevaUnidad = await unidadesColl.insertOne(returnProcesado.info)
					this.entorno.tools.LogInfo('Unidad nueva registrada (System)', nuevaUnidad.insertedId)
					returnProcesado.unidadid = nuevaUnidad.insertedId
				}catch(error){
					this.entorno.tools.LogError('Error al registrar la unidad', error)
					return null
				}
				return returnProcesado
			},
		registradaUnidad: async function(procesar, unidad)
			{
				var returnProcesado = {info:null, unidadid:null}
				returnProcesado.info = this.entorno.tools.organizarInformacion(1, procesar, unidad)
				try{
					// Comparación de fechas
					var dateRegNuevo = this.entorno.moment(returnProcesado.info.gps.registro)
					var dateRegAnterior = this.entorno.moment(unidad.gps.registro)
					if(dateRegAnterior < dateRegNuevo){
						var filtro = {_id:unidad._id}
						var opciones = { multi: true }
						var unidadesColl =  this.entorno.db.collection('unidades')
						var actualizaUnidad = await unidadesColl.findOneAndUpdate(filtro, [{"$addFields": returnProcesado.info}], opciones)
						returnProcesado.info = actualizaUnidad.value
					}
					returnProcesado.unidad = returnProcesado.info
					returnProcesado.unidadid = unidad._id
				}catch(error){
					this.entorno.tools.LogError('Error al actualizar la unidad', error)
					return null
				}
				return returnProcesado
			},
		reprocesarFecha: function(predatos)
			{
				if(predatos.procesar == null)
					return
				// Revisando registro
				predatos.procesar.registro = this.entorno.tools.resetFecha(predatos.procesar.registro)
				// Revisando lbsRegistro
				if(predatos.procesar.lbsRegistro != null)
					predatos.procesar.lbsRegistro = this.entorno.tools.resetFecha(predatos.procesar.lbsRegistro)
				// Revisando resetFactoryRegistro
				if(predatos.procesar.resetFactoryRegistro != null)
					predatos.procesar.resetFactoryRegistro = this.entorno.tools.resetFecha(predatos.procesar.resetFactoryRegistro)
				// Revisando reinicioRegistro
				if(predatos.procesar.reinicioRegistro != null)
					predatos.procesar.reinicioRegistro = this.entorno.tools.resetFecha(predatos.procesar.reinicioRegistro)
				// Revisando RSRegistro
				if(predatos.procesar.RSRegistro != null)
					predatos.procesar.RSRegistro = this.entorno.tools.resetFecha(predatos.procesar.RSRegistro)
				// Revisando CMDRegistro
				if(predatos.procesar.CMDRegistro != null)
					predatos.procesar.CMDRegistro = this.entorno.tools.resetFecha(predatos.procesar.CMDRegistro)
			},
	}