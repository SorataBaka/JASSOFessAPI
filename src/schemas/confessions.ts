import mongoose from "mongoose";
const confessionSchema = new mongoose.Schema(
	{
		confession: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		likes: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Confessions", confessionSchema);
