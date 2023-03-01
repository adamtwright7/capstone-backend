const express = require("express");
const router = express.Router(); // change app to router
// importing stuff for sessions and cookies
router.use(express.static(__dirname + "/public"));
const session = require("express-session"); // for sessions
const cookieSession = require("cookie-session"); // for cookies
const bodyParser = require("body-parser");
const { Users } = require("../sequelize/models"); // replace this with magic item data later
const { Op } = require("sequelize"); // we're going to need some advanced querries
const bcrypt = require("bcrypt"); // for hashing passwords

// connect session sequelize
router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

// const SequelizeStore = require("connect-session-sequelize")(session.Store);
// const store = new SequelizeStore({ db: models.sequelize });
router.use(
  cookieSession({
    name: "session",
    keys: ["secrethaha"],
    maxAge: 14 * 24 * 60 * 60 * 1000,
  })
);

// session middlewear:
const authenticate = (req, res, next) => {
  if (req.session.user) {
    next(); // like a return statement for Middlewear
  } else {
    res.send("Log in first.");
    // res.render("pages/login", { modal: "Log in first." });
  }
};

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
    res.send("Email already in use. Use another email or log in.");
    // Should render an actual page at a later date.
    // res.render("pages/signup", {
    //   modal: "There's already an account with that username or email.",
    // });
    return;
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    Users.create({
      email,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  res.send("User created.");
  // render statement for later. Will send the user to a log-in page, which creates a session.
  // res.render("pages/login", { modal: "Account created! Now log in." });
});

// Log in as guest post route -- creates an account with guest data and logs you in.
router.post("/guestLogIn", async (req, res) => {
  let user = await Users.create({
    email: "tasha@witch.queen",
    password: "Zybilna",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  req.session.user = user.dataValues; // creates a session
  res.redirect("/"); // send the user back home since they don't care about their account
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
    res.send("Email not found.");
    // res.render("pages/login", { modal: "Email not found." });
    return;
  }
  // comparing passwords
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.send("Server error. Please try again.");
      // res.render("pages/login", { modal: "Server error. Please try again." });
      return;
    }
    if (!result) {
      // result will be true if the passwords match
      res.send("Incorrect password. Try again.");
      // res.render("pages/login", { modal: "Incorrect password. Try again." });
      return;
    }
    // If we're here, the passwords match. Add a session that stores user data and send them to the account page.
    req.session.user = user.dataValues;
    res.redirect("/profile");
    // res.redirect("/account");
  });
});

// Modify account route. This is a post route, rather than a put route, because forms only allow get and post methods. Authenticate is here to make sure the user is logged in
router.post("/modify", authenticate, async (req, res) => {
  const { email, password } = req.body; // The information that the user put in on this page. u = updated
  const { id, oldEmail } = req.session.user; // The information that already exists of the user in the database (via the current session).

  // update the email. If the updated email exists and it's not equal to the existing email
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

  // log them out and send them back to the log in page.
  req.session = null;
  res.send("Account updated. Log in again.");
  // res.render("pages/login", { modal: "Account updated. Log in again." });
});

// Delete account. This is a post route (even though it should be a delete route), to conform with forms, which can only get or post.
router.post("/delete", async (req, res) => {
  const { id } = req.session.user;
  Users.destroy({
    where: { id },
  });
  req.session = null;
  res.send("Account deleted.");
  // res.redirect("/");
});

// log out
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session = null;
    res.send("Logged out.");
    // res.render("pages/login", { modal: "Logged out." });
  }
});

module.exports = router;
