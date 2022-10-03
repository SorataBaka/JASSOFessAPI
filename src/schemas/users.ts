import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    deletedAt: {
        type: Date,
    }
})

export default mongoose.model("Users", userSchema);