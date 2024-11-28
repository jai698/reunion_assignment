const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth");

router.get("/getTasks",auth,taskController.getTasks);
router.post("/createTask",auth,taskController.createTask);
router.put("/updateTask/:id",auth,taskController.updateTask);
router.delete("/deleteTask/:id",auth,taskController.deleteTask);

module.exports = router;
