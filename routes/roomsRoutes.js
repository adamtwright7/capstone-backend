const express = require("express");
const router = express.Router();
const { Rooms, UsersRooms } = require("../sequelize/models");
const session = require("express-session");

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
  const { id } = req.body; // have to use ID because there can be multiple rooms of the same name.
  // We'll have to store the room ID somewhere on the frontend, like how Tasha's Trinkets stored the IDs of each product in the "add to cart" buttons.
  // This was done in URL variables.
  const room = await Rooms.findOne({
    where: { id },
  });
  req.session.room = room.dataValues;
  res.send("Logged into a room.");
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
      where: { id: userRooms.roomID },
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
  const roomToDel = req.body.id;

  // follow the join tables to delete scenes and resources associated with that room

  // Then actually delete the room (and CASCADE will take care of the join tables).
  await Rooms.destroy({
    where: {
      id: roomToDel,
    },
  });
  const remainingRooms = await Rooms.findAll({});
  res.send("Room deleted.");
});
// DESTROY //

module.exports = router;
