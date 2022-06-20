let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ShoppingListSchema = new Schema (
  {
    user_name: {type: String},
    userShoppingList: [{name: [String], image: [String]}]
  }
);

//Export model
module.exports = mongoose.model("shoppingLists", ShoppingListSchema)