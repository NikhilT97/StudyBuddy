const express = require('express');
const cors = require('cors')
const helmet = require('helmet') //read about this
const morgan = require('morgan') // RAT
const rateLimit = require('express-rate-limit')

const app = express();

// ------------------------Security Middleware -------------------------

app.use(helmet())
app.use(cors())

// ------------------------Rate Limiter----------------------

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message:'Too many requests, pleasae try after 15 minutes.'
})

app.use('/api', limiter)

// ------------------------Request Logger----------------------
app.use(morgan('dev'))

// -------------------------Body Parser-----------------------
app.use(express.json())

// ------------------------health check route----------------

app.get('/', (req,res)=> {
    res.json({message:'📚 StudyBuddy API is running!'})
})

//--------------- Routes -------------------------------
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const pathRoutes = require('./routes/pathRoutes')
app.use('/api/paths', pathRoutes)

const chatRoutes = require('./routes/chatRoutes')
app.use('/api/chat',chatRoutes)

const quizRoutes = require('./routes/quizRoutes')
app.use('/api/quiz', quizRoutes)

const adminRoutes = require('./routes/adminRoutes')
app.use('/api/admin', adminRoutes)

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// ------------------------404 handler-------------------------
app.use( (req, res) => {
    res.status(404).json({message:'Route not found'})
})

module.exports = app

