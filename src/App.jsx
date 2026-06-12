import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RecordPage from './pages/RecordPage';
import PersonalityPage from './pages/PersonalityPage';
import DashboardPage from './pages/DashboardPage';
import TimeCapsulePage from './pages/TimeCapsulePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-dark text-white flex flex-col">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Routed Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/personality" element={<PersonalityPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/timecapsule" element={<TimeCapsulePage />} />
          </Routes>
        </main>
        
        {/* Dynamic Footer */}
        <footer className="py-8 border-t border-white/5 bg-navy-dark text-center text-xs text-text-muted">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} EternalVoice. Designed for voice preservation and accessibility.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-white/10">|</span>
              <a href="#" className="hover:text-white transition-colors">Accessibility Standards</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
