var jwt = require('jsonwebtoken');
const _ = require('lodash');

let Procedures = Object();
let Storage = Array();
Procedures.leer = async( )=>{
    return Storage;
}

Procedures.read = async( id )=>{
    let filtro = Storage.find( row => row.id == id );
    return filtro || {};
}

Procedures.guardar = async( data )=>{
    // let filtro = Storage.find( row => row.user == data.user );
    let filtro = _.findIndex( Storage, [ 'user', data.user ]);
    if( filtro >= 0 ) Storage[filtro] = data;
    else Storage.push( data );
}

Procedures.eliminar = async( id )=>{
    let filtro = Storage.filter( row => row.id !== id );
    Storage = filtro;
    return filtro;
}

Procedures.editar = async( data, id )=>{
    let filtro = _.findIndex( Storage, [ 'id', id ]);
    if( filtro >= 0 ) return Storage[filtro] = data;
    else return "Error al actualizar";
}

Procedures.validar = async( token ) =>{
    if(!token) return { status:400, data: "Es necesario el token de autenticación" };

    token = token.replace('Bearer ', '');
    //console.log( token , "********", Storage );
    let filtro = Storage.find( row => row.tokens == token );
    if( !filtro ) return { status:401, data: "Token inválido" };


    return new  Promise( resolve =>{
        jwt.verify(token, 'Secret Password', function(err, user) {
            if (err) return resolve({ status:401, data: "Token inválido" });
            else return resolve({ status: 200, data: "Awwwww yeah!!!!" });
        })
    })
}

module.exports = Procedures;