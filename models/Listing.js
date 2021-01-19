const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);

const stringSchemaType = {
  type: String,
  minlength: 1,
  maxlength: 256,
  required: true,
  trim: true,
};
const listingSchema = new Schema({
  title: stringSchemaType,
  images: {
    type: Array,
  },
  price: {
    type: Number,
    min: 0,
    max: 1000 * 1000 * 1000,
  },
  categoryId: stringSchemaType,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: Object,
  description: {
    type: String,
    maxlength: 512,
  },
});

const validateListing = (listing) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    price: Joi.number()
      .min(0)
      .max(1000 * 1000 * 1000)
      .required(),
    categoryId: Joi.string().min(1).max(3).required(),
    description: Joi.string().max(512).allow(""),
    user: Joi.ObjectId().required(),
    location: Joi.string().min(10).max(256),
  });
  return schema.validate(listing);
};

module.exports.validateListing = validateListing;
module.exports.Listing = model("listing", listingSchema);
