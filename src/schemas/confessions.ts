import mongoose from "mongoose";
const confessionSchema = new mongoose.Schema(
	{
		confession: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Confessions", confessionSchema);
