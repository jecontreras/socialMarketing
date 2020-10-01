let Procedures = Object();
let urlPlataforma = String();
const moment = require('moment');
const _ = require('lodash');

Procedures.tareaMensajes = async ()=>{
    let resultado = Object();
    resultado = await Mensajes.find( { where: { programado: true, estadoActividad: false, tipoEnvio: [0,1] } } );
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
    if( ( params2.tipoEnvio == '0' || params2.tipoEnvio == 0 ) && params2.listEmails.length == 0 ) await Procedures.mensajeNormal( params2 );
    if( ( params2.tipoEnvio == '1' || params2.tipoEnvio == 1 ) && params2.listEmails.length == 0 ) await Procedures.mensajePlataforma( resultado );
    if( ( params2.listEmails.length > 0 ) && ( ( params2.tipoEnvio == '0' || params2.tipoEnvio == 0 ) || ( params2.tipoEnvio == '1' || params2.tipoEnvio == 1 ) ) ) for( let row of params2.listEmails) await Procedures.mensajeNormal( { emails: row.usu_email, descripcion: params2.descripcion, subtitulo: params2.subtitulo } );
}

Procedures.mensajeNormal = async(data)=>{
    let resultado = Object();
    resultado = await Mailer.sendWelcomeMail( { from: data.subtitulo, text: data.descripcion, to: data.emails, descripcion: data.subtitulo });
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
Procedures.getUrlPlatform = async( count, url )=>{
    urlPlataforma = url;
    console.log("11111111111111111",urlPlataforma, count)
    let resultado = await Procedures.procesoPaginacion( count );
    console.log("22222222222222",resultado.length, url)
    return resultado;
}
Procedures.procesoPaginacion = async( count )=>{
    let paginasTotal = 0;
    paginasTotal = count / 30;
    paginasTotal = parseInt(paginasTotal);
    let LISTJSON = Array();
    console.log("=>>>>>>>>cuanto",paginasTotal, count); 
    for(let i = 0; i < paginasTotal; i++){
        // await sleep(1)
        let result = await Procedures.paginaGetLocompro( 30, i );
        console.log(",,,", result.length )
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
       let result =  await Mailer.sendWelcomeMail( { from: "", to: formato.usu_email, descripcion: cabezera, text: mensaje  });
       if( result ) console.log("Enviando");
    }
}


module.exports = Procedures;