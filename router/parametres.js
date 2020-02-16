//nous allons gérer l'ensemble des requêtes http 
//que l'on peut faire à notre serveur sur la ressource commentaires

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); // créer note router puis l'éxporter dans /app.js
// schema des données => colonnes
const { Parametres, schema } = require("../model/parametres"); // importer le shema depuis le /model. parametres.js

// ============== récupérer toute la liste des parametres ====================================
router.get("/", async function(req, res) {
    const resultat = await Parametres.find();
    res.send(resultat);
});

// ============= récupérer 1 seul parametre ====================================

router.get("/:id", async function(req, res) {
    const id = req.params.id; // récupérer l'id qui a été transmis dans l'url

    const verifID = mongoose.Types.ObjectId.isValid(id);
    //si l'id n'est pas conforme => 400 bad request et stop
    if (!verifID) {
        res.status(400).send("id donné n'est pas conforme");
        return;
    }
    // vérifier qu'il y a bien un article avec l'id recherché
    const resultat = await Parametres.find({ _id: id });
    // si il n'y a pas d'article => 404 Not Found et stop 
    if (resultat.length === 0) {
        res.status(404).send("aucun enregistrement avec l'id " + id);
        return;
    }
    // si tout est ok, je retourne l'article concerné
    res.send(resultat);
});

//================ créer ou poster ======================== 
router.post("/", async function(req, res) {
    // récupérer le body de la requête post
    const body = req.body;
    // vérifier quelle est conforme à ce que l'on attend

    const verif = schema.validate(body);
    // si ko => message et stop exécution
    if (verif.error) {
        res.status(400).send(verif.error.details[0].message);
        return;
    }
    // si ok => ajouter dans la base de données MOngo un nouvel enregistrement
    const parametres = new Parametres(body);
    const resultat = await parametres.save(); // asychrone => attendre que Mongo écrive 
    res.send(resultat);
});

// =============== mis à jour d'un enregistrement dans la bdd MongoDB ===================
router.put("/:id", async function(req, res) {

    const id = req.params.id; // récupérer l'id dans l'url
    const verifID = mongoose.Types.ObjectId.isValid(id);
    // si c'est pas conforme : erreur 400 + message + stop

    if (!verifID) {
        res.status(400).send("id non conforme !");
        return;
    }
    const body = req.body; // récupérer le body de la requête
    // vérifier quelle est conforme 

    const verif = schema.validate(body);
    // attention la variable schema est globale == disponible pour toutes les fonctions 
    // si non conforme : erreur 400 + message + stop 

    if (verif.error) {
        res.status(400).send(verif.error.details[0].message);
        return;
    }

    // est qu'il y a un enregistrement avec l'id transmis dans l'url

    const resultat = await Parametres.findById(id);
    // si il n'y a pas d'enregistrement : erreur 404 + message + stop

    if (!resultat) {
        res.status(404).send("aucun enregistrement trouvé pour l'id " + id);
        return;
    }

    // si tout ok alors effectuer la mis à jour 
    // retourner la liste des articles 

    resultat.information = body.information;

    const reponse = await resultat.save();

    res.send(reponse);

});

//=============== supprimer un enregistrement dans la base de données MongoDB online =========================
router.delete("/:id", async function(req, res) {
    const id = req.params.id;
    const verifID = mongoose.Types.ObjectId.isValid(id);
    if (!verifID) {
        res.status(400).send("l'id transmis n'est pas conforme");
        return;
    }
    const resultat = await Parametres.deleteOne({ _id: id });
    //res.send(resultat); si on veux connaitre l'élément supprimer

    // si il y en a pas => erreur 404 + message + stop

    if (resultat.deletedCount === 0) {
        res.status(404).send("il n'existe pas d'enregistrement avec l'id" + id);
        return;
    }

    // si tout est ok => effectuer la suppression
    // retourner un message la liste de tous les articles dans la base

    const reponse = await Parametres.find();
    res.send(reponse);
});

module.exports = router;