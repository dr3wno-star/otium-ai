const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM DIALOG STYLE ENGINE V1");

// =========================
// STATE
// =========================

let state = {
  lastMode: null
};

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const response = generateResponse(last);

  return res.json(response);
});

// =========================
// CORE ENGINE
// =========================

function generateResponse(text) {

  const t = text;

  // --- RELACJE / DUCHOWOŚĆ ---
  if (t.includes("wiara") || t.includes("duch") || t.includes("relacj")) {

    return reflectExpand();
  }

  // --- GAMING / ZAINTERESOWANIA ---
  if (t.includes("gra") || t.includes("gram") || t.includes("craft")) {

    return expandShift();
  }

  // --- TOŻSAMOŚĆ / RELACJE ---
  if (t.includes("osob") || t.includes("kto") || t.includes("ludzie")) {

    return reflectClarify();
  }

  // DEFAULT
  return mixedResponse();
}

// =========================
// DIALOG MODES
// =========================

function reflectExpand() {
  return {
    question: "Brzmi jak szukasz relacji opartej na czymś głębszym niż codzienność — bardziej wspólnych wartościach i sensie. Co w tym jest dla Ciebie najważniejsze?"
  };
}

function expandShift() {
  return {
    question: "Wygląda na to, że w grach ważne jest dla Ciebie tworzenie i swoboda. Czy to coś, czego brakuje Ci też w realnym życiu?"
  };
}

function reflectClarify() {
  return {
    question: "Czy bardziej chodzi Ci o znalezienie osoby podobnej do Ciebie, czy raczej kogoś kto Cię uzupełnia?"
  };
}

function mixedResponse() {
  const pool = [
    "Co teraz najbardziej zajmuje Twoje myśli?",
    "Co w tym momencie jest dla Ciebie najważniejsze?",
    "Co próbujesz dziś zrozumieć o sobie?"
  ];

  return {
    question: pool[Math.floor(Math.random() * pool.length)]
  };
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
