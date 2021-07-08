const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const PROFILE = require("../models/profileModal");

// ------------- API SECTION --------------

// ------- Get Profile API
//  method POST
//  path   /api/profile/GetUserProfile
router.post("/GetUserProfile", authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  //   lets get user profile
  const profile = await PROFILE.findOne({ user: user_id });
  if (profile) {
    res.send(profile);
  } else {
    res.status(500).json({ errors: [{ msg: "No Profile Found " }] });
  }

  try {
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
  }
});

// ------- Edit Profile API
//  method POST
//  path   /api/profile/EditUserProfile
router.post("/EditUserProfile", authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  //   lets get user profile
  const profile = await PROFILE.findOne({ user: user_id });
  if (profile) {
    //  lets edit profile
    
    res.send(profile);
  } else {
    res.status(500).json({ errors: [{ msg: "No Profile Found " }] });
  }

  try {
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
  }
});

// ------------ Export Router -------------
module.exports = router;
