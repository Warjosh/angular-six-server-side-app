var express = require('express');
var bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var app = express();

var Usuario = require('../models/usuario');

/**********************************************/
/* Login */
/**********************************************/
app.post('/login', (req, res) => {

    var body = req.body;

    Usuario.findOne({ correo: body.correo, estatus: 'Activo' }, (err, response) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        /* if (!response || !bcrypt.compareSync(body.password, response.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario inválido o inactivo',
                errors: err
            });
        } */

        if (!response || (body.password != response.password)  || (body.correo != response.correo)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña invalida',
                errors: err
            });
        }      

        // Crear un token
        // var token = jwt.sign({ usuario: response }, conf.SEED, { expiresIn: 500 });
        response.password = '';
        res.status(200).json({
            ok: true,
            response: response,
            // token: token
        });

    });

});

app.post('/send', (req, res) => {

    var body = req.body;

    var random = Math.random();

    var hash = crypto.createHmac('sha256', random.toString()).digest('hex');

    body.codigoExpira = hash;

    Usuario.findOneAndUpdate({ correo: body.correo }, body)
        .exec(function(err, user) {
            if (err) throw err;

            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.mailgun.org',
                    //port: 587,
                    // secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'postmaster@sandboxdfef60f793864741998e92a86d5ddc9e.mailgun.org', // generated ethereal user
                        pass: '847729f6bd1c97021dda492a9b5b57a4-65b08458-79b27d30' // generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Sistema de Reserva" booking@mailgun.org ', // sender address
                    to: body.correo, // list of receivers
                    subject: 'Restablecer contraseña', // Subject line
                    // text: 'Contenido del email de prueba', // plain text body
                    html: '<html>Estimado/a usuario.<br> Se ha generado un código de verificación para formalizar su solicitud de cambio de clave. A continuación se proporciona un link con el que podrá realizar el cambio:' + body.host + '/restablecer/' + body.codigoExpira + '</html>',
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                    res.status(200).json({
                        ok: true,
                        mensaje: 'Se han enviado instrucciones a su correo'
                    });
                });
            });

        });

})

app.post('/restablecer', (req, res) => {

    var body = req.body;

    body.codigoExpira = '';

    Usuario.findOneAndUpdate({ correo: body.correo }, body)
        .exec(function(err, user) {
            if (err) throw err;

            res.status(200).json({
                ok: true,
                mensaje: 'Se ha cambiado la contraseña exitosamente'
            });
        });

})

module.exports = app;