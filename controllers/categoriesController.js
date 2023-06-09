"use strict";
// Récupère le modèle Product
 const Categorie = require('../models/categorie');

// Utilise la méthode find() afin de récupérer tous les categories
exports.getCategories = (req, res, next) => {
    Categorie.find()
    .then(categories => {
        console.log(categories);
        res.status(200).json({
            categories: categories,
            pageTitle: 'Accueil'    
        });
        }
    )
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
    );
}

// Récupère un categorie grâce à son id
exports.getCategorie = (req, res, next) => {
    const categorieId = req.params.categorieId;
    Categorie.findById(categorieId)
    .then(categorie => {
        res.status(200).json({
            categorie: categorie,
            pageTitle: 'Categorie'
        });
        }
    )
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
    );
}

// Crée un nouveau categorie
exports.createCategorie = (req, res, next) => {
    const name = req.body.name;
    const categorie = new Categorie({
        name: name
        
    });
    categorie.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Categorie créée avec succès !',
            categorie: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    });
}

// Met à jour un categorie
exports.updateCategorie = (req, res, next) => {
   
    const name = req.body.name;
    const categorieId = req.params.categorieId;
    Categorie.findById(categorieId)
    .then(categorie => {
        if (!categorie) {
            const error = new Error('Impossible de trouver la categorie.');
            error.statusCode = 404;
            throw error;
        }
        categorie.name = name;
        return categorie.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Categorie mise à jour avec succès !',
            categorie: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    });
}

// Supprime une categorie
exports.deleteCategorie = (req, res, next) => {
    const categorieId = req.params.categorieId;
   Categorie.findByIdAndRemove(categorieId)
    .then(result => {
        res.status(200).json({
            message: 'Categorie supprimée avec succès !'
        });
    }   
    )
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
    );
}
 