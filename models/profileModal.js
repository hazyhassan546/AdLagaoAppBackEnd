const mongoose = require("mongoose");
const ProfileModal = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
});
module.exports = Profile = mongoose.model("profile", ProfileModal);
