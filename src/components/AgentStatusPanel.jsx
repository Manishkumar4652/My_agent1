import { Mic, Brain, Eye, Volume2 } from 'lucide-react';

const AgentStatusPanel = ({ isProcessing = false }) => {
  const agents = [
    {
      id: 'voice',
      name: 'Voice Agent',
      icon: <Mic className="w-5 h-5 text-primary-blue" />,
      normalText: 'Active — Monitoring speech patterns',
      activeText: 'Analyzing pitch and vocal tone...',
      status: 'active'
    },
    {
      id: 'personality',
      name: 'Personality Agent',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      normalText: 'Active — Maintaining your style',
      activeText: 'Injecting common phrases & dialect...',
      status: 'active'
    },
    {
      id: 'expression',
      name: 'Expression Agent',
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      normalText: 'Standby — Watching for gestures',
      activeText: 'Scanning text for emotional tags...',
      status: isProcessing ? 'active' : 'standby'
    },
    {
      id: 'speech',
      name: 'Speech Agent',
      icon: <Volume2 className="w-5 h-5 text-emerald-400" />,
      normalText: 'Ready — Prepared to speak for you',
      activeText: 'Generating synthesized voice waveform...',
      status: isProcessing ? 'active' : 'ready'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h3 className="font-semibold text-lg tracking-wide text-white">System Orchestrator</h3>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary-blue/10 text-primary-blue border border-primary-blue/20 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full bg-primary-blue ${isProcessing ? 'animate-ping' : ''}`}></span>
          {isProcessing ? 'Processing...' : 'Listening'}
        </span>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => {
          const isActive = agent.status === 'active';
          const isReady = agent.status === 'ready';
          
          let indicatorBg = 'bg-slate-500';
          if (isActive) indicatorBg = 'bg-success-green';
          else if (isReady) indicatorBg = 'bg-primary-blue';

          return (
            <div 
              key={agent.id} 
              className={`p-4 rounded-xl transition-all duration-300 border flex gap-4 items-start ${
                isProcessing && isActive 
                  ? 'bg-primary-blue/5 border-primary-blue/30 shadow-md translate-x-1' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-navy-dark border border-white/10 flex-shrink-0">
                {agent.icon}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-white">{agent.name}</h4>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`w-2 h-2 rounded-full ${indicatorBg} ${isActive ? 'animate-pulse' : ''}`}></span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
                      {isProcessing && isActive ? 'Running' : agent.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed truncate">
                  {isProcessing && isActive ? agent.activeText : agent.normalText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-navy-dark/40 rounded-xl border border-white/5 text-center">
        <p className="text-[11px] text-text-muted italic">
          💡 Simulated Multi-Agent pipeline automatically scales to user health profile changes.
        </p>
      </div>
    </div>
  );
};

export default AgentStatusPanel;
