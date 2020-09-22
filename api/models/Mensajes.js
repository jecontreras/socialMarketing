/**
 * Mensajes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    subtitulo:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    },
    emails:{
      type: 'string'
    },
    empresa:{
      model: 'empresa'
    },
    listRotador:{
      type: 'json'
    },
    rotadorMensajes:{
      type: 'boolean'
    },
    cantidadLista:{
      type: 'number'
    },
    pausar:{
      type: 'boolean'
    },
    cantidadTiempoMensaje:{
      type: 'number'
    },
    tiempoMsxPausa:{
      type: 'number'
    },
    cantidadMsxPausa:{
      type: 'number'
    },
    // usuEmails:{
    //   type: 'string'
    // },
    tipoEnvio:{
      type: 'integer',  // 0 emails , 1 plataforma , 2  whatsapp
      required: true  
    },
    creado:{
      model: 'user',
      required: true
    },
    creadoEmail:{
      type: 'string'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activa, 1 Aprobado,
    },
    programado:{
      type: 'boolean',
      defaultsTo: false
    },
    fechaEnio:{
      type: 'string'
    },
    estadoActividad:{
      type: 'boolean',
      defaultsTo: false
    },
    imagenWhat:{
      type: 'string'
    },
    cantidadEnviado:{
      type: 'integer',
      defaultsTo: 0
    }

  },

};

