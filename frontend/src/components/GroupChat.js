import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context/SharedState';
import { socket } from './socket';

export default function GroupChat() {
    const { groupName } = useParams();
    const states = useContext(Context);
    const [isLoading, setIsLoading] = useState(true)

    const [messages, setMessages] = useState([]);
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!groupName) return

        setIsLoading(true)

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message])
            console.log("Received:", message)
        };

        const handleJoinChat = (chatHistory) => {
            setMessagesHistory(chatHistory)
            setIsLoading(false)
            console.log("Chat history loaded:", chatHistory)
        };

        socket.on("receive-group-message", handleReceiveMessage);
        socket.on("join-group-messages", handleJoinChat);

        socket.emit("join-group", { groupName, username: states.user?.username });

        return () => {
            socket.off("receive-group-message");
            socket.off("join-group");
        };
    }, [groupName, states.user?.username]);

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("send-group-message", {
            groupName,
            senderUsername: states.user?.username,
            messageText: input,
        });
        setInput('');
    };

    return (
        <div className='container col-sm-7 col-md-4 rounded bg-dark mt-4' style={{ height: '80vh', overflowY: 'auto' }}>
            <h6 className='text-dark d-flex align-items-center justify-content-between mt-2 p-2 sticky-top bg-warning rounded' style={{ zIndex: 100 }}>
                Group Chat: {groupName}
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
                    messagesHistory.map((msg, index) => (
                        <div key={index} className={`d-flex my-2 ${msg.sender.username === states.user?.username ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`px-3 py-2 rounded-4 shadow-sm ${msg.sender.username === states.user?.username ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'}`} style={{ maxWidth: '70%' }}>
                                {msg.sender.username !== states.user?.username && (
                                    <strong className="text-secondary d-block mb-1">
                                        {msg.sender.username}
                                        {states.onlineUsers.includes(msg.sender.username) && <span className="text-success"> (Online)</span>}
                                    </strong>
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
                {messages.map((msg, index) => (
                    <div key={index} className={`d-flex my-2 ${msg.senderUsername === states.user?.username ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`px-3 py-2 rounded-4 shadow-sm ${msg.senderUsername === states.user?.username ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'}`} style={{ maxWidth: '70%' }}>
                            {msg.senderUsername !== states.user?.username && (
                                <strong className="text-secondary d-block mb-1">{msg.senderUsername}</strong>
                            )}
                            <span>{msg.messageText}</span>
                        </div>
                    </div>
                ))}
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
