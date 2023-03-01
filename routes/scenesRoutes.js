const express = require("express");
const session = require("express-session");
const router = express.Router();
const { Scenes, ScenesRooms } = require("../sequelize/models");

// CREATE //
router.post("/create", async (req, res) => {
  const { name, image } = req.body;
  const scene = await Scenes.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const scenesInRoom = await ScenesRooms.create({
    sceneID: scene.id,
    roomID: req.session.room.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("scene created");
});
// CREATE //

// READ //
router.get("/view", async (req, res) => {
  const scenesInRoom = await ScenesRooms.findAll({
    where: {
      roomID: req.session.room.id,
    },
  });

  let scenes = [];
  for (const scene of scenesInRoom) {
    const thisScene = await Scenes.findOne({
      where: { id: scenesInRoom.roomID },
    });
    scenes.push(thisScene);
  }
  res.send(scenes);
});
// READ //

// UPDATE //
router.post("/update", async (req, res) => {
  const { name, image } = req.body;
  await Scenes.update(
    {
      name: name,
      image: image,
      updatedAt: new Date(),
    },
    {
      where: {
        id: { id },
      },
    }
  );
  res.send("scene updated");
});
// UPDATE //

// DESTROY //
router.delete("/delete", async (req, res) => {
  await Scenes.destroy({
    where: {
      id: { id },
    },
  });
  const remainingScenes = await ScenesRooms.findAll({
    where: {
      roomID: req.session.room.id,
    },
  });
  res.send("scene deleted");

  let scenes = [];
  for (const scene of scenesInRoom) {
    const thisScene = await Scenes.findOne({
      where: { id: remainingScenes.roomID },
    });
    scenes.push(thisScene);
  }
  res.send(scenes);
});
// DESTROY //

module.exports = router;
