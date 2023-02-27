const express = require("express");
const router = express.Router(); // change app to router
const PORT = 3010;
// importing stuff for sessions and cookies
router.use(express.static(__dirname + "/public"));
const session = require("express-session"); // for sessions
const cookieSession = require("cookie-session"); // for cookies
const bodyParser = require("body-parser");
const { Customers, Orders, Products } = require("../sequelize/models"); // replace this with magic item data later
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
    res.render("pages/login", { modal: "Log in first." });
  }
};

/// ------------------------------------------------------------------------------------------
// Product pages! Every page will be based on a similar ejs template, but be passed different data from the Products database.
// The data from the Products database is currently contained in the 'Products' variable. I'll pass it to each page as the "trinkets" variable.
// This way the ejs files can all loop through the trinkets variable without any renaming between pages.
// (Also I'm passing a lil Tasha quip to each page)

// Armor page. I'll move the bracers and cloaks over here.
router.get("/armor", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      [Op.or]: [
        { type: { [Op.startsWith]: "Armor" } },
        { name: { [Op.startsWith]: "Cloak" } },
      ],
    },
  });

  let quip = "You wouldn't need any of this if you could learn my spells.";
  res.render("pages/products/armor", { trinkets, quip });
});

// Foci page
router.get("/foci", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      [Op.or]: [{ type: "Rod" }, { type: "Staff" }, { type: "Wand" }],
    },
  });

  let quip = "My Demonomicon is not for sale. These will have to do for you.";
  res.render("pages/products/foci", { trinkets, quip });
});

// Potions page
router.get("/potions", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      type: "Potion",
    },
  });

  let quip =
    "At least one of these is poisoned. I'm sure I labeled it as such.";
  res.render("pages/products/potions", { trinkets, quip });
});

// Rings page
router.get("/rings", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      type: "Ring",
    },
  });

  let quip = "A dozen fingers, and not one for me...";
  res.render("pages/products/rings", { trinkets, quip });
});

// Weapons page
router.get("/weapons", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      type: { [Op.startsWith]: "Weapon" },
    },
  });

  let quip = "Don't cut yourself. At least not in my store.";
  res.render("pages/products/weapons", { trinkets, quip });
});

// Woundrous Items page
router.get("/wondrousitems", async (req, res) => {
  // get only the products that are armor

  let trinkets = await Products.findAll({
    where: {
      type: "Wondrous item",
    },
  });

  let quip = "Now these are trinkets.";
  res.render("pages/products/wondrousItems", { trinkets, quip });
});

module.exports = router;
