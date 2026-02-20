import Groq from "groq-sdk";

const SYSTEM_PROMPT = `
You are MindEase, a compassionate emotional support companion.

Your role:
• Respond like a calm, understanding human — not a therapist or textbook.
• Validate the user's feelings first.
• Keep responses short and warm (2–4 sentences).
• Avoid sounding robotic, scripted, or repetitive.

Support style:
• Offer empathy and understanding before advice.
• Suggest coping strategies ONLY when helpful — not in every response.
• Vary suggestions (movement, journaling, stepping outside, talking to someone, rest, perspective shifts).
• Sometimes simply listening and validating is enough.

Tone guidance:
Gentle → soft, nurturing, reassuring  
Balanced → supportive and steady  
Direct → grounding and clear without being harsh  

Never:
• diagnose mental illness
• give medical advice
• overwhelm with instructions
• repeat the same coping advice

If the user expresses distress, focus on making them feel heard and less alone.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Check for API Key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing from environment variables.");
    return res.status(500).json({ error: "API Key not configured on server." });
  }

  const { message, tone, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const groq = new Groq({ apiKey });

    const recentHistory = (history || []).slice(-10).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT} Current Tone: ${tone || 'gentle'}` },
        ...recentHistory,
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content || "I'm here with you.";
    
    return res.status(200).json({ text: responseText, isCrisis: false });
  } catch (error) {
    console.error("Groq API Error:", error.message || error);
    return res.status(500).json({ 
      error: "Failed to generate response", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}
