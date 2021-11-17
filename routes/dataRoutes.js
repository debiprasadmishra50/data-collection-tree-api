const express = require("express");

const dataController = require("./../controllers/dataController");

const router = express.Router(); // Creating Routers

router.route("/insert").post(dataController.addOne);

router.route("/query").get(dataController.getOne);

module.exports = router;
