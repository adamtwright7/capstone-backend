const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;

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
