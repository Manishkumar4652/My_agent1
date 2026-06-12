import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Heart, Shield, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Wave parameters
    let angle = 0;
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    // Animation loop
    const render = () => {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 142, 247, ${p.alpha})`;
        ctx.fill();
      });

      // Draw heartbeat wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(79, 142, 247, 0)');
      gradient.addColorStop(0.5, 'rgba(79, 142, 247, 0.4)');
      gradient.addColorStop(1, 'rgba(79, 142, 247, 0)');
      ctx.strokeStyle = gradient;

      const centerY = height * 0.65;
      for (let x = 0; x < width; x += 2) {
        // Base sine wave
        let y = Math.sin(x * 0.005 + angle) * 20;

        // Heartbeat spike simulation
        const phase = (x - angle * 50) % (width * 0.8);
        if (phase > 0 && phase < 80) {
          const t = phase / 80;
          // EKG-like shape
          if (t < 0.25) {
            y += Math.sin(t * Math.PI * 4) * 10; // small initial bounce
          } else if (t < 0.5) {
            y -= Math.sin((t - 0.25) * Math.PI * 4) * 80; // sharp drop/rise
          } else if (t < 0.75) {
            y += Math.sin((t - 0.5) * Math.PI * 4) * 50; // counter spike
          } else {
            y -= Math.sin((t - 0.75) * Math.PI * 4) * 15; // return to normal
          }
        }

        if (x === 0) {
          ctx.moveTo(x, centerY + y);
        } else {
          ctx.lineTo(x, centerY + y);
        }
      }
      ctx.stroke();

      angle += 0.015;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 text-center flex-grow flex flex-col justify-center">
        {/* Heart Accent Icon */}
        <div className="mx-auto mb-6 flex items-center justify-center w-12 h-12 rounded-full bg-primary-blue/10 border border-primary-blue/20 animate-pulse">
          <Heart className="w-6 h-6 text-primary-blue fill-primary-blue/30" />
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent leading-none">
          Your Voice. <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-primary-blue to-cyan-400 bg-clip-text text-transparent">Forever.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Preserve your voice before it is gone. Record a few minutes of speech today, and speak to your loved ones in your own voice, always.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <button
            onClick={() => navigate('/record')}
            className="w-full sm:w-auto px-8 py-4 bg-primary-blue hover:bg-blue-600 text-white rounded-2xl font-semibold text-base shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            Start My Journey
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowDemoVideo(true)}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 hover:bg-white/10 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            Watch Demo
          </button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 text-left border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-2">300,000+</h3>
            <p className="text-sm font-semibold text-primary-blue mb-1">Global ALS Community</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Patients worldwide lose their ability to speak every single year due to degenerative conditions.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 text-left border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10">
              <Heart className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-2">100%</h3>
            <p className="text-sm font-semibold text-cyan-400 mb-1">Self-Owned Preservation</p>
            <p className="text-xs text-text-muted leading-relaxed">
              We encrypt and save your speech patterns directly on your device. You retain full ownership of your voice.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 text-left border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-2">&lt; 10 Mins</h3>
            <p className="text-sm font-semibold text-purple-400 mb-1">Onboarding Training</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Record just 5 key sentence prompts to generate your AI twin and communicate instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Modal Overlay */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel border border-white/25 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white">EternalVoice Demo Walkthrough</h3>
              <button 
                onClick={() => setShowDemoVideo(false)} 
                className="text-text-muted hover:text-white transition-colors text-sm px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video bg-navy-dark border border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <Play className="w-12 h-12 text-primary-blue animate-pulse mb-3" />
                <p className="text-sm font-medium text-white">Simulated Product Video</p>
                <p className="text-xs text-text-muted mt-2 max-w-md">
                  In a production environment, this is a cinematic video explaining the ALS voice loss challenge and showing EternalVoice's TTS system speaking in real-time.
                </p>
              </div>
              <div className="p-4 bg-primary-blue/5 border border-primary-blue/20 rounded-xl text-left">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-blue mb-1">Key Workflow Highlights</h4>
                <ul className="text-xs text-text-muted list-disc list-inside space-y-1">
                  <li>Quick 5-prompt voice capture using your browser microphone.</li>
                  <li>Multi-Agent orchestrator matching common vocabulary and emotional context.</li>
                  <li>Assistive communication via keyboard shortcuts and full Eye-Control board simulation.</li>
                  <li>Locked Time Capsules that open automatically on specified legacy milestone dates.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
