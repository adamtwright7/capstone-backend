const express = require("express");
const app = express();
const PORT = process.env.PORT || 3050;
const cookieParser = require("cookie-parser"); // not sure if needed now that we aren't using experess-session

app.use(cookieParser());

// cors setup
const cors = require("cors");
const corsoptions = { optionsSuccessStatus: 200, credentials: true };
app.use(cors(corsoptions)); // allows any origin

// Load in the account routes.
const accountRoutes = require("./routes/account");
app.use("/account", accountRoutes);

const roomsRoutes = require("./routes/roomsRoutes");
app.use("/rooms", roomsRoutes);

const scenesRoutes = require("./routes/scenesRoutes");
app.use("/scenes", scenesRoutes);

const resourcesRoutes = require("./routes/resourcesRoutes");
app.use("/resources", resourcesRoutes);

// test route

app.get("/", async (req, res) => {
  res.send("hit the test route");
});

// listen
app.listen(PORT, console.log(`Listening on port ${PORT}`));
