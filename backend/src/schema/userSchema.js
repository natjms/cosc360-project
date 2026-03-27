import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  imagePath: String
});

export default mongoose.model("User", userSchema);