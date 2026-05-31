import { useEffect, useState, useRef } from 'react';
import { socket } from '../lib/socket';
import { SecureMessage } from './SecureMessage';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  senderId: string;
  roomId: string;
}

export const ChatWindow = ({ roomId, currentUserId }: { roomId: string, currentUserId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    socket.emit('join_room', roomId);

    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [roomId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('send_message', {
      roomId,
      senderId: currentUserId,
      content: input
    });
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-white font-medium">Support Chat</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">Secure Connection</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <SecureMessage 
            key={idx} 
            content={msg.content} 
            isOwnMessage={msg.senderId === currentUserId} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-gray-950 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};