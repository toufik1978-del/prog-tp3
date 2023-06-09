 "use strict";
// Récupère le modèle Product
const Product = require('../models/product');

// Utilise la méthode find() afin de récupérer tous les produits
exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        console.log(products);
        res.status(200).json({
            products: products,
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
};

// Récupère un produit grâce à son id
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.status(200).json({
            product: product,
            pageTitle: 'Product'
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

// Crée un nouveau produit
exports.createProduct = (req, res, next) => {
    const { title, desc, price }= req.body;
    const product = new Product({
        title: title,
        desc: desc,
        price: price,
        userId: req.user.userId

    });
    product.save()
    .then(result => {
        res.status(201).json({
            message: 'Produit créé avec succès',
            product: result
        })
        }
    )
    .catch(err => {
        return res.status(500).json({ 
            erroeMessage: err.errors
    });
    }   
    );
}
        
// suprimer un produit
exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByIdAndRemove(productId)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Produit supprimé avec succès',
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
// reccuperer un produit
exports.getProductsByUserId = (req, res, next) => {
  const userId = req.params.userId;

  Product.find({ seller: userId })
    .then(products => {
      res.status(200).json({ products: products });
    })
    .catch(err => {
     
      res.status(500).json({ message: 'Erreur serveur' });
    });
};
 
