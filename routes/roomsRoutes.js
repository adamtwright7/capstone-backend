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

// View all rooms belonging to a user
router.post("/viewRooms", async (req, res) => {
  const { userID } = req.body; // from state.user
  // finds all rows in the UsersRooms join table with the given userID
  const userRooms = await UsersRooms.findAll({
    where: {
      userID,
    },
  });
  // Loops through the rows returned above, looks at each row's roomID, then finds and returns the room with that ID
  let rooms = [];
  for (const room of userRooms) {
    const thisRoom = await Rooms.findOne({
      where: { id: room.roomID },
    });
    rooms.push(thisRoom);
  }
  res.send(rooms);
});

// View all users in a given room
router.post("/viewUsers", async (req, res) => {
  const { roomID } = req.body; // from state.room
  const userRooms = await UsersRooms.findAll({
    where: {
      roomID,
    },
  });
  let users = [];
  for (const user of userRooms) {
    const thisUser = await Users.findOne({
      where: { id: user.userID },
    });
    users.push(thisUser);
  }
  res.send(users);
});

// UPDATE //
router.post("/update", async (req, res) => {
  const { roomID, name, image } = req.body;

  // Only updates the name if it's a non-empty string name and the same for image.
  if (name) {
    await Rooms.update(
      {
        name: name,
        updatedAt: new Date(),
      },
      {
        where: {
          id: roomID,
        },
      }
    );
  }
  if (image) {
    await Rooms.update(
      {
        image: image,
        updatedAt: new Date(),
      },
      {
        where: {
          id: roomID,
        },
      }
    );
  }

  // update doesn't send back data (just a 1 or 0 for success or fail), and we're not in a room yet anyway,
  // so we can't and shouldn't send back data to be stored in redux.
  res.send({ message: "Room updated." });
});
// UPDATE //

// DESTROY //
router.delete("/delete", async (req, res) => {
  const { roomID } = req.body;
  // follow the join tables to delete scenes and resources associated with that room,
  // as well as any lines in UsersRooms that refer to it.

  // delete any rows in UsersRooms that refer to the room:
  await UsersRooms.destroy({
    where: {
      roomID,
    },
  });

  // delete the scenes in that room
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

  // delete the resources in that room
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
