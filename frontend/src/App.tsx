import { ChatWindow } from './components/ChatWindow';

function App() {
  const mockClientId = "client-uuid-1234"; 

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <ChatWindow roomId={mockClientId} currentUserId={mockClientId} />
    </div>
  );
}

export default App;