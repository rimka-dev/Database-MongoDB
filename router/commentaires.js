//nous allons gérer l'ensemble des requêtes http 
//que l'on peut faire à notre serveur sur la ressource commentaires

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); // créer note router puis l'éxporter dans /app.js
// schema des données => colonnes
const { Commentaires, schema } = require("../model/commentaires"); // importer le shema depuis le /model. commentaire.js

// ============== récupérer toute la liste des commentaires ====================================
router.get("/", async function(req, res) {
    const resultat = await Commentaires.find();
    res.send(resultat);
});

// ============= récupérer 1 seul commentaire ====================================

router.get("/:id", async function(req, res) {
    const id = req.params.id;

    const verifID = mongoose.Types.ObjectId.isValid(id);

    if (!verifID) {
        res.status(400).send("id donné n'est pas conforme");
        return;
    }

    const resultat = await Commentaires.find({ _id: id });

    if (resultat.length === 0) {
        res.status(404).send("aucun enregistrement avec l'id " + id);
        return;
    }

    res.send(resultat);
});

//================ créer ou poster ======================== 
router.post("/", async function(req, res) {
    // récupérer le body de la requête post
    const body = req.body;

    const verif = schema.validate(body);
    // si ko => message et stop exécution
    if (verif.error) {
        res.status(400).send(verif.error.details[0].message);
        return;
    }
    // si ok => ajouter dans la base de données MOngo un nouvel enregistrement
    const commentaires = new Commentaires(body);
    const resultat = await commentaires.save();
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

    // si non conforme : erreur 400 + message + stop 

    if (verif.error) {
        res.status(400).send(verif.error.details[0].message);
        return;
    }

    // est qu'il y a un enregistrement avec l'id transmis dans l'url

    const resultat = await Commentaires.findById(id);
    // si il n'y a pas d'enregistrement : erreur 404 + message + stop

    if (!resultat) {
        res.status(404).send("aucun enregistrement trouvé pour l'id " + id);
        return;
    }

    // si tout ok alors effectuer la mis à jour 
    // retourner la liste des articles 

    resultat.contenu = body.contenu;
    resultat.date_creation = body.date_creation;
    resultat.nom_auteur = body.nom_auteur

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
    const resultat = await Commentaires.deleteOne({ _id: id });
    //res.send(resultat); si on veux connaitre l'élément supprimer

    // si il y en a pas => erreur 404 + message + stop

    if (resultat.deletedCount === 0) {
        res.status(404).send("il n'existe pas d'enregistrement avec l'id" + id);
        return;
    }

    // si tout est ok => effectuer la suppression
    // retourner un message la liste de tous les articles dans la base

    const reponse = await Commentaires.find();
    res.send(reponse);
});

module.exports = router;