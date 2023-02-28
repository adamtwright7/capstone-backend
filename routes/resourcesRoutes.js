const express = require("express");
const router = express.Router();
const { Resources } = require("../sequelize/models");

// CREATE //
router.post("/create-resource", (req, res) => {
  const { name, image } = req.body;
  const resource = async () =>
    await Resources.create({
      name: name,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
});
// CREATE //

// READ //
const { name } = req.body;
const resources = await Resources.findAll({
  where: {
    name: { name },
  },
});
// READ //

// UPDATE //
router.post("/update-resource", async (req, res) => {
  const { name, image } = req.body;
  await Resources.update({
    name: name,
    image: image,
    updatedAt: new Date(),
  });
});
// UPDATE //

// DESTROY //
router.post("/delete-resource/:name", async (req, res) => {
  const resourceToDel = req.params.id;
  await Resources.destroy({
    where: {
      id: resourceToDel,
    },
  });
  const remainingResources = await Resources.findAll({});
});
// DESTROY //

module.exports = router;
