const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    currentAura: "OBSERWATOR"
};

const auraColors = {
    'OBSERWATOR': '#1b4d3e',       
    'ŻYWY UMYSŁ': '#2ecc71',       
    'CICHA GŁĘBIA': '#0b3d33',     
    'BEZPOŚREDNIA OBECNOŚĆ': '#2980b9' 
};

// NOWA LOGIKA REZONANSU: Budowanie profilu rozmówcy
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
    
    // REAKCJA NA INTELIGENCJĘ I CECHY UMYSŁU
    if (text.includes('inteligent') || text.includes('mądr')) {
        reply = "Inteligencja to rzadkie światło, które nadaje sens tej ciszy. Powiedz, czy ta błyskotliwość ma być chłodna i analityczna, czy raczej pełna empatii?";
        userSession.vector.analytic += 0.1;
    } 
    // REAKCJA NA EMOCJE / SPOKÓJ
    else if (text.includes('spokój') || text.includes('ciepł') || text.includes('dobr')) {
        reply = "Szczerość i spokój to fundamenty, na których budujemy rezonans. Jak bardzo głęboka musi być ta bliskość, byś poczuł się zrozumiany?";
        userSession.vector.relational += 0.1;
    }
    // FALLBACK - GWARANCJA KONTYNUACJI PROFILOWANIA
    else {
        reply = "Każde Twoje słowo rzuca światło na tę postać. Opisz mi bardziej... jaki rytm rozmowy sprawia, że czujesz się sobą?";
    }

    const newAura = (userSession.vector.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : "OBSERWATOR";

    res.json({ 
        reply: reply, 
        aura: newAura, 
        color: auraColors[newAura] 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine v2.6 online`));
