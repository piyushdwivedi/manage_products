const fs = require('fs');

const reqHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write(`<html>
            <head>
                <title>Landing Page of NodeJs</title>
            </head>
            <body>
                <form action="/message" method="POST">
                    <input type="text" name="message">
                    <button type="Submit">Send</button>
                </form>
            </body>
        </html>`);
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        let dataBody = [];
        req.on('data', (chunk) => {
            dataBody.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(dataBody).toString();
            const userInput = parsedBody.split('=')[1];
            fs.writeFile('message.txt', userInput, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    res.setHeader('Content-type', 'text/html');
}
    
module.exports = reqHandler;