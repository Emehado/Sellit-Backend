const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/User");

/* GET users listing. */
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ err: "Email Already Exist" });

  const contactExist = await User.findOne({ contact: req.body.contact });
  if (contactExist)
    return res.status(400).json({ err: "Phone number Already Exist" });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashedPassword;
  const newUser = new User(req.body);
  const addNewUser = await newUser.save();

  const token = newUser.generateAuthToken();
  res
    .header("Authorization", `Bearer ${token}`)
    .header("access-control-expose-headers", "Authorization")
    .send(addNewUser);
});

module.exports = router;
