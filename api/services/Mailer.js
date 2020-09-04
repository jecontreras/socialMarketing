let Procedures = Object();
var API_KEY = '1f7820a47fc80c3d635f45ddd6b2b716-3e51f8d2-57dd12ee';
var DOMAIN = 'sandbox6896fe575d1b4697b94e6724271b4677.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

Procedures.sendWelcomeMail = async( obj )=>{

    return new Promise(resolve=>{
        const data = {
            from: 'victorlandazury1@gmail.com', 
            to: obj.from, // para quien es
            subject: obj.subject, // subtitulo
            html: obj.text // mensaje
        };
        mailgun.messages().send(data, (error, body) => {
        console.log("=>>>>>",body);
            resolve(true)
        },(error)=> resolve(false));
    });
}

module.exports = Procedures;