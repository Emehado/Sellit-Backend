const express = require("express");
const router = express.Router();
const { Listing, validateListing } = require("../models/Listing");
const multer = require("multer");
const upload = multer({ dest: "/uploads" });
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "perple",
  api_key: "616251437221118",
  api_secret: "BjztMn3K0XgsrqtUxpEqqDlVjJo",
});

router.get("/", async (req, res) => {
  const listings = await Listing.find().populate("user");
  res.send(listings);
});

router.post("/", upload.array("images", 5), async (req, res) => {
  const listing = { ...req.body };

  const { error } = validateListing(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const imageUpload = req.files.map(async (image) => {
    const result = await cloudinary.uploader.upload(image.path, {
      eager: { width: 200, crop: "scale" },
    });
    return { url: result.secure_url, thumbnail: result.eager[0].secure_url };
  });

  const images = await Promise.all(imageUpload).catch((e) => console.log(e));
  listing.images = images;

  if (listing.images.length < 1)
    return res.status(500).json({ err: "An internal server error occured" });

  const newListing = new Listing(listing);
  await newListing.save();

  res.send("success");
});

module.exports = router;
