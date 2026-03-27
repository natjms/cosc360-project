import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {

    const { username, password } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : "";

    const newUser = new User({
      username,
      password,
      imagePath
    });

    await newUser.save();

    res.json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Error saving user" });
  }
};