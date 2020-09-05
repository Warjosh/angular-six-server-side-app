var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

 var Producto = require('../models/productos');

/**********************************************/
/* Obtener todos los productos */
/**********************************************/
app.get('/find', (req, res, next) => {

    Producto.find({ estatus: "Activo" })
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando lista de productos',
                    errors: err
                });
            }

            //mandar respuesta a la solicitud
            res.status(200).json({
                ok: true,
                response: response
            });
        });

});
/**********************************************/
/* Obtener un producto */
/**********************************************/
app.post('/find', (req, res) => {

    Producto.findOne({ codigoBarra: req.body.codigoBarra, estatus: "Activo" }, 'nombre descripcion img nutricionalInfo codigoBarra disponibilidad estatus')
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err.message,
                    errors: err
                });
            }

            //mandar respuesta a la solicitud
            res.status(200).json({
                ok: true,
                response: response
            });
        });

});
/**********************************************/
/* Crear Productos */
/**********************************************/
app.post('/add', (req, res) => {

    var body = req.body;

    body.estatus = 'Activo';
    
    Producto.create(body, function(err, data) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err.message,
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Producto creado exitosamente'
        });
    });

})
/**********************************************/
/*  Actualizar Productos */
/**********************************************/
app.post('/update', (req, res) => {

    var body = req.body;

    Producto.updateOne({ codigoBarra: req.body.codigoBarra }, body)
        .exec(function(err, producto) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err.message,
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Producto actualizado exitosamente',
            });
        });

})
/**********************************************/
/*  Borrar un Productos */
/**********************************************/
app.post('/disabled', (req, res) => {

    var body = req.body;
    body.estatus = "NoActivo";

    Producto.updateOne({ codigoBarra: req.body.codigoBarra }, body)
        .exec(function(err, producto) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err.message,
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Producto eliminado exitosamente',
            });
        });

})

module.exports = app;