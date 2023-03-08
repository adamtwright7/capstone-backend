/// CRUD routes for Users
const express = require("express");
const router = express.Router(); // change app to router
// importing stuff for sessions and cookies
const session = require("express-session"); // for sessions
const bodyParser = require("body-parser");
const { Users } = require("../sequelize/models"); // replace this with magic item data later
const bcrypt = require("bcrypt"); // for hashing passwords

// Body parser
router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

/// Sign in/out/modify account routes -------------------------------------------------------------------

// Sign up post route -- adds a new user to the Users database.
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Detect repeat users (via already used emails)
  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (user) {
    res.send({ error: "Email already in use. Use another email or log in." });
    return;
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    const newUser = await Users.create({
      email,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.send(newUser);
  });
});

// Log in post route -- actually checks to see if that user exists in the database.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // getting the user from the database
  const user = await Users.findOne({
    where: {
      email: email,
    },
  });
  // checking username
  if (!user) {
    res.send({ error: "Email not found." }); // send back errors in json format
    return;
  }
  // comparing passwords
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.send({ error: "Server error. Please try again." });
      return;
    }
    if (!result) {
      // result will be true if the passwords match
      res.send({ error: "Incorrect password. Try again." });
      return;
    }
    // If we're here, the passwords match and the user has been created in the database. Send back their data to store on the frontend.
    res.send(user.dataValues);
  });
});

// Modify account route.
router.post("/modify", async (req, res) => {
  const { id, oldEmail, email, password, bio } = req.body; // id and oldEmail will come from Redux state; email, password, and bio will come from user input

  // update the email if the updated email exists and it's not equal to the existing email
  if (email && oldEmail !== email) {
    const user = await Users.update(
      {
        email: email,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
  }

  // update the bio if it's not an empty string
  if (bio) {
    const user = await Users.update(
      {
        bio: bio,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
  }

  // update password with bcrypt -- even if it is the same password as before (because that's just as efficient or more efficient than checking if the passwords match first, then updating it).
  if (password) {
    // update it in the database
    bcrypt.hash(password, 10, async (err, hash) => {
      Users.update(
        {
          password: hash,
          updatedAt: new Date(),
        },
        { where: { id } }
      );
    });
  }

  res.send({ message: "Account updated. Log in again." });
});

// Delete account.
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  Users.destroy({
    where: { id },
  });
  res.send({ message: "Account deleted." });
});

module.exports = router;
