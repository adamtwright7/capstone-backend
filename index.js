const express = require("express");
const app = express();
const PORT = process.env.PORT || 3050;
const cors = require("cors");
const session = require("express-session");

app.use(cors()); // allows any origin

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
