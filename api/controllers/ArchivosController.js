/**
 * ArchivosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Procedures = Object();

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(Archivos,params);
    return res.ok( { status: 200, ...resultado } );
}

Procedures.create = async(req, res)=> {
    let params = req.allParams();
    let resultado = Array(); 
    for(let row of params.archivos) resultado.push(await Archivos.create(row).fetch());
    
    return res.ok( { status: 200, data:[ ...resultado ] } );
}

module.exports = Procedures;

