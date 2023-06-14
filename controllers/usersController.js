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
    const connectedUserId = req.user.id;
  
    if (userId !== connectedUserId) {
      return res.status(401).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet utilisateur' });
    }
    User.findByIdAndDelete(userId)
      .then(deletedUser => {
        if (!deletedUser) {
          
          return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        return res.status(201).json({ message: 'Utilisateur supprimé avec succès' });
      })
      .catch(err => {
        
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
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

  // /users/cart => PUT
  exports.updateUserCart = (req, res, next) => {
    const userId = req.params.id;
    const loggedInUserId = req.userId;
  
    if (userId !== loggedInUserId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier le panier de cet utilisateur." });
    }
  
    const productId = req.body.productId;
  
    if (!productId) {
      return res.status(400).json({ message: "Vous devez fournir un ID de produit." });
    }
  
    // Effectuer les opérations nécessaires pour mettre à jour le panier de l'utilisateur avec le produit donné (par exemple, ajouter le produit au panier)
  
    return res.status(200).json({ message: "Produit ajouté au panier avec succès." });
  };
    
        

    
  


      
      

    // /users/cart => DELETE
    exports.deleteUserCart = (req, res, next) => {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Vous n'êtes pas authentifié." });
      }
      
      // Récupération des identifiants de l'utilisateur et du produit
      const userId = req.user.id;
      const productId = req.params.productId;
      
      // Suppression du produit du panier de l'utilisateur
      removeFromUserCart(userId, productId);
      
      // Réponse indiquant la suppression réussie
      res.status(201).json({ message: "Produit supprimé du panier avec succès." })
    };