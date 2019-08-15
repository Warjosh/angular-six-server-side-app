var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    
    codigoExpira: { type: String },
    tiempoExpiracion: { type: Number },
    estatus: { type: String }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);