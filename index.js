var fs = require('fs');
var http = require('http');
var https = require('https');
var mysql = require('mysql');
const fetch = require('node-fetch');
const util = require('util');
const body_parser = require('body-parser');
//var privateKey  = fs.readFileSync('/sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('/sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var path = require('path');
const Console = require("console");
//var httpsServer = https.createServer(credentials,app);
var httpServer = http.createServer(app);
app.use(body_parser.json());

var con = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tasksdb"
};

function setUpDB(){
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - Setting up DB");
    sqlQuerry("CREATE TABLE IF NOT EXISTS tasksdb.tasks (id int(11) NOT NULL, name varchar(50) DEFAULT NULL, details varchar(255) DEFAULT NULL, isCompleted bool DEFAULT NULL, date datetime DEFAULT NULL, PRIMARY KEY (id));");
}

async function sqlQuerry(querry){
    var result = null 
    const conn = mysql.createConnection(con);
    const query = util.promisify(conn.query).bind(conn);
    const rows = query(querry);
    conn.end();
    return Promise.resolve(rows);
}

//var httpsServer = https.createServer(credentials, app);
app.get('/', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/index.html', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/authors.html', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/authors.html'));
});

app.get('/calendar.html', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/html/calendar.html'));
});

app.get('/img/hatter.png', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/img/hatter.png'));
});

app.get('/js/main.js', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/js/main.js'));
});

app.get('/css/style.css', function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    res.sendFile(path.join(__dirname + '/css/style.css'));
});


// app.get('/data/node', function(req, res) {
//     console.log(req.originalUrl);
//     res.sendFile(path.join(__dirname + '/node_modules.zip'));
// });

app.post('/api/addTask', async function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    var name = req.query.name;
    var details = req.query.details;
    var isCompleted = req.query.isCompleted;
    var date = req.query.date;
    var querry = "INSERT INTO tasksdb.tasks (name, details, inProgress, date) VALUES ('"+name+"', '"+details+"', '"+isCompleted+"', '"+date+"');";
    var result = await sqlQuerry(querry);
    res.send(result);
});

app.get('/api/getTasks', async function(req, res) {
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - "+req.originalUrl);
    var querry = "SELECT * FROM tasks;";
    var result = await sqlQuerry(querry);
    res.send(result);
});

async function cleanCalendar() {
    var querry = "SELECT * FROM tasks;";
    var result = await sqlQuerry(querry);
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - Cleaning db");
    for (var i = 0; i < result.length; i++) {
        if (Date(result[i].date).toLocaleDateString === new Date().toLocaleDateString) {
            var querry = "UPDATE tasksdb.tasks SET inProgress = 1 WHERE id = " + result[i].id + ";";
            var result = await sqlQuerry(querry);
        }else{
            await sqlQuerry("UPDATE tasksdb.tasks SET inProgress = 0 WHERE id = " + result[i].id + ";");
        }
        if (result[i].date < new Date()) {
            await sqlQuerry("DELETE FROM tasksdb.tasks WHERE id = " + result[i].id + ";");
        }
    }
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - Cleaning done!");
    setTimeout(cleanCalendar, 60000);
}

app.get('*',async function(req, res){
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - 404 ERROR - "+req.originalUrl);
    res.status(404).sendFile(path.join(__dirname + '/img/404.png'));
});

httpServer.listen(8080, () => {
    cleanCalendar();
    setUpDB();
    setTimeout(cleanCalendar, 60000);
    console.log("["+new Date().toLocaleDateString()+" " +new Date().toLocaleTimeString()+"] - server starting on port : http://localhost:" + 8080);
});
// httpsServer.listen(443, () => {
// console.log("server starting on port : " + 443)
// });