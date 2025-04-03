import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import messageModel from "./src/models/messagesModel";
import userDataModel from "./src/models/userModel";
import groupModel from "./src/models/groupModel";

const messagesController = require('./src/controllers/messagesController')

const onlineUsers = new Map();
const groupSockets = new Map();

export const initializeSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            credentials: true,
            origin: "*",
        },
    });
    io.listen(5050)

    io.on("connection", (socket) => {

        socket.on("user-online", (userId) => {
            onlineUsers.set(userId, socket.id);

            if (onlineUsers.has(null)) onlineUsers.delete(null)

            io.emit("online-users", Array.from(onlineUsers.keys()));
        })

        socket.on("send-message", (data) => {
            const { senderUsername, receiverUsername, messageText } = data

            messagesController.saveMessage(data) //Store msg to DB

            const senderSocketId = onlineUsers.get(senderUsername);
            const receiverSocketId = onlineUsers.get(receiverUsername);

            if (receiverSocketId)
                io.to(receiverSocketId).emit("receive-message", data);

            if (senderSocketId)
                io.to(senderSocketId).emit("sent-message", data);

        })

        socket.on("join-chat", async (data) => {
            const { senderUsername, receiverUsername } = data;

            if (senderUsername === undefined || receiverUsername === undefined) return;

            const senderUser: any = await userDataModel.findOne({ username: senderUsername });
            const receiverUser: any = await userDataModel.findOne({ username: receiverUsername });

            const oldMessages = await messageModel.find({
                $or: [
                    { sender: senderUser._id, receiver: receiverUser._id },
                    { sender: receiverUser._id, receiver: senderUser._id }
                ]
            })
                .populate("sender", "username email -_id")
                .populate("receiver", "username email -_id")
                .sort({ timestamp: 1 });

            socket.emit("join-chat-messages", oldMessages)
        })

        socket.on("join-group", async ({ groupName, username }) => {
            if (!groupName || !username) return;

            socket.join(groupName);

            if (!groupSockets.has(groupName)) groupSockets.set(groupName, new Set());

            groupSockets.get(groupName).add(username);

            const group:any = await groupModel.findOne({ group_name: groupName })
            if (!group)  throw new Error ("Group not found")

            const oldMessages = await messageModel.find({ group: group._id })
            .populate("sender", "username email -_id")
            .populate("receiver", "username email -_id")
            .sort({ timestamp: 1 });

            socket.emit("join-group-messages", oldMessages);
        })

        socket.on("send-group-message", async ({ groupName, senderUsername, messageText }) => {
            if (!groupName || !senderUsername || !messageText.trim()) return;

            const sender = await userDataModel.findOne({ username: senderUsername });
            if (!sender) return

            const group = await groupModel.findOne({ group_name: groupName });
            if (!group) return

            const newMessage = await messageModel.create({
                sender: sender._id,
                group: group._id,
                message_text: messageText,
            });

            io.to(groupName).emit("receive-group-message", {
                senderUsername,
                messageText,
                timestamp: newMessage.timestamp
            });
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("online-users", Array.from(onlineUsers.keys()));
                    break;
                }
            }
        });
    });

    return io;
};
