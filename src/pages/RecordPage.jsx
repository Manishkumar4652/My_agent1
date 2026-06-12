import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Play, Check, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';

const sentences = [
  "Hello, my name is [name] and this is my voice.",
  "I love you more than words can say.",
  "Today is a beautiful day full of possibilities.",
  "Thank you for being part of my life.",
  "Even when I am silent, my voice will always be with you."
];

const RecordPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('eternalvoice_user_name') || '');
  const [nameEntered, setNameEntered] = useState(!!name);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [audioUrls, setAudioUrls] = useState({});
  const [permissionError, setPermissionError] = useState(null);

  // References for MediaRecorder and Web Audio API
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize name if already saved
  const handleStartRecordingFlow = (e) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      localStorage.setItem('eternalvoice_user_name', name);
      setNameEntered(true);
    }
  };

  const getSentenceText = (index) => {
    return sentences[index].replace('[name]', name || 'User');
  };

  // Start recording audio
  const startRecording = async () => {
    setPermissionError(null);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioUrls((prev) => ({
          ...prev,
          [currentStep]: audioUrl
        }));

        setRecordings((prev) => {
          const updated = [...prev];
          updated[currentStep] = audioBlob;
          return updated;
        });

        // Stop stream tracks to turn off the microphone light
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // Set up Web Audio API Visualizer
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.start();
      setIsRecording(true);
      drawVisualizer();
    } catch (err) {
      console.error("Microphone access error:", err);
      setPermissionError("Could not access microphone. Please ensure microphone permissions are granted.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Audio Visualizer Canvas loop
  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 100;

    const draw = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#121829';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Custom blue gradient styling
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#1E294B');
        gradient.addColorStop(0.5, '#4F8EF7');
        gradient.addColorStop(1, '#06B6D4');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  // Navigate back to recording
  const handleResetCurrent = () => {
    setAudioUrls((prev) => {
      const updated = { ...prev };
      delete updated[currentStep];
      return updated;
    });
    setRecordings((prev) => {
      const updated = [...prev];
      updated[currentStep] = null;
      return updated;
    });
  };

  // Proceed to next prompt
  const handleNext = () => {
    if (currentStep < sentences.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all recordings!
      localStorage.setItem('eternalvoice_recording_complete', 'true');
      
      // Dispatch custom event to notify Navbar immediately
      const event = new Event('eternalvoice_voice_updated');
      window.dispatchEvent(event);

      // Save dummy audio data to simulate loaded voice
      localStorage.setItem('eternalvoice_voice_data_present', 'true');
    }
  };

  // Reset all steps to start again
  const resetAll = () => {
    setRecordings([]);
    setAudioUrls({});
    setCurrentStep(0);
    localStorage.removeItem('eternalvoice_recording_complete');
    const event = new Event('eternalvoice_voice_updated');
    window.dispatchEvent(event);
  };

  const isCompleted = recordings.filter(Boolean).length === sentences.length;
  const progressPercent = Math.min((recordings.filter(Boolean).length / sentences.length) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col justify-center min-h-[calc(100vh-80px)]">
      
      {/* Onboarding Name Input Form */}
      {!nameEntered ? (
        <div className="glass-panel border border-white/10 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary-blue/10 border border-primary-blue/20 flex items-center justify-center mx-auto mb-2 animate-bounce">
            <Mic className="w-8 h-8 text-primary-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Preserve Your Voice</h2>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Before we start the sentence-by-sentence calibration, please enter your name so we can personalize your training program.
            </p>
          </div>
          <form onSubmit={handleStartRecordingFlow} className="max-w-sm mx-auto space-y-4">
            <input
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-navy-dark border border-white/10 focus:border-primary-blue/40 rounded-xl text-white outline-none text-center text-lg placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-blue hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md cursor-pointer"
            >
              Continue to Step 1
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header Step Indicators */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary-blue font-bold">Step 1 of 3</span>
              <h2 className="text-2xl font-bold text-white mt-1">Voice Preservation</h2>
            </div>
            <span className="text-xs text-text-muted font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              Sentence {isCompleted ? sentences.length : Math.min(currentStep + 1, sentences.length)} of {sentences.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 border border-white/5 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary-blue h-full transition-all duration-500 rounded-full shadow-inner"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Main Interface */}
          {!isCompleted ? (
            <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl space-y-8 flex flex-col items-center">
              
              {/* Sentence Prompt Panel */}
              <div className="text-center space-y-3 w-full">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Please read this sentence aloud:
                </span>
                <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed max-w-xl mx-auto px-4 border-l-4 border-primary-blue bg-primary-blue/5 py-4 rounded-r-xl">
                  "{getSentenceText(currentStep)}"
                </p>
              </div>

              {/* Error Message */}
              {permissionError && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-md w-full">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>{permissionError}</p>
                </div>
              )}

              {/* Live Web Audio Canvas */}
              {isRecording && (
                <div className="w-full max-w-md bg-navy-medium border border-white/5 rounded-xl overflow-hidden p-2">
                  <canvas ref={canvasRef} className="w-full h-16 bg-navy-medium rounded-lg" />
                </div>
              )}

              {/* Playback Preview Box */}
              {audioUrls[currentStep] && !isRecording && (
                <div className="w-full max-w-sm flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const audio = new Audio(audioUrls[currentStep]);
                        audio.play();
                      }}
                      className="p-2.5 bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 rounded-lg transition-colors cursor-pointer"
                      title="Play Recorded Sentence"
                    >
                      <Play className="w-4 h-4 fill-primary-blue" />
                    </button>
                    <span className="text-xs text-white font-medium">Recorded Segment Output</span>
                  </div>
                  
                  <button 
                    onClick={handleResetCurrent}
                    className="flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Redo
                  </button>
                </div>
              )}

              {/* Big Interaction Recording Button */}
              <div className="flex flex-col items-center gap-3">
                {!audioUrls[currentStep] ? (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 hover:scale-105 cursor-pointer relative ${
                      isRecording 
                        ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
                        : 'bg-primary-blue/10 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white'
                    }`}
                  >
                    {isRecording ? <Square className="w-8 h-8 fill-red-500" /> : <Mic className="w-8 h-8" />}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-4 bg-success-green hover:bg-emerald-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-success-green/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    Confirm & Proceed
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                
                <span className="text-xs text-text-muted mt-2 font-medium">
                  {isRecording 
                    ? 'Recording... Tap to stop speaking.' 
                    : audioUrls[currentStep] 
                      ? 'Confirm that you are happy with the recording.' 
                      : 'Tap mic button to start reading.'}
                </span>
              </div>
            </div>
          ) : (
            /* Recording Complete Success Card */
            <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-success-green/10 border border-success-green/20 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <Check className="w-10 h-10 text-success-green" />
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Voice Captured Successfully ✓</h2>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Excellent! We have captured your vocal frequency signatures. Next, we will customize the AI personality settings to finalize your voice preservation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => navigate('/personality')}
                  className="w-full sm:w-auto px-8 py-4 bg-primary-blue hover:bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  Step 2: Train AI Twin
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={resetAll}
                  className="w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Recording
                </button>
              </div>
            </div>
          )}

          {/* Guidelines info */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
            <h4 className="text-xs font-semibold text-white mb-1">🎤 Pro-Tips for Clean Preservation</h4>
            <ul className="text-xs text-text-muted list-disc list-inside space-y-1">
              <li>Record in a quiet room, away from hums like fans or ACs.</li>
              <li>Hold your device at a steady distance from your mouth.</li>
              <li>Read with your natural speed, emotion, and pauses.</li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default RecordPage;
