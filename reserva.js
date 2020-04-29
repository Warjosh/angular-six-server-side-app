//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var credential = require('./config');

//Inicializar variables
var app = express();

//body parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Importar rutas
var sessionRoute = require('./routes/session');
var usuariosRoute = require('./routes/usuarios');


//Conexion a la base de datos
// Conexion offline
// mongoose.connection.openUri('mongodb://' + credential.SERVER + ':' + credential.PORT + '/' + credential.DB, { useCreateIndex: true, useNewUrlParser: true, "auth": credential.USERDB == '' ? undefined : { "authSource": "admin" }, "user": credential.USERDB == '' ? undefined : credential.USERDB, "pass": credential.PASSDB == '' ? undefined : credential.PASSDB, }, (err, res) => {
// Conexion online with mongoatlas
mongoose.connection.openUri('mongodb+srv://' + credential.USERDB + ':' + credential.PASSDB + '@cluster0-lm43p.mongodb.net/test?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, "auth": credential.USERDB == '' ? undefined : { "authSource": "admin" }, "user": credential.USERDB == '' ? undefined : credential.USERDB, "pass": credential.PASSDB == '' ? undefined : credential.PASSDB, }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

//Rutas
app.use('/reserva/session', sessionRoute); 
app.use('/reserva/usuario', usuariosRoute);

//Escuchar peticiones
app.listen(3002, () => {
    console.log('Express server puerto 3002: \x1b[32m%s\x1b[0m', 'online');
});