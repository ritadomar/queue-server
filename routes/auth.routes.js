const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', async (req, res, next) => {
  const { name, isAdmin } = req.body;

  try {
    if (name === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const userExists = await User.findOne({ name });

    if (userExists) {
      return res.status(400).json({
        message: 'The provided name is already registered',
      });
    }

    const newUser = await User.create({
      name,
      isAdmin
    });

    // sending the new user without the hashedPassword
    res.json({ name: newUser.name, isAdmin: newUser.isAdmin, _id: newUser._id });
  } catch (error) {
    console.log('Error creating the user', error);
    next(error);
  }
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { name } = req.body;

  // Check if email or password are provided as empty string
  if (name === "" ) {
    res.status(400).json({ message: "Provide name." });
    return;
  }

  // Check the users collection if a user with the same name exists
  User.findOne({ name })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      else {
        // Deconstruct the user object to omit the password
        const { _id, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "24h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } 
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
