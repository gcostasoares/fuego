const express              = require("express");
const router               = express.Router();
const authenticateAdmin    = require("../../adminAuthMiddleware");
const usersController      = require("./adminUsersController");

router.use(authenticateAdmin);

router.get(   "/",     usersController.getAllUsers);
router.get(   "/:id",  usersController.getUserById);
router.post(  "/",     usersController.createUser);
router.put(   "/:id",  usersController.updateUser);
router.delete("/:id",  usersController.deleteUser);

module.exports = router;
