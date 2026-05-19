const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast 6 Chars"],
      select: false, // never return password
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true },
);

// ----------------------------- Hash password before saving-----------------------------

userSchema.pre('save', async function () {
    if(!this.isModified('password')) return 

    this.password = await bcrypt.hash(this.password, 12)

   
    
})

// -------------------------compare password method-----------

userSchema.methods.comparePassword = async function (candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password)  
}

module.exports = mongoose.model("User", userSchema)