const express = require("express")
const router = express.Router()

const users_controller = require("../controllers/usersController")

router.patch("/users/:username", users_controller.update_one_user_by_username)
router.post("/users/create", users_controller.create_user)

router.get("/users/email/:email", users_controller.read_one_user_by_email) // Meant to be used with password reset, authorization not required
router.get("/users/:username", users_controller.read_one_user)

router.post("/users/login", users_controller.read_login)
router.post("/users/reset/password", users_controller.reset_password) // Meant to be used with password reset, authentication not required

router.put("/users/password/reset", users_controller.password_reset) // Temporary token provided TODO: Require API Key

module.exports = router;
