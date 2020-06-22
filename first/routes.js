const fs = require('fs');

const requestHandler = (req, res) =>{
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html><head><title> Enter an Message </title><body><form action="/message" method="POST"><input name="message" type="text"><button type="submit">SEND</button> </form></body></html>')
        return res.end();
    }
    if(url === '/message' && method === 'POST' ){
        const body = [];
        req.on('data', (chunk) =>{
            body.push(chunk);
        })
        return req.on('end', () =>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message, (err) =>{
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
                
            });
    

        })
    } 
}

module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     algo: 'algo'
// }

// module.exports.handler = requestHandler;
// module.exports.algo = 'algo';

// exports.handler = requestHandler;