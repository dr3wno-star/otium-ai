const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V12 ANCHOR ENGINE");

// =========================
// STATE
// =========================

let state = {
  anchor: null,
  lastQuestion: null
};

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  // 🔥 detect if user breaks context
  const isMetaBreak = detectMetaBreak(last);

  if (isMetaBreak) {
    state.anchor = null;
  }

  // 🔥 establish anchor if needed
  if (!state.anchor) {
    state.anchor = extractAnchor(last);
  }

  const question = generate(state.anchor, last);

  if (question === state.lastQuestion) {
    return res.json({ question: fallback() });
  }

  state.lastQuestion = question;

  return res.json({
    question,
    anchor: state.anchor
  });
});

// =========================
// META BREAK DETECTION
// =========================

function detectMetaBreak(text) {

  return (
    text.includes("o jaką") ||
    text.includes("o co pytasz") ||
    text.includes("wszystko") ||
    text.length < 10
  );
}

// =========================
// ANCHOR EXTRACTION
// =========================

function extractAnchor(text) {

  if (text.includes("gra") || text.includes("gram")) return "gaming";
  if (text.includes("relacj") || text.includes("ludzie")) return "social";
  if (text.includes("czuję") || text.includes("myśl")) return "reflection";

  return "general";
}

// =========================
// QUESTION ENGINE
// =========================

function generate(anchor, last) {

  if (anchor === "gaming") {
    return "Co w tej grze jest dla Ciebie najbardziej znaczące?";
  }

  if (anchor === "social") {
    return "Co w relacjach jest dla Ciebie dziś najbardziej niejasne?";
  }

  if (anchor === "reflection") {
    return "Co w Twoich myślach dziś dominuje?";
  }

  return "Co teraz jest dla Ciebie najbardziej istotne?";
}

// =========================
// FALLBACK
// =========================

function fallback() {
  return "Możesz to doprecyzować?";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
