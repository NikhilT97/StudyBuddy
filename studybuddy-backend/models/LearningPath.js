const mongoose = require('mongoose')

const moduleSchema = new mongoose.Schema({
    order: Number,
    title: String,
    description: String,
    estimatedDays: Number,
    topics: [String],
    isCompleted: {
        type: Boolean,
        default: false,
    }
})

const learningPathSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        topic: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate','advanced'],
            default: 'beginner'
        },
        modules: [moduleSchema],
        progress: {
            type: Number,
            default: 0, //percentage 0 to 100
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('LearningPath', learningPathSchema)