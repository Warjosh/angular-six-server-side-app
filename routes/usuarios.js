var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

/**********************************************/
/* Obtener todos los usuarios */
/**********************************************/
app.get('/find', (req, res, next) => {

    Usuario.find({})
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            //mandar respuesta a la solicitud
            res.status(200).json({
                ok: true,
                mensaje: 'Get de usuarios!',
                response: response
            });
        });

});

app.post('/find', (req, res) => {

    Usuario.findOne({ username: req.body.username }, 'nombreCompleto correo username celular')
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            //mandar respuesta a la solicitud
            res.status(200).json({
                ok: true,
                //mensaje: 'Get de usuario!',
                response: response
            });
        });

});

app.post('/find_cod', (req, res) => {

    Usuario.findOne({ codigoExpira: req.body.codigoExpira }, 'correo username')
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            //mandar respuesta a la solicitud
            res.status(200).json({
                ok: true,
                //mensaje: 'Get de usuario!',
                response: response
            });
        });

});

/**********************************************/
/* Crear usuario */
/**********************************************/

app.post('/add', (req, res) => {

    var body = req.body;

    body.estatus = 'Activo';
    body.empresaRif = 'J-402457111';
    body.codigoExpira = '';
    body.tiempoExpiracion = '';

    Usuario.create(body, function(err, data) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error creando usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado exitosamente',
            response: data
        });
    });

})

app.post('/update', (req, res) => {

    var body = req.body;
    if (body.password == null)
        delete body.password;

    Usuario.updateOne({ username: body.username }, body)
        .exec(function(err, user) {
            if (err) throw err;
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado exitosamente',
                response: user
            });
        });

})

module.exports = app;