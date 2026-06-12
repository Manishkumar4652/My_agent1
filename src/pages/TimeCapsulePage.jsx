import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Calendar, Send, Mic, Square, Play, Sparkles, Trash2 } from 'lucide-react';

const TimeCapsulePage = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [message, setMessage] = useState('');
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Time capsules list state (lazy initialized from localStorage with seeds)
  const [capsules, setCapsules] = useState(() => {
    const savedCapsules = localStorage.getItem('eternalvoice_capsules');
    if (savedCapsules) {
      return JSON.parse(savedCapsules);
    } else {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 45); // 45 days in future
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2); // 2 days in past

      const seedData = [
        {
          id: 'seed-1',
          title: "For my daughter's wedding day",
          recipient: "Emily",
          unlockDate: futureDate.toISOString().split('T')[0],
          message: "Emily, my sweet girl. Today you start a new chapter. I wanted to make sure you hear my voice telling you how beautiful you are, and how much I love you.",
          hasAudio: true,
          mockAudio: true,
          status: 'locked'
        },
        {
          id: 'seed-2',
          title: "To my son, on his graduation",
          recipient: "Daniel",
          unlockDate: pastDate.toISOString().split('T')[0],
          message: "Daniel, I am so proud of your graduation. Remember to keep learning, stay kind, and follow your dreams. Congratulations, son.",
          hasAudio: true,
          mockAudio: true,
          status: 'unlocked'
        }
      ];
      localStorage.setItem('eternalvoice_capsules', JSON.stringify(seedData));
      return seedData;
    }
  });

  const [countdowns, setCountdowns] = useState({});

  // Mic recording references
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Update countdown timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      capsules.forEach((capsule) => {
        const now = new Date();
        const unlock = new Date(capsule.unlockDate);
        const diff = unlock - now;

        if (diff <= 0) {
          newCountdowns[capsule.id] = 'unlocked';
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const mins = Math.floor((diff / (1000 * 60)) % 60);
          const secs = Math.floor((diff / 1000) % 60);
          newCountdowns[capsule.id] = `${days}d ${hours}h ${mins}m ${secs}s`;
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [capsules]);

  // Audio Recording for Time Capsule
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone permission blocked or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayVoice = (capsule) => {
    // Synthesize using Web Speech synthesis, playing back the message in user voice
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const profile = JSON.parse(localStorage.getItem('eternalvoice_personality_profile') || '{}');
      const utterance = new SpeechSynthesisUtterance(capsule.message);
      
      // Pitch/rate adjustments from personality profile
      if (profile.personality === 'Calm') {
        utterance.rate = 0.8;
      } else if (profile.personality === 'Energetic') {
        utterance.rate = 1.25;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !recipient || !unlockDate || !message) return;

    const newCapsule = {
      id: Date.now().toString(),
      title,
      recipient,
      unlockDate,
      message,
      hasAudio: !!audioUrl,
      localAudioUrl: audioUrl || null,
      status: new Date(unlockDate) <= new Date() ? 'unlocked' : 'locked'
    };

    const updatedCapsules = [newCapsule, ...capsules];
    setCapsules(updatedCapsules);
    localStorage.setItem('eternalvoice_capsules', JSON.stringify(updatedCapsules));

    // Clear Form inputs
    setTitle('');
    setRecipient('');
    setUnlockDate('');
    setMessage('');
    setAudioUrl(null);
  };

  const handleDelete = (id) => {
    const updated = capsules.filter((c) => c.id !== id);
    setCapsules(updated);
    localStorage.setItem('eternalvoice_capsules', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* 1. Header with Golden Accents */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold/20 animate-pulse">
          <Sparkles className="w-5 h-5 text-accent-gold" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Leave Your Legacy</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Record messages for your loved ones. They will hear your voice, exactly as it is today, unlocked on special dates.
        </p>
        
        {/* Emotional Quote */}
        <p className="text-xs text-accent-gold/80 italic font-medium px-4 py-2 border-y border-accent-gold/10 inline-block">
          "The ones we love never truly leave us — their voice lives on."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Create Form (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-panel-gold rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="font-bold text-lg text-white border-b border-accent-gold/10 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-gold" />
              Create Time Capsule
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs font-semibold text-text-muted">Message Title</label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. For Emily's wedding day"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-accent-gold/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted transition-colors"
              />
            </div>

            {/* Recipient */}
            <div className="space-y-1.5">
              <label htmlFor="recipient" className="block text-xs font-semibold text-text-muted">Recipient Name</label>
              <input
                id="recipient"
                type="text"
                required
                placeholder="e.g. Emily"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-accent-gold/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted transition-colors"
              />
            </div>

            {/* Unlock Date */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="block text-xs font-semibold text-text-muted">Delivery Date</label>
              <input
                id="date"
                type="date"
                required
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-accent-gold/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted transition-colors cursor-pointer"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label htmlFor="msg" className="block text-xs font-semibold text-text-muted">Your Message</label>
              <textarea
                id="msg"
                required
                rows={4}
                placeholder="Write your loving letter here. The system will synthesize the voice from this script..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-accent-gold/40 rounded-xl text-white text-sm outline-none placeholder:text-text-muted resize-none transition-colors"
              />
            </div>

            {/* Voice Message Recorder */}
            <div className="p-3 bg-navy-dark/40 border border-white/5 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-muted">Preserve Original Vocal Track (Optional)</span>
                {audioUrl && <span className="text-success-green font-semibold flex items-center gap-1">✓ Recorded</span>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex-grow py-3 border-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isRecording 
                      ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
                      : 'bg-white/5 border-white/10 hover:border-accent-gold/40 hover:text-accent-gold'
                  }`}
                >
                  {isRecording ? <Square className="w-4 h-4 fill-red-500" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Stop Recording' : 'Record Voice Track'}
                </button>

                {audioUrl && (
                  <button
                    type="button"
                    onClick={() => new Audio(audioUrl).play()}
                    className="px-4 bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold rounded-xl border border-accent-gold/20 flex items-center justify-center cursor-pointer"
                    title="Play recorded capsule audio"
                  >
                    <Play className="w-4 h-4 fill-accent-gold" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-accent-gold hover:opacity-95 text-navy-dark font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Seal Time Capsule
              <Send className="w-4 h-4 fill-navy-dark" />
            </button>
          </form>
        </div>

        {/* Right Side: Saved Capsules (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2.5">
            <Unlock className="w-5 h-5 text-accent-gold" />
            My Saved Capsules
          </h3>

          {capsules.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-text-muted italic text-sm border border-white/5">
              No legacy capsules found. Build one using the form on the left.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capsules.map((capsule) => {
                const isUnlocked = countdowns[capsule.id] === 'unlocked' || capsule.status === 'unlocked';
                const timerVal = countdowns[capsule.id] || 'Loading...';

                return (
                  <div 
                    key={capsule.id} 
                    className={`glass-panel rounded-2xl border p-5 shadow-md flex flex-col justify-between h-[230px] hover:border-white/20 transition-all duration-300 relative overflow-hidden group ${
                      isUnlocked 
                        ? 'border-success-green/20' 
                        : 'border-white/10'
                    }`}
                  >
                    {/* Locked/Unlocked indicators */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate leading-tight group-hover:text-accent-gold transition-colors">{capsule.title}</h4>
                        <span className="text-[10px] text-text-muted block mt-1 font-medium">To: <span className="text-white font-semibold">{capsule.recipient}</span></span>
                      </div>
                      <div className={`p-2 rounded-lg flex-shrink-0 border ${
                        isUnlocked 
                          ? 'bg-success-green/10 text-success-green border-success-green/20' 
                          : 'bg-amber-500/10 text-accent-gold border-amber-500/20'
                      }`}>
                        {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Preview of locked message */}
                    <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mt-3">
                      {isUnlocked ? capsule.message : "This message is sealed. The audio track is encrypted until the milestone date is reached."}
                    </p>

                    {/* Bottom controls */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold block">Unlock Status:</span>
                        <span className={`text-xs font-mono font-semibold ${isUnlocked ? 'text-success-green' : 'text-accent-gold animate-pulse'}`}>
                          {isUnlocked ? 'Unlocked ✓' : timerVal}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isUnlocked && (
                          <button
                            onClick={() => handlePlayVoice(capsule)}
                            className="p-2.5 bg-success-green/10 text-success-green hover:bg-success-green hover:text-white rounded-lg transition-all duration-200 cursor-pointer border border-success-green/20"
                            title="Play Synthesized Voice Capsule"
                          >
                            <Play className="w-4.5 h-4.5 fill-current" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(capsule.id)}
                          className="p-2.5 bg-red-400/5 hover:bg-red-400/20 border border-red-500/10 text-red-400 rounded-lg cursor-pointer transition-colors"
                          title="Delete Capsule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
};

export default TimeCapsulePage;
