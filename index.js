const express = require("express");
const app = express();
const PORT = 3010;
// importing stuff for sessions and cookies
app.use(express.static(__dirname + "/public"));
const session = require("express-session"); // for sessions
const cookieSession = require("cookie-session"); // for cookies
const bodyParser = require("body-parser");
const { Customers, Orders, Products } = require("./sequelize/models"); // replace this with magic item data later
const { Op } = require("sequelize"); // we're going to need some advanced querries
const bcrypt = require("bcrypt"); // for hashing passwords

// connect session sequelize
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["secrethaha"],
    maxAge: 14 * 24 * 60 * 60 * 1000,
  })
);

// body parser for forms
const { where } = require("sequelize");
const { application } = require("express");

// All the other middlewear
app.set("view engine", "ejs");

// session middlewear:
const authenticate = (req, res, next) => {
  if (req.session.user) {
    next(); // like a return statement for Middlewear
  } else {
    res.render("pages/login", { modal: "Log in first." });
  }
};

// basic home page get route
app.get("/", (req, res) => {
  res.render("pages/home");
});

// Load in the account routes.
const accountRoutes = require("./routes/account");
app.use("/account", accountRoutes);

// Load in the product pages.
const productsRoutes = require("./routes/products");
app.use("/products", productsRoutes);

/// Cart routes ---------------------------------------------------------

// When a user hits "add to cart" underneath an item, it sends them to this route with a '/?itemToAdd=' followed by the item's id.
app.post("/addToCart", authenticate, async (req, res) => {
  let productId = req.query.itemToAdd; // snagged from the add to cart button, which is actually a form
  let customerId = req.session.user.id; // snagged from the session information

  // Creates a row in the orders table that links a customer to an item
  Orders.create({
    productId,
    customerId,
    createdAt: new Date(),
  });

  // Redirects the user to the last page they were on
  res.redirect("back");
});

// Remove from cart
app.post("/removeFromCart", authenticate, async (req, res) => {
  let orderId = req.query.orderId; // snagged from the remove from cart button, which is actually a form
  let customerId = req.session.user.id; // snagged from the session information. Technically don't need this, but it makes me feel better :))

  // Destroys the row in the orders table that has this item
  await Orders.destroy({
    where: {
      id: orderId,
      customerId,
    },
  });

  // Redirects the user to the last page they were on
  res.redirect("/cart");
});

// Cart page. Populated with user data
app.get("/cart", authenticate, async (req, res) => {
  // Find all rows in the Orders table matching the current customer id.
  let customerId = req.session.user.id;
  let orders = await Orders.findAll({
    where: { customerId },
  });

  // Then use the product ids from those rows to populate the cart page.

  let trinkets = [];
  for (let order of orders) {
    currentTrinket = await Products.findOne({
      where: { id: order.productId },
    });
    currentTrinket.orderId = order.id; // tags each item in the cart with its unique ID on the Orders table so we can delete one at a time
    trinkets.push(currentTrinket);
  }

  res.render("pages/cart", { user: req.session.user, trinkets });
});

// Buy page. Right now, it's basically just a "sorry Tasha doesn't deliver here."
// In a full application, it would empty your cart and perhaps keep a record of your order in a different database.
app.get("/buy", authenticate, (req, res) => {
  res.render("pages/buy", { user: req.session.user });
});

// listen
app.listen(PORT, console.log(`Listening on port ${PORT}`));
