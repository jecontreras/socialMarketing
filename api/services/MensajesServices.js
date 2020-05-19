let Procedures = Object();
let urlPlataforma = String();
const moment = require('moment');
const _ = require('lodash');

Procedures.tareaMensajes = async ()=>{
    let resultado = Object();

    resultado = await Mensajes.find( { where: { programado: true, estadoActividad: false } } );
    if(Object.keys(resultado).length == 0 ) return false;
    for(let row of resultado) { 
        if( !row.fechaEnio ) continue;
        if( new moment().unix() >= new moment( row.fechaEnio ).unix() ){
            await Procedures.procesoSiguiente( { listEmails: await Procedures.armandoArray( row ), ... row }, row );
            await Mensajes.update( { id: row.id }, { estadoActividad: true } );
        }
    }
}

Procedures.armandoArray = async( data )=>{
    let lista = Array();
    for(let row of data.emails.split()) lista.push( { usu_email: row } );
    return lista;
}

Procedures.procesoSiguiente = async( params2, resultado )=>{
    if( ( params2.tipoEnvio == '0' || params2.tipoEnvio == 0 ) && params2.listEmails.length == 0 ) await Procedures.mensajeNormal( params );
    if( ( params2.tipoEnvio == '1' || params2.tipoEnvio == 1 ) && params2.listEmails.length == 0 ) await Procedures.mensajePlataforma( resultado );
    if( params2.listEmails.length > 0 ) for( let row of params2.listEmails) await Procedures.mensajeNormal( { emails: row.usu_email, descripcion: params2.descripcion, subtitulo: params2.subtitulo } );
}

Procedures.mensajeNormal = async(data)=>{
    let resultado = Object();
    resultado = await Mailer.sendWelcomeMail( { from: data.emails, text: data.descripcion ,subject: data.subtitulo });
    if( !resultado ) return resultado = { status:400, data: "Error al Crear" }
    else return resultado = { status:200, data: "Creado correcto" }
} 

Procedures.mensajePlataforma = async( data )=>{
    let resultado = Object();
    resultado = await Empresa.findOne({ id: data.empresa });
    if( !resultado ) return { status: 400, data: "Error empresa no encontrada"};
    await Procedures.procesoLocomproaqui( data, resultado );
}

Procedures.procesoLocomproaqui = async( data, plataforma )=>{
    let resultado = Object();
    urlPlataforma = plataforma.urlConfirmacion;
    resultado = await RequestServices.get(  urlPlataforma, 1);
    if(!resultado) return resultado;
    console.log("=>>>>>>>>",resultado.count);
    let listPaginado = await Procedures.procesoPaginacion( resultado.count );
    console.log("=>>>>>>>>",listPaginado.length);
    await Procedures.recorrecArreglo( listPaginado, data.descripcion, data.subtitulo, plataforma );
}

Procedures.procesoPaginacion = async(count)=>{
    let paginasTotal = 0;
    paginasTotal = count / 10;
    let funPlat = Procedures.paginaGetLocompro;
    let LISTJSON = Array();
    console.log("=>>>>>>>>cuanto",paginasTotal, count); 
    for(let i = 0; i < paginasTotal; i++){
        await sleep(1)
        let result = await funPlat( 10, i );
        LISTJSON.push( ... result );
    }
    LISTJSON = _.unionBy(LISTJSON || [], LISTJSON, 'id');
    console.log("=>>>>>>>>cuanto",LISTJSON.length);
    return LISTJSON;
}

async function sleep(segundos) {
    return new Promise(resolve => {
        setTimeout(async () => { resolve(true) }, segundos * 1000)
    })
}

Procedures.paginaGetLocompro = async( limit, page )=>{
    let resultado = Object();
    resultado = await RequestServices.get(  urlPlataforma, limit, page);
    return resultado.data;
}

Procedures.recorrecArreglo = async(lista, mensaje, cabezera, plataforma )=>{
    for( let row of lista ){
        await sleep(1)
        let formato = {};
        if( plataforma.slug === 'publihazclick' ) formato = { usu_email: row.email };
        else formato = row;
       let result =  await Mailer.sendWelcomeMail( { from: formato.usu_email, text: mensaje ,subject: cabezera });
       if( result ) console.log("Enviando");
    }
}


module.exports = Procedures;