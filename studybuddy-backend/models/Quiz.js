const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
    label: String,
    text: String
})

const questionSchema = new mongoose.Schema({
    question: String,
    options: [optionSchema],
    correctAnswer: String,
    explanation: String
})

const quizSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        learningPathId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LeaerningPath',
            required: true
        },
        questions: [questionSchema],
        userAnswers:[
            {
                questionIndex: Number,
                selectedAnswer: String
            },
        ],
        score: {
            type: Number,
            default: null,
        },
        totalQuestions: Number,
        isSubmitted: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('Quiz', quizSchema)