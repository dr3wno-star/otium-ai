import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// SESSION (MVP)
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
// VECTOR ENGINE v1.1
// ======================
function updateVectors(answers) {
  let v = {
    intensity: 0,
    expressiveness: 0,
    analytic: 0,
    relational: 0,
  };

  answers.forEach((a) => {
    const t = a.toLowerCase();

    // INTENSITY (energia, emocje, ważność)
    if (/(ważn|siln|mocn|intens|głęb|porusza)/.test(t)) v.intensity += 0.6;

    // EXPRESSIVENESS (emocje, dusza, odczucia)
    if (/(czuję|emocj|serc|dusza|wewnętrz|nietypow)/.test(t))
      v.expressiveness += 0.6;

    // ANALYTIC (myślenie, analiza, logika)
    if (/(myśl|rozum|analiz|logik|dlacz|zrozum)/.test(t))
      v.analytic += 0.6;

    // RELATIONAL (ludzie, rozmowy, relacje)
    if (/(ludź|osob|relac|rozmow|kontakt|ktoś)/.test(t))
      v.relational += 0.6;
  });

  return v;
}

// ======================
// AURA ENGINE v1.1
// ======================
function calculateAura(v) {
  const sum = v.intensity + v.expressiveness + v.analytic + v.relational;

  // fallback (KLUCZOWE)
  if (sum === 0) return "Obserwator";

  if (v.analytic > 1.0 && v.relational < 0.6) {
    return "Obserwator";
  }

  if (v.relational > 1.0 && v.expressiveness < 0.8) {
    return "Cicha Głębia";
  }

  if (v.intensity > 1.0 && v.expressiveness > 0.8) {
    return "Żywy Umysł";
  }

  if (v.expressiveness > 1.2) {
    return "Bezpośrednia Obecność";
  }

  return "Żywy Umysł";
}

// ======================
// API
// ======================

app.post("/answer", (req, res) => {
  const answer = req.body?.answer || "";

  console.log("ANSWER:", answer);

  session.answers.push(answer);

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
    aura: session.aura || "Obserwator",
    firstMessage:
      session.aura === "Żywy Umysł"
        ? "Są rozmowy, które zaczynają się od sposobu myślenia. Co ostatnio naprawdę Cię poruszyło?"
        : session.aura === "Cicha Głębia"
        ? "Nie wszystko trzeba mówić wprost. Co czujesz, kiedy rozmawiasz z kimś nowym?"
        : "Co sprawiło, że trafiłeś właśnie tutaj?",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`OTIUM running on port ${PORT}`);
});
