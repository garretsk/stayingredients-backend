let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let SavedRecipeSchema = new Schema (
  {
    user_name: {type: String},
    userSavedRecipes: [{name: [String], image: [String]}]
  }
);

//Export model
module.exports = mongoose.model("savedRecipes", SavedRecipeSchema);