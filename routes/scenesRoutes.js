const express = require("express");
const router = express.Router();
const { Scenes, ScenesRooms } = require("../sequelize/models");

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
  const { name, image, roomID } = req.body;
  const scene = await Scenes.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const scenesInRoom = await ScenesRooms.create({
    sceneID: scene.dataValues.id,
    roomID: roomID,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("scene created");
});
// CREATE //

// READ // -- view all the scenes in a given room. roomID comes from state.room on the frontend.
router.post("/view", async (req, res) => {
  const { roomID } = req.body;
  const scenesInRoom = await ScenesRooms.findAll({
    where: {
      roomID: roomID,
    },
  });

  let scenes = [];
  for (const scene of scenesInRoom) {
    const thisScene = await Scenes.findOne({
      where: { id: scene.sceneID }, // hopefully dot notation doesn't try to read the variable "roomID". We do want the literal roomID key.
    });
    scenes.push(thisScene);
  }
  res.send(scenes);
});
// READ //

// UPDATE //
router.post("/update", async (req, res) => {
  const { sceneID, name, image } = req.body; // again, sceneID should come from URL parameters later.
  await Scenes.update(
    {
      name: name,
      image: image,
      updatedAt: new Date(),
    },
    {
      where: {
        id: sceneID,
      },
    }
  );
  res.send("scene updated");
});
// UPDATE //

// DESTROY //
router.delete("/delete", async (req, res) => {
  const { sceneID } = req.body; // again, sceneID should come from URL parameters later.
  await Scenes.destroy({
    where: {
      id: sceneID,
    },
  });
  res.send("scene deleted");
});
// DESTROY //

module.exports = router;
