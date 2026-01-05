const { Schema, model, ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    diskSpace: { type: Number, default: 1024 ** 3 * 10 },
    usedSpace: { type: Number, default: 0 },
    avatar: { type: String },
    files: [{ type: ObjectId, ref: "File" }],
});

// Проверяем, существует ли модель уже
module.exports = mongoose.models.User || model("User", UserSchema);