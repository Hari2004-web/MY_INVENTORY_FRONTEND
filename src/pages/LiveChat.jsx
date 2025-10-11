// src/pages/LiveChat.jsx

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const LiveChat = () => {
    const { user } = useAuth();
    const [connectedUsers, setConnectedUsers] = useState(new Map());
    const [conversations, setConversations] = useState(new Map());
    const [activeChatId, setActiveChatId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // This useEffect handles setting up and tearing down the socket connection.
    // It runs only once.
    useEffect(() => {
        // **IMPORTANT:** Connect to the correct backend server address
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', user);

        // Event: A user (customer or manager) has come online.
        socketRef.current.on('user_online', (onlineUser) => {
            setConnectedUsers(prev => new Map(prev).set(onlineUser.userId, onlineUser));
        });

        // Event: A user has gone offline.
        socketRef.current.on('user_offline', ({ userId }) => {
            setConnectedUsers(prev => {
                const newUsers = new Map(prev);
                newUsers.delete(userId);
                return newUsers;
            });
            setActiveChatId(currentId => (currentId === userId ? null : currentId));
        });

        // Event: A new message has been received from anyone.
        socketRef.current.on('receive_message', (message) => {
            const sender = message.sender;
            
            // **CRITICAL FIX**: If a message arrives from a customer who isn't in our list yet,
            // this ensures they are added to the list and become visible.
            if (sender.role === 'customer') {
                setConnectedUsers(prev => {
                    if (!prev.has(sender.id)) {
                        return new Map(prev).set(sender.id, { userId: sender.id, ...sender });
                    }
                    return prev;
                });
            }

            // Add the message to the correct conversation thread.
            const conversationId = sender.id === user.id ? activeChatId : sender.id;
            setConversations(prev => {
                const newConversations = new Map(prev);
                const existing = newConversations.get(conversationId) || [];
                newConversations.set(conversationId, [...existing, message]);
                return newConversations;
            });
        });

        // Cleanup: Disconnect the socket when the component unmounts.
        return () => {
            socketRef.current.disconnect();
        };
    }, [user, activeChatId]); // Dependency array is kept minimal.

    // This effect handles auto-scrolling to the latest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, activeChatId]);


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() && activeChatId) {
            const messageData = {
                sender: { id: user.id, username: user.username, role: user.role },
                recipientId: activeChatId,
                text: inputValue,
            };
            socketRef.current.emit('manager_reply', messageData);

            // Add the manager's own message to the UI immediately.
            setConversations(prev => {
                 const newConversations = new Map(prev);
                 const existing = newConversations.get(activeChatId) || [];
                 const newMessage = { sender: messageData.sender, text: messageData.text, timestamp: new Date() };
                 newConversations.set(activeChatId, [...existing, newMessage]);
                 return newConversations;
            });
            setInputValue('');
        }
    };
    
    // Filter the list to only show customers in the sidebar.
    const customerList = Array.from(connectedUsers.values()).filter(u => u.role === 'customer');
    const activeConversation = conversations.get(activeChatId) || [];

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-white">
            <aside className="w-1/3 border-r overflow-y-auto">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold">Active Chats</h2>
                </div>
                <div>
                    {customerList.length > 0 ? customerList.map(u => (
                        <div
                            key={u.userId}
                            onClick={() => setActiveChatId(u.userId)}
                            className={`p-4 cursor-pointer hover:bg-gray-100 ${activeChatId === u.userId ? 'bg-indigo-100' : ''}`}
                        >
                            <p className="font-semibold">{u.username}</p>
                            <span className="text-xs text-green-500">Online</span>
                        </div>
                    )) : (
                        <p className="p-4 text-sm text-gray-500">No customers online.</p>
                    )}
                </div>
            </aside>

            <main className="w-2/3 flex flex-col">
                {activeChatId ? (
                    <>
                        <header className="p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-lg">Chat with {connectedUsers.get(activeChatId)?.username}</h3>
                        </header>
                        <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
                           {activeConversation.map((msg, index) => (
                                <div key={index} className={`mb-3 p-3 rounded-lg max-w-md ${msg.sender.id === user.id ? 'bg-indigo-500 text-white ml-auto' : 'bg-white shadow-sm'}`}>
                                    <p className="font-bold text-sm mb-1">{msg.sender.username}</p>
                                    <p>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender.id === user.id ? 'text-indigo-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full p-2 border rounded-lg"
                            />
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500 bg-gray-100">
                        <p>Select a customer to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LiveChat;