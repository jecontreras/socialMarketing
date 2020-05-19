/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /empresas/querys': 'EmpresasController.querys',
  'POST /user/querys': 'UserController.querys',
  'POST /user/register': 'UserController.register',
  'POST /user/login': 'UserController.login',
  'POST /rol/querys': 'RolController.querys',
  'POST /pais/querys': 'PaisController.querys',
  'POST /archivos/querys': 'ArchivosController.querys',
  'POST /mensajes/querys': 'MensajesController.querys',
  'POST /empresa/querys': 'EmpresaController.querys',
  'POST /mensajes/probando': 'MensajesController.procesoLocomproaqui',
  'POST /mensajes/create': 'MensajesController.create',
  'POST /mensajes/renvio': 'MensajesController.renvio',
  'POST /mensajes/getPlataformas': 'MensajesController.getPlataformas',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
