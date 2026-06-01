import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle } from 'lucide-react';

// Тимчасові фейкові дані для візуалу
const MOCK_PROFILES = [
  { id: 1, name: 'Elena', age: 22, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', bio: 'Coffee lover & UI Designer' },
  { id: 2, name: 'Sophia', age: 24, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', bio: 'Always traveling ✈️' },
  { id: 3, name: 'Mia', age: 21, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', bio: 'Frontend dev. Let\'s build something.' },
];

export const DiscoverScreen = () => {
  const [cards, setCards] = useState(MOCK_PROFILES);

  // Значення для відслідковування позиції картки
  const x = useMotionValue(0);
  
  // Трансформації на основі зсуву (поворот і прозорість індикаторів)
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  // Функція обробки завершення свайпу
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100; // На скільки пікселів треба потягнути, щоб зарахувати свайп
    if (info.offset.x > swipeThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // В майбутньому тут буде запит на бекенд (like/skip)
    console.log(`Swiped ${direction} on ${cards[0]?.name}`);
    setCards((prev) => prev.slice(1)); // Видаляємо верхню картку
  };

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4">
          <Heart size={24} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No more profiles</h3>
        <p className="text-gray-500">Check back later for new matches in your area.</p>
      </div>
    );
  }

  const activeCard = cards[0];

  return (
    <div className="flex-1 flex flex-col relative bg-[#0a0a0a]">
      {/* Навігація зверху */}
      <div className="flex items-center justify-between p-6 z-10">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          ZenMatch
        </h1>
        <button className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition">
          <MessageCircle size={20} className="text-white" />
        </button>
      </div>

      {/* Зона карток */}
      <div className="flex-1 relative flex items-center justify-center px-4">
        <AnimatePresence>
          <motion.div
            key={activeCard.id}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} // Повертає картку в центр, якщо не дотягнув
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: x.get(), opacity: 0, transition: { duration: 0.2 } }}
            whileDrag={{ cursor: 'grabbing' }}
            className="absolute w-full max-w-[340px] h-[500px] cursor-grab"
          >
            {/* Сама картка */}
            <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 bg-gray-900">
              <img 
                src={activeCard.photo} 
                alt={activeCard.name}
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Індикатор Лайку (зелений/рожевий) */}
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-emerald-500 rounded-xl px-4 py-1 z-20 transform -rotate-12">
                <span className="text-emerald-500 font-bold text-3xl tracking-wider uppercase">Like</span>
              </motion.div>

              {/* Індикатор Скіпу (червоний) */}
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-rose-500 rounded-xl px-4 py-1 z-20 transform rotate-12">
                <span className="text-rose-500 font-bold text-3xl tracking-wider uppercase">Nope</span>
              </motion.div>

              {/* Інформація про користувача знизу картки */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                <h2 className="text-3xl font-semibold text-white mb-1 flex items-baseline gap-2">
                  {activeCard.name} <span className="text-xl font-normal text-gray-300">{activeCard.age}</span>
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">{activeCard.bio}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Кнопки дій знизу */}
      <div className="p-6 flex justify-center gap-6 z-10 pb-10">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:scale-105"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:scale-105"
        >
          <Heart size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};