import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layers, MessageCircle, User } from 'lucide-react';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { AuthScreen } from './screens/AuthScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ChatWindow } from './components/ChatWindow';
import { ProfileScreen } from './screens/ProfileScreen';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const showNav = ['/discover', '/matches', '/profile'].includes(location.pathname);

  if (!showNav) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-2xl mx-auto flex items-end justify-center pb-6 gap-16 pointer-events-auto px-6">
        
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
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="w-full h-[100dvh] bg-[#0a0a0a] text-white font-sans selection:bg-rose-500/30 overflow-hidden relative flex flex-col">
        
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
      </div>
    </Router>
  );
}

export default App;