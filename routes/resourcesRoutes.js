const express = require("express");
const router = express.Router();
const { Resources, ResourcesRooms } = require("../sequelize/models");
const session = require("express-session");
const cookieSession = require("cookie-session"); // for cookies

// body parser stuff
const bodyParser = require("body-parser");

router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.use(
  cookieSession({
    name: "session",
    keys: ["secrethaha"],
    maxAge: 14 * 24 * 60 * 60 * 1000,
  })
);

// CREATE //
router.post("/create", async (req, res) => {
  const { roomID, name, image } = req.body;
  const resource = await Resources.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const resourcesRooms = await ResourcesRooms.create({
    roomID: roomID,
    resourceID: resource.dataValues.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("Resource created");
});
// CREATE //

// READ //
router.post("/view", async (req, res) => {
  const { roomID } = req.body;
  const resourcesInRoom = await ResourcesRooms.findAll({
    where: {
      roomID: roomID,
    },
  });

  let resources = [];
  for (const resource of resourcesInRoom) {
    const thisResource = await Resources.findOne({
      where: { id: resource.roomID },
    });
    resources.push(thisResource);
  }
  res.send(resources);
});
// READ //

// DESTROY //
router.delete("/delete", async (req, res) => {
  const { resourceID } = req.body;
  await Resources.destroy({
    where: {
      id: resourceID,
    },
  });
  // Also need to delete its columns of the ResourcesRooms join table.
  await ResourcesRooms.destroy({
    where: {
      resourceID: resourceID,
    },
  });
  res.send("resource deleted");
});
// DESTROY //

module.exports = router;
