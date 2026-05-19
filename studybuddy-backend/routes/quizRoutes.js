const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { authorizeRoles } = require('../middleware/roleMiddleware')
const {
  generateQuizHandler,
  submitQuiz,
  getQuizResult,
} = require('../controllers/quizController')

router.use(protect)

router.post('/:pathId/generate', authorizeRoles('student'), generateQuizHandler)
router.post('/:pathId/submit', authorizeRoles('student'), submitQuiz)
router.get('/:pathId/result', authorizeRoles('student'), getQuizResult)

module.exports = router