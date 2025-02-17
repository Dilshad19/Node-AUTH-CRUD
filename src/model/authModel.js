import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        const emailRegx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegx.test(email);
      },
      message: "Email format is invalid",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        return password.length >= 8;
      },
      message: "Password must be at least 8 characters long",
    },
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

// Hashing password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Remove confirmPassword before saving
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.confirmPassword = undefined;
  }
  next();
});

// Create and export the model
const authUser = mongoose.model("authUser", userSchema);

export default authUser;
