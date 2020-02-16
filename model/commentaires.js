const mongoose = require("mongoose");
const Joi = require("@hapi/joi").extend(require('@hapi/joi-date')); // module pour créer le shema et le sécuriser 

const schemaCommentaires = mongoose.Schema({
    contenu: String,
    date_creation: { type: Date, default: Date.now },
    nom_auteur: String
});

// lier le schema à la collection = Modèle

const Commentaires = mongoose.model("commentaires", schemaCommentaires);

const schema = Joi.object({
    contenu: Joi.string().min(5).max(348).required(),
    nom_auteur: Joi.string().min(3).max(255).required()
});

module.exports.schema = schema;
module.exports.Commentaires = Commentaires;