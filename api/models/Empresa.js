/**
 * Empresa.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    titulo:{
      type: 'string',
      required: true
    },
    slug:{
      type: 'string',
      required: true
    },
    nit:{
      type: 'string'
    },
    descripcion:{
      type: 'string'
    },
    urlRespuesta:{
      type: 'string'
    },
    urlConfirmacion:{
      type: 'string',
      required: true
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activa, 1 Aprobado,
    },
  },

};

