/**
 * MensajesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(Mensajes,params);
    for( let row of resultado.data ){
        if( row.creado ) row.creado  = await User.findOne( { id: row.creado } ).populate('rol');
        if( row.empresa ) row.empresa = await Empresa.findOne( { id: row.empresa });
    }
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
    resultado = await Mensajes.findOne({ id: resultado.id });
    return resultado;
}

Procedures.probando = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    res.status(200).send({ status: 200, data: "OK"})
    Mailer.sendWelcomeMail({ text: "Hello", descripcion: "jose pruebas", subject: "josepragrame123@gmail.com" });
}


Procedures.getPlataformas = async( req, res )=>{
    let params = req.allParams();
    let resultado = Object();
    console.log("****", params);
    resultado = await RequestServices.get(  params.url, 1);
    if(!resultado) return resultado;
    console.log("=>>>>>>>>",resultado.count);
    let listPaginado = await MensajesServices.procesoPaginacion( resultado.count );
    return res.status(200).send( { status: 200, data: listPaginado });
}

module.exports = Procedures;
