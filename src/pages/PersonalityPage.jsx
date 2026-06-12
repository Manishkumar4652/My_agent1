import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle, ChevronRight, Activity } from 'lucide-react';

const PersonalityPage = () => {
  const navigate = useNavigate();
  
  // Form State
  const [topics, setTopics] = useState(localStorage.getItem('eternalvoice_topics') || '');
  const [personality, setPersonality] = useState(localStorage.getItem('eternalvoice_personality') || 'Warm');
  const [phrases, setPhrases] = useState(localStorage.getItem('eternalvoice_phrases') || '');
  const [language, setLanguage] = useState(localStorage.getItem('eternalvoice_language') || 'English');
  
  // Animation/Flow States
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatusText, setTrainingStatusText] = useState('');
  const [isTrained, setIsTrained] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTraining(true);
    setTrainingProgress(0);

    // Save configuration parameters to LocalStorage
    const profile = { topics, personality, phrases, language };
    localStorage.setItem('eternalvoice_personality_profile', JSON.stringify(profile));
    
    // Also save individual keys for easy access
    localStorage.setItem('eternalvoice_topics', topics);
    localStorage.setItem('eternalvoice_personality', personality);
    localStorage.setItem('eternalvoice_phrases', phrases);
    localStorage.setItem('eternalvoice_language', language);
    localStorage.setItem('eternalvoice_personality_trained', 'true');

    // Simulate neural training phases over 2 seconds
    const intervalTime = 40; // 40ms * 50 steps = 2000ms
    let currentStep = 0;
    
    const trainingSteps = [
      { max: 20, text: "Analyzing vocal phonemes..." },
      { max: 50, text: "Mapping semantic vocabulary patterns..." },
      { max: 80, text: "Synthesizing conversational tone matrices..." },
      { max: 100, text: "Deploying AI Twin Orchestrator..." }
    ];

    const timer = setInterval(() => {
      currentStep += 2;
      setTrainingProgress(currentStep);

      // Find appropriate status text based on progress
      const stepInfo = trainingSteps.find(step => currentStep <= step.max);
      if (stepInfo) {
        setTrainingStatusText(stepInfo.text);
      }

      if (currentStep >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsTraining(false);
          setIsTrained(true);
        }, 300);
      }
    }, intervalTime);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center min-h-[calc(100vh-80px)]">
      
      {/* 1. TRAINING IN PROGRESS VIEW */}
      {isTraining && (
        <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Pulsing visual core */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-blue/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <Cpu className="w-10 h-10 text-primary-blue" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Learning your personality...</h3>
            <p className="text-xs text-primary-blue font-mono tracking-widest">{trainingProgress}% Complete</p>
          </div>

          {/* Training status log */}
          <div className="bg-navy-dark border border-white/5 rounded-xl p-4 max-w-sm mx-auto flex items-center gap-3 justify-center">
            <Activity className="w-4 h-4 text-primary-blue animate-pulse flex-shrink-0" />
            <span className="text-xs text-text-muted font-mono truncate">{trainingStatusText}</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
            <div 
              className="bg-primary-blue h-full transition-all duration-300 rounded-full"
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 2. SUCCESS VIEW */}
      {isTrained && !isTraining && (
        <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-success-green/10 border border-success-green/20 flex items-center justify-center mx-auto mb-2 animate-bounce">
            <CheckCircle className="w-10 h-10 text-success-green" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">AI Twin Trained!</h2>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Your speech parameters, phrase catalogs, and personality traits have been integrated. You can now use the Communication Dashboard.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-primary-blue hover:bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            Go to Speak Dashboard
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 3. CORE PROFILE FORM */}
      {!isTraining && !isTrained && (
        <div className="space-y-6">
          {/* Header step progress */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary-blue font-bold">Step 2 of 3</span>
              <h2 className="text-2xl font-bold text-white mt-1">Personality Setup</h2>
            </div>
            <span className="text-xs text-text-muted font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              Profile Training
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            
            {/* Favourite Topics Text Area */}
            <div className="space-y-2">
              <label htmlFor="topics" className="block text-sm font-semibold text-white">
                What are your favorite topics to talk about?
              </label>
              <textarea
                id="topics"
                required
                placeholder="e.g. Sports, reading literature, technology updates, chatting about family stories, playing cards..."
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted resize-none transition-colors"
              />
            </div>

            {/* Personality Dropdown */}
            <div className="space-y-2">
              <label htmlFor="personality" className="block text-sm font-semibold text-white">
                How would you describe your personality?
              </label>
              <select
                id="personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white text-sm outline-none transition-colors cursor-pointer"
              >
                <option value="Warm">Warm (Calming, empathetic, supportive)</option>
                <option value="Humorous">Humorous (Lighthearted, playful, cheerful)</option>
                <option value="Calm">Calm (Slow paced, peaceful, structured)</option>
                <option value="Energetic">Energetic (Fast paced, high-pitch, loud)</option>
                <option value="Thoughtful">Thoughtful (Reflective, analytical, deliberate)</option>
              </select>
            </div>

            {/* Common Phrases Text Input */}
            <div className="space-y-2">
              <label htmlFor="phrases" className="block text-sm font-semibold text-white">
                Your common phrases or words you use often
              </label>
              <input
                id="phrases"
                type="text"
                placeholder="e.g. cheers, you bet, alright my friend, bless you (separated by commas)"
                value={phrases}
                onChange={(e) => setPhrases(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted transition-colors"
              />
              <p className="text-[10px] text-text-muted leading-relaxed">
                Tip: The system orchestrator will automatically blend these vocabulary triggers into speech suggestions.
              </p>
            </div>

            {/* Language Preference Dropdown */}
            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-semibold text-white">
                Language preference
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white text-sm outline-none transition-colors cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Hinglish">Hinglish (English & Hindi mix)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-primary-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              Train My AI Twin
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PersonalityPage;
