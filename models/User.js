const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: String
});

module.exports = model('User', userSchema);