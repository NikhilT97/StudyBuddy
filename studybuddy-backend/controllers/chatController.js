const ChatSession = require('../models/ChatSession')
const LearningPath = require('../models/LearningPath')
const { chatWithTutor } = require('../services/aiService')

// ── Send message & get AI reply ───────────────────────
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { pathId } = req.params

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    // Verify learning path belongs to this user
    const learningPath = await LearningPath.findOne({
      _id: pathId,
      userId: req.user._id,
    })

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' })
    }

    // Find existing chat session or create new one
    let session = await ChatSession.findOne({
      userId: req.user._id,
      learningPathId: pathId,
    })

    if (!session) {
      session = new ChatSession({
        userId: req.user._id,
        learningPathId: pathId,
        messages: [],                 // ✅ correct name
      })
      await session.save()
    }

    // Safety check before push
    if (!session.messages) {
      session.messages = []
    }

    // Add user message to session
    session.messages.push({ role: 'user', content: message })

    // Build messages array for AI (only role + content)
    const aiMessages = session.messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Call AI tutor
    const aiReply = await chatWithTutor(learningPath.topic, aiMessages)

    // Save AI reply to session
    session.messages.push({ role: 'assistant', content: aiReply })
    await session.save()

    res.status(200).json({
      message: 'Success',
      userMessage: message,
      aiReply,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── Get chat history ──────────────────────────────────
const getChatHistory = async (req, res) => {
  try {
    const { pathId } = req.params

    const session = await ChatSession.findOne({
      userId: req.user._id,
      learningPathId: pathId,
    })

    if (!session) {
      return res.status(200).json({ messages: [] })
    }

    res.status(200).json({ messages: session.messages })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { sendMessage, getChatHistory }