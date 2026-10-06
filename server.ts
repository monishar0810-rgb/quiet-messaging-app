import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI Smart Replies
  app.post("/api/suggest-replies", async (req, res) => {
    try {
      const { messages, contactName } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        // Safe mock responses if no key is supplied to prevent any app crashes
        // and allow the feature to still be interacted with in preview
        const contact = contactName || "this contact";
        return res.json({
          suggestions: [
            `Hey! Sure, let me look into that.`,
            `Sounds great! I'll text you soon.`,
            `No problem at all, talk to you later!`
          ],
          isFallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Format last 8 messages to provide concise context for response generation
      const chatContext = messages
        .slice(-8)
        .map(m => `${m.sender === 'me' ? 'User' : contactName || 'Contact'}: ${m.text}`)
        .join("\n");

      const prompt = `You are a helpful smart reply generator. Suggest exactly 3 brief, natural, context-aware quick replies for the User (me) to send back to ${contactName || 'the Contact'}.
Analyze the recent conversation and provide options that fit the conversation flow (e.g., an agreement/affirmation, a casual friendly reply, or a polite inquiry/closing).
Each suggested reply must be extremely short, max 10 words, and sound completely human.

Conversation Context:
${chatContext}

Return the suggestions in JSON format matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a smart reply drafting engine. Return exactly 3 suggested strings inside a JSON array property called 'suggestions'.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: "List of exactly 3 suggested quick replies."
              }
            },
            required: ["suggestions"]
          }
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());
      res.json({
        suggestions: parsed.suggestions || []
      });
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const isQuotaOrLimit = errorMessage.includes("RESOURCE_EXHAUSTED") || 
                             errorMessage.includes("429") || 
                             errorMessage.includes("Quota exceeded") || 
                             errorMessage.includes("UNAVAILABLE") || 
                             errorMessage.includes("503");
      
      if (isQuotaOrLimit) {
        console.warn("Gemini API is currently busy or rate-limited. Serving local fallback smart replies gracefully.");
      } else {
        console.warn("Error calling Gemini API for smart replies:", errorMessage);
      }

      // Return 200 OK with standard fallback replies so the app continues working flawlessly
      // without throwing hard console errors or breaking the frontend flow.
      res.json({
        suggestions: [
          "Great, I will let you know!",
          "Let's catch up later.",
          "Awesome, thanks!"
        ],
        isFallback: true
      });
    }
  });

  // Serve static frontend in production or proxy to Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
