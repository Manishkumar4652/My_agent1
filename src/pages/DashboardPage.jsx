import { useState } from 'react';
import { Volume2, Send, History, Sparkles, MessageSquare, Eye, Trash2 } from 'lucide-react';
import AgentStatusPanel from '../components/AgentStatusPanel';
import agentOrchestrator from '../components/AgentOrchestrator';

const DashboardPage = () => {
  // Input tabs state
  const [activeTab, setActiveTab] = useState('type');
  const [inputText, setInputText] = useState('');
  const [speechText, setSpeechText] = useState('');
  
  // Voice synthesis settings
  const [volume, setVolume] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  
  // Processing and ripple animation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  
  // Active days banner (lazy initialized from localStorage)
  const [activeDays] = useState(() => {
    const activeSince = localStorage.getItem('eternalvoice_active_since');
    if (!activeSince) {
      const today = new Date();
      // Set to 4 days ago for realistic demo, otherwise standard today
      today.setDate(today.getDate() - 4);
      localStorage.setItem('eternalvoice_active_since', today.toISOString());
      return 4;
    } else {
      const diffTime = Math.abs(new Date() - new Date(activeSince));
      return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  });
  
  // Conversation History (lazy initialized from localStorage)
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('eternalvoice_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Eye Control selection states
  const [eyeSelectedGroup, setEyeSelectedGroup] = useState(null);

  // Load personality profile (lazy initialized from localStorage)
  const [profile] = useState(() => {
    const savedProfile = localStorage.getItem('eternalvoice_personality_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      topics: '',
      personality: 'Warm',
      phrases: '',
      language: 'English'
    };
  });

  // Handle Quick Phrases click
  const handleQuickPhrase = (phrase) => {
    setInputText(phrase);
    setSpeechText(phrase);
    setActiveTab('type'); // switch back to Type to edit/preview
  };

  // Simulated Eye Control Groups
  const eyeGroups = [
    { label: 'A B C D', chars: ['A', 'B', 'C', 'D'] },
    { label: 'E F G H', chars: ['E', 'F', 'G', 'H'] },
    { label: 'I J K L', chars: ['I', 'J', 'K', 'L'] },
    { label: 'M N O P', chars: ['M', 'N', 'O', 'P'] },
    { label: 'Q R S T', chars: ['Q', 'R', 'S', 'T'] },
    { label: 'U V W X', chars: ['U', 'V', 'W', 'X'] },
    { label: 'Y Z ? .', chars: ['Y', 'Z', '?', '.'] },
    { label: 'Space ␣', action: 'space' },
    { label: 'Backspace ⌫', action: 'backspace' }
  ];

  const handleEyeSelect = (cell) => {
    if (cell.action) {
      if (cell.action === 'space') {
        setInputText((prev) => prev + ' ');
        setSpeechText((prev) => prev + ' ');
      } else if (cell.action === 'backspace') {
        setInputText((prev) => prev.slice(0, -1));
        setSpeechText((prev) => prev.slice(0, -1));
      }
      return;
    }

    setEyeSelectedGroup(cell.chars);
  };

  const handleEyeCharSelect = (char) => {
    setInputText((prev) => prev + char.toLowerCase());
    setSpeechText((prev) => prev + char.toLowerCase());
    setEyeSelectedGroup(null);
  };

  // Submit and speak synthesis pipeline
  const handleSpeak = async (e) => {
    if (e) e.preventDefault();
    const textToSpeak = speechText.trim() || inputText.trim();
    if (!textToSpeak) return;

    setIsProcessing(true);
    
    try {
      // Step through the Multi-Agent Orchestrator
      const result = await agentOrchestrator.processInput(textToSpeak, profile);
      
      setIsProcessing(false);
      setIsRippling(true);

      // Play synthesis
      if ('speechSynthesis' in window) {
        // Cancel ongoing voices
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(result.refinedText);
        utterance.rate = speed * result.speechRate;
        utterance.pitch = result.pitch;
        utterance.volume = volume;

        // Try to match language specific voices
        const voices = window.speechSynthesis.getVoices();
        if (profile.language === 'Hindi' || profile.language === 'Hinglish') {
          const hiVoice = voices.find(v => v.lang.startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        }

        window.speechSynthesis.speak(utterance);
      }

      // Add to conversation history logs
      const logItem = {
        id: Date.now(),
        original: textToSpeak,
        refined: result.refinedText,
        emotion: result.emotion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [logItem, ...history].slice(0, 50); // cap history at 50 logs
      setHistory(updatedHistory);
      localStorage.setItem('eternalvoice_history', JSON.stringify(updatedHistory));

      // Trigger temporary ripple animation cleanup
      setTimeout(() => {
        setIsRippling(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('eternalvoice_history');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      
      {/* 1. Dynamic Health Preserved Banner */}
      <div className="bg-gradient-to-r from-primary-blue/20 to-purple-500/10 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-primary-blue/10 border border-primary-blue/20 rounded-xl text-primary-blue">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Vocal Footprint Active</h2>
            <p className="text-xs text-text-muted">
              Your preserved digital vocal profile is successfully trained. AI orchestrators are active.
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-navy-dark border border-white/10 rounded-xl font-mono text-xs text-primary-blue">
          Preservation Time: <span className="font-bold text-white">{activeDays} Days</span>
        </div>
      </div>

      {/* 2. Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input panel (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Tabs Selector Header */}
            <div className="flex bg-navy-dark border-b border-white/10">
              <button
                onClick={() => setActiveTab('type')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  activeTab === 'type' 
                    ? 'border-primary-blue text-white bg-white/5' 
                    : 'border-transparent text-text-muted hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Type to Speak
              </button>
              
              <button
                onClick={() => setActiveTab('phrases')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  activeTab === 'phrases' 
                    ? 'border-primary-blue text-white bg-white/5' 
                    : 'border-transparent text-text-muted hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Quick Phrases
              </button>
              
              <button
                onClick={() => setActiveTab('eye')}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  activeTab === 'eye' 
                    ? 'border-primary-blue text-white bg-white/5' 
                    : 'border-transparent text-text-muted hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                Eye Control Mode
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              
              {/* TAB 1: TYPE TO SPEAK */}
              {activeTab === 'type' && (
                <div className="space-y-4">
                  <textarea
                    rows={4}
                    placeholder="Type what you want to say... (Your AI agent will automatically format output structure)"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setSpeechText(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white outline-none resize-none text-base transition-colors"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSpeak}
                      disabled={isProcessing || !inputText.trim()}
                      className="px-6 py-3 bg-primary-blue hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      Process Input
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: QUICK PHRASES GRID */}
              {activeTab === 'phrases' && (
                <div className="space-y-4">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">
                    Click a common command phrase to write it instantly:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      'I love you',
                      'Thank you',
                      'I need help',
                      'I am fine',
                      'Call the doctor',
                      'I am hungry',
                      'Please come here',
                      'Good morning'
                    ].map((phrase) => (
                      <button
                        key={phrase}
                        onClick={() => handleQuickPhrase(phrase)}
                        className="p-4 bg-white/5 border border-white/10 hover:border-primary-blue/40 hover:bg-primary-blue/5 text-white rounded-xl text-xs font-semibold text-center transition-all duration-300 cursor-pointer shadow-sm hover:scale-[1.02]"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EYE CONTROL SIMULATOR */}
              {activeTab === 'eye' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                      Simulated Eye-Gaze Board (Select character groups):
                    </span>
                    {eyeSelectedGroup && (
                      <button 
                        onClick={() => setEyeSelectedGroup(null)}
                        className="text-[10px] text-primary-blue hover:underline bg-primary-blue/10 px-2 py-1 rounded"
                      >
                        ← Back to Groups
                      </button>
                    )}
                  </div>
                  
                  {/* Selected Group Expansion Sub-Grid */}
                  {eyeSelectedGroup ? (
                    <div className="grid grid-cols-4 gap-4 p-4 bg-navy-dark/40 border border-white/5 rounded-xl animate-fade-in">
                      {eyeSelectedGroup.map((char) => (
                        <button
                          key={char}
                          onClick={() => handleEyeCharSelect(char)}
                          className="h-20 bg-primary-blue/10 border-2 border-primary-blue hover:bg-primary-blue text-white rounded-xl font-bold text-2xl transition-all duration-200 cursor-pointer flex items-center justify-center"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Default 3x3 Groups Grid */
                    <div className="grid grid-cols-3 gap-3">
                      {eyeGroups.map((cell, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleEyeSelect(cell)}
                          className="h-20 bg-white/5 border border-white/10 hover:border-primary-blue hover:bg-primary-blue/5 rounded-xl font-bold text-sm text-center flex flex-col justify-center items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                        >
                          <span className="text-white text-lg tracking-wider">{cell.label}</span>
                          {!cell.action && <span className="text-[9px] uppercase tracking-widest text-text-muted font-medium">Select Group</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Output Preview */}
                  <div className="mt-4 p-3 bg-navy-dark border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="min-w-0 flex-grow">
                      <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Board Text Buffer:</span>
                      <p className="text-sm font-semibold text-white truncate mt-0.5 min-h-[20px]">
                        {inputText || <span className="text-text-muted italic font-normal">Buffer empty... select letters above</span>}
                      </p>
                    </div>
                    {inputText && (
                      <button 
                        onClick={() => { setInputText(''); setSpeechText(''); }}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 bg-red-400/10 rounded cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right speak parameters panel & sidebar status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Voice Output Card */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            
            {/* Gentle Background ripple wrapper */}
            {isRippling && (
              <div className="absolute inset-0 z-0 bg-primary-blue/5 border-2 border-primary-blue/30 rounded-2xl animate-ripple pointer-events-none" />
            )}

            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-white uppercase tracking-wider">Voice Processor</h3>
                <div className="mt-3 p-4 bg-navy-dark border border-white/10 rounded-xl min-h-[90px] flex flex-col justify-between">
                  <span className="text-[10px] text-primary-blue font-bold uppercase tracking-widest">Utterance:</span>
                  <p className="text-sm text-white font-medium italic mt-1 leading-relaxed">
                    {isProcessing ? 'Agents processing output...' : speechText || 'No pending speech.'}
                  </p>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-muted">Pitch Modifier</span>
                    <span className="text-white">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-muted">Output Volume</span>
                    <span className="text-white">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                  />
                </div>
              </div>

              {/* Big SPEAK trigger */}
              <button
                onClick={handleSpeak}
                disabled={isProcessing || (!speechText.trim() && !inputText.trim())}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                  isProcessing 
                    ? 'bg-slate-700 text-slate-400' 
                    : 'bg-gradient-to-r from-primary-blue to-cyan-500 text-white hover:opacity-95 shadow-blue-500/10'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                {isProcessing ? 'Simulating AI Agents...' : 'SPEAK NOW'}
              </button>
            </div>

          </div>

          {/* System status agent monitor */}
          <AgentStatusPanel isProcessing={isProcessing} />

        </div>
      </div>

      {/* 3. Bottom Logs history list */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary-blue" />
            <h3 className="font-semibold text-base text-white">Conversation History</h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-red-400/5 hover:bg-red-400/10 border border-red-500/10 rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-text-muted text-sm italic">
            Conversation log is empty. Try typing something above and click "SPEAK NOW".
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {history.map((log) => (
              <div 
                key={log.id} 
                className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-text-muted">{log.timestamp}</span>
                    <span className="px-2 py-0.5 bg-primary-blue/10 border border-primary-blue/20 rounded font-semibold text-primary-blue">
                      {log.emotion}
                    </span>
                  </div>
                  <p className="text-white leading-relaxed font-medium">
                    "{log.refined}"
                  </p>
                  {log.original !== log.refined && (
                    <p className="text-[10px] text-text-muted truncate">
                      Source input: "{log.original}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
