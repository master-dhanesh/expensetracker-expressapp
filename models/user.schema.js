const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is Required"],
        minLength: [3, "Username must be atleast 3 characters long"],
        maxLength: [15, "Username must not exceed more than 15 characters"],
        trim: true,
    },
    password: String,
    email: {
        type: String,
        required: [true, "Email is Required"],
        lowercase: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Invalid Email Format"],
    },
    avatar: {
        type: String,
        default: "default.jpg",
    },
});
// userSchema.plugin(plm, { usernameField: "email" }); // for email as username // createStrategy
userSchema.plugin(plm);
const UserSchema = mongoose.model("User", userSchema);
module.exports = UserSchema;
