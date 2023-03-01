const express = require("express");
const router = express.Router();
const { Rooms, UsersRooms } = require("../sequelize/models");

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

// READ //
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
  await Rooms.destroy({
    where: {
      id: roomToDel,
    },
  });
  const remainingRooms = await Rooms.findAll({});
});
// DESTROY //

module.exports = router;
