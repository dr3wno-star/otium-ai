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

// API CHECK
app.get("/api/question", (req, res) => {
  res.json({ status: "OK" });
});

// =========================
// CORE AI LOGIC
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const tone = analyzeTone(last, memory);

  const question = generateQuestion(last, memory, tone);

  res.json({ question, tone });

});

// =========================
// SIMPLE "AI LAYER"
// =========================

function analyzeTone(last, memory) {

  let score = {
    calm: 0,
    heavy: 0,
    social: 0,
    reflective: 0
  };

  const text = memory.join(" ").toLowerCase();

  if (text.includes("zmęcz") || text.includes("dość")) score.heavy++;
  if (text.includes("sam") || text.includes("cisz")) score.calm++;
  if (text.includes("ludzie") || text.includes("rozmow")) score.social++;
  if (text.includes("czuję") || text.includes("myśl")) score.reflective++;

  return score;
}

function generateQuestion(last, memory, tone) {

  const len = memory.length;

  // --- EARLY STAGE
  if (len <= 1) {
    return "Co sprawiło, że zatrzymałeś się właśnie tutaj?";
  }

  // --- EMOTION BASED
  if (tone.heavy > 0) {
    return "Co dziś najbardziej Cię obciąża — myśl, sytuacja czy człowiek?";
  }

  if (tone.calm > 0) {
    return "Czy ta cisza jest dla Ciebie spokojem czy ucieczką?";
  }

  if (tone.social > 0) {
    return "Jakich rozmów ostatnio Ci brakuje najbardziej?";
  }

  if (tone.reflective > 0) {
    return "Czy Twoje myśli dziś bardziej Cię prowadzą czy gubią?";
  }

  // --- DEFAULT FLOW
  const pool = [
    "Co w Tobie teraz najbardziej domaga się uwagi?",
    "Jakiego rodzaju obecności dziś szukasz?",
    "Co ostatnio zmieniło sposób, w jaki myślisz?",
    "Czy czujesz, że coś w Tobie się domyka?",
    "Co dziś jest niewypowiedziane?"
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON", PORT);
});
