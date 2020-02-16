const mongoose = require("mongoose");
const Joi = require("@hapi/joi"); // module pour créer le shema et le sécuriser 

const schemaArticles = mongoose.Schema({
    titre: String,
    contenu: String,
    date_creation: { type: Date, default: Date.now },
    nom_auteur: String,
    categories: Array,
    email_auteur: String,
    estPublie: Boolean
});

// lier le schema à la collection = Modèle

const Articles = mongoose.model("articles", schemaArticles);

const schema = Joi.object({
    titre: Joi.string().min(3).max(255).required(),
    contenu: Joi.string().min(10).max(348).required(),
    nom_auteur: Joi.string().min(5).max(255).required(),
    categories: Joi.array().items(Joi.string()).required(),
    email_auteur: Joi.string().email().required(),
    estPublie: Joi.boolean().required()
});

module.exports.schema = schema;
module.exports.Articles = Articles;