import * as mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    group_name: { type: String, required: true, unique: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now }
});

const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;
