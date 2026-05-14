const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM AI V7 ONLINE");

// =========================
// MEMORY (simple session)
// =========================

let questionHistory = [];

// =========================
// HEALTH
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM AI V7 RUNNING" });
});

// =========================
// MAIN AI ENDPOINT
// =========================

app.post("/api/question", async (req, res) => {

  const memory = req.body.memory || [];

  const last = memory[memory.length - 1] || "";

  const style = detectStyle(memory);
  const tone = detectTone(memory);

  const question = generateControlledQuestion(last, memory, style, tone);

  return res.json({
    question,
    style,
    tone
  });
});

// =========================
// STYLE DETECTION
// =========================

function detectStyle(memory) {

  const text = memory.join(" ").toLowerCase();

  let score = {
    basic: 0,
    deep: 0
  };

  if (text.length < 40) score.basic++;
  if (text.includes("dlaczego")) score.deep++;
  if (text.includes("czuję") || text.includes("myśl")) score.deep++;

  return score.deep > score.basic ? "deep" : "basic";
}

// =========================
// TONE DETECTION
// =========================

function detectTone(memory) {

  const text = memory.join(" ").toLowerCase();

  return {
    heavy: text.includes("zmęcz") || text.includes("dość"),
    calm: text.includes("cisz") || text.includes("spokój"),
    reflective: text.includes("myśl") || text.includes("czuję"),
    social: text.includes("ludzie") || text.includes("rozmow")
  };
}

// =========================
// ANTI-REPEAT
// =========================

function isRepeat(q) {
  return questionHistory.includes(q);
}

function save(q) {
  questionHistory.push(q);
  if (questionHistory.length > 60) questionHistory.shift();
}

// =========================
// CORE ENGINE (CONTROLLED AI)
// =========================

function generateControlledQuestion(last, memory, style, tone) {

  const promptBase = buildPrompt(style, tone, last);

  const generated = generateFromTemplate(promptBase);

  if (isRepeat(generated)) {
    return fallbackQuestion(style, tone);
  }

  save(generated);

  return generated;
}

// =========================
// PROMPT BUILDER (SYSTEM LOGIC)
// =========================

function buildPrompt(style, tone, last) {

  return {
    style,
    tone,
    last
  };
}

// =========================
// "AI SIMULATION ENGINE"
// (tu w przyszłości możesz podpiąć OpenAI)
// =========================

function generateFromTemplate(ctx) {

  const { style, tone, last } = ctx;

  // BASIC MODE
  if (style === "basic") {

    if (tone.heavy) {
      return "Co dziś najbardziej Cię męczy?";
    }

    return "Co u Ciebie teraz się dzieje?";
  }

  // DEEP MODE
  if (style === "deep") {

    if (tone.heavy) {
      return "Co w Tobie dziś najbardziej Cię obciąża?";
    }

    if (last.toLowerCase().includes("praca")) {
      return "Co w Twojej pracy najbardziej Cię dziś zajmuje emocjonalnie?";
    }

    return "Co dziś najbardziej zmienia Twój sposób myślenia?";
  }

  return "Co w Tobie teraz najbardziej domaga się uwagi?";
}

// =========================
// FALLBACK
// =========================

function fallbackQuestion(style, tone) {

  if (style === "basic") {
    return "Jak się dziś czujesz naprawdę?";
  }

  if (tone.heavy) {
    return "Co dziś najbardziej Cię przytłacza?";
  }

  return "Co w Tobie dziś jest niewypowiedziane?";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
