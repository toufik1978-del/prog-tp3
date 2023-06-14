"use strict";

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const productsController = require('../controllers/productsController');
const categoriesController = require('../controllers/categoriesController');
const searchController = require('../controllers/searchController');
// isAuth est un middleware qui vérifie si l'utilisateur est authentifié
const isAuth = require('../middleware/is-auth');

// /users => GET
router.get('/users', usersController.getUsers);

// /users/profil => GET
router.get('/users/profil', isAuth, usersController.getUserProfil);

// /users/userId => GET
router.get('/users/:userId', usersController.getUser);

// /users/profil => GET
router.get('/users/profil', usersController.getUserProfil);

// /users/userId => PUT
router.put('/users/:userId', isAuth, usersController.updateUser);

// /users/userId => DELETE
router.delete('/users/:userId', isAuth, usersController.deleteUser);

// /users/cart => GET
router.get('/users/:userId/cart', isAuth, usersController.getUserCart);

// /users/cart => Put
router.put('/cart/:userId', isAuth, usersController.updateUserCart);

// /users/cart => DELETE
router.delete('/cart/:productId', isAuth, usersController.deleteUserCart);

// /products => GET
router.get('/products', productsController.getProducts);

// /products /:userId => GET
router.get('/products/user/:userId', productsController.getProductsByUserId);

// /products/productId => GET
router.get('/products/:productId', productsController.getProduct);

// /products => POST
router.post('/products',isAuth, productsController.createProduct);

// /products/:productId => DELETE
router.delete('/products/:productId', isAuth, productsController.deleteProduct);

// categries=> GET
router.get('/categories', categoriesController.getCategories);

// /categories/categorieId => GET
router.get('/categories/:categorieId', categoriesController.getCategorie);

// /categories => POST
router.post('/categories', isAuth, categoriesController.createCategorie);

// /categories/:categorieId => PUT
router.put('/categories/:categorieId', isAuth, categoriesController.updateCategorie);

// /categories/:categorieId => DELETE
router.delete('/categories/:categorieId', isAuth, categoriesController.deleteCategorie);

// /search => GET
router.get('/search', searchController.searchProduct);

// Export des routes pour utilisation dans app.js
module.exports = router;

