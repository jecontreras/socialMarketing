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
    return new Promise ( async( resolve )=>{
        let url = `https://backpublihazclick.herokuapp.com/mensajes/enviarEmails`;
        let headers = { 
          'Connection': 'keep-alive',
          'sec-ch-ua': '"\\Not;A"Brand";v="99", "Google Chrome";v="85", "Chromium";v="85"',
          'Accept': 'application/json',
          'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2VAZW1haWwuY29tIiwiaWQiOiI1ZWJjMjhmOWRiYTY5NTAwZDg4N2Y0NzAiLCJpYXQiOjE2MDEzNDg4ODYsImV4cCI6MTYwMTQzNTI4Nn0.zZDK0x2tZAJlQ3PvmnMf8PSBAtl_8okCXiAeuwpwwBU',
          'sec-ch-ua-mobile': '?0',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
          'Content-Type': 'application/json; charset=UTF-8',
          'Sec-Fetch-Site': 'same-site',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Accept-Language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7,und;q=0.6,pl;q=0.5,pt;q=0.4'
         };
        let body = JSON.stringify( {
            from: obj.from,
            to: obj.to,
            subject: obj.descripcion || '',
            html: obj.text
        } );
        resultado = await HttpService.request(url, body, false, headers, {}, 'POST');
        console.log( "***respuesta", resultado);
        resolve( resultado );
    });
    // return new Promise( async (resolve) => {
    //     textmail = {
    //         from: obj.from,
    //         to: obj.to,
    //         subject: obj.descripcion || '',
    //         html: obj.text
    //     };
    //     let dominio = ( obj.to.split("@") )[1];
    //     // console.log( "***", dominio );
    //     let cortando = textmail.to.split("@");
    //     textmail.to = cortando[0] + "@" + cortando[1].toLowerCase();
    //     if( dominio == "gmail.com" || dominio == "gmail.es") resolve( await Procedures.enviarGmail( textmail ) );
    //     else if( dominio == "hotmail.com" || dominio == "outlook.com" || dominio == "outlook.es" ) {
    //         textmail.from = `joseeduar147@hotmail.com`;
    //         console.log("*** data a enviar", textmail);
    //         resolve( await Procedures.enviarOutlook( textmail ) );
    //     }
    //     else resolve( false );
    // });
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