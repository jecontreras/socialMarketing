let Procedures = Object();
var API_KEY = '1f7820a47fc80c3d635f45ddd6b2b716-3e51f8d2-57dd12ee';
var DOMAIN = 'sandbox6896fe575d1b4697b94e6724271b4677.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });
const nodemailer = require('nodemailer');
/*
Procedures.sendWelcomeMail = async (obj) => {
    console.log( "¨***", obj)
    return new Promise(resolve => {
        const mailjet = require('node-mailjet')
            .connect('73244e17d1376a4c9ac8d8dbc99aac36', 'a27912c5dd2dc4827feec332e2464010')
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "victorlandazury1@gmail.com",
                            "Name": "Victor"
                        },
                        "To": [
                            {
                                "Email": obj.from,
                                "Name": "Usuario"
                            }
                        ],
                        "Subject": obj.subject,
                        "TextPart": "Emails",
                        "HTMLPart": obj.text,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                console.log(result.body)
                resolve(true)
            })
            .catch((err) => {
                console.log(err.statusCode)
                resolve(false)
            })



        // const data = {
        //     from: 'victorlandazury1@gmail.com', 
        //     to: obj.from, // para quien es
        //     subject: obj.subject, // subtitulo
        //     html: obj.text // mensaje
        // };
        // mailgun.messages().send(data, (error, body) => {
        // console.log("=>>>>>",body);
        //     resolve(true)
        // },(error)=> resolve(false));
    });
}*/
Procedures.sendWelcomeMail = async (obj) => {
    console.log("¨***", obj)
    return new Promise( async (resolve) => {
        textmail = {
            from: obj.from,
            to: obj.to,
            subject: obj.descripcion || '',
            html: obj.text
        };
        let dominio = ( obj.to.split("@") )[1];
        // console.log( "***", dominio );
        let cortando = textmail.to.split("@");
        textmail.to = cortando[0] + "@" + cortando[1].toLowerCase();
        if( dominio == "gmail.com" || dominio == "gmail.es") resolve( await Procedures.enviarGmail( textmail ) );
        else if( dominio == "hotmail.com" || dominio == "outlook.com" || dominio == "outlook.es" ) {
            textmail.from = `joseeduar147@hotmail.com`;
            console.log("*** data a enviar", textmail);
            resolve( await Procedures.enviarOutlook( textmail ) );
        }
        else resolve( false );
        // resolve( await Procedures.enviarGmail( textmail ) );
        // resolve( await Procedures.enviarOutlook( textmail ) );
        //resolve( await Procedures.enviarYahoo( textmail ) );
    });
}

Procedures.enviarGmail = async ( textmail ) => {
    return new Promise( async (resolve)  => {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'publichazclick2019@gmail.com',
                pass: 'jose98090871986'
            }
        });

        resolve( await Procedures.envioSend( transporter, textmail ) );
    });
}

Procedures.enviarOutlook = async ( textmail ) => {
    // textmail.from = "joseeduar147@hotmail.com";
    return new Promise( async (resolve)  => {
        let transporter = nodemailer.createTransport({
            service: 'Hotmail',
            auth: {
                user: 'joseeduar147@hotmail.com',
                pass: 'Actualizarexamen23'
            }
        });
        resolve( await Procedures.envioSend( transporter, textmail ) );
    });
}

Procedures.enviarYahoo = async ( textmail ) => {
    // textmail.from = "joseeduar147@hotmail.com";
    return new Promise( async (resolve)  => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: true,
            auth: {
                user: 'socialmarketing98@yahoo.com',
                pass: 'jose98090871986'
            },
            debug: false,
            logger: true
        });
        resolve( await Procedures.envioSend( transporter, textmail ) );
    });
}

Procedures.envioSend = async ( transporter, textmail )=>{
    // Enviamos el email
    return new Promise( resolve =>{
        transporter.sendMail(textmail, function (error, info) {
            if (error) {
                console.log("*** Error", error);
                resolve( false );
            } else {
                console.log("****, Enviado");
                resolve( true );
            }
        });
    });
}

module.exports = Procedures;