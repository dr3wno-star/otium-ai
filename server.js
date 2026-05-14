const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM V3 STABLE DIALOG");

// =========================
// STATE (NA SERWERZE)
// =========================

let state = {
  lastAIResponse: "",
  lastType: ""
};

// =========================
// MAIN
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const lastUser = (memory[memory.length - 1] || "").toLowerCase();
  const context = memory.join(" ").toLowerCase();

  const reply = generate(lastUser, context);

  // 🔴 HARD ANTI-REPEAT (KLUCZOWE)
  if (reply.type === state.lastType) {
    const fallback = neutralVariation();
    state.lastType = "fallback";
    state.lastAIResponse = fallback;

    return res.json({ question: fallback });
  }

  state.lastType = reply.type;
  state.lastAIResponse = reply.text;

  return res.json({ question: reply.text });
});

// =========================
// GENERATOR
// =========================

function generate(lastUser, context) {

  // RELACJE
  if (context.includes("relacj") || context.includes("osob") || context.includes("wiar")) {
    return {
      type: "relacje",
      text: "Brzmi jak temat relacji, w których ważna jest głębia i autentyczność, nie tylko powierzchowność."
    };
  }

  // GAMING
  if (context.includes("gra") || context.includes("craft") || context.includes("budow")) {
    return {
      type: "gaming",
      text: "Wygląda na to, że w grach najbardziej cenisz tworzenie i swobodę działania."
    };
  }

  // REFLEKSJA
  if (context.includes("czuję") || context.includes("myśl") || context.includes("życie")) {
    return {
      type: "reflection",
      text: "Słychać w tym moment refleksji i porządkowania myśli."
    };
  }

  // DEFAULT
  return {
    type: "neutral",
    text: "Co teraz najbardziej dominuje w Twoich myślach?"
  };
}

// =========================
// FALLBACK VARIATION (NIE POWTARZA TEGO SAMEGO)
// =========================

function neutralVariation() {

  const pool = [
    "Co teraz jest dla Ciebie najważniejsze w tym wszystkim?",
    "Jak byś opisał to, co teraz w Tobie dominuje?",
    "Co najbardziej przyciąga Twoją uwagę w tej chwili?"
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
