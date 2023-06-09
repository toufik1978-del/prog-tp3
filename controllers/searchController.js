"use strict";
// Récupère le modèle Product
const Product = require('../models/product');


exports.searchProduct = (req, res, next) => {
    const searchQuery = req.query.q;
    Product.find({ title: { $regex: searchQuery, $options: 'i' } })
    return Product.find({ title: { $regex: searchQuery, $options: 'i' } })
    .populate('userId')
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Une erreur s\'est produite.' });
      });
  };

