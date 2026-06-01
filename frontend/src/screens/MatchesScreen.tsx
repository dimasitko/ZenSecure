import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NEW_MATCHES = [
  { id: 'm1', name: 'Victoria', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'm2', name: 'Mia', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
];

const RECENT_CHATS = [
  { id: 'c1', name: 'Elena', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', lastMessage: 'That sounds perfect! ✨', time: '2m', unread: true },
  { id: 'c2', name: 'Sophia', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', lastMessage: 'Are we still on for tonight?', time: '1h', unread: false },
];

export const MatchesScreen = () => {
  const navigate = useNavigate();
  const openChat = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
      <div className="pt-8 px-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Messages</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search matches..."
            className="w-full bg-gray-900/80 text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder-gray-600 transition-all border border-gray-800 focus:bg-gray-900"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        <div className="px-6 mb-8">
          <h2 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-4">New Matches</h2>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
            {NEW_MATCHES.map((match) => (
              <div 
                key={match.id} 
                onClick={() => openChat(match.id)}
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-pink-500 transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full border-2 border-[#0a0a0a] overflow-hidden">
                    <img src={match.photo} alt={match.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-300">{match.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Conversations</h2>
          <div className="space-y-4">
            {RECENT_CHATS.map((chat, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className="flex items-center gap-4 cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-gray-900/50 transition-colors"
              >
                <div className="relative w-14 h-14 shrink-0">
                  <img src={chat.photo} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                  {chat.unread && (
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-[#0a0a0a] rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={chat.unread ? "font-semibold text-white" : "font-medium text-gray-200"}>
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className={`text-sm truncate ${chat.unread ? "text-gray-300 font-medium" : "text-gray-500"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};