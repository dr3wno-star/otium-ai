import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// SESSION (MVP IN MEMORY)
// ======================
let session = {
  answers: [],
  vectors: {
    intensity: 0,
    expressiveness: 0,
    analytic: 0,
    relational: 0,
  },
  aura: null,
};

// ======================
// VECTOR ENGINE
// ======================
function updateVectors(answers) {
  let v = {
    intensity: 0,
    expressiveness: 0,
    analytic: 0,
    relational: 0,
  };

  answers.forEach((a) => {
    const text = a.toLowerCase();

    // INTENSITY
    if (text.includes("intensywn") || text.includes("spokoj")) v.intensity += 0.5;
    if (text.includes("emocj") || text.includes("siln")) v.expressiveness += 0.5;

    // ANALYTIC vs RELATIONAL
    if (text.includes("analiz") || text.includes("myśl")) v.analytic += 0.6;
    if (text.includes("ludź") || text.includes("relac")) v.relational += 0.6;

    // SIMPLE BOOSTERS
    if (text.includes("obserw")) v.analytic += 0.2;
    if (text.includes("rozmow")) v.relational += 0.2;
  });

  return v;
}

// ======================
// AURA ENGINE
// ======================
function calculateAura(v) {
  if (v.intensity > 0.6 && v.expressiveness > 0.5) {
    return "Żywy Umysł";
  }

  if (v.analytic > 0.7 && v.relational < 0.4) {
    return "Obserwator";
  }

  if (v.relational > 0.7) {
    return "Cicha Głębia";
  }

  return "Bezpośrednia Obecność";
}

// ======================
// API
// ======================

app.post("/answer", (req, res) => {
  session.answers.push(req.body.answer);

  if (session.answers.length >= 4) {
    session.vectors = updateVectors(session.answers);
    session.aura = calculateAura(session.vectors);
  }

  res.json({
    step: session.answers.length,
    done: session.answers.length >= 4,
  });
});

app.get("/result", (req, res) => {
  res.json({
    vectors: session.vectors,
    aura: session.aura,
    firstMessage:
      session.aura === "Żywy Umysł"
        ? "Niektóre rozmowy zaczynają się od sposobu myślenia. Co ostatnio naprawdę Cię poruszyło intelektualnie?"
        : "Czasem najciekawsze rozmowy zaczynają się od prostych rzeczy. Co Cię dziś przyciągnęło tutaj?",
  });
});

app.listen(3000, () => {
  console.log("OTIUM running on port 3000");
});
