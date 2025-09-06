import { useState, useEffect } from "react";
import { getMyMessages } from "../api/messageApi";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMyMessages();
        setMessages(response.data || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Inbox</h1>
      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {messages.length === 0 && <li className="p-4 text-gray-500">You have no messages.</li>}
          {messages.map(msg => (
            <li key={msg.id} onClick={() => setSelectedMessage(msg)} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between">
                <p className="font-semibold text-gray-800">{msg.subject}</p>
                <p className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">From: {msg.sender_name}</p>
            </li>
          ))}
        </ul>
      </div>

      {selectedMessage && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
            <button onClick={() => setSelectedMessage(null)} className="text-gray-500 text-2xl font-bold hover:text-gray-800">&times;</button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.body}</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;