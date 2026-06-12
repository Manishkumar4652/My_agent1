class AgentOrchestrator {
  /**
   * Simulates the multi-agent processing pipeline.
   * @param {string} text - The input text to be spoken.
   * @param {Object} personalityProfile - User's customized profile from LocalStorage.
   * @returns {Promise<{refinedText: string, emotion: string, speechRate: number, pitch: number}>}
   */
  async processInput(text, personalityProfile) {
    // Simulate API processing latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const profile = personalityProfile || {
      topics: "",
      personality: "Warm",
      phrases: "",
      language: "English"
    };

    // --- STEP 1: Personality Agent ---
    // Refines text to match user's custom phrases and style
    let refinedText = text;
    
    // In Hinglish mode, do some basic word substitutions for demonstration
    if (profile.language === "Hinglish") {
      const translations = {
        "hello": "namaste",
        "thank you": "shukriya",
        "i need help": "mujhe help chahiye",
        "i am fine": "mein thik hoon",
        "call the doctor": "doctor ko call karo",
        "i am hungry": "mujhe bhook lagi hai",
        "please come here": "please yahan aao",
        "good morning": "shubh prabhat",
        "i love you": "main tumse pyaar karta hoon"
      };
      
      let lowercaseText = refinedText.toLowerCase().trim();
      if (translations[lowercaseText]) {
        refinedText = translations[lowercaseText];
      }
    }

    // Inject custom phrases if defined
    if (profile.phrases && profile.phrases.trim().length > 0) {
      const customPhrases = profile.phrases
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
        
      if (customPhrases.length > 0) {
        // Appending the first custom phrase if it's not already in the text
        const randomPhrase = customPhrases[Math.floor(Math.random() * customPhrases.length)];
        const punctuation = /[.!?]$/.test(refinedText) ? "" : ".";
        
        // Only append 40% of the time, or if the text is short, to keep it natural
        if (Math.random() > 0.5 && !refinedText.toLowerCase().includes(randomPhrase.toLowerCase())) {
          refinedText = `${refinedText}${punctuation} ${randomPhrase}`;
        }
      }
    }

    // --- STEP 2: Voice Agent & STEP 3: Expression Agent ---
    // Voice Agent: Sets speech rate & pitch parameters based on personality type
    // Expression Agent: Scans for emotional context & tags
    let speechRate;
    let pitch;
    let emotion;

    switch (profile.personality) {
      case "Warm":
        speechRate = 0.9;
        pitch = 1.05;
        emotion = "❤️ Warm";
        break;
      case "Humorous":
        speechRate = 1.15;
        pitch = 1.1;
        emotion = "😄 Cheerful";
        if (!refinedText.endsWith("!")) {
          refinedText += " 😄";
        }
        break;
      case "Calm":
        speechRate = 0.8;
        pitch = 0.95;
        emotion = "🧘 Calm";
        break;
      case "Energetic":
        speechRate = 1.25;
        pitch = 1.15;
        emotion = "⚡ Energetic";
        if (!refinedText.endsWith("!")) {
          refinedText += "!";
        }
        break;
      case "Thoughtful":
        speechRate = 0.85;
        pitch = 0.98;
        emotion = "🤔 Thoughtful";
        break;
      default:
        speechRate = 1.0;
        pitch = 1.0;
        emotion = "😊 Friendly";
    }

    // Override pitch/rate based on emotional keywords in text
    const textLower = text.toLowerCase();
    if (textLower.includes("love") || textLower.includes("pyaar")) {
      emotion = "❤️ Loving";
      pitch += 0.05;
      speechRate -= 0.05;
    } else if (textLower.includes("help") || textLower.includes("doctor") || textLower.includes("emergency")) {
      emotion = "⚠️ Urgent";
      speechRate = 1.1;
      pitch = 1.05;
    } else if (textLower.includes("hungry") || textLower.includes("food") || textLower.includes("bhook")) {
      emotion = "😋 Hungry";
    }

    // --- STEP 4: Speech Agent ---
    // Speech Agent validates the voice configurations and prepares output payload
    return {
      refinedText,
      emotion,
      speechRate: parseFloat(speechRate.toFixed(2)),
      pitch: parseFloat(pitch.toFixed(2))
    };
  }
}

export default new AgentOrchestrator();
