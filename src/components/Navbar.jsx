import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mic } from 'lucide-react';

const Navbar = () => {
  const [hasVoice, setHasVoice] = useState(false);

  useEffect(() => {
    // Check if voice has been preserved in LocalStorage
    const checkVoice = () => {
      const savedRecording = localStorage.getItem('eternalvoice_recording_complete');
      setHasVoice(savedRecording === 'true');
    };

    // Initial check
    checkVoice();

    // Listen for storage changes
    window.addEventListener('storage', checkVoice);
    
    // Add custom event listener for in-app updates
    window.addEventListener('eternalvoice_voice_updated', checkVoice);

    return () => {
      window.removeEventListener('storage', checkVoice);
      window.removeEventListener('eternalvoice_voice_updated', checkVoice);
    };
  }, []);

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/10 px-6 py-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary-blue/10 border border-primary-blue/20 group-hover:border-primary-blue/40 transition-all duration-300">
            <Mic className="w-5 h-5 text-primary-blue" />
            {/* Pulsing soundwave animation next to logo */}
            <div className="absolute -bottom-0.5 right-0.5 flex gap-0.5 items-end h-4">
              <span className="wave-bar w-[2px] bg-primary-blue"></span>
              <span className="wave-bar w-[2px] bg-primary-blue"></span>
              <span className="wave-bar w-[2px] bg-primary-blue"></span>
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              EternalVoice
            </span>
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-success-green animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Voice Preserver</span>
            </div>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/record', label: 'Record' },
            { to: '/personality', label: 'Personality' },
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/timecapsule', label: 'Time Capsule' }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-inner border border-white/10'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-500 ${
            hasVoice 
              ? 'bg-success-green/10 text-success-green border-success-green/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${hasVoice ? 'bg-success-green animate-pulse' : 'bg-amber-400 animate-pulse'}`}></span>
            <span className="hidden sm:inline">My Voice:</span>
            <span>{hasVoice ? 'Active ✓' : 'Setup Required'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="md:hidden flex justify-around mt-4 pt-3 border-t border-white/5">
        {[
          { to: '/', label: 'Home' },
          { to: '/record', label: 'Record' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/timecapsule', label: 'Time Capsule' }
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-white/10 text-white font-bold' : 'text-text-muted'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
