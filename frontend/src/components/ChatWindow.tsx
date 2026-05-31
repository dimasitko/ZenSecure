import { useEffect, useState, useRef } from 'react';
import { socket } from '../lib/socket';
import DOMPurify from 'dompurify';
import { Send, Heart, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: number;
  content: string;
  senderId: string;
  roomId: string;
}
const MATCH_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

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
    <div className="flex flex-col h-[700px] w-full max-w-sm mx-auto bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[4px] border-gray-900">
      <div className="relative h-48 w-full bg-gray-900 flex-shrink-0">
        <img 
          src={MATCH_AVATAR} 
          alt="Match" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-semibold text-white tracking-wide">Victoria, 21</h2>
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            </div>
            <p className="text-gray-400 text-sm">Matched today</p>
          </div>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-rose-500/20 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#0a0a0a] custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Heart className="text-rose-500 animate-pulse" size={32} />
            <p className="text-gray-400 text-sm">You matched with Victoria!<br/>Don't be shy, say hi.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={idx} 
                className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}
              >
                {!isOwn && (
                  <img src={MATCH_AVATAR} className="w-8 h-8 rounded-full object-cover mr-2 self-end" alt="avatar" />
                )}
                <div 
                  className={cn(
                    "max-w-[75%] px-5 py-3 text-[15px] leading-relaxed",
                    isOwn 
                      ? "bg-gradient-to-br from-rose-600 to-rose-500 text-white rounded-2xl rounded-br-sm shadow-lg shadow-rose-900/20" 
                      : "bg-gray-900 text-gray-100 rounded-2xl rounded-bl-sm"
                  )}
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(msg.content, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] }) 
                  }}
                />
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 bg-[#0a0a0a] flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="w-full bg-gray-900/50 text-white rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder-gray-600 transition-all border border-gray-800 focus:bg-gray-900"
          />
        </div>
        <button 
          type="submit"
          disabled={!input.trim()}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-800 disabled:text-gray-600 text-white p-3.5 rounded-full transition-all flex-shrink-0 shadow-lg shadow-rose-500/20"
        >
          <Send size={18} className={input.trim() ? "ml-1" : ""} />
        </button>
      </form>
    </div>
  );
};