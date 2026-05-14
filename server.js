import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM AI V6 ONLINE");

// =========================
// MEMORY (simple in-memory session)
// =========================

let questionHistory = [];

// =========================
// ENTRY
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM V6 RUNNING" });
});

// =========================
// MAIN AI ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const last = (memory[memory.length - 1] || "").toLowerCase();

  const style = detectStyle(memory);
  const tone = detectTone(memory);

  const question = generateQuestion(last, memory, tone, style);

  res.json({
    question,
    style,
    tone
  });
});

// =========================
// STYLE DETECTION (NOT IQ — COMMUNICATION DEPTH)
// =========================

function detectStyle(memory) {

  const text = memory.join(" ").toLowerCase();

  let score = {
    basic: 0,
    deep: 0,
    intuitive: 0
  };

  // BASIC signals
  if (
    text.includes("co") ||
    text.includes("jak") ||
    text.length < 40
  ) {
    score.basic++;
  }

  // DEEP signals
  if (
    text.includes("czuję") ||
    text.includes("myśl") ||
    text.includes("dlaczego")
  ) {
    score.deep++;
  }

  // INTUITIVE signals
  if (
    text.includes("sens") ||
    text.includes("istnie") ||
    text.includes("wewnątrz")
  ) {
    score.intuitive++;
  }

  const max = Object.entries(score)
    .sort((a,b) => b[1] - a[1])[0][0];

  return max;
}

// =========================
// TONE DETECTION
// =========================

function detectTone(memory) {

  const text = memory.join(" ").toLowerCase();

  return {
    heavy: text.includes("zmęcz") || text.includes("dość"),
    calm: text.includes("cisz") || text.includes("spokój"),
    social: text.includes("ludzie") || text.includes("rozmow"),
    reflective: text.includes("czuję") || text.includes("myśl")
  };
}

// =========================
// ANTI-REPEAT SYSTEM (24h simulated via session memory)
// =========================

function isRepeat(question) {
  return questionHistory.includes(question);
}

function saveQuestion(question) {
  questionHistory.push(question);

  // soft limit memory
  if (questionHistory.length > 50) {
    questionHistory.shift();
  }
}

// =========================
// CORE GENERATOR
// =========================

function generateQuestion(last, memory, tone, style) {

  const base = buildPool(style, tone);

  const available = base.filter(q => !isRepeat(q));

  const pool = available.length ? available : base;

  const selected = pool[
    Math.floor(Math.random() * pool.length)
  ];

  saveQuestion(selected);

  return selected;
}

// =========================
// QUESTION POOLS BY STYLE
// =========================

function buildPool(style, tone) {

  // BASIC MODE
  if (style === "basic") {

    if (tone.heavy) {
      return [
        "Co dziś Cię męczy?",
        "Co jest dla Ciebie dziś najtrudniejsze?"
      ];
    }

    return [
      "Co dziś u Ciebie słychać?",
      "Jak się dziś czujesz?",
      "Co robisz teraz?"
    ];
  }

  // DEEP MODE
  if (style === "deep") {

    if (tone.heavy) {
      return [
        "Co najbardziej
