import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM AI CORE V3 ONLINE");

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "OTIUM RUNNING" });
});

// =========================
// MAIN AI ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const last = (memory[memory.length - 1] || "").toLowerCase();

  const tone = analyzeTone(memory);

  const question = generateQuestion(last, memory, tone);

  console.log("LAST:", last);
  console.log("TONE:", tone);

  return res.json({
    question: question
  });

});

// =========================
// SIMPLE TONE ANALYSIS
// =========================

function analyzeTone(memory) {

  const text = memory.join(" ").toLowerCase();

  return {
    heavy: text.includes("zmęcz") || text.includes("dość") ? 1 : 0,
    calm: text.includes("cisz") || text.includes("spokój") ? 1 : 0,
    social: text.includes("ludzie") || text.includes("rozmow") ? 1 : 0,
    reflective: text.includes("czuję") || text.includes("myśl") ? 1 : 0
  };
}

// =========================
// QUESTION ENGINE
// =========================

function generateQuestion(last, memory, tone) {

  const len = memory.length;

  if (len <= 1) {
    return "Co sprawiło, że zatrzymałeś się właśnie tutaj?";
  }

  if (tone.heavy) {
    return "Co dziś najbardziej Cię obciąża?";
  }

  if (tone.calm) {
    return "Czy ta cisza jest dla Ciebie spokojem czy ucieczką?";
  }

  if (tone.social) {
    return "Czego brakuje Ci w rozmowach z ludźmi?";
  }

  if (tone.reflective) {
    return "Czy Twoje myśli dziś prowadzą Cię czy gubią?";
  }

  const pool = [
    "Co teraz najbardziej domaga się Twojej uwagi?",
    "Co w Tobie się dziś zmienia?",
    "Jakiego rodzaju obecności dziś szukasz?",
    "Co jest dziś niewypowiedziane?",
    "Za czym naprawdę tęsknisz?"
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
