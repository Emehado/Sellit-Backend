const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const { error } = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(256).required(),
  }).validate(req.body);

  if (error) return res.status(400).json({ err: error.details[0].message });

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ err: "Invalid Username or Password" });

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched)
    return res.status(400).json({ err: "Invalid Username or Password" });

  const token = user.generateAuthToken();

  res
    // .header("Authorization", `Bearer ${token}`)
    // .header("access-control-expose-headers", "Authorization")
    .send(token);
});

module.exports = router;
