let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    user_name: {type: String, required: true, maxlength: 50, unique: true},
    password: {type: String, required: true, maxlength: 200,  minlength: 6},
    first_name: {type: String, required: true, maxlength: 50},
    last_name: {type: String, required: true, maxlength: 50},
    email: {type: String, required: true, maxlength: 50, unique: true},
  }
);

//Export model
module.exports = mongoose.model("users", UserSchema);