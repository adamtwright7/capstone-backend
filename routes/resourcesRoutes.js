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
  const { name, image } = req.body;
  const resource = await Resources.create({
    name: name,
    image: image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const resourcesRooms = await ResourcesRooms.create({
    roomID: req.session.room.id,
    resourceID: resource.dataValues.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.send("Resource created");
});
// CREATE //

// READ //
router.get("/view", async (req, res) => {
  const resourcesInRoom = await ResourcesRooms.findAll({
    where: {
      roomID: req.session.room.id,
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
  const resourceToDel = req.body.id;
  await Resources.destroy({
    where: {
      id: resourceToDel,
    },
  });
  res.send("resource deleted");
});
// DESTROY //

module.exports = router;
