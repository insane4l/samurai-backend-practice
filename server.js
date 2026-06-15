const http = require('http');
const fs = require('fs');

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setInterval(() => {
            resolve()
        }, ms)
    })
}

const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject('Something went wrong')
            else resolve(data);
        });
    })
}


const server = http.createServer(async (request, response) => {

    switch (request.url) {
        case '/':
        case '/main':
            try {
                const data = await readFile('./pages/index.html');
                response.write(data);
            } catch (err) {
                response.write('Something went wrong');
            }

            response.end();
            break;
        case '/blog':
            await delay(5000)
            response.write('Blog page ');
            response.end();
            break;
        default:
            response.write('404 PAGE NOT FOUND ');
            response.end();
    }
})

server.listen('3003');