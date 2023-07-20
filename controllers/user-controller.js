const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const validateRegisterInput = require("../validator/register");
const validateLoginInput = require("../validator/login");

let User = require('../models/user-schema');
let Pantry = require('../models/pantry-schema');
let ShoppingList = require('../models/shoppingList-schema');
let SavedRecipes = require('../models/savedRecipe-schema');

module.exports = {
  
  register : async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user_name = req.body.uname;
    const email = req.body.email;

    User.findOne({ email }).then(user => {
      if (user) {
        return res.status(404).json({ EmailExists: "Email already in use"});
      }
    })

    User.findOne({ user_name }).then(user => {
      if (user) {
        return res.status(404).json({ UsernameExists: "Username already exists" });
      }
      else {
        const newUser = new User({
          first_name: req.body.fname,
          last_name: req.body.lname,
          user_name: req.body.uname,
          email: req.body.email,
          password: req.body.psw
        });

        const newPantry = new Pantry({
          user_name: req.body.uname
        });

        const newShoppingList = new ShoppingList({
          user_name: req.body.uname
        });

        const newSavedRecipes = new SavedRecipes({
          user_name: req.body.uname
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });

        newPantry
          .save()
          .then(pantry => res.json(pantry))
          .catch(err => console.log(err));

        newShoppingList
          .save()
          .then(shoppingList => res.json(shoppingList))
          .catch(err => console.log(err));

        newSavedRecipes
          .save()
          .then(savedRecipes => res.json(savedRecipes))
          .catch(err => console.log(err));
      }
    });
  },

  login : async (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user_name = req.body.uname;
    const password = req.body.psw;

    // Find user by username
    User.findOne({ user_name }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ UsernameNotFound: "Username doesn't exist" });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            uname: user.user_name
          };

          // Sign token
          jwt.sign(
            payload,
            db.secretOrKey,
            {
              expiresIn: 31556926
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        }
        else {
          return res
            .status(400)
            .json({ PasswordIncorrect: "Password incorrect" });
        }
      });
    });
  },

  getUserInfo : async (req, res, next) => {
    const query = { user_name: req.params.name };
  
    User.findOne(query, function(err, result) {
      res.json(result);
    });
  },

  addPantry : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = {user_name: username};
    
    let bodyData = req.body.selectedIngredients;
    let dataRemove;
    let dataAdd;
    let innerData = [];
    let ingredient;

    for (i = 0; i < bodyData.length - 1; i++)
    {
      ingredient = {name:bodyData[i].name, image:bodyData[i].image};
      dataRemove = {$pull: {userPantry: ingredient}};
      innerData.push(ingredient);

      Pantry.updateOne(query, dataRemove, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
      });
    }

    ingredient = {name:bodyData[bodyData.length - 1].name, image:bodyData[bodyData.length - 1].image};
    dataRemove = {$pull: {userPantry: ingredient}};
    innerData.push(ingredient);
    dataAdd = {$addToSet: {userPantry: innerData}};
    
    Pantry.updateOne(query, dataRemove, (err, collection) => {
      if(err) throw err;
      console.log("Record updated successfully");

      Pantry.updateOne(query, dataAdd, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
        res.json(true);
      });
    });
  },

  addShoppingList : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = { user_name: username};
    
    let bodyData = req.body.selectedIngredients;
    let dataRemove;
    let dataAdd;
    let innerData = [];
    let ingredient;

    for (i = 0; i < bodyData.length - 1; i++)
    {
      ingredient = {name:bodyData[i].name, image:bodyData[i].image};
      dataRemove = {$pull: {userShoppingList: ingredient}};
      innerData.push(ingredient);

      ShoppingList.updateOne(query, dataRemove, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
      });
    }

    ingredient = {name:bodyData[bodyData.length - 1].name, image:bodyData[bodyData.length - 1].image};
    dataRemove = {$pull: {userShoppingList: ingredient}};
    innerData.push(ingredient);
    dataAdd = {$addToSet: {userShoppingList: innerData}};
    
    ShoppingList.updateOne(query, dataRemove, (err, collection) => {
      if(err) throw err;
      console.log("Record updated successfully");

      ShoppingList.updateOne(query, dataAdd, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
        res.json(true);
      });
    });
  },

  getPantry : async (req, res, next) => {
    Pantry.findOne({ user_name: req.params.name }, function(err, result) {
      if (err) throw err;
      console.log("PANTRY: ", result);
      console.log("PANTRY FOR REAL:" + JSON.stringify(result.userPantry));
      res.json(result);
    });
  },

  getShoppingList : async (req, res, next) => {
    ShoppingList.findOne({ user_name: req.params.name }, function(err, result) {
      if (err) throw err;
      console.log("SHOPPING_LIST: ", result);
      console.log("SHOPPING_LIST FOR REAL:" + JSON.stringify(result.userShoppingList));
      res.json(result);
    });
  },

  removePantry : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = { user_name: username };
    
    let bodyData = req.body.selectedIngredients;
    let data;
    let ingredient;

    for (i = 0; i < bodyData.length - 1; i++)
    {
      ingredient = {name:bodyData[i].name, image:bodyData[i].image};
      data = {$pull: {userPantry: ingredient}};

      Pantry.updateOne(query, data, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
      });
    }

    ingredient = {name:bodyData[bodyData.length - 1].name, image:bodyData[bodyData.length - 1].image};
    data = {$pull: {userPantry: ingredient}};

    Pantry.updateOne(query, data, (err, collection) => {
      if(err) throw err;
      console.log("Record updated successfully");
      res.json(true);
    });
  },

  removeShoppingList : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = { user_name: username };
    
    let bodyData = req.body.selectedIngredients;
    let data;
    let ingredient;

    for (i = 0; i < bodyData.length - 1; i++)
    {
      ingredient = {name:bodyData[i].name, image:bodyData[i].image};
      data = {$pull: {userShoppingList: ingredient}};

      ShoppingList.updateOne(query, data, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
      });
    }

    ingredient = {name:bodyData[bodyData.length - 1].name, image:bodyData[bodyData.length - 1].image};
    data = {$pull: {userShoppingList: ingredient}};

    ShoppingList.updateOne(query, data, (err, collection) => {
      if(err) throw err;
      console.log("Record updated successfully");
      res.json(true);
    });
  },

  addSavedRecipe : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = { user_name: username};
    
    let bodyData = req.body.selectedRecipe;
    let dataRemove;
    let dataAdd;
    let recipe;

    console.log("--->>>");
    console.log(bodyData.name);
    console.log(bodyData.image);

    recipe = {name:bodyData.name, image:bodyData.image};

    console.log(query);

    dataRemove = {$pull: {userSavedRecipes: recipe}};
    dataAdd = {$addToSet: {userSavedRecipes: recipe}};

    SavedRecipes.updateOne(query, dataRemove, (err, collection) => {
      if (err) throw err;
      //console.log("SAVED_RECIPES THAT ARE DUPLICATES: ", result);
      //console.log("SAVED_RECIPES THAT ARE DUPLICATES FOR REAL:" + JSON.stringify(result.userSavedRecipes));
      //console.log(recipe);
      
      SavedRecipes.updateOne(query, dataAdd, (err, collection) => {
        if(err) throw err;
        console.log("Record updated successfully");
        res.json(true);
      });
    });
  },

  getSavedRecipe : async (req, res, next) => {
    SavedRecipes.findOne({ user_name: req.params.name }, function(err, result) {
      if (err) throw err;
      console.log("SAVED_RECIPES: ", result);
      console.log("SAVED_RECIPES FOR REAL:" + JSON.stringify(result.userSavedRecipes));
      res.json(result);
    });
  },

  removeSavedRecipe : async (req, res, next) => {
    let username = req.body.currentUser;
    const query = { user_name: username };
    
    let bodyData = req.body.selectedRecipe;
    let data;
    let recipe;

    recipe = {name:bodyData.name, image:bodyData.image};
    data = {$pull: {userSavedRecipes: recipe}};

    SavedRecipes.updateOne(query, data, (err, collection) => {
      if(err) throw err;
      console.log("Record updated successfully");
      res.json(true);
    });
  }
}