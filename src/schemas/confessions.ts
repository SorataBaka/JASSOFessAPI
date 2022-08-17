import mongoose from "mongoose";
const confessionSchema = new mongoose.Schema({
	confession: String,
	date: Date,
});

export default mongoose.model("Confessions", confessionSchema);
