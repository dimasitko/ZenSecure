import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layers, MessageCircle, User } from 'lucide-react';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { AuthScreen } from './screens/AuthScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ChatWindow } from './components/ChatWindow';
import { ProfileScreen } from './screens/ProfileScreen';
import { Toaster } from 'react-hot-toast';
 
const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const showNav = ['/discover', '/matches', '/profile'].includes(location.pathname);

  if (!showNav) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-50 flex items-end justify-center pb-6 gap-12">
      <button 
        onClick={() => navigate('/discover')}
        className={`p-2 transition-colors ${location.pathname === '/discover' ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <Layers size={28} strokeWidth={2.5} />
      </button>
      <button 
        onClick={() => navigate('/matches')}
        className={`p-2 transition-colors ${location.pathname === '/matches' ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <MessageCircle size={28} strokeWidth={2.5} />
      </button>
      <button 
        onClick={() => navigate('/profile')}
        className={`p-2 transition-colors ${location.pathname === '/profile' ? 'text-rose-500' : 'text-gray-600 hover:text-gray-400'}`}
      >
        <User size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30 flex items-center justify-center">
        <div className="w-full max-w-md h-[100dvh] sm:h-[800px] sm:rounded-[2.5rem] bg-[#0a0a0a] overflow-hidden relative shadow-2xl sm:border-[4px] border-gray-900 flex flex-col">
          
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/discover" element={<DiscoverScreen />} />
            <Route path="/matches" element={<MatchesScreen />} />
            <Route 
              path="/chat/:matchId" 
              element={
                <ChatWindow 
                  roomId="test-room"
                  currentUserId="my-uuid" 
                />
              } 
            />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
          <BottomNav />
          <Toaster position="top-center" toastOptions={{ 
            style: { background: '#18181b', color: '#fff', borderRadius: '16px' } 
          }} />
        </div>
      </div>
    </Router>
  );
}

export default App;