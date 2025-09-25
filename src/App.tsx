import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import LoginButton from "./components/LoginButton";
import TestConnection from "./components/TestConnection";
import DebugPanel from "./components/DebugPanel";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-8">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">ExploreSG</h1>
            <p className="text-gray-600">Discover Singapore with us</p>
          </div>

          <LoginButton />

          <DebugPanel />

          <TestConnection />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
