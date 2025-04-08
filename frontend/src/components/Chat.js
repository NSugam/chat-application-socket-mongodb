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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!username) return;

        setIsLoading(true);

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        const handleSentMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        const handleJoinChat = (chatHistory) => {
            setMessagesHistory(chatHistory);
            setIsLoading(false)
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("sent-message", handleSentMessage);
        socket.on("join-chat-messages", handleJoinChat);

        socket.emit("join-chat", {
            senderUsername: states.user?.username,
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
            senderUsername: states.user?.username,
            receiverUsername: username,
            messageText: input,
        });
        setInput('');
    };

    return (
        <div className='container col-sm-7 col-md-4 rounded bg-dark mt-4' style={{ height: '80vh', overflowY: 'auto' }}>
            <h6 className='text-light d-flex align-items-center justify-content-between mt-2 p-2 sticky-top bg-dark rounded' style={{ zIndex: 100 }}>
                {username}
                {states.onlineUsers.includes(username) ?
                    <span className="text-light" style={{ fontSize: '14px' }}>🟢 Active now</span> :
                    <span className="text-light" style={{ fontSize: '14px' }}>🔴 Offline</span>
                }
            </h6>
            <hr className='text-light' />

            <div className="chat-history-messages mx-4">
                {isLoading ? (
                    <div className="text-center text-light my-3">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : messagesHistory.length > 0 ? (
                    messagesHistory
                        .filter((msg) =>
                            (msg.sender.username === username && msg.receiver.username === states.user?.username) ||
                            (msg.receiver.username === username && msg.sender.username === states.user?.username)
                        )
                        .map((msg, index) => (
                            <div key={index} className={`d-flex my-2 ${msg.sender.username === states.user?.username ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`px-3 py-2 rounded-4 shadow-sm ${msg.sender.username === states.user?.username ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'}`} style={{ maxWidth: '70%' }}>
                                    {msg.sender.username !== states.user?.username && (
                                        <strong className="text-secondary d-block mb-1">{msg.sender.username}</strong>
                                    )}
                                    <span>{msg.message_text}</span>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="text-center text-light">No messages yet</div>
                )}
            </div>

            <div className="chat-messages mx-4">
                {messages
                    .filter((msg) =>
                        (msg.senderUsername === username && msg.receiverUsername === states.user?.username) ||
                        (msg.receiverUsername === username && msg.senderUsername === states.user?.username)
                    )
                    .map((msg, index) => (
                        <div key={index} className={`d-flex my-2 ${msg.senderUsername === states.user?.username ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`px-3 py-2 rounded-4 shadow-sm ${msg.senderUsername === states.user?.username ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'}`} style={{ maxWidth: '70%' }}>
                                {msg.senderUsername !== states.user?.username && (
                                    <strong className="text-secondary d-block mb-1">{msg.senderUsername}</strong>
                                )}
                                <span>{msg.messageText}</span>
                            </div>
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
                    <span className="material-symbols-outlined rounded rounded-5 fs-4 ms-1">
                        send
                    </span>
                </button>
            </div>
        </div>
    );
}
