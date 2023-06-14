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
  const userId = req.user.userId;
  console.log(userId)
  User.findById(userId)
  .then(user => {
    res.status(200).json({
      user: user
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  });

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
    
  
    User.findByIdAndDelete(userId)
      .then(deletedUser => {
        if (!deletedUser) {
          return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        return res.status(204).json({ message: "Utilisateur supprimé avec succès" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      });
  };

  // /cart => GET
  exports.getUserCart = (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    User.findById(userId)
    .populate('cart.productId') 
      .then(user => {
        if (!user) {
          const error = new Error('Utilisateur non trouvé');
          error.statusCode = 404;
          throw error;
        }
        const userCart = user.cart;
  
        res.status(200).json({
          user: userCart
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  // /cart => PUT
  exports.updateUserCart = (req, res, next) => {
    const loggedInUserId = req.user.userId;
  
    if (!loggedInUserId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier le panier de cet utilisateur." });
    }
  
    const productId = req.body.productId;
  
    if (!productId) {
      return res.status(400).json({ message: "Vous devez fournir un ID de produit." });
    }
    
    User.findById(loggedInUserId)
      .then(user => {
        
        if (user.cart.includes(productId)) {
           
          return res.status(200).json({ message: "Le produit est déjà présent dans le panier." });
        }
        return Product.findByIdAndUpdate(productId, { isSold: true }, { new: true })
        .then(updatedProduct => {
          if (!updatedProduct) {
            return res.status(404).json({ message: "Produit non trouvé." });
          }
        user.cart.push(productId);
        
        return user.save();
        
      })  
      .then(() => {
        res.status(200).json({ message: "Produit ajouté au panier avec succès." });
      })
      .catch((error) => {
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du panier de l'utilisateur.", error: error });
      });
  })
  };
         
    // /cart => DELETE
    exports.deleteUserCart = (req, res, next) => {
      const userId = req.user.userId;
      const productId = req.params.productId;
    
      User.findById(userId)
        .then(user => {
          if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
          }
          const cartIndex = user.cart.indexOf(productId);
          user.cart.splice(cartIndex, 1);
    
          return user.save();
        })
        .then(() => {
          res.status(204).json({ message: "Produit supprimé du panier avec succès." });
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du produit du panier de l'utilisateur :", error);
          res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du produit du panier de l'utilisateur." });
        });
    };