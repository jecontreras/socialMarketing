let Procedures = Object();

Procedures.request = async ( url, body, params, headers, form = {}, metodo = "POST" ) => {
    return new Promise( resolve =>{
        var request = require('request');
        var options = {
            'method': metodo,
            'url': url,
            'headers': headers,
            'body': body,
            //'form': form
        };
        if( Object.keys( form ).length > 0  ) options.form = form;
        //console.log( "+++++", options)
        request( options , function (error, response) {
            if ( error ) return resolve("Error")
            //console.log(response.body);
            resolve( response.body );
        });
    });
}

module.exports = Procedures;