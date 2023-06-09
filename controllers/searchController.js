"use strict";
// Récupère le modèle Product
const Search = require('../models/product');

exports.getSearchProducts = (req, res, next) => {
    Search.find()
    .then(products => {
        console.log(products);
        res.status(200).json({
            products: products, 
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
