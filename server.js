const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V6 RUNNING");

// =========================
// MEMORY
// =========================

let questionHistory = [];

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM OK" });
});

// =========================
// MAIN AI
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const last = (memory[memory.length - 1] || "").toLowerCase();

  const style = detectStyle(memory);
  const tone = detectTone(memory);

  const question = generateQuestion(style, tone);

  return res.json({ question });
});

// =========================
// STYLE
// =========================

function detectStyle(memory) {

  const text = memory.join(" ").toLowerCase();

  let basic = 0;
  let deep = 0;

  if (text.length < 40) basic++;
  if (text.includes("czuję") || text.includes("myśl")) deep++;
  if (text.includes("dlaczego")) deep++;

  if (deep > basic) return "deep";
  return "basic";
}

// =========================
// TONE
// =========================

function detectTone(memory) {

  const text = memory.join(" ").toLowerCase();

  return {
    heavy: text.includes("zmęcz") || text.includes("dość"),
    calm: text.includes("cisz") || text.includes("spokój")
  };
}

// =========================
// GENERATOR
// =========================

function generateQuestion(style, tone) {

  const pool = [];

  if (style === "basic") {

    if (tone.heavy) {
      pool.push(
        "Co dziś Cię męczy?",
        "Co jest dla Ciebie dziś trudne?"
      );
    } else {
      pool.push(
        "Jak się dziś czujesz?",
        "Co u Ciebie słychać?",
        "Co robisz teraz?"
      );
    }
  }

  if (style === "deep") {

    if (tone.heavy) {
      pool.push(
        "Co najbardziej Cię dziś obciąża?",
        "Co w Tobie jest przeciążone?"
      );
    } else {
      pool.push(
        "Co dziś wpływa na Twój nastrój?",
        "Co się w Tobie zmienia?",
        "Co próbujesz dziś zrozumieć?"
      );
    }
  }

  const q = pool[Math.floor(Math.random() * pool.length)];

  return q || "Co teraz czujesz?";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
