let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PantrySchema = new Schema (
  {
    user_name: {type: String},
    userPantry: [{name: [String], image: [String]}]
  }
);

//Export model
module.exports = mongoose.model("pantries", PantrySchema);