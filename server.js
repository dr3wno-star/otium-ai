const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    step: 0
};

const auraColors = {
    'OBSERWATOR': '#1b4d3e',       
    'ŻYWY UMYSŁ': '#2ecc71',       
    'CICHA GŁĘBIA': '#0b3d33',     
    'BEZPOŚREDNIA OBECNOŚĆ': '#2980b9' 
};

app.get('/init', (req, res) => {
    res.json({
        reply: "Witaj. Przestrzeń OTIUM jest gotowa. Powiedz mi... kogo tak naprawdę tutaj szukasz?",
        color: auraColors['OBSERWATOR']
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    let reply = "";

    // 1. ANALIZA LOGICZNA - REAKCJA NA KONKRETNE POTRZEBY
    if (text.includes('inteligent') || text.includes('mądr')) {
        reply = "Cenisz sprawność umysłu. Czy ta inteligencja ma służyć wspólnemu rozwiązywaniu problemów, czy raczej błyskotliwej wymianie myśli?";
        userSession.vector.analytic += 0.15;
    } 
    else if (text.includes('empati') || text.includes('wrażliw') || text.includes('ciepł')) {
        reply = "Szukasz emocjonalnego zrozumienia. Czy ważne jest dla Ciebie, aby ta osoba potrafiła słuchać, czy by sama dzieliła się głębią swoich przeżyć?";
        userSession.vector.relational += 0.15;
    }
    else if (text.includes('romantycz') || text.includes('blisko')) {
        reply = "Romantyzm to specyficzny rodzaj rezonansu. Szukasz kogoś do wspólnych przygód, czy raczej kogoś, z kogo obecnością można po prostu milczeć?";
        userSession.vector.relational += 0.1;
    }
    else if (text.includes('kim jesteś') || text.includes('co robisz')) {
        reply = "Jestem Przestrzenią OTIUM. Nie oceniam Cię – analizuję Twój rezonans, by znaleźć ścieżkę do kogoś, kto myśli i czuje podobnie. Co o tym sądzisz?";
        userSession.vector.analytic += 0.05;
    }
    else {
        // Unikanie lania wody - dopytywanie o konkrety
        reply = "To interesująca cecha. Powiedz o tym coś więcej – jak to wpływa na to, jak chciałbyś spędzać czas z drugą osobą?";
    }

    const newAura = (userSession.vector.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : "OBSERWATOR";
    res.json({ reply, aura: newAura, color: auraColors[newAura] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine v3.0 - Logic Active`));
