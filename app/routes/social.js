const express = require("express")
const router = express.Router()

const social_controller = require("../controllers/socialController")

router.delete("/social/link/:linkId", social_controller.delete_social_media_link)

router.get("/social/user/:username", social_controller.read_social_media_links)

router.patch("/social/:linkId", social_controller.update_social_media_links)
router.post("/social", social_controller.create_social_media_link)

module.exports = router;
