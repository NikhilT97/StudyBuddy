const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')
const {
  getAllUsers,
  getAllPaths,
  getAnalytics,
  deleteUser,
} = require('../controllers/adminController')

// All admin routes — must be logged in AND must be admin
router.use(protect)
router.use(authorizeRoles('admin'))

router.get('/users', getAllUsers)
router.get('/paths', getAllPaths)
router.get('/analytics', getAnalytics)
router.delete('/users/:userId', deleteUser)

module.exports = router