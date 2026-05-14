const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM REAL TALK ENGINE V1");

// =========================
// MAIN ENDPOINT
// =========================

app.post("/api/question", async (req, res) => {

  const memory = req.body.memory || [];

  const conversation = memory.join("\n");

  const response = generateReply(conversation);

  return res.json({
    question: response
  });
});

// =========================
// CORE LOGIC (NO RULE LOOPING)
// =========================

function generateReply(conversation) {

  const last = conversation.split("\n").slice(-1)[0] || "";

  // prosta, stabilna reakcja zamiast "engine"
  return buildResponse(last, conversation);
}

// =========================
// RESPONSE BUILDER
// =========================

function buildResponse(last, full) {

  const text = full.toLowerCase();

  // RELACJE / DUCHOWOŚĆ
  if (text.includes("relacj") || text.includes("osob") || text.includes("wiara")) {
    return "Brzmi jak szukasz czegoś głębszego w relacjach — bardziej sensu i bliskości niż powierzchowności. Co dla Ciebie oznacza taka relacja w praktyce?";
  }

  // GAMING / ŚWIATY WIRTUALNE
  if (text.includes("gra") || text.includes("craft") || text.includes("budow")) {
    return "Wygląda na to, że lubisz w grach swobodę tworzenia i kontrolę nad światem. To bardziej forma relaksu czy wyrażania siebie?";
  }

  // EMOCJE / REFLEKSJA
  if (text.includes("czuję") || text.includes("myśl") || text.includes("życie")) {
    return "Słyszę w tym trochę refleksji — jakbyś próbował poukładać coś w sobie. Co teraz najbardziej Ci się w tym miesza?";
  }

  // DEFAULT (ważne: NIE pytania w kółko)
  return "Opowiedz mi trochę więcej o tym — chcę lepiej zrozumieć Twój punkt widzenia.";
}

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
