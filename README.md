# EternalVoice 🎙️

**EternalVoice** is an AI-powered voice preservation and assistive communication application designed for individuals with degenerative diseases (such as ALS, Parkinson's, and Motor Neuron Disease) who are losing their ability to speak. 

The application enables patients to preserve their unique vocal footprint, configure a tailored conversational AI twin, communicate instantly using keyboard or simulated eye-gaze inputs, and seal milestone-locked Time Capsules for their loved ones.

---

## 🌟 Core Features

### 1. 🎤 Voice Preservation (Onboarding)
- **Step-by-Step Prompts**: A structured calibration sequence guiding the user through 5 emotional sentence prompts.
- **Microphone Capture**: Utilizes the browser's native **MediaRecorder API** to capture speech.
- **Vocal Waveform Visualizer**: Uses the **Web Audio API** (`AudioContext` and `AnalyserNode`) to draw a live frequency visualizer on canvas while recording.
- **Audio Verification**: Allows users to play back and verify each segment before confirming.

### 2. 🧠 Personality Setup (Step 2 of 3)
- **Adaptive Adaptation**: Configures conversation topics, custom phrases, dialect preferences, and language (English, Hindi, Hinglish).
- **Neural Sim Training**: Simulates a 2-second neural training pipeline that computes voice and vocabulary mappings, saving the profile to local storage.

### 3. 💬 Communication Dashboard (Step 3 of 3)
- **Three Input Modalities**:
  - **Type to Speak**: Custom text box with AI orchestration layout formatting.
  - **Quick Phrases Grid**: A 1-tap grid containing 8 essential phrases (e.g., "I need help", "I love you", "Call the doctor") for emergency or quick interactions.
  - **Eye Control Mode**: A nested 3x3 letter selection grid mimicking an assistive eye-gaze communication board.
- **Vocal Customizers**: Live sliders to adjust volume and speech pitch.
- **Pulsing SPEAK Trigger**: Initiates text-to-speech outputs with clean button ripple effects.
- **Conversation Logs**: Maintains a chronological history of spoken phrases with timestamped emotional tags.

### 4. 🔒 Golden Legacy Time Capsules
- **Milestone Delivery**: Allows patients to leave messages for special future dates (e.g., anniversaries, graduations).
- **Milestone Timers**: Computes dynamic countdown clocks (days, hours, minutes, seconds) for locked messages.
- **Vocal Playback**: Once unlocked, capsules can be played back using the synthesized preserved voice.

### 5. 🤖 Multi-Agent Orchestrator
Uses a simulated background multi-agent system (`AgentOrchestrator`) mapping text inputs:
- **Personality Agent**: Adjusts vocabulary and injects user custom words/Hinglish translations.
- **Voice Agent**: Computes dynamic rate and pitch settings.
- **Expression Agent**: Scans semantics to tag conversational emotions (e.g., Calm, Warm, Cheerful, Urgent).
- **Speech Agent**: Synthesizes output using the browser's `SpeechSynthesis` Web Speech API.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (native `@tailwindcss/vite` integration)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Browser Integrations**: Web Speech API (`window.speechSynthesis`), MediaRecorder API, Web Audio API
- **State & Storage**: LocalStorage

---

## 📁 Repository Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AgentOrchestrator.js       # Core NLP & voice parameter pipelines
│   │   ├── AgentStatusPanel.jsx       # Sidebar panel showing the 4 active agents
│   │   └── Navbar.jsx                 # Dynamic navigation bar with active status badge
│   ├── pages/
│   │   ├── LandingPage.jsx            # Dark-themed home page with Canvas EKG wave
│   │   ├── RecordPage.jsx             # Onboarding voice capture & Audio Visualizer
│   │   ├── PersonalityPage.jsx        # Neural profile training form
│   │   ├── DashboardPage.jsx          # Speech board (Type, Quick, Eye control, History)
│   │   └── TimeCapsulePage.jsx        # Time-locked legacy messages with countdowns
│   ├── App.jsx                        # Layout router
│   ├── index.css                      # Tailwind v4 directives & global ripple keyframes
│   └── main.jsx                       # Entry mount point
├── index.html                         # Header tags and font integrations
├── vite.config.js                     # Vite build and Tailwind v4 plugin registry
└── package.json                       # Dependencies configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Manishkumar4652/My_agent1.git
   cd My_agent1
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser to interact with the application.

4. Create a production build:
   ```bash
   npm run build
   ```

---

## 📽️ Demo Video
A full walkthrough showing the application workflow (microphone capture, voice setup, dashboard speech triggers, and countdown legacy capsules) is saved in the repository:
- 🎬 View the demo: **[eternal_voice_demo.webp](./eternal_voice_demo.webp)**
