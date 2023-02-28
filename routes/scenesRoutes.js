const express = require("express");
const router = express.Router();
const { Scenes } = require("../sequelize/models");

// CREATE //
router.post("/create-scene", (req, res) => {
  const { name, image } = req.body;
  const scene = async () =>
    await Scenes.create({
      name: name,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
});
// CREATE //

// READ //
const { name } = req.body;
const scenes = await Scenes.findAll({
  where: {
    name: { name },
  },
});
// READ //

// UPDATE //
router.post("/update-scene", async (req, res) => {
  const { name, image } = req.body;
  await Scenes.update({
    name: name,
    image: image,
    updatedAt: new Date(),
  });
});
// UPDATE //

// DESTROY //
router.post("/delete-scene/:name", async (req, res) => {
  const sceneToDel = req.params.id;
  await Scenes.destroy({
    where: {
      id: sceneToDel,
    },
  });
  const remainingScenes = await Scenes.findAll({});
});
// DESTROY //

module.exports = router;
