const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V8 FLOW ENGINE ONLINE");

// =========================
// SESSION STATE (simple global)
// =========================

let session = {
  lastQuestion: "",
  lastAnswer: "",
  turn: 0
};

// =========================
// HEALTH
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM V8 FLOW OK" });
});

// =========================
// MAIN ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const last = memory[memory.length - 1] || "";

  const isUserReply = session.lastQuestion.length > 0;

  let question;

  // =========================
  // FLOW CONTROL
  // =========================

  if (session.turn === 0) {

    question = "Co sprawiło, że tu jesteś?";

  } else if (session.turn % 2 === 1) {

    // USER JUST ANSWERED → generate follow-up

    question = generateFollowUp(session.lastAnswer);

  } else {

    question = generateContinuation(last);
  }

  // update state
  session.lastAnswer = last;
  session.lastQuestion = question;
  session.turn++;

  return res.json({ question });
});

// =========================
// FOLLOW-UP LOGIC
// =========================

function generateFollowUp(answer) {

  const a = answer.toLowerCase();

  if (a.includes("zmęcz")) {
    return "Co najbardziej Cię dziś wyczerpuje?";
  }

  if (a.includes("ludzie")) {
    return "Czy problemem są ludzie czy relacje które tworzysz?";
  }

  if (a.includes("praca")) {
    return "Co w pracy najbardziej zabiera Ci energię?";
  }

  return "Możesz powiedzieć o tym trochę więcej?";
}

// =========================
// CONTINUATION LOGIC
// =========================

function generateContinuation(last) {

  const pool = [
    "Co teraz jest dla Ciebie najważniejsze?",
    "Co dziś najbardziej zajmuje Twoje myśli?",
    "Co próbujesz dziś zrozumieć?"
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
