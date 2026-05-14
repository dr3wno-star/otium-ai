const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM HARD FIX ENGINE");

// =========================
// STATE
// =========================

let state = {
  lastQuestionType: null,
  lastQuestionText: null
};

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const response = generate(last);

  // 🔴 HARD BLOCK DUPLICATES
  if (response.type === state.lastQuestionType) {
    return res.json({
      question: fallback(last),
      type: "fallback"
    });
  }

  state.lastQuestionType = response.type;
  state.lastQuestionText = response.question;

  return res.json(response);
});

// =========================
// CORE GENERATION (NO LOOPING TYPES)
// =========================

function generate(text) {

  // RELACJE
  if (text.includes("relacj") || text.includes("osob")) {
    return {
      type: "reflection",
      question: "Co w relacjach jest dla Ciebie dziś najważniejsze — bliskość czy zrozumienie?"
    };
  }

  // DUCHOWOŚĆ
  if (text.includes("wiara") || text.includes("duch")) {
    return {
      type: "depth",
      question: "Jaką rolę wiara lub duchowość odgrywa w Twoim codziennym życiu?"
    };
  }

  // GAMING / ZAINTERESOWANIA
  if (text.includes("gra") || text.includes("gram") || text.includes("craft")) {
    return {
      type: "experience",
      question: "Co w tej aktywności daje Ci największe poczucie swobody?"
    };
  }

  // DEFAULT (ważne: NIE powtarzamy struktury „czy bardziej…”)
  return {
    type: "general",
    question: "Co teraz najbardziej dominuje w Twoich myślach?"
  };
}

// =========================
// FALLBACK (anti-loop safety)
// =========================

function fallback(text) {
  return "Chcę lepiej zrozumieć, co jest dla Ciebie najważniejsze w tym wszystkim.";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
