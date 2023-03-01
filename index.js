const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
// importing stuff for sessions and cookies
app.use(express.static(__dirname + "/public"));
const session = require("express-session"); // for sessions
const cookieSession = require("cookie-session"); // for cookies
const bodyParser = require("body-parser");
const {
  Resources,
  ResourcesRooms,
  Rooms,
  Scenes,
  ScenesRooms,
  Users,
  UsersRooms,
} = require("./sequelize/models"); // replace this with magic item data later
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

// session middlewear:
const authenticate = (req, res, next) => {
  if (req.session.user) {
    next(); // like a return statement for Middlewear
  } else {
    res.render("pages/login", { modal: "Log in first." });
  }
};

// Load in the account routes.
const accountRoutes = require("./routes/account");
app.use("/account", accountRoutes);

const roomsRoutes = require("./routes/roomsRoutes");
app.use("/rooms", roomsRoutes);

const scenesRoutes = require("./routes/scenesRoutes");
app.use("/scenes", scenesRoutes);

const resourcesRoutes = require("./routes/resourcesRoutes");
app.use("/resources", resourcesRoutes);

/// Other queries -- should be moved to other files

// CRUD routes for Rooms (on the "hallway" page that loads all the rooms)

// CRUD routes for Scenes (inside of a room)

// CRUD routes for Resources (inside of a room)

// listen
app.listen(PORT, console.log(`Listening on port ${PORT}`));
