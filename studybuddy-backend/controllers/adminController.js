const User = require('../models/User')
const LearningPath = require('../models/LearningPath')
const Quiz = require('../models/Quiz')
const ChatSession = require('../models/ChatSession')

// ──----- Get all users ─────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Get all learning paths ────────────────────────────
const getAllPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find()
      .populate('userId', 'name email')  // show user info
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'All learning paths fetched',
      count: paths.length,
      paths,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Get platform analytics ────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    // Run all queries in parallel for speed
    const [
      totalUsers,
      totalPaths,
      totalQuizzes,
      totalChats,
      submittedQuizzes,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      LearningPath.countDocuments(),
      Quiz.countDocuments(),
      ChatSession.countDocuments(),
      Quiz.find({ isSubmitted: true }).select('score'),
    ])

    // Calculate average quiz score
    const averageScore =
      submittedQuizzes.length > 0
        ? Math.round(
            submittedQuizzes.reduce((sum, q) => sum + q.score, 0) /
              submittedQuizzes.length
          )
        : 0

    // Most popular topics
    const popularTopics = await LearningPath.aggregate([
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    res.status(200).json({
      message: 'Analytics fetched successfully',
      analytics: {
        totalUsers,
        totalPaths,
        totalQuizzes,
        totalChats,
        totalSubmittedQuizzes: submittedQuizzes.length,
        averageQuizScore: `${averageScore}%`,
        popularTopics,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Delete a user ─────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin' })
    }

    await User.findByIdAndDelete(req.params.userId)

    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getAllUsers, getAllPaths, getAnalytics, deleteUser }