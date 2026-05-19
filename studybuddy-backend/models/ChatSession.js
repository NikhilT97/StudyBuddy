const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        require: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const chatSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        learningPathId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LearningPath',
            required: true,
        },
        messages: [messageSchema],
    },
    {timestamps: true}
)

module.exports = mongoose.model('ChatSession', chatSessionSchema)