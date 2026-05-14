const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM FINAL STABLE MODE");

// =========================
// MAIN ENDPOINT
// =========================

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];

  const conversation = memory.join("\n");

  const last = memory[memory.length - 1] || "";

  const reply = generateReply(conversation, last);

  return res.json({
    question: reply
  });
});

// =========================
// SINGLE RESPONSE ENGINE (NO LOOPS)
// =========================

function generateReply(conversation, lastUser) {

  const text = conversation.toLowerCase();

  // 🔥 KLUCZ: NIE MA JUŻ „TYPE SYSTEMU”
  // tylko styl odpowiedzi zależny od kontekstu

  if (text.includes("relacj") || text.includes("osob") || text.includes("wiar")) {
    return "Brzmi jak szukasz relacji opartej na czymś głębszym niż codzienność — bardziej o więzi i sensie niż powierzchowności. Co w takim połączeniu byłoby dla Ciebie najważniejsze?";
  }

  if (text.includes("gra") || text.includes("craft") || text.includes("budow")) {
    return "Wygląda na to, że w grach najbardziej pociąga Cię tworzenie i swoboda działania. To bardziej forma relaksu czy coś, co daje Ci poczucie sprawczości?";
  }

  if (text.includes("czuję") || text.includes("myśl") || text.includes("życie")) {
    return "Słychać w tym moment, w którym próbujesz coś w sobie uporządkować. Co teraz najbardziej wybija się na pierwszy plan?";
  }

  // DEFAULT (WAŻNE: BEZ POWTARZANIA TEGO SAMEGO STYLU)
  const fallback = [
    "Co teraz najbardziej zajmuje Twoją uwagę?",
    "Co w tym momencie jest dla Ciebie najważniejsze?",
    "Jak byś opisał to, co teraz w Tobie dominuje?"
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
