import { useState, useEffect } from "react";
import { getMyMessages, markMessageAsRead } from "../api/messageApi";
import { useAuth } from "../context/AuthContext";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get user for avatar initials

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getMyMessages();
      setMessages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id);
        setMessages(prevMessages =>
          prevMessages.map(m =>
            m.id === message.id ? { ...m, is_read: 1 } : m
          )
        );
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex h-[calc(100vh-10rem)] overflow-hidden">
      {/* --- Left Pane: Message List --- */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Inbox</h1>
        </div>
        <div className="overflow-y-auto">
          {loading ? (
            <p className="p-4 text-slate-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <p>Your inbox is empty.</p>
            </div>
          ) : (
            <ul>
              {messages.map(msg => (
                <li
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer border-l-4 transition-colors ${selectedMessage?.id === msg.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${!msg.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${!msg.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {msg.sender_name}
                        </p>
                        <p className="text-slate-800 font-medium truncate text-sm mt-1">{msg.subject}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- Right Pane: Message Content --- */}
      <div className="w-2/3 p-6 flex flex-col bg-slate-50">
        {selectedMessage ? (
          <>
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">{selectedMessage.subject}</h2>
              <div className="flex items-center mt-2">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold mr-3">
                  {selectedMessage.sender_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedMessage.sender_name}</p>
                  <p className="text-sm text-slate-500">to: {user?.username} ({user?.email})</p>
                </div>
                <p className="ml-auto text-sm text-slate-500">{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 text-slate-700 text-base leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1">
              {selectedMessage.body}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p className="mt-2 text-lg font-medium">Select a message to read</p>
              <p className="text-sm">Your messages will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;