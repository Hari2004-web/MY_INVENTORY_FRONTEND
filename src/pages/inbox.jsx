import { useState, useEffect } from "react";
import { getMyMessages, markMessageAsRead } from "../api/messageApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// --- Modern Icon Set ---
const ReplyIcon = () => <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const DeleteIcon = () => <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
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

  const handleToggleMessage = (message) => {
    const newExpandedId = expandedMessageId === message.id ? null : message.id;
    setExpandedMessageId(newExpandedId);

    if (newExpandedId !== null && !message.is_read) {
      setMessages(prevMessages =>
        prevMessages.map(m =>
          m.id === message.id ? { ...m, is_read: 1 } : m
        )
      );
      (async () => {
        try {
          await markMessageAsRead(message.id);
        } catch (error) {
          console.error("Failed to mark message as read on the server:", error);
        }
      })();
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-full font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">Messages</h1>
            <p className="text-slate-500 mt-2">You have {messages.filter(m => !m.is_read).length} unread messages.</p>
        </header>
        
        <div className="relative mb-8">
            <SearchIcon />
            <input 
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
        </div>

        {loading ? (
            <div className="flex h-64 items-center justify-center"><Loader /></div>
        ) : (
          <div className="relative pl-8">
            {/* --- Timeline Axis --- */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

            {filteredMessages.length > 0 ? (
              filteredMessages.map(msg => (
                <div key={msg.id} className="relative mb-6">
                  {/* --- Timeline Dot --- */}
                  <div className={`absolute left-0 top-3 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${!msg.is_read ? 'bg-indigo-500 ring-4 ring-white' : 'bg-slate-300'}`}></div>

                  <div className="ml-8">
                    <div 
                      className="bg-white rounded-xl shadow-md border border-slate-200 p-4 cursor-pointer hover:shadow-lg hover:border-indigo-500 transition-all duration-300"
                      onClick={() => handleToggleMessage(msg)}
                    >
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-lg ${!msg.is_read ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                              {msg.sender_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 overflow-hidden">
                              <p className={`font-semibold truncate ${!msg.is_read ? 'text-slate-900' : 'text-slate-600'}`}>{msg.sender_name}</p>
                              <p className={`truncate text-sm font-medium ${!msg.is_read ? 'text-slate-800' : 'text-slate-500'}`}>{msg.subject}</p>
                          </div>
                          <p className="text-sm text-slate-500 ml-4 flex-shrink-0">{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* --- Expanded Content --- */}
                    {expandedMessageId === msg.id && (
                       <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-6 -mt-1 shadow-md">
                         <div className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">
                             {msg.body}
                         </div>
                         <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                               <ReplyIcon />
                               <span>Reply</span>
                           </button>
                           <button className="flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg">
                               <DeleteIcon />
                               <span>Delete</span>
                           </button>
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="ml-8 text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                  <p className="text-slate-500">No messages to display.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;