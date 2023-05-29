var fs = require('fs');
var http = require('http');
var https = require('https');
var mysql = require('mysql');
const body_parser = require('body-parser');
//var privateKey  = fs.readFileSync('/sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('/sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors());
var path = require('path');
const Console = require("console");
//var httpsServer = https.createServer(credentials,app);
var httpServer = http.createServer(app);
app.use(body_parser.json());

function sqlQuerry(querry){
    var con = mysql.createConnection({
        host: "",
        user: "",
        password: "",
        database: ""
    });
    con.connect(function(err) {
        if (err) {
            console.log(err);
            return null
        }else{
            con.query(querry, function (err, result, fields) {
                if (err){
                    console.log(err);
                    return null
                }
                else
                {
                    return result
                }
            });
        }
        con.end();
    });
}

//var httpsServer = https.createServer(credentials, app);
app.get('/', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/authors', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/authors.html'));
});

app.get('/calendar', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/calendar.html'));
});

app.get('/img/hatter', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/img/hatter.png'));
});

app.get('/js/main', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/js/main.js'));
});

app.get('/css/style', function(req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname + '/css/style.css'));
});

httpServer.listen(8080, () => {
    console.log("server starting on port : http://localhost:" + 8080);
});
// httpsServer.listen(443, () => {
// console.log("server starting on port : " + 443)
// });