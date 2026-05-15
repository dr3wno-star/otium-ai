const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    currentAura: "OBSERWATOR",
    lastResponse: ""
};

const auraColors = {
    'OBSERWATOR': '#1b4d3e',       
    'ŻYWY UMYSŁ': '#2ecc71',       
    'CICHA GŁĘBIA': '#0b3d33',     
    'BEZPOŚREDNIA OBECNOŚĆ': '#2980b9' 
};

app.get('/init', (req, res) => {
    res.json({
        reply: "Witaj w ciszy. OTIUM stroi się do Twojej obecności. Powiedz mi... kogo tak naprawdę szukasz w tej przestrzeni?",
        color: auraColors['OBSERWATOR']
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    let reply = "";
    
    // LOGIKA REZONANSU - PRECYZYJNE ŚCIEŻKI
    if (text.includes('empati') || text.includes('czuł') || text.includes('blisko')) {
        reply = "Empatia to najwyższa forma inteligencji serca. Skoro jej szukasz, powiedz – czy wolisz, by ta druga osoba była Twoim lustrem, czy raczej Twoim dopełnieniem?";
        userSession.vector.relational += 0.15;
    } 
    else if (text.includes('inteligent') || text.includes('mądr') || text.includes('bystr')) {
        reply = "Inteligencja to rzadkie światło, które nadaje sens tej ciszy. Powiedz, czy ta błyskotliwość ma być chłodna i analityczna, czy raczej pełna empatii?";
        userSession.vector.analytic += 0.12;
    } 
    else if (text.includes('romantycz') || text.includes('miłość') || text.includes('serc')) {
        reply = "Romantyzm w OTIUM to powolne odkrywanie wspólnych częstotliwości. Co dla Ciebie jest ważniejsze: wspólne pasje czy wspólne milczenie?";
        userSession.vector.relational += 0.1;
    }
    else {
        reply = "Każde Twoje słowo rzuca światło na tę postać. Opisz mi bardziej... jaki rytm rozmowy sprawia, że czujesz się w pełni sobą?";
    }

    const newAura = (userSession.vector.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : "OBSERWATOR";
    res.json({ reply, aura: newAura, color: auraColors[newAura] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine v2.7 online`));
