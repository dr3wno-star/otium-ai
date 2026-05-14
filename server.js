const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V11 MEANING ENGINE");

// =========================
// STATE
// =========================

let state = {
  lastMeaning: "",
  lastQuestion: ""
};

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const meaning = extractMeaning(last);

  const question = generateFromMeaning(meaning);

  if (question === state.lastQuestion) {
    return res.json({
      question: fallback()
    });
  }

  state.lastQuestion = question;

  return res.json({
    question,
    meaning
  });
});

// =========================
// MEANING ENGINE (CORE)
// =========================

function extractMeaning(text) {

  return {
    gaming_identity: text.includes("gra") || text.includes("craft") || text.includes("budow"),
    relationship_need: text.includes("osob") || text.includes("akcept") || text.includes("relacj"),
    social_search: text.includes("ludzie") || text.includes("pozn"),
    escape: text.includes("uciecz") || text.includes("świat"),
    creativity: text.includes("tworz") || text.includes("budow")
  };
}

// =========================
// QUESTION GENERATOR (SEMANTIC)
// =========================

function generateFromMeaning(m) {

  // 🔥 RELATIONSHIP + IDENTITY
  if (m.relationship_need && m.gaming_identity) {
    return "Czy czujesz, że Twoje zainteresowania są częścią tego kim jesteś w relacjach z ludźmi?";
  }

  // GAMING + CREATIVITY
  if (m.gaming_identity && m.creativity) {
    return "Co w budowaniu i tworzeniu w grach daje Ci największe poczucie sensu?";
  }

  // SOCIAL SEARCH
  if (m.social_search) {
    return "Jakiego rodzaju relacji dziś najbardziej szukasz?";
  }

  // ESCAPE
  if (m.escape) {
    return "Przed czym najbardziej uciekasz w takie światy?";
  }

  // DEFAULT
  return "Co w tym wszystkim jest dla Ciebie dziś najważniejsze?";
}

// =========================
// FALLBACK
// =========================

function fallback() {
  return "Co teraz najbardziej czujesz w tej sytuacji?";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
