const mongoose = require("mongoose");
const AdsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  photos: {
    type: Array,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  views: {
    type: Number,
  },
  status: {
    type: String,
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      userName: {
        type: String,
      },
      userImage: {
        type: String,
      },
      text: { type: String },
      pubDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Ad = mongoose.model("ads", AdsSchema);
