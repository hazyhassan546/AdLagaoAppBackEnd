const express = require("express");
const { body, validationResult } = require("express-validator");
const USER = require("../models/userModel");
const PROFILE = require("../models/profileModal");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// ------------- API SECTION --------------
router.post("/", (req, res) => {
  res.send("Authenticated");
});

// ------- SignUp API
//  method POST
//  path   /api/auth/signup
router.post(
  "/signup",
  body("firstName", "First name is required").not().isEmpty(),
  body("lastName", "Last name is required").not().isEmpty(),
  body("userName", "User name is required").not().isEmpty(),
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    // if nor errors lets check if user already exists.
    try {
      const { firstName, lastName, userName, email, password } = req.body;
      let user = await USER.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      //   lets create User
      user = new USER({ firstName, lastName, userName, email, password });
      /// password encryption
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //// save user
      await user.save();
      // lets save user profile id
      let profile = new PROFILE({
        name: firstName + " " + lastName,
        user: user.id, /// this id will come from mongo db after saving user to document in the db
      });
      await profile.save();
      //// now get JWT (json web token)
      const payload = {
        user: {
          id: user.id, /// this id will come from mongo db after saving user to document in the db
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ token });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ msg: "INTERNAL SERVER ERROR" + error }] });
    }
  }
);

// ------- Login API
//  method POST
//  path   /api/auth/Login
router.post(
  "/login",
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password is required").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    //   lets login user
    try {
      const { email, password } = req.body;
      // if nor errors lets check if user  exists.
      let user = await USER.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // now lets match password

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //// now get JWT (json web token)
      const payload = {
        user: {
          id: user.id, /// this id will come from mongo db after saving user to document in the db
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ msg: "INTERNAL SERVER ERROR " + error }] });
    }
  }
);

// ------------ Export Router -------------
module.exports = router;
