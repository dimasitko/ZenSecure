import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export const ProfileScreen = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-screen text-white">
      
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold tracking-tight mb-8 mt-4">Profile</h1>
        
        <div className="flex-1 flex flex-col items-center justify-center mt-12">
          <div className="w-24 h-24 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 shadow-lg shadow-black">
            <User size={40} className="text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">Your profile details will be here</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-12 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-900/50 text-rose-500 font-medium hover:bg-gray-900 transition-colors border border-gray-800/50"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};