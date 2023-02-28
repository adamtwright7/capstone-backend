const express = require("express");
const router = express.Router();
const { Rooms } = require("../sequelize/models");

// CREATE //
router.post("/createRoom", async (req, res) => {
  const { name, image } = req.body;
  const room = await Rooms.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send(room);
});
// CREATE //

// READ //
// const { name } = req.body;
// const rooms = async () => {
//   await Rooms.findAll({
//     where: {
//       name: { name },
//     },
//   });
// };
// READ //

// UPDATE //
router.post("/update-room", async (req, res) => {
  const { name, image } = req.body;
  await Rooms.update({
    name: name,
    image: image,
    updatedAt: new Date(),
  });
});
// UPDATE //

// DESTROY //
router.post("/delete-room/:name", async (req, res) => {
  const roomToDel = req.params.id;
  await Rooms.destroy({
    where: {
      id: roomToDel,
    },
  });
  const remainingRooms = await Resources.findAll({});
});
// DESTROY //

module.exports = router;
