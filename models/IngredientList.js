let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let IngredientListSchema = new Schema(
  {
    Ingredient: {type: String}
  }
);

// // Virtual for users ID
// UserSchema.virtual('ID').get(function () {
//   return this._id;
// });

//Export model
module.exports = mongoose.model("ingredientList", IngredientListSchema);