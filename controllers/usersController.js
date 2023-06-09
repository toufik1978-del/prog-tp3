"use strict";
// Récupère le modèle User
const User = require('../models/user');
const Product = require('../models/product');


// Utilise la méthode find() afin de récupérer tous les utilisateurs
exports.getUsers = (req, res, next) => {
    User.find() 
    .then(users => {
        console.log(users);
        res.status(200).json({
            users: users,
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
    // Récupère un utilisateur grâce à son id
  exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
      res.status(200).json({
        user: user,
        pageTitle: 'User'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
  }; 
  
   // /users/profil => GET
 exports.getUserProfil = (req, res, next) => {
  const userProfil = {
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    isAdmin: req.user.isAdmin,
    pasword: req.user.password,
    city: req.user.city,
    cart: req.user.cart
  };

  res.status(200).json({ user: userProfil });
};
    

  
  // Met à jour un utilisateur  
  exports.updateUser = (req, res, next) => {
    const userId = req.params.id; 
    const loggedInUserId = req.userId; 
  
    if (userId !== loggedInUserId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cet utilisateur." });
    }
  
    if (req.body.isAdmin !== undefined) {
      return res.status(400).json({ message: "La modification du champ 'isAdmin' n'est pas autorisée." });
    }
  
    if (req.body.cart !== undefined) {
      return res.status(400).json({ message: "La modification du champ 'cart' n'est pas autorisée ici." });
    }
  
    const updatedFields = {};
  
    if (req.body.name) {
      updatedFields.name = req.body.name;
    }
  
    if (req.body.email) {
      updatedFields.email = req.body.email;
    }
  
    User.findByIdAndUpdate(userId, updatedFields)
      .then(() => {
        res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
      })
      .catch((error) => {
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", error: error });
      });
  };
  
  // Supprime un utilisateur
  exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    const connectedUserId = req.user.id;
  
    if (userId !== connectedUserId) {
      return res.status(401).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet utilisateur' });
    }
    User.findByIdAndDelete(userId)
      .then(deletedUser => {
        if (!deletedUser) {
          
          return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      })
      .catch(err => {
        
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
      });
  };

  // /users/cart => GET
  exports.getUserCart = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Vous n'êtes pas authentifié." });
    }
    const userId = req.user.id;
    const userCart = retrieveUserCart(userId);
    if (!userCart) {
      return res.status(404).json({ message: "Le panier de l'utilisateur n'a pas été trouvé." });
    }
    res.status(200).json({ cart: userCart });
  };

  // /users/cart => PUT
  exports.updateUserCart = (req, res, next) => {
    const userId = req.user.id;
      const productId = req.body.productId;
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Vous n'êtes pas authentifié." });
      }
      
      Product.updateOne({ _id: productId }, { isSold: true })
        .then(() => {
          
          addToUserCart(userId, productId);
          res.status(200).json({ message: "Produit ajouté au panier avec succès." });
        })
        .catch((error) => {
         
          res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du produit au panier.", error: error });
        });
    };

    // /users/cart => DELETE
    exports.deleteUserCart = (req, res, next) => {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Vous n'êtes pas authentifié." });
        }
        const userId = req.user.id;
        const productId = req.params.productId;
    
        removeFromUserCart(userId, productId);
      
        res.status(200).json({ message: "Produit supprimé du panier avec succès." });
      };