import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { AuthScreen } from './screens/AuthScreen';
// import { MatchesScreen } from './screens/MatchesScreen';
// import { ChatWindow } from './components/ChatWindow';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30 flex items-center justify-center">
        <div className="w-full max-w-md h-[100dvh] sm:h-[800px] sm:rounded-[2.5rem] bg-[#0a0a0a] overflow-hidden relative shadow-2xl sm:border-[4px] border-gray-900 flex flex-col">
          
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/discover" element={<DiscoverScreen />} />
            
            {/* <Route path="/matches" element={<MatchesScreen />} /> */}
            {/* <Route path="/chat/:matchId" element={<ChatWindow />} /> */}
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;