const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM BACKEND v1 RUNNING");

// ===============================
// CONFIG
// ===============================

const MAX_RESONANCE = 5;
const RECHARGE_TIME = 4 * 60 * 60 * 1000; // 4h

// ===============================
// SIMPLE IN-MEMORY DB (na start)
// ===============================

const users = {};

// ===============================
// HELPERS
// ===============================

function getUser(userId) {
  if (!users[userId]) {
    users[userId] = {
      resonance: MAX_RESONANCE,
      lastRecharge: Date.now(),
      profile: {
        relation: 0,
        thinking: 0,
        values: 0,
        communication: 0
      }
    };
  }
  return users[userId];
}

// regeneracja rezonansu
function updateResonance(user) {
  const now = Date.now();
  const diff = now - user.lastRecharge;

  const gained = Math.floor(diff / RECHARGE_TIME);

  if (gained > 0) {
    user.resonance = Math.min(MAX_RESONANCE, user.resonance + gained);
    user.lastRecharge = now;
  }
}

// ===============================
// ROUTES
// ===============================

// INIT / STATUS
app.post("/api/init", (req, res) => {
  const { userId } = req.body;

  const user = getUser(userId);
  updateResonance(user);

  res.json({
    resonance: user.resonance,
    max: MAX_RESONANCE
  });
});

// START CHAT SESSION
app.post("/api/start", (req, res) => {
  const { userId } = req.body;

  const user = getUser(userId);
  updateResonance(user);

  if (user.resonance <= 0) {
    return res.json({
      ok: false,
      message: "Brak rezonansu"
    });
  }

  user.resonance -= 1;

  res.json({
    ok: true,
    resonance: user.resonance
  });
});

// CHAT + PROFILING
app.post("/api/message", (req, res) => {
  const { userId, message } = req.body;

  const user = getUser(userId);

  const text = (message || "").toLowerCase();

  // ===============================
  // PROFILING (lekki, nie inwazyjny)
  // ===============================

  if (text.includes("relac") || text.includes("osob")) {
    user.profile.relation += 1;
  }

  if (text.includes("czuję") || text.includes("myśl") || text.includes("analiz")) {
    user.profile.thinking += 1;
  }

  if (text.includes("sens") || text.includes("wiar") || text.includes("duch")) {
    user.profile.values += 1;
  }

  if (text.includes("rozmaw") || text.includes("lubię gadać")) {
    user.profile.communication += 1;
  }

  // ===============================
  // RESPONSE ENGINE (BEZ PĘTLI)
  // ===============================

  let reply = "";

  if (user.profile.relation > 2) {
    reply = "Brzmi jak relacje są dla Ciebie czymś głębszym niż tylko kontakt.";
  } else if (user.profile.thinking > 2) {
    reply = "Widzę, że często analizujesz to, co czujesz i myślisz.";
  } else if (user.profile.values > 2) {
    reply = "W Twoich wypowiedziach pojawia się potrzeba sensu i czegoś większego.";
  } else {
    reply = "Rozumiem. Opowiedz mi trochę więcej o tym.";
  }

  res.json({
    reply
  });
});

// ===============================
// AURA SNAPSHOT (FUTURE)
// ===============================

app.post("/api/aura", (req, res) => {
  const { userId } = req.body;

  const user = getUser(userId);

  let aura = "flow";

  const p = user.profile;

  if (p.values > p.thinking && p.values > p.relation) {
    aura = "spiritual";
  } else if (p.thinking > p.relation) {
    aura = "analytical";
  } else if (p.relation > 2) {
    aura = "relational";
  }

  res.json({
    aura,
    profile: user.profile
  });
});

// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("OTIUM RUNNING ON", PORT);
});
