import * as mongoose from "mongoose"
// var mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: String,
    password: String,
})
var userDataModel = mongoose.model("User", userDataSchema)

export default userDataModel;