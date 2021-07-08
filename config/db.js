const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoUrl");

const connectDB = async () => {
  try {
    console.log("Connecting to db");
    await mongoose.connect(db);
    console.log("connected to db");
  } catch (error) {
    console.log("Internal server Error " + error);
  }
};

module.exports = connectDB;
