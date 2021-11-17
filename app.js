const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const mime = require('mime');
const mysql = require('mysql');
let querystring = require('querystring');
const port = 3000;

http.createServer((req, res) => {
    let filename = 'public' + url.parse(req.url).pathname;
    if (filename === 'public/') filename = 'public/index.html';
    router(req, res, filename);
}).listen(port);

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'pizzastore'
});

conn.connect(err => {
    if (err) throw err;
    console.log('App connected to MySQL');
});

let router = (req, res, filename) => {
    switch (filename){
        //Routes for processing products
        case 'public/saveorder':
            saveOrder(req, res);
            break;
        case 'public/getorders':
            getOrders(req, res);
            break;
        case 'public/deleteorder':
            deleteOrder(req, res);
            break;
        default:
            fs.readFile(filename, (err, data) => {
                if (err){
                    res.writeHead(404, {'content-type': 'text/html'});
                    res.write('404 Not Found');
                    return res.end();
                }
                else{
                    res.writeHead(200, {'content-type': mime.getType(filename)});
                    res.write(data);
                    return res.end();
                }
            });
            break;
    }
}

console.log(`App running on port ${port}`);
console.log(`You can run your app here: http://localhost:${port}`);

let saveOrder = (req, res) => {
    let info = '';
    req.on('data', chunks => {
        info += chunks;
    });
    req.on('end', () => {
        let form = qs.parse(info);
        console.log(form);
        let cmd = `INSERT INTO orders set ?`;
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(200, {'content-type': 'text/html'});
            res.end();
        });
    });
}

function getOrders(req, res) {
    var info = '';
    req.on('data', function (partialData) {
        info += partialData;
    });
    req.on('end', function () {
        var form = querystring.parse(info);
        var sqlCmd = '';
        if (form.query) {
            sqlCmd = 'SELECT * FROM orders WHERE name LIKE ?'; //placeholder
        }
        else {
            sqlCmd = 'SELECT * FROM orders';
        }
        conn.query(sqlCmd, '%' + form.query + '%', function (error, allRows) { //This query returns the result in "allRows"
            if (error) {
                console.log('Error listing pizza orders');
                return;
            }
            res.end(JSON.stringify(allRows));
        });
    });
}

let deleteOrder = (req, res) => {
    let id = url.parse(req.url, true).query.id;
    let cmd = 'DELETE FROM orders WHERE orderid = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(200, {'content-type': 'text/html'});
        res.end();
    });
}