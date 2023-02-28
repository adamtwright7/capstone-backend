const express = require("express");
const router = express.Router();
const { Scenes, ScenesRooms } = require("../sequelize/models");

// CREATE //
router.post("/createScene", async (req, res) => {
  const { name, image } = req.body;
  const scene = await Scenes.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("complete");
});
// CREATE //

// READ //
router.get("/viewScenes", async (req, res) => {
  const scenesInRoom = await ScenesRooms.findAll({
    where: {
      roomID: "notSure",
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
router.post("/updateScenes", async (req, res) => {
  const { id, name, image } = req.body;
  await Scenes.update(
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
router.delete("/deleteScenes", async (req, res) => {
  const sceneToDel = req.body.id;
  await Scenes.destroy({
    where: {
      id: sceneToDel,
    },
  });
  const remainingScenes = await Scenes.findAll({});
});
// DESTROY //

module.exports = router;
