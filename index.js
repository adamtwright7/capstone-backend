const express = require("express");
const app = express();
const PORT = process.env.PORT || 3050;

// cookie parser setup
const cookieParser = require("cookie-parser"); // not sure if needed now that we aren't using experess-session
app.use(cookieParser());

// cors setup
const cors = require("cors");
app.use(cors()); // allows any origin

// Socket.io setup
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // the URL for our fronted. Will be deployed later
    methods: ["GET", "POST"],
  },
});

// io.on listens to events that happen on the frontend.
// Some events are integrated, like "connection". Others are established on the frontend.
// See WebSocket.jsx any time we `socket.emit("event"`
io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  // for example, this listens to the "send message" event
  socket.on("send-message", (data) => {
    console.log(data);
  });
});

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

// listen with the server instead of the app for web socket.
server.listen(PORT, console.log(`Listening on port ${PORT}`));
