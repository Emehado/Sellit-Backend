const mongoose = require("mongoose");
const debug = require("debug")("sellit:database");
require("dotenv/config");

// Connection URL
const url = process.env.DB_CONNECTION;
const con = mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
con
  .then(() => {
    debug("Connected to database !");
  })
  .catch((err) => console.log(err));
