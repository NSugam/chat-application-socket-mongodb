import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context/SharedState';
import { socket } from './socket';

export default function GroupChat() {
    const { groupName } = useParams();
    const states = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!groupName) return;

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            console.log("Received:", message);
        };

        const handleJoinChat = (chatHistory) => {
            setMessagesHistory(chatHistory);
            console.log("Chat history loaded:", chatHistory);
        };

        socket.on("receive-group-message", handleReceiveMessage);
        socket.on("join-group-messages", handleJoinChat);

        socket.emit("join-group", { groupName, username: states.user.username });

        return () => {
            socket.off("receive-group-message");
            socket.off("join-group");
        };
    }, [groupName, states.user?.username]);

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("send-group-message", {
            groupName,
            senderUsername: states.user.username,
            messageText: input,
        });
        setInput('');
    };

    return (
        <div className='container col-sm-7 col-md-4 rounded bg-dark mt-5' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h5 className='text-light mt-2 p-2 sticky-top bg-success rounded' style={{ zIndex: 100 }}>
                Group Chat - {groupName}
            </h5>
            <hr className='text-light' />

            <div className="chat-history-messages mx-4">
                {messagesHistory.map((msg, index) => (
                    <div key={index} className='my-3 container bg-light p-2 rounded rounded-5'>
                        <strong className='text-danger'>
                            {msg.sender.username === states.user.username ? 'Me' : msg.sender.username}
                            {states.onlineUsers.includes(msg.sender.username) && <span className="text-success"> (Online)</span>}:
                        </strong>
                        <span className='text-dark'> {msg.message_text}</span>
                    </div>
                ))}
            </div>

            <div className="chat-messages mx-4">
                {messages.map((msg, index) => (
                    <div key={index} className='my-3 container bg-light p-2 rounded rounded-5'>
                        <strong className='text-danger'>{msg.senderUsername}:</strong>
                        <span className='text-dark'> {msg.messageText}</span>
                    </div>
                ))}
            </div>
            <hr className='text-light' />

            <div className="bg-dark pb-3 d-flex align-items-center justify-content-between sticky-bottom">
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
