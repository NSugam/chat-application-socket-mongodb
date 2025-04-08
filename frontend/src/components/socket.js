import { io } from 'socket.io-client';

export const socket = io('https://socket.neupanesugam.com.np', {
    transports: ["websocket"],
    autoConnect: false
});

export const initializeSocket = (username, setOnlineUsers) => {

    if (!username) return;

    socket.connect()
    
    socket.emit("user-online", username);

    socket.on("online-users", async (users) => {
        await setOnlineUsers(users.filter((user) => user && user !== username));
    });
};