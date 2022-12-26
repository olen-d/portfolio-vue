const express = require('express')
const router = express.Router()

const welcome_controller = require('../controllers/welcomeController')

router.post('/welcome', welcome_controller.create_welcome_item)

router.get('/welcome', welcome_controller.read_welcome_items)
router.get('/welcome/all', welcome_controller.read_welcome_items_all)
router.get('/welcome/id/:welcomeItemId', welcome_controller.read_welcome_item_by_id)

router.patch('/welcome/:welcomeItemId', welcome_controller.update_welcome_item)

router.delete('/welcome', welcome_controller.delete_welcome_item)

module.exports = router
