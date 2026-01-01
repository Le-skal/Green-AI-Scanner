import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

function App() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-ink-900 border-t border-ink-700 mt-16">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-sand-400">
            PFE 2025-2026 · IT for Green & Data Sovereignty · Skills4Mind
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
