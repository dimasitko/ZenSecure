import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle } from 'lucide-react';
import { api } from '../lib/api';
import { BottomNav } from '../components/BottomNav';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80";

export const DiscoverScreen = () => {
  const [cards, setCards] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/discover/feed');
        setCards(res.data);
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left');
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const activeCard = cards[0];
    if (!activeCard) return;

    const isLike = direction === 'right';
    setCards((prev) => prev.slice(1));
    x.set(0);

    try {
      const res = await api.post('/interactions/swipe', {
        targetUserId: activeCard.id,
        isLike: isLike
      });

      if (res.data.isMatch) {
      toast.success(`IT'S A MATCH with ${activeCard.name}! 🎉`);
      }
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 shadow-xl shadow-black">
            <Heart size={32} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-medium text-white mb-3 tracking-wide">No more profiles</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">
            You've seen everyone in your area. Check back later for new matches.
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const activeCard = cards[0];

  return (
    <div className="flex-1 flex flex-col relative bg-[#0a0a0a] overflow-hidden">
      
      <div className="flex items-center justify-between p-6 z-10">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          ZenMatch
        </h1>
        <button className="p-2.5 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
          <MessageCircle size={20} className="text-gray-300" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center px-4">
        <AnimatePresence>
          <motion.div
            key={activeCard.id}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: x.get(), opacity: 0, transition: { duration: 0.2 } }}
            whileDrag={{ cursor: 'grabbing' }}
            className="absolute w-full max-w-[340px] h-[520px] cursor-grab touch-none"
          >
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-gray-800 bg-gray-900">
              
              <img 
                src={activeCard.photoUrl || DEFAULT_AVATAR} 
                alt={activeCard.name}
                className="w-full h-full object-cover pointer-events-none"
              />
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-8 border-[3px] border-emerald-500 rounded-xl px-4 py-1.5 z-20 transform -rotate-12 bg-black/20 backdrop-blur-sm">
                <span className="text-emerald-500 font-bold text-3xl tracking-wider uppercase">Like</span>
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-8 border-[3px] border-rose-500 rounded-xl px-4 py-1.5 z-20 transform rotate-12 bg-black/20 backdrop-blur-sm">
                <span className="text-rose-500 font-bold text-3xl tracking-wider uppercase">Nope</span>
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <h2 className="text-3xl font-semibold text-white mb-2 flex items-baseline gap-3">
                  {activeCard.name}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                  {activeCard.bio || "No bio provided."}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="p-6 flex justify-center gap-6 z-10 pb-8">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:scale-105 border border-gray-800"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:scale-105 border border-gray-800"
        >
          <Heart size={28} strokeWidth={2.5} />
        </button>
      </div>
      <BottomNav />
    </div>
  );
};