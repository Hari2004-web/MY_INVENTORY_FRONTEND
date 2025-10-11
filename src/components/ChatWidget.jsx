// src/components/ChatWidget.jsx

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const ChatIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const CloseIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user && user.role === 'customer') {
            // **IMPORTANT:** Connect to the correct backend server address
            socketRef.current = io('http://localhost:5000');
            
            socketRef.current.emit('join', user);

            socketRef.current.on('receive_message', (message) => {
                setMessages(prev => [...prev, message]);
            });

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() && user) {
            const messageData = {
                sender: { id: user.id, username: user.username, role: user.role },
                text: inputValue,
            };
            socketRef.current.emit('customer_message', messageData);
            
            setMessages(prev => [...prev, { ...messageData, timestamp: new Date() }]);
            setInputValue('');
        }
    };

    if (!user || user.role !== 'customer') {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <div className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col">
                    <header className="bg-indigo-600 text-white p-4 rounded-t-lg">
                        <h3 className="font-bold text-lg">Live Chat Support</h3>
                    </header>
                    <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-3 p-2 rounded-lg max-w-xs ${msg.sender.id === user.id ? 'bg-indigo-500 text-white ml-auto' : 'bg-gray-200 text-gray-800'}`}>
                                <strong className="text-sm">{msg.sender.username}</strong>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </main>
                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full p-2 border rounded-lg"
                        />
                    </form>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform duration-200 hover:scale-110"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
};

export default ChatWidget;