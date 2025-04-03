import * as mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    message_text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read_status: { type: Boolean, default: false }
});

const messageModel = mongoose.model("Messages", messageSchema);
export default messageModel;
