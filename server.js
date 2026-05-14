const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM REAL TALK BACKEND V2");

// =========================
// MAIN ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const reply = generateReply(memory);

  return res.json({
    question: reply
  });
});

// =========================
// CORE LOGIC
// =========================

function generateReply(memory) {

  const last = (memory[memory.length - 1] || "").toLowerCase();
  const context = memory.join(" ").toLowerCase();

  // =========================
  // 1. RELACJE / DUCHOWOŚĆ
  // =========================
  if (
    context.includes("relacj") ||
    context.includes("osob") ||
    context.includes("wiar") ||
    context.includes("duch")
  ) {
    return respondRelacje(context);
  }

  // =========================
  // 2. GAMING / TWORZENIE
  // =========================
  if (
    context.includes("gra") ||
    context.includes("craft") ||
    context.includes("budow") ||
    context.includes("pływ") ||
    context.includes("morze")
  ) {
    return respondGaming(context);
  }

  // =========================
  // 3. REFLEKSJA / EMOCJE
  // =========================
  if (
    context.includes("czuję") ||
    context.includes("myśl") ||
    context.includes("życie") ||
    context.includes("ważne")
  ) {
    return respondReflection(context);
  }

  // =========================
  // DEFAULT
  // =========================
  return respondNeutral();
}

// =========================
// RESPONSE BLOCKS
// =========================

function respondRelacje(context) {

  const pool = [
    "Brzmi jak szukasz relacji, w której ważna jest bliskość i wspólne wartości, nie tylko powierzchowność.",
    "Wygląda na to, że zależy Ci na kimś, z kim możesz dzielić coś głębszego niż codzienność.",
    "To bardziej potrzeba więzi opartej na zrozumieniu niż samej obecności drugiej osoby."
  ];

  return pick(pool);
}

function respondGaming(context) {

  const pool = [
    "Wygląda na to, że w grach najbardziej cenisz swobodę tworzenia i budowania własnego świata.",
    "To brzmi jak coś, co daje Ci poczucie kontroli i przestrzeni do działania.",
    "Chyba ważniejsze od samej gry jest dla Ciebie to, co możesz w niej stworzyć."
  ];

  return pick(pool);
}

function respondReflection(context) {

  const pool = [
    "Brzmi jak moment, w którym próbujesz coś w sobie poukładać.",
    "To wygląda na refleksję nad tym, co teraz naprawdę jest dla Ciebie ważne.",
    "Słychać w tym potrzebę zatrzymania się i zrozumienia siebie."
  ];

  return pick(pool);
}

function respondNeutral() {

  const pool = [
    "Co teraz najbardziej zajmuje Twoją uwagę?",
    "Co w tym momencie jest dla Ciebie najważniejsze?",
