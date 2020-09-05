var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String },
    descripcion: { type: String },
    img: { type: String },
    nutricionalInfo: { type: String },
    codigoBarra: { type: String ,   unique: true},
    disponibilidad: { type: String },
    estatus: { type: String }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Producto', productoSchema);