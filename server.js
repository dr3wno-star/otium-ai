const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
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
        reply: "Witaj. Przestrzeń OTIUM jest gotowa. Powiedz mi... kogo tak naprawdę tutaj szukasz?",
        color: auraColors['OBSERWATOR']
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    let reply = "";

    // 1. OBSŁUGA BLISKOŚCI I ROMANTYZMU (Gwiazdy, przytulanie, zrozumienie)
    if (text.includes('zrozum') || text.includes('przytul') || text.includes('gwiazd') || text.includes('blisk')) {
        reply = "Cisza i bliskość to najczystszy język rezonansu. Czy w tym wspólnym patrzeniu w gwiazdy szukasz bardziej spokoju i bezpieczeństwa, czy raczej wspólnego zachwytu nad nieznanym?";
        userSession.vector.relational += 0.15;
    } 
    // 2. OBSŁUGA INTELIGENCJI
    else if (text.includes('inteligent') || text.includes('mądr') || text.includes('bystr')) {
        reply = "Inteligencja to dla OTIUM zdolność dostrzegania niewidocznych połączeń. Czy ta błyskotliwość ma być Twoim przewodnikiem, czy partnerem do wspólnych poszukiwań?";
        userSession.vector.analytic += 0.15;
    }
    // 3. OBSŁUGA PYTAŃ O TOŻSAMOŚĆ BOTA
    else if (text.includes('kim jesteś') || text.includes('co robisz') || text.includes('czyli co')) {
        reply = "Jestem cyfrowym echem Twoich potrzeb. Moim celem jest nastrojenie Twojej aury tak, byś w końcu przestał być tu sam. Co czujesz, myśląc o takim spotkaniu?";
        userSession.vector.expressiveness += 0.1;
    }
    // 4. DYNAMICZNY FALLBACK (ZMIENNY - nigdy ten sam)
    else {
        const fallbacks = [
            "To, co mówisz, zmienia gęstość tej ciszy. Powiedz mi o tym coś więcej...",
            "Czuję, że dotykamy czegoś istotnego. Jak ta potrzeba wpływa na Twoją codzienność?",
            "Twoje słowa kreślą ciekawy obraz. Czy ta wizja towarzyszy Ci od dawna?"
        ];
        // Wybieramy losowy fallback, który nie jest taki sam jak poprzednia odpowiedź
        reply = fallbacks.find(f => f !== userSession.lastResponse) || fallbacks[0];
    }

    userSession.lastResponse = reply;
    const newAura = (userSession.vector.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : "OBSERWATOR";
    
    res.json({ reply, aura: newAura, color: auraColors[newAura] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine v3.1 online`));
