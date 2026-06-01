import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { BottomNav } from '../components/BottomNav';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=150&q=80";

interface MatchItem {
  id: string;
  user: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
  lastMessage: string | null;
  updatedAt: string;
  unread: boolean;
}

export const MatchesScreen = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        setMatches(res.data);
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const openChat = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const newMatches = matches.filter(m => !m.lastMessage);
  const recentChats = matches.filter(m => m.lastMessage);
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
      
      {/* ЦЕНТРАЛЬНИЙ КОНТЕЙНЕР */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col overflow-hidden">
        
        <div className="pt-8 px-6 pb-4 shrink-0">
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

        <div className="flex-1 overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {newMatches.length > 0 && (
            <div className="px-6 mb-8">
              <h2 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-4">New Matches</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {newMatches.map((match) => (
                  <div 
                    key={match.id} 
                    onClick={() => openChat(match.id)}
                    className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-pink-500 transition-transform group-hover:scale-105">
                      <div className="w-full h-full rounded-full border-2 border-[#0a0a0a] overflow-hidden">
                        <img src={match.user.photoUrl || DEFAULT_AVATAR} alt={match.user.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{match.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              {recentChats.length > 0 ? "Recent Conversations" : "No recent conversations"}
            </h2>
            <div className="space-y-4">
              {recentChats.map((match, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={match.id}
                  onClick={() => openChat(match.id)}
                  className="flex items-center gap-4 cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-gray-900/50 transition-colors"
                >
                  <div className="relative w-14 h-14 shrink-0">
                    <img src={match.user.photoUrl || DEFAULT_AVATAR} alt={match.user.name} className="w-full h-full rounded-full object-cover" />
                    {match.unread && (
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-[#0a0a0a] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={match.unread ? "font-semibold text-white" : "font-medium text-gray-200"}>
                        {match.user.name}
                      </h3>
                      <span className="text-xs text-gray-500">{formatTime(match.updatedAt)}</span>
                    </div>
                    <p className={`text-sm truncate ${match.unread ? "text-gray-300 font-medium" : "text-gray-500"}`}>
                      {match.lastMessage}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};