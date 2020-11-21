/**
 * MensajesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
const _ = require('lodash');

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(Mensajes,params);
    console.log("*** params", params );
    for( let row of resultado.data ){
        if( row.creado ) row.creado  = await User.findOne( { id: row.creado } ).populate('rol');
        if( row.empresa ) row.empresa = await Empresa.findOne( { id: row.empresa });
    }
    console.log( "********Cantidad mensaje", resultado.data.length );
    return res.ok( { status: 200, ...resultado } );
}

Procedures.create = async(req, res)=>{
    const params = req.allParams();
    const params2 = req.allParams();
    let resultado = Object();
    resultado = await Procedures.creandoMensaje( params );
    if( !params2.programado ) MensajesServices.procesoSiguiente( params2, resultado );
    resultado = { status: 200, data: resultado };
    return res.status( resultado.status ).send( resultado );
}

Procedures.renvio = async( req, res )=>{
    const params = req.allParams();
    const params2 = req.allParams();
    let resultado = Object();
    resultado = await Mensajes.findOne( { id: params.id });
    if( !resultado ) return res.status(400).send( { status: 400, data: "Error mensaje no encontrado "});
    MensajesServices.procesoSiguiente( params2, resultado );
    resultado = { status: 200, data: resultado };
    return res.status( resultado.status ).send( resultado );
}

Procedures.creandoMensaje = async(data)=>{
    let resultado = Object();
    resultado = await Mensajes.create( data ).fetch();
    resultado = await Mensajes.findOne({ id: resultado.id }).populate('empresa');
    return resultado;
}

Procedures.probando = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    Mailer.sendWelcomeMail({ text: "Hello", descripcion: "jose pruebas", subject: "joseeduar147@gmail.com" });
    res.status(200).send({ status: 200, data: "OK"})
}


Procedures.getPlataformas = async( req, res )=>{
    let params = req.allParams();
    let resultado = Object();
    console.log("**** params getPlatform", params);
    
    resultado = await RequestServices.get(  params.url, 1);
    if(!resultado) return resultado;
    //validando si ya creo el mensajeNumeros
    let validando = await Procedures.validandoMensajes( { id: params.id });
    console.log("**** validador", validando);
    if( !validando ) {
        let listPaginado = await MensajesServices.getUrlPlatform( resultado.count, params.url );
        console.log( "*****+++++", listPaginado.length );
        resultado = await Procedures.creandoMensajesNumeros( { id: params.id, cantidadLista: params.cantidadLista || 1 }, listPaginado );
    }
    resultado = await MensajesNumeros.find( { mensaje: params.id }).limit( 1000 );
    let mensajes = await Mensajes.find( { id: params.id });
    mensajes = mensajes[0];
    console.log("***total", resultado.length );
    return res.status(200).send( { status: 200, data: { mensaje: mensajes, listaMensaje: resultado } });
    /*let numeros = await Procedures.transFormarEmail( listPaginado );
    await Mensajes.update( { id: params.id }, { emails: numeros })
    console.log("************cantidad encontrado *****************", listPaginado.length );
    return res.status(200).send( { status: 200, data: listPaginado });
    */

}

Procedures.validandoMensajes = async( data )=>{
    let resultado = Object();
    resultado = await MensajesNumeros.find( { mensaje: data.id });
    resultado = resultado[0];
    if( resultado ) return true;
    else return false;
}

Procedures.creandoMensajesNumeros = async( data, lista )=>{
    for( let row of lista ) { if( !row.usu_telefono ) row.usu_telefono = row.celular }
    // console.log( lista );
    lista = _.unionBy( lista || [], lista, 'usu_telefono' );
    let cantidadLista = Number( lista.length ) / Number( data.cantidadLista  || 0 );
    cantidadLista = parseInt( cantidadLista );
    let contado = 1;
    let armando = [];
    let dataFinix = [];
    let index = 0;
    console.log("****", cantidadLista, lista.length)
    for( let row of lista ){
        index++;
        if( ( contado == cantidadLista ) ) {
            contado = 1;
            armando.push( { username: row.usu_nombre || row.name, telefono: row.usu_telefono || row.celular });
            dataFinix.push( { numerosPendientes: armando, mensaje: data.id } );
            armando = [];
        }else {
            contado++;
            armando.push( { username: row.usu_nombre || row.name, telefono: row.usu_telefono || row.celular });
            if( lista.length == index ) dataFinix.push( { numerosPendientes: armando, mensaje: data.id } );
        }
    }
    console.log("*** final", dataFinix.length );
    for( let row of dataFinix ){
        await MensajesNumeros.create( { numerosPendientes: row.numerosPendientes, mensaje: row.mensaje });
    }
    return "ok";
}

Procedures.transFormarEmail = async( lista = [] )=>{
    let obj = "";
    let formatiando = [];
    for( let row of lista ) formatiando.push( ( row.usu_indicativo || 57 ) + ( row.usu_telefono || row.celular ) );
    if( Object.keys(formatiando).length > 0 ) obj = formatiando.join();
    return obj;
}

module.exports = Procedures;
