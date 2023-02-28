const express = require("express");
const router = express.Router();
const { Resources, ResourcesRooms } = require("../sequelize/models");

// CREATE //
router.post("/createResource", async (req, res) => {
  const { name, image } = req.body;
  const resource = await Resources.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("complete");
});
// CREATE //

// READ //
router.get("/viewResources", async (req, res) => {
  const resourcesInRoom = await ResourcesRooms.findAll({
    where: {
      roomID: "notSure",
    },
  });

  let resources = [];
  for (const resource of resourcesInRoom) {
    const thisResource = await Resource.findOne({
      where: { id: resourcesInRoom.roomID },
    });
    resources.push(thisResource);
  }
  res.send(resources);
});
// READ //

// UPDATE //
router.post("/updateResources", async (req, res) => {
  const { id, name, image } = req.body;
  await Resources.update(
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
router.delete("/deleteResources", async (req, res) => {
  const resourceToDel = req.body.id;
  await Resources.destroy({
    where: {
      id: resourceToDel,
    },
  });
  const remainingResources = await Resources.findAll({});
});
// DESTROY //

module.exports = router;
