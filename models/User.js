const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const stringSchemaType = {
  type: String,
  minlength: 3,
  maxlength: 256,
  required: true,
  trim: true,
};
const userSchema = Schema({
  name: stringSchemaType,
  email: stringSchemaType,
  contact: stringSchemaType,
  password: stringSchemaType,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.TOKEN_SECRET
  );
};
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(256).required(),
    email: Joi.string().email().required(),
    contact: Joi.string().min(3).max(256).required(),
    password: Joi.string().min(3).max(256).required(),
  });
  return schema.validate(user);
};
module.exports.validateUser = validateUser;
module.exports.User = model("User", userSchema);
