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

const markers = {
    analytic: ['dlaczego', 'jak', 'ponieważ', 'system', 'logika', 'analiza', 'struktura', 'zrozumieć', 'fakt', 'czyli', 'co'],
    relational: ['my', 'razem', 'czuję', 'blisko', 'ludzie', 'relacja', 'obecność', 'spokój', 'rozmowa', 'kto', 'poznać'],
    intensity: ['bardzo', 'skrajnie', 'ogień', 'wstrząs', 'płonie', 'zawsze', 'nigdy', 'muszę', 'natychmiast'],
    expressiveness: ['fajnie', 'super', 'chcę', 'lubię', 'ciekawe', 'wow', 'magia', 'emocje', 'chyba', 'hej']
};

const auraColors = {
    'OBSERWATOR': '#1b4d3e',       // Głęboka, leśna zieleń
    'ŻYWY UMYSŁ': '#2ecc71',       // Szmaragdowa energia
    'CICHA GŁĘBIA': '#0b3d33',     // Ciemny turkus
    'BEZPOŚREDNIA OBECNOŚĆ': '#7fb031' // Ciepła, oliwkowa zieleń
};

const resonanceResponses = {
    "OBSERWATOR": ["Sygnał zarejestrowany. Analizuję strukturę Twoich słów.", "Klarowność myśli jest tu kluczowa. Słucham."],
    "ŻYWY UMYSŁ": ["To otwiera nową przestrzeń wewnątrz systemu. Drążmy to.", "Widzę tu puls nowej idei. Rozwiń ją."],
    "CICHA GŁĘBIA": ["Poczuj spokój, który płynie z tych słów. Zostańmy w nim.", "Cisza między Twoimi zdaniami ma wielką moc."],
    "BEZPOŚREDNIA OBECNOŚĆ": ["Twoja szczerość ogrzewa tę przestrzeń. Jesteśmy tu razem.", "Czuję Twoją energię. To piękny moment wspólnej obecności."]
};

app.get('/init', (req, res) => {
    res.json({
        reply: "Witaj w ciszy. OTIUM jest nastrojone na Twój głos. Od czego chcesz zacząć tę podróż?",
        color: auraColors['OBSERWATOR'],
        aura: 'OBSERWATOR'
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    const v = userSession.vector;

    if (text.length < 15) { v.analytic += 0.04; v.expressiveness -= 0.03; }
    else if (text.length > 50) { v.expressiveness += 0.06; v.relational += 0.04; }

    for (let m in markers) {
        markers[m].forEach(word => { if (text.includes(word)) v[m] += 0.06; });
    }

    for (let key in v) { v[key] = Math.max(0, Math.min(1, v[key])); }

    const newAura = (v.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : 
                    (v.analytic > 0.6) ? "ŻYWY UMYSŁ" : 
                    (v.relational > 0.5) ? "CICHA GŁĘBIA" : "OBSERWATOR";

    const pool = resonanceResponses[newAura];
    let replyText = pool[Math.floor(Math.random() * pool.length)];
    if (replyText === userSession.lastResponse) replyText = pool[(pool.indexOf(replyText) + 1) % pool.length];
    userSession.lastResponse = replyText;

    res.json({ reply: replyText, aura: newAura, color: auraColors[newAura], vector: v });
});

app.post('/reset', (req, res) => {
    userSession = { vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 }, currentAura: "OBSERWATOR" };
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine running on port ${PORT}`));
