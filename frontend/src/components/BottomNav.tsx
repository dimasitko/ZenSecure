import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MessageSquare, User } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-[#0a0a0a] border-t border-gray-900 px-8 py-4 flex justify-between items-center shrink-0">
      <button 
        onClick={() => navigate('/')}
        className={`transition-colors ${isActive('/') ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <Search size={26} />
      </button>
      
      <button 
        onClick={() => navigate('/matches')}
        className={`transition-colors ${isActive('/matches') ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <MessageSquare size={26} />
      </button>

      <button 
        onClick={() => navigate('/profile')}
        className={`transition-colors ${isActive('/profile') ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <User size={26} />
      </button>
    </div>
  );
};