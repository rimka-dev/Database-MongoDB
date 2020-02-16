const mongoose = require("mongoose");
const Joi = require("@hapi/joi"); // module pour créer le shema et le sécuriser 

const schemaParametres = mongoose.Schema({
    information: String,
});

// lier le schema à la collection = Modèle

const Parametres = mongoose.model("parametres", schemaParametres);

const schema = Joi.object({
    information: Joi.string().min(10).max(348).required(),
});

module.exports.schema = schema;
module.exports.Parametres = Parametres;