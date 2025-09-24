import { useState, useEffect } from "react";
import { getMyMessages, markMessageAsRead } from "../api/messageApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// --- Helper component for a styled action button ---
const ActionButton = ({ icon, text }) => (
    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
        {icon}
        <span>{text}</span>
    </button>
);

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
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
    fetchMessages();
  }, []);

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

  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl flex h-[calc(100vh-10rem)] overflow-hidden border border-slate-200">
      
      {/* --- Left Pane: Message List --- */}
      <div className="w-full md:w-2/5 lg:w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Inbox</h1>
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center"><Loader /></div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-slate-500 mt-10">
              <p className="font-semibold">No messages found</p>
              <p className="text-sm">Your inbox is empty or no messages match your search.</p>
            </div>
          ) : (
            <ul>
              {filteredMessages.map(msg => (
                <li
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer border-l-4 transition-all duration-200 ease-in-out relative ${
                    selectedMessage?.id === msg.id 
                    ? 'border-blue-600 bg-white shadow-inner' 
                    : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       {!msg.is_read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                       <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-white font-bold">
                           {msg.sender_name.charAt(0).toUpperCase()}
                       </div>
                       <div className="flex-1 overflow-hidden">
                           <p className={`font-semibold text-sm truncate ${!msg.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                               {msg.sender_name}
                           </p>
                           <p className={`font-medium truncate text-sm mt-1 ${!msg.is_read ? 'text-slate-800' : 'text-slate-500'}`}>
                               {msg.subject}
                           </p>
                       </div>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2 mt-1">
                      {new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- Right Pane: Message Content --- */}
      <div className="hidden md:flex w-3/5 lg:w-2/3 p-6 lg:p-8 flex-col bg-white">
        {selectedMessage ? (
          <>
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900">{selectedMessage.subject}</h2>
              <div className="flex items-center mt-4">
                <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold mr-4">
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
            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
                <ActionButton icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>} text="Reply" />
                <ActionButton icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} text="Delete" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <svg className="mx-auto h-20 w-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p className="mt-4 text-xl font-medium text-slate-500">Select a message to read</p>
              <p className="text-slate-400">Your messages will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;