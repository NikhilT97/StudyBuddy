const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')
const { generatePath, getMyPaths, getPathById, updateProgress } = require('../controllers/pathController')
const router = express.Router()

//All routes protected - must be logged in

router.use(protect)


//Students only
router.post('/generate', authorizeRoles('student'), generatePath)
router.get('/my-paths', authorizeRoles('student'), getMyPaths)
router.get("/:id", authorizeRoles('student'), getPathById)
router.patch("/:id/progress", authorizeRoles('student'), updateProgress)

module.exports = router
