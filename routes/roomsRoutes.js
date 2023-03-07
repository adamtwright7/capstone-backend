const express = require("express");
const router = express.Router();
const {
  Users,
  Rooms,
  UsersRooms,
  Scenes,
  ScenesRooms,
  Resources,
  ResourcesRooms,
} = require("../sequelize/models");
const session = require("express-session");
const cookieSession = require("cookie-session"); // for cookies

// body parser stuff
const bodyParser = require("body-parser");

router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.use(
  cookieSession({
    name: "session",
    keys: ["secrethaha"],
    maxAge: 14 * 24 * 60 * 60 * 1000,
  })
);

// CREATE //
router.post("/create", async (req, res) => {
  const { name, image } = req.body;
  const room = await Rooms.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  req.session.room = room.dataValues;
  const userRoom = await UsersRooms.create({
    userID: req.session.user.id,
    roomID: req.session.room.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("room created");
});
// CREATE //

// Go into a room as though logging in as a user -- just storing req.session.room.
// Might be helpful for editting a room or entering a room that's already created
router.post("/login", async (req, res) => {
  const { id } = req.body; // have to use room ID because there can be multiple rooms of the same name.
  // We'll have to store the room ID somewhere on the frontend, like how Tasha's Trinkets stored the IDs of each product in the "add to cart" buttons.
  // This was done in URL variables.
  const room = await Rooms.findOne({
    where: { id },
  });
  req.session.room = room.dataValues;
  res.send("Logged into a room.");
});

// Add a user to an existing room.
router.post("/addUser", async (req, res) => {
  // find the user ID to add by their email.
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  // Add a user to the join table for the room.
  const userRoom = await UsersRooms.create({
    userID: user.id,
    roomID: req.session.room.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("User added to room.");
});

// READ // -- view all rooms belonging to a user
router.get("/view", async (req, res) => {
  const userRooms = await UsersRooms.findAll({
    where: {
      userID: req.session.user.id,
    },
  });

  let rooms = [];
  for (const room of userRooms) {
    const thisRoom = await Rooms.findOne({
      where: { id: room.roomID },
    });
    rooms.push(thisRoom);
  }
  res.send(rooms);
});
// READ //

// UPDATE //
router.post("/update", async (req, res) => {
  const { id } = req.session.room;
  const { name, image } = req.body;
  await Rooms.update(
    {
      name: name,
      image: image,
      updatedAt: new Date(),
    },
    {
      where: {
        id: id,
      },
    }
  );
});
// UPDATE //

// DESTROY //
router.delete("/delete", async (req, res) => {
  const roomToDelID = req.body.id;
  // follow the join tables to delete scenes and resources associated with that room
  const scenesInRoom = await ScenesRooms.findAll({
    where: {
      roomID: roomToDelID,
    },
  });

  for (const scene of scenesInRoom) {
    const scenesToDelete = await Scenes.destroy({
      where: {
        id: scene.dataValues.sceneID,
      },
    });
  }

  const resourcesInRoom = await ResourcesRooms.findAll({
    where: { roomID: roomToDelID },
  });

  for (const resource of resourcesInRoom) {
    const resourcesToDelete = await Resources.destroy({
      where: {
        id: resource.dataValues.resourceID,
      },
    });
  }

  // Then actually delete the room (and CASCADE will take care of the join tables).
  await Rooms.destroy({
    where: {
      id: roomToDelID,
    },
  });
  res.send("Room deleted.");
});
// DESTROY //

module.exports = router;
