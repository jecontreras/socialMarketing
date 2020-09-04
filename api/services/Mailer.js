let Procedures = Object();
var API_KEY = '1f7820a47fc80c3d635f45ddd6b2b716-3e51f8d2-57dd12ee';
var DOMAIN = 'sandbox6896fe575d1b4697b94e6724271b4677.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

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
}

module.exports = Procedures;