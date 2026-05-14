const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V9 CONTEXT ENGINE ONLINE");

// =========================
// STATE (simple session)
// =========================

let state = {
  history: [],
  topic: "neutral",
  direction: "explore",
  lastQuestion: ""
};

// =========================
// HEALTH
// =========================

app.get("/", (req, res) => {
  res.json({ status: "OTIUM V9 OK" });
});

// =========================
// MAIN ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const last = memory[memory.length - 1] || "";

  // update state
  state.history = memory;

  const context = buildContext(memory);
  const topic = detectTopic(context);
  const direction = detectDirection(context, topic);

  state.topic = topic;
  state.direction = direction;

  const question = generateQuestion(topic, direction, context, last);

  state.lastQuestion = question;

  return res.json({
    question,
    topic,
    direction,
    context
  });
});

// =========================
// CONTEXT BUILDER
// =========================

function buildContext(memory) {

  return memory.join(" ").toLowerCase();
}

// =========================
// TOPIC DETECTION
// =========================

function detectTopic(text) {

  if (text.includes("praca") || text.includes("szef") || text.includes("zawód")) {
    return "work";
  }

  if (text.includes("ludzie") || text.includes("relacj")) {
    return "social";
  }

  if (text.includes("zmęcz") || text.includes("dość") || text.includes("przytłocz")) {
    return "fatigue";
  }

  if (text.includes("czuję") || text.includes("myśl") || text.includes("wewnętrz")) {
    return "reflection";
  }

  return "neutral";
}

// =========================
// DIRECTION ENGINE
// =========================

function detectDirection(context, topic) {

  if (topic === "fatigue") return "soothe";
  if (topic === "reflection") return "deepen";
  if (topic === "social") return "clarify";
  if (topic === "work") return "analyze";

  return "explore";
}

// =========================
// QUESTION ENGINE (CORE)
// =========================

function generateQuestion(topic, direction, context, last) {

  // WORK
  if (topic === "work") {

    if (direction === "analyze") {
      return "Co dokładnie w pracy najbardziej Cię dziś obciąża?";
    }
  }

  // SOCIAL
  if (topic === "social") {

    if (direction === "clarify") {
      return "Czy trudniejsze są relacje czy oczekiwania wobec nich?";
    }
  }

  // FATIGUE
  if (topic === "fatigue") {

    if (direction === "soothe") {
      return "Co najbardziej odbiera Ci dziś energię?";
    }
  }

  // REFLECTION
  if (topic === "reflection") {

    if (direction === "deepen") {
      return "Co w Twoich myślach dziś najbardziej się powtarza?";
    }
  }

  // DEFAULT FLOW
  const fallback = [
    "Co teraz najbardziej domaga się Twojej uwagi?",
    "Co w tym momencie jest dla Ciebie najważniejsze?",
    "Co próbujesz dziś zrozumieć?"
  ];

  return fallback[Math.floor(Math.random() * fallback.length)];
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
