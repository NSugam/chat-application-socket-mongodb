import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context/SharedState';
import { socket } from './socket';

export default function Chat() {
    const { username } = useParams();
    const states = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!username) return;

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            // console.log("Received:", message);
        };

        const handleSentMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            // console.log("Sent:", message);
        };

        const handleJoinChat = (chatHistory) => {
            setMessagesHistory(chatHistory);
            console.log("Chat history loaded:", chatHistory);
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("sent-message", handleSentMessage);
        socket.on("join-chat-messages", handleJoinChat);

        socket.emit("join-chat", {
            senderUsername: states.user.username,
            receiverUsername: username
        });

        return () => {
            socket.off('receive-message');
            socket.off('sent-message');
            socket.off('join-chat');
        };

    }, [username, states.user?.username]);

    const sendMessage = () => {
        socket.emit('send-message', {
            senderUsername: states.user.username,
            receiverUsername: username,
            messageText: input,
        });
        setInput('');
    };

    return (
        <div className='container col-sm-7 col-md-4 rounded bg-dark mt-4' style={{ height: '75vh', overflowY: 'auto' }}>
            <h6 className='text-light mt-2 p-2 sticky-top text-dark bg-warning rounded' style={{ zIndex: 100 }}>
                {states.onlineUsers.includes(username) ?
                    <span className="text-success me-2" style={{ fontSize: '14px' }}>🟢</span> :
                    <span className="text-success me-2" style={{ fontSize: '14px' }}>🔴</span>
                }
                {username}
            </h6>
            <hr className='text-light' />
            <div className="chat-history-messages mx-4">
                {messagesHistory.length > 0 ? (
                    messagesHistory
                        .filter((msg) =>
                            (msg.sender.username === username || msg.receiver.username === states.user.username) ||
                            (msg.receiver.username === username && msg.sender.username === states.user.username)
                        )
                        .map((msg, index) => (
                            <div key={index} className="my-3 container bg-light p-2 rounded rounded-5">
                                <strong className={msg.sender.username === username ? "text-danger" : "text-success"}>
                                    {msg.sender.username === states.user.username ? "Me" : msg.sender.username}:
                                </strong>
                                <span className="text-dark"> {msg.message_text}</span>
                            </div>
                        ))
                ) : (
                    <div className="text-center text-light">No any messages yet</div>
                )}

            </div>
            <div className="chat-messages mx-4">
                {messages
                    .filter((msg) =>
                        (msg.senderUsername === username && msg.receiverUsername === states.user.username) ||
                        (msg.receiverUsername === username && msg.senderUsername === states.user.username)
                    )
                    .map((msg, index) => (
                        <div key={index} className='my-3 container bg-light p-2 rounded rounded-5'>
                            <strong className={msg.senderUsername === username ? 'text-danger' : 'text-success'}>
                                {msg.senderUsername === username ? msg.senderUsername : 'Me'}:
                            </strong>
                            <span className='text-dark'> {msg.messageText}</span>
                        </div>
                    ))
                }
            </div>
            <hr className='text-light' />

            <div className="bg-dark pt-3 pb-3 d-flex align-items-center sticky-bottom">
                <input
                    className="rounded p-2 me-2 form-control"
                    name="message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Type a message..."
                />
                <button className="btn btn-primary me-2 d-flex align-items-center" onClick={sendMessage}>
                    <span class="material-symbols-outlined rounded rounded-5 fs-4 ms-1">
                        send
                    </span>
                </button>
            </div>
        </div>
    );
}
