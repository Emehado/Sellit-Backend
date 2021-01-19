const { Schema, model } = require("mongoose");
const Joi = require("joi");

const stringSchemaType = {
  type: String,
  required: true,
  minlength: 2,
  maxlength: 256,
};
const categorySchema = new Schema({
  label: stringSchemaType,
  icon: stringSchemaType,
  backgroundColor: stringSchemaType,
});

const validateCategory = (category) => {
  const schema = Joi.object({
    label: Joi.string().min(2).max(256).required(),
    icon: Joi.string().min(2).max(256).required(),
    backgroundColor: Joi.string().min(2).max(256).required(),
  });
  return schema.validate(category);
};

module.exports.validateCategory = validateCategory;
module.exports.Category = model("category", categorySchema);
