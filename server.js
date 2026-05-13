import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/question", async (req, res) => {
  const profile = req.body.profile || {};

  const prompt = `
You are OTIUM.

User profile:
depth: ${profile.depth}
emotion: ${profile.emotion}
openness: ${profile.openness}

Generate ONE short introspective question (max 14 words).
Human, calm, minimal.
`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ question: result.choices[0].message.content });

  } catch (e) {
    res.json({ question: "Co w Tobie dziś naprawdę żyje?" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("OTIUM AI running"));