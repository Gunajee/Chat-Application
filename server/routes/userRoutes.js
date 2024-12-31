const router = require("express").Router();
// const { default: SetAvatar } = require("../../client/src/pages/SetAvatar");
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
module.exports = { userRoutes: router };
