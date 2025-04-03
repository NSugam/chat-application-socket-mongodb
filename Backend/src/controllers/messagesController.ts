import messageModel from "../models/messagesModel";
import userDataModel from "../models/userModel";

exports.getMessages = async (req: any, res: any) => {

    const oldMessages = await messageModel.find({
        $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
        ]
    })
    .populate("sender", "username email -_id")
    .populate("receiver", "username email -_id")
    .sort({ timestamp: -1 });

    return res.status(200).json({ message: `${req.user.username} chat data`, success: true, oldMessages })
}

exports.saveMessage = async (data: any) => {
    const { senderUsername, receiverUsername, messageText } = data

    const sender = await userDataModel.findOne({ username: senderUsername });
    const receiver = await userDataModel.findOne({ username: receiverUsername });

    if (!sender) throw new Error("Sender not found")

    if (!receiver) throw new Error("Receiver not found")

    await messageModel.create({
        sender: sender._id,
        receiver: receiver._id,
        message_text: messageText,
        read_status: false,
        timestamp: new Date()
    })

}
