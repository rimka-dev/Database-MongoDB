// importer les modules dont on a besoin pour créer notre API backend

const express = require("express"); // pour créer le serveur http
const mongoose = require("mongoose"); // pour relier notre base de données MongoDB
const routerUtilisateurs = require("./router/utilisateurs"); // relier et importer la partie utilisateurs (users)
const routerArticles = require("./router/articles"); // relier et importer la partie articles
const routerCommentaires = require("./router/commentaires"); // relier et importer la partie commentaires
const routerParametres = require("./router/parametres"); // relier et importer la partie parametres
const cors = require("cors"); // pour mettre en ligne notre projet

const app = express(); // définit le module serveur

// fonction middleware 
app.use(cors()); // autoriser des sites internet à lui faire des requêtes
app.use(express.json()); // récupérer les requêtes POST et PUT dans le body au format JSON
app.use("/utilisateurs", routerUtilisateurs); // utiliser le router utilisateurs
app.use("/articles", routerArticles); // utiliser le router articles
app.use("/commentaires", routerCommentaires); // utiliser le router pour la partie commentaires
app.use("/parametres", routerParametres); // utiliser le router pour la partie parametres

//Pour relier notre API à la base de données en ligne sur MongoDB Atlas on utilise les étapes suivantes.
const urlBDD = "mongodb+srv://ifocop_takka:azerty1234@cluster0-fzvlq.mongodb.net/test?retryWrites=true&w=majority";
const optionConnexion = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(urlBDD, optionConnexion)
    .then(function() {
        console.log("connexion à la base de donnée est réussie");
    })
    .catch(function(err) {
        console.log(err);
    })

// récupére le port d'écoute de la machine
const port = process.env.PORT || 3200;
//              undefined || 3200

app.listen(port, function() {
    console.log("serveur lancé sur le port " + port); // afiche dans le CDM qu'on est bien connecter 
});