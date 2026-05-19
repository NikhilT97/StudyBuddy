const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// --------Register---------------------------
const register = async (req,res) => {
    
    try{
        const {name, email, password, role} = req.body
        //if user already exists
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message:`Email already registered`})
        }

        const user = await User.create({name,email,password, role})

        const token = generateToken(user._id, user.role)

        res.status(201).json({message:"Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }

        })
    } catch (error) {
        res.status(500).json({message:'Server error', error: error.message})
    }

}

// ----------------Login-----------------------

const login = async (req, res) => {
    try{
        const {email, password} = req.body

        //select: false on password field - must explicitly request
        const user = await User.findOne({email}).select('+password')
        
        if(!user){
            return res.status(401).json({message: 'Invalid email or password'})
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch) {
            return res.status(401).json({message: 'invalid email or password'})
        }

        const token = generateToken(user._id, user.role)

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch(error) {
        res.status(500).json({messae: "Server error", error: error.messae})
    }
}

module.exports = { register, login}