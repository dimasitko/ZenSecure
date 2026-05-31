import { ChatWindow } from './components/ChatWindow';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'true';
  const roomId = "client-uuid-1234"; 
  const currentUserId = isAdmin ? "admin-uuid-9999" : roomId;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-gray-500 mb-4 text-sm font-medium">
        Logged in as: {' '}
        <span className={isAdmin ? "text-red-400" : "text-blue-400"}>
          {isAdmin ? "Admin Support" : "Client"}
        </span>
      </div>
      
      <ChatWindow roomId={roomId} currentUserId={currentUserId} />
    </div>
  );
}

export default App;