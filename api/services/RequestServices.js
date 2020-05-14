const Procedures = Object();
const request = require('request');

Procedures.enviar = (url, data)=>{
    return new Promise(resolve=>{
        var options = {
            'method': 'POST',
            'url': url,
            'headers': {'Content-Type': 'application/json'},
            body: JSON.stringify({data})
        };
        //console.log("***", options)
        request(options, function (error, response) { 
        if (error) {throw new Error(error); resolve(false)}
            resolve(response.body);
        });
    });
}

Procedures.get = (url, limit, page = 0 )=>{
    return new Promise(resolve=>{
        var options = {
            'method': 'POST',
            'url': url,
            'headers': {
              'Accept': 'application/json, text/plain, */*',
              'Referer': 'https://locomproaqui.com/config/usuarios',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
              'Content-Type': ['application/json', 'text/plain'],
              'Cookie': 'sails.sid=s%3Aflsl5KMMVXBuQVVSiu0PJD-u1_znq-Mq.Q3NdtR%2FMzwmgI0VaY4R%2FXJWr3FBO%2BNKUD14Cqs85gTM'
            },
            body: `{\n    \"where\": {},\n    \"page\": ${ page },\n    \"skip\": 0,\n    \"limit\": ${ limit }\n}`
          
          };
          request(options, function (error, response) { 
            if (error) return resolve({status: 400, data: "Error"})
            // console.log(response.body);
            resolve(JSON.parse(response.body));
          });
    })
}

module.exports = Procedures;