export const getResponse = async (message, tone = 'gentle', history = []) => {
  const lowerMsg = message.toLowerCase();
  
  // 1. Local Crisis Detection (Fast & Safe)
  if (CRISIS_KEYWORDS.some(k => lowerMsg.includes(k))) {
    return {
      text: `I'm really concerned about what you're saying. You don't have to go through this alone. Please reach out for immediate help. The Kiran Mental Health Helpline is available at ${HELPLINE_NUMBER}.`,
      isCrisis: true
    };
  }

  // 2. Call Serverless API
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, tone, history }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      text: data.text || "I'm here with you.",
      isCrisis: false
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      text: "I'm having a little trouble thinking clearly right now, but I'm listening. Can we try taking a deep breath together?",
      isCrisis: false
    };
  }
};

export const getGroundingExercise = () => {
    return [
       "Let's try a 5-4-3-2-1 technique.",
       "👀 Acknowledge 5 things you see around you.",
       "✋ Acknowledge 4 things you can touch.",
       "👂 Acknowledge 3 things you can hear.",
       "👃 Acknowledge 2 things you can smell.",
       "👅 Acknowledge 1 thing you can taste.",
       "Take a deep breath. You are here."
    ].join('\n\n');
};
