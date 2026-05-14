import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM CORE V2 ONLINE");

// ROOT
app.get("/", (req, res) => {
  res.json({ status: "OTIUM OK" });
});

// TEST ENDPOINT
app.get("/api/question", (req, res) => {
  res.json({ status: "OK" });
});

// =========================
// AI CORE
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const tone = analyzeTone(memory);

  const question = generateQuestion(last, memory, tone);

  res.json({
    question,
    tone
  });
});

// =========================
// ANALYSIS
// =========================

function analyzeTone(memory) {

  const text = memory.join(" ").toLowerCase();

  return {
    heavy: (text.includes("zmęcz") || text.includes("dość")) ? 1 : 0,
    calm: (text.includes("cisz") || text.includes("spokój")) ? 1 : 0,
    social: (text.includes("ludzie") || text.includes("rozmow")) ? 1 : 0,
    reflective: (text.includes("czuję") || text.includes("myśl")) ? 1 : 0
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
    return "Co dziś najbardziej Cię obciąża — myśl, sytuacja czy człowiek?";
  }

  if (tone.calm) {
    return "Czy ta cisza jest dla Ciebie spokojem czy ucieczką?";
  }

  if (tone.social) {
    return "Jakich rozmów ostatnio Ci brakuje najbardziej?";
  }

  if (tone.reflective) {
    return "Czy Twoje myśli dziś bardziej Cię prowadzą czy gubią?";
  }

  const pool = [
    "Co w Tobie teraz najbardziej domaga się uwagi?",
    "Jakiego rodzaju obecności dziś szukasz?",
    "Co ostatnio zmieniło Twój sposób myślenia?",
    "Czy czujesz, że coś w Tobie się domyka?",
    "Co dziś pozostaje niewypowiedziane?"
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
