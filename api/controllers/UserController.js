/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Procedures = Object();
const Passwords = require('machinepack-passwords');
var jwt = require('jsonwebtoken');

Procedures.register = async(req, res)=>{
    let
        params = req.allParams()
    ;
  // sails.log.info(26, params);
  if((params.password !== params.confirpassword) && (!params.username && !params.email)) return res.ok({status: 400, data: "error en el envio de los datos"});
    //   Validando si existe  el usuario
  let user = await User.findOne({where:{username: params.username}});
  if(user) return res.ok({status: 400, data: "error el username ya se encuentra registrado"});
    //   Validando la Contraseña
  let password = await Procedures.encryptedPassword(params.password);
  if(!password) return res.serverError("password Error");
  params.password = password;
    //   Codigo
  function codigo(){return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();}
    //   Rol
  let rol = await Rol.findOne({nombre: params.rol || "usuario"});
  if(!rol) {
    rol = await Rol.create({nombre: params.rol || "usuario",descripcion: "rol del usuario"}).fetch();
    if(!rol) return res.ok({status: 400, data: "error al crear el rol"});
  }
  params.rol = rol.id;
  params.codigo = codigo();
  user = await User.create(params).fetch();
  if(!user) return res.badRequest(err);
  let tokens = await Procedures.creacionTokens( user );
  resulado.tokens = tokens;
  return res.ok({ status: 200, data: user });
}

Procedures.encryptedPassword = (password) =>{
    return new Promise(resolve=>{
        Passwords.encryptPassword({
            password: password,
          }).exec({
            error: function (err){
              resolve(false)
            },
            success: function (password) {
              resolve(password);

            }
        });
    })

}
Procedures.login = async(req, res)=>{
    let param = req.allParams();
    let resulado = Object();
    // Buscando el usuario
    resulado = await User.findOne({where:{email: param.email}}).populate("rol").populate("empresa");
    if(!resulado) return res.send({'success': false,'data': 'Usuario no encontrado','data': resulado});
    // chequiando el password
    let password = await Procedures.chequearPassword(param, resulado);
    if(!password) return res.send({'success': false,'data': 'Contraseña incorrecta'});
    resulado.password = '';
    let tokens = await Procedures.creacionTokens( resulado );
    resulado.tokens = tokens;
    return res.send({
    'success': true,
    'data': 'Peticion realizada',
    'data': resulado
    });
}

Procedures.creacionTokens = async( data )=>{
  let tokenData = {
    username: data.email,
    id: data.id
  };
  return new Promise( async( resolve ) => {
    let token = jwt.sign( tokenData, 'Secret Password', { expiresIn: 60 * 60 * 24 /*expires in 24 hours */ });
    await Cache.guardar( { user: data.id, rol: data.rol, tokens: token } );
    return resolve( token );
  })
}

Procedures.chequearPassword = async(param, user)=>{
    return new Promise(resolve=>{
        Passwords.checkPassword({
            passwordAttempt: param.password,
            encryptedPassword: user.password,
            }).exec({
            error: function (err) {
                resolve({status: 400, data: "Eror del servidor"});
            },
            incorrect: function () {
                resolve({status: 400, data: "Contraseña incorrecta"});
            },
            success: function () {
                resolve({status: 200, data: "Peticion realizada"});
            },
            });
    })
}

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    // console.log("***********", await Cache.leer() );
    resultado = await QuerysServices(User,params);
    return res.ok( { status: 200, ...resultado } );
}

module.exports = Procedures;