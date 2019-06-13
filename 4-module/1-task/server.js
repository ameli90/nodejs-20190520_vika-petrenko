const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('file not found');
    }

    switch (req.method) {
        case 'GET':
            fs.createReadStream(filepath).on('error', err => {
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('file not found')
                } else {
                    res.statusCode = 500;
                    res.end('internal server error')
                }
            })
                .pipe(res);
            break;
        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
