const express = require('express')
const { authorizeRoles } = require('../middleware/roleMiddleware')
const { getChatHistory, sendMessage } = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.use(protect)

router.post('/:pathId', authorizeRoles('student'), sendMessage)
router.get('/:pathId/history', authorizeRoles("student"), getChatHistory)

module.exports = router