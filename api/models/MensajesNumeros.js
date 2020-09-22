/**
 * MensajesNumeros.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    numerosPendientes:{
      type: 'json'
    },
    numerosCompletados:{
      type: 'json'
    },
    cantidadEnviados:{
      type: 'number'
    },
    estado:{
      type: 'number',
      defaultsTo: 0 // 0 activo 1 completado 2 pausado 3 cancelado
    },
    mensaje:{
      model: 'mensajes',
      required: true
    }

  },

};

