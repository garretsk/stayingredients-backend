const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user-controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserInfo/:name", userController.getUserInfo);
router.post("/addPantry", userController.addPantry);
router.post("/addShoppingList", userController.addShoppingList);
router.get("/getPantry/:name", userController.getPantry);
router.get("/getShoppingList/:name", userController.getShoppingList);
router.post("/removePantry", userController.removePantry);
router.post("/removeShoppingList", userController.removeShoppingList);
router.post("/addSavedRecipe", userController.addSavedRecipe);
router.get("/getSavedRecipes/:name", userController.getSavedRecipe);
router.post("/removeSavedRecipe", userController.removeSavedRecipe);

module.exports = router;