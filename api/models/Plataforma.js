/**
 * Plataforma.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    tipo:{
      type: 'string'
    },
    estado:{
      type: 'integer',
      defaultsTo: 0 // 0 activa, 1 Aprobado,
    },

  },

};

