var mongoose = require("mongoose");

const groupMembersSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const groupMembersModel = mongoose.model("GroupMembers", groupMembersSchema);

module.exports = groupMembersModel;
