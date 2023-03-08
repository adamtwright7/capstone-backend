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

// body parser stuff
const bodyParser = require("body-parser");

router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

// CREATE //
router.post("/create", async (req, res) => {
  const { userID, name, image } = req.body;
  const room = await Rooms.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const roomID = room.dataValues.id;

  const userRoom = await UsersRooms.create({
    userID: userID, // comes from frontend state.user
    roomID: roomID,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send(room.dataValues); // to be stored in state.room
});
// CREATE //

// Go into a room as though logging in as a user -- just storing req.session.room.
// Might be helpful for editting a room or entering a room that's already created
router.post("/login", async (req, res) => {
  const { id } = req.body; // have to use room ID because there can be multiple rooms of the same name.
  // We'll have to store the room ID somewhere in the click of a room picture on the frontend,
  // like how Tasha's Trinkets stored the IDs of each product in the "add to cart" buttons.
  // This was done in URL variables.
  const room = await Rooms.findOne({
    where: { id },
  });
  res.send(room.dataValues); // to be stored in state.room
});

// Add a user to an existing room.
router.post("/addUser", async (req, res) => {
  const { email, roomID } = req.body; // frontend needs to get email from user input and roomID from state.room
  // find the user ID to add by their email.
  const user = await Users.findOne({
    where: {
      email: email,
    },
  });

  // Add a user to the join table for the room.
  const userRoom = await UsersRooms.create({
    userID: user.id,
    roomID: roomID,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send({ message: "User added to room." });
});

// READ // -- view all rooms belonging to a user
router.post("/view", async (req, res) => {
  const { userID } = req.body; // from state.user
  const userRooms = await UsersRooms.findAll({
    where: {
      userID,
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
  const { roomID, name, image } = req.body;
  // roomID needs to make it here from the profile page -- again, probably in URL parameters inside the edit room button.
  const room = await Rooms.update(
    {
      name: name,
      image: image,
      updatedAt: new Date(),
    },
    {
      where: {
        id: roomID,
      },
    }
  );
  // update doesn't send back data (just a 1 or 0 for success or fail), and we're not in a room yet anyway,
  // so we can't and shouldn't send back data to be stored in redux.
  res.send({ message: "Room updated." });
});
// UPDATE //

// DESTROY //
router.delete("/delete", async (req, res) => {
  const { roomID } = req.body;
  // follow the join tables to delete scenes and resources associated with that room
  const scenesInRoom = await ScenesRooms.findAll({
    where: {
      roomID: roomID,
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
    where: { roomID: roomID },
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
      id: roomID,
    },
  });
  res.send({ message: "Room deleted." });
});
// DESTROY //

module.exports = router;
