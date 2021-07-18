const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const Ad = require("../models/adsModal");
const USER = require("../models/userModel");

// ------------- API SECTION --------------
// ------- Get Profile API
//  method POST
//  path   /api/ads/PostAd
router.post(
  "/PostAd",
  body("title", "title is required").not().isEmpty(),
  body("photos", "photos is required").not().isEmpty(),
  body("description", "description is required").not().isEmpty(),
  body("price", "price is required").not().isEmpty(),
  body("country", "country is required").not().isEmpty(),
  body("city", "city is required").not().isEmpty(),
  body("category", "category is required").not().isEmpty(),
  body("subCategory", "subCategory is required").not().isEmpty(),
  authMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    try {
      const user_id = req.user.id;
      // now we have the user id to store ad wrt user id.
      // -----------------------  lets create Ad  --------------------------
      const {
        title,
        photos,
        description,
        price,
        publishDate,
        country,
        city,
        category,
        subCategory,
        views,
        status,
      } = req.body;
      let newAd = new Ad({
        user: user_id,
        title,
        photos,
        description,
        price,
        publishDate,
        country,
        city,
        category,
        subCategory,
        views,
        status,
      });
      await newAd.save();
      res.send(newAd);
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
    }
  }
);

// ------------- API SECTION --------------
//  method POST
//  path   /api/ads/GetMyAds
router.get("/GetMyAds", authMiddleware, async (req, res) => {
  try {
    const user = req.user.id;
    let Ads = await Ad.find({ user });
    res.send(Ads);
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
  }
});


//  method POST
//  path   /api/ads/createComment
router.post(
  "/createComment",
  body("add_id", "add_id is required").not().isEmpty(),
  body("comment", "comment is required").not().isEmpty(),
  authMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    try {
      const userId = req.user.id;
      // we can search user w.r.t id
      let user = await USER.findById(userId);
      // here we have the user now we can look for respective add
      // -----------------------  lets Find Ad  --------------------------
      const { add_id, comment } = req.body;
      let ad_commented = await Ad.findById(add_id);
      // -----------------------  lets Add comments  --------------------------
      if (ad_commented) {
        ad_commented.comments.push({
          user: userId,
          userName: user.firstName + " " + user.lastName,
          userImage: user.avatar,
          text: comment,
        });
        await ad_commented.save();
        res.send(ad_commented);
      } else {
        res.status(400).json({ errors: [{ msg: "No Ad Exist " }] });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
    }
  }
);

// ------------ Export Router -------------
module.exports = router;
