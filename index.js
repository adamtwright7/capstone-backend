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
  console.log(`A user connected with id ${socket.id}.`);

  // Joining a room in socket.io. Will use roomID.
  socket.on("join-room", (roomID) => {
    // This  leaves all other rooms because a socket in no rooms has its `socket.rooms` attribute start as only its ID, which is always first in the set.
    // This loop leaves all rooms that aren't first in the set.
    let firstIteration = true;
    socket.rooms.forEach((room) => {
      if (!firstIteration) {
        socket.leave(room);
      }
      firstIteration = false;
    });
    // console.log(socket.rooms);

    socket.join(roomID); // joins the given room
    // console.log(`A user joined a room with id`);
    // console.log(roomID);
    // console.log(socket.rooms);
  });

  socket.on("send-background", (data) => {
    // `data` needs to be {backgroundImage, roomID}
    console.log(
      `Background for room ${data.roomID} sent with ${data.backgroundImage}`
    );
    // This will emit back to the frontend (for everyone in the same room other than the current user.)
    socket.to(data.roomID).emit("receive-background", data.backgroundImage);
  });

  socket.on("send-token", (data) => {
    // data = { pieceToDropObj, roomID }
    socket.to(data.roomID).emit("receive-token", data.pieceToDropObj);
  });

  socket.on("send-remove-token", (data) => {
    socket.to(data.roomID).emit("receive-remove-token", data.tokenKey);
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
