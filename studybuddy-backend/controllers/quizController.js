const Quiz = require('../models/Quiz')
const LearningPath = require('../models/LearningPath')
const { generateQuiz } = require('../services/aiService')

// ── Generate Quiz ─────────────────────────────────────
const generateQuizHandler = async (req, res) => {
  try {
    const { pathId } = req.params

    // Verify learning path belongs to this user
    const learningPath = await LearningPath.findOne({
      _id: pathId,
      userId: req.user._id,
    })          

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' })
    }

    // Check if quiz already exists for this path
    const existingQuiz = await Quiz.findOne({
      userId: req.user._id,
      learningPathId: pathId,
      isSubmitted: false,
    })

    if (existingQuiz) {
      return res.status(200).json({
        message: 'Quiz already generated, please submit it first',
        quiz: existingQuiz,
      })
    }

    // Generate quiz from AI
    const questions = await generateQuiz(learningPath.topic)

    const quiz = await Quiz.create({
      userId: req.user._id,
      learningPathId: pathId,
      questions,
      totalQuestions: questions.length,
    })

    // Send questions WITHOUT correct answers to student
    const questionsWithoutAnswers = quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }))

    res.status(201).json({
      message: 'Quiz generated successfully',
      quizId: quiz._id,
      totalQuestions: quiz.totalQuestions,
      questions: questionsWithoutAnswers, // ✅ no answers leaked!
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Submit Quiz ───────────────────────────────────────
const submitQuiz = async (req, res) => {
  try {
    const { pathId } = req.params
    const { answers } = req.body
    // answers = [{ questionIndex: 0, selectedAnswer: "A" }, ...]

    const quiz = await Quiz.findOne({
      userId: req.user._id,
      learningPathId: pathId,
      isSubmitted: false,
    })

    if (!quiz) {
      return res.status(404).json({ message: 'No active quiz found' })
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' })
    }

    // Calculate score
    let correctCount = 0
    const results = quiz.questions.map((q, index) => {
      const userAnswer = answers.find(a => a.questionIndex === index)
      const isCorrect = userAnswer?.selectedAnswer === q.correctAnswer

      if (isCorrect) correctCount++

      return {
        question: q.question,
        yourAnswer: userAnswer?.selectedAnswer || 'Not answered',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const scorePercentage = Math.round((correctCount / quiz.totalQuestions) * 100)

    // Save results
    quiz.userAnswers = answers
    quiz.score = scorePercentage
    quiz.isSubmitted = true
    await quiz.save()

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score: scorePercentage,
      correctAnswers: correctCount,
      totalQuestions: quiz.totalQuestions,
      results,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Get Quiz Result ───────────────────────────────────
const getQuizResult = async (req, res) => {
  try {
    const { pathId } = req.params

    const quiz = await Quiz.findOne({
      userId: req.user._id,
      learningPathId: pathId,
      isSubmitted: true,
    })

    if (!quiz) {
      return res.status(404).json({ message: 'No submitted quiz found' })
    }

    res.status(200).json({
      score: quiz.score,
      totalQuestions: quiz.totalQuestions,
      submittedAt: quiz.updatedAt,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { generateQuizHandler, submitQuiz, getQuizResult }