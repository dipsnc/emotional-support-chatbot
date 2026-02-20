# 🌿 MindEase: AI Emotional Support Chatbot

MindEase is a compassionate, AI-powered companion designed to provide emotional support, grounding exercises, and a safe space to share your thoughts. Built with a focus on modern aesthetics and user safety.

![MindEase Light Theme](https://raw.githubusercontent.com/dipsnc/emotional-support-chatbot/main/preview.png) _(Placeholder if you add an image later)_

## ✨ Features

- **🧠 Contextual Memory**: Remembers your conversation within a session for personalized support.
- **☁️ Serverless Architecture**: Uses Vercel Serverless Functions to keep Groq API keys secure on the backend.
- **🎨 Modern Light Theme**: A premium, "breathable" UI designed with soft palettes and glassmorphism.
- **🌿 Grounding Tools**: Built-in 5-4-3-2-1 grounding exercises for instant stress relief.
- **🚨 Pulse Crisis Detection**: Instant local detection of crisis keywords to provide immediate helpline support.
- **🎭 Multi-Tone Support**: Choose between _Gentle_, _Balanced_, or _Direct_ response styles.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4 (with `@theme` variables)
- **AI Engine**: Groq SDK (`llama-3.1-8b-instant`)
- **Backend**: Vercel Serverless Functions (Node.js)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dipsnc/emotional-support-chatbot.git
cd emotional-support-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run locally

Since this project uses serverless functions, you should run it using the **Vercel CLI**:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run development server
vercel dev
```

## 📖 Integration Details

For a deeper look into how the AI is integrated and how memory is handled, see [GROQ_INTEGRATION.md](./GROQ_INTEGRATION.md).

## 🛡️ Privacy & Safety

MindEase is an AI companion, not a professional therapist. If you are in immediate danger, please contact local emergency services or the Kiran Mental Health Helpline at `1800-599-0019`.

---

Built with ❤️ for mental health awareness.
