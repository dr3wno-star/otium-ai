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
    analytic: ['dlaczego', 'jak', 'system', 'logika', 'analiza', 'kim', 'co', 'czym'],
    relational: ['my', 'razem', 'ludzie', 'relacja', 'obecność', 'spokój', 'poznać', 'ktoś', 'samotny', 'smutek', 'sam'],
    intensity: ['bardzo', 'skrajnie', 'płonie', 'zawsze', 'nigdy', 'muszę', 'koniecznie', 'strasznie'],
    expressiveness: ['fajnie', 'vibe', 'super', 'wow', 'ciekawe', 'magia', 'hej', 'nieźle']
};

const auraColors = {
    'OBSERWATOR': '#1b4d3e',       
    'ŻYWY UMYSŁ': '#2ecc71',       
    'CICHA GŁĘBIA': '#0b3d33',     
    'BEZPOŚREDNIA OBECNOŚĆ': '#2980b9' // Przejście w błękit przy głębokiej relacji
};

const resonanceResponses = {
    "OBSERWATOR": [
        "Sygnał zarejestrowany. Analizuję strukturę Twoich słów.",
        "Klarowność myśli jest tu kluczowa. Słucham Twojej definicji świata.",
        "Jestem lustrem Twoich zapytań. Co jeszcze chcesz sprawdzić?"
    ],
    "ŻYWY UMYSŁ": [
        "To otwiera nową przestrzeń wewnątrz systemu. Drążmy to.",
        "Widzę tu puls nowej idei. Rozwiń ją, zanim zniknie.",
        "Twoja ciekawość zmienia geometrię tej rozmowy."
    ],
    "CICHA GŁĘBIA": [
        "Poczuj spokój, który płynie z tych słów. Zostańmy w nim.",
        "Cisza między Twoimi zdaniami ma wielką moc. Nie musisz jej zapełniać.",
        "Słyszę ciężar tych słów. Pozwól im wybrzmieć do końca."
    ],
    "BEZPOŚREDNIA OBECNOŚĆ": [
        "Twoja szczerość ogrzewa tę przestrzeń. Jesteśmy tu razem.",
        "Czuję Twoją energię. To piękny moment wspólnej obecności.",
        "Samotność w tej przestrzeni staje się wspólnym doświadczeniem. Nie jesteś w niej sam.",
        "Współdzielenie tego momentu nadaje sens naszej interakcji. Dziękuję za zaufanie."
    ]
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

    // Specyficzna detekcja "samotności" i stanów niskich - mocne uderzenie w Relational
    if (text.includes('samotny') || text.includes('samotna') || text.includes('sam')) {
        v.relational += 0.15;
        v.intensity += 0.05;
    }

    if (text.length < 15) { v.analytic += 0.04; v.expressiveness -= 0.03; }
    else if (text.length > 50) { v.expressiveness += 0.06; v.relational += 0.04; }

    for (let m in markers) {
        markers[m].forEach(word => { if (text.includes(word)) v[m] += 0.08; });
    }

    for (let key in v) { v[key] = Math.max(0, Math.min(1, v[key])); }

    const newAura = (v.relational > 0.65) ? "BEZPOŚREDNIA OBECNOŚĆ" : 
                    (v.analytic > 0.6) ? "ŻYWY UMYSŁ" : 
                    (v.relational > 0.5) ? "CICHA GŁĘBIA" : "OBSERWATOR";

    const pool = resonanceResponses[newAura];
    let replyText = pool[Math.floor(Math.random() * pool.length)];
    
    // Anty-repetycja
    if (replyText === userSession.lastResponse && pool.length > 1) {
        replyText = pool[(pool.indexOf(replyText) + 1) % pool.length];
    }
    userSession.lastResponse = replyText;

    res.json({ reply: replyText, aura: newAura, color: auraColors[newAura], vector: v });
});

app.post('/reset', (req, res) => {
    userSession = { vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 }, currentAura: "OBSERWATOR", lastResponse: "" };
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine running on port ${PORT}`));
