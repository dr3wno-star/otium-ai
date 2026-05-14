const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V10 ANTI-LOOP ENGINE");

// =========================
// GLOBAL STATE
// =========================

let state = {
  lastTopic: null,
  topicCount: 0,
  lastQuestion: null
};

// =========================
// HEALTH
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM V10 OK" });
});

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  const topic = detectTopic(last);

  updateTopicState(topic);

  const question = generate(topic);

  // anti-repeat hard block
  if (question === state.lastQuestion) {
    return res.json({
      question: fallback(topic)
    });
  }

  state.lastQuestion = question;

  return res.json({ question });
});

// =========================
// TOPIC DETECTION
// =========================

function detectTopic(text) {

  if (text.includes("relacj") || text.includes("ludzie")) return "social";
  if (text.includes("praca") || text.includes("szef")) return "work";
  if (text.includes("gra") || text.includes("gram")) return "gaming";
  if (text.includes("czuję") || text.includes("myśl")) return "reflection";

  return "general";
}

// =========================
// TOPIC STATE ENGINE
// =========================

function updateTopicState(topic) {

  if (state.lastTopic === topic) {
    state.topicCount++;
  } else {
    state.lastTopic = topic;
    state.topicCount = 1;
  }
}

// =========================
// QUESTION GENERATOR
// =========================

function generate(topic) {

  const bank = {

    social: [
      "Co w relacjach z ludźmi jest dla Ciebie najtrudniejsze?",
      "Czy bardziej męczą Cię ludzie czy oczekiwania wobec nich?"
    ],

    work: [
      "Co w pracy najbardziej Cię obciąża?",
      "Czy to obowiązki czy ludzie w pracy są trudniejsi?"
    ],

    gaming: [
      "Co sprawia, że ta gra Cię teraz wciąga?",
      "Co najbardziej Cię w niej angażuje?"
    ],

    reflection: [
      "Co dziś najbardziej zajmuje Twoje myśli?",
      "Co próbujesz dziś zrozumieć w sobie?"
    ],

    general: [
      "Co teraz najbardziej domaga się Twojej uwagi?",
      "Co jest dla Ciebie dziś najważniejsze?"
    ]
  };

  let options = bank[topic];

  // 🔥 ANTI-STUCK RULE
  if (state.topicCount > 2) {
    options = bank.general;
  }

  return options[Math.floor(Math.random() * options.length)];
}

// =========================
// FALLBACK
// =========================

function fallback(topic) {
  return "Co w tym jest dla Ciebie najważniejsze?";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
