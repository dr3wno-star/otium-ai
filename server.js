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

const resonanceResponses = {
    "OBSERWATOR": [
        "Sygnał zarejestrowany. Analizuję strukturę Twoich słów.",
        "Klarowność myśli jest tu kluczowa. Słucham.",
        "Jestem lustrem Twoich zapytań. Kontynuuj."
    ],
    "ŻYWY UMYSŁ": [
        "To otwiera nową przestrzeń. Rozłóżmy to na czynniki pierwsze.",
        "Widzę tu puls nowej idei. Rozwiń ją.",
        "Twoja ciekawość zmienia geometrię tej rozmowy."
    ],
    "CICHA GŁĘBIA": [
        "Poczuj spokój, który płynie z tych słów. Zostańmy w nim.",
        "Cisza między zdaniami ma moc. Słyszę jej ciężar.",
        "Nie musisz się spieszyć. Twoje słowa wybrzmiewają powoli."
    ],
    "BEZPOŚREDNIA OBECNOŚĆ": [
        "Twoja szczerość ogrzewa tę przestrzeń. Jesteśmy tu razem.",
        "Czuję Twoją energię. To piękny moment wspólnej obecności.",
        "Dziękuję za to zaufanie. Współdzielenie momentu nadaje mu sens."
    ]
};

app.get('/init', (req, res) => {
    res.json({
        reply: "Witaj w przestrzeni OTIUM. Twoja aura została wstępnie nastrojona. O czym chcesz teraz porozmawiać?",
        color: auraColors['OBSERWATOR'],
        aura: 'OBSERWATOR'
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    const v = userSession.vector;

    if (text.includes('samotny') || text.includes('samotna') || text.includes('sam')) v.relational += 0.15;
    if (text.length < 15) { v.analytic += 0.04; v.expressiveness -= 0.03; }
    else if (text.length > 50) { v.expressiveness += 0.06; v.relational += 0.04; }

    const newAura = (v.relational > 0.65) ? "BEZPOŚREDNIA OBECNOŚĆ" : 
                    (v.analytic > 0.6) ? "ŻYWY UMYSŁ" : 
                    (v.relational > 0.5) ? "CICHA GŁĘBIA" : "OBSERWATOR";

    const pool = resonanceResponses[newAura];
    let replyText = pool[Math.floor(Math.random() * pool.length)];
    if (replyText === userSession.lastResponse) replyText = pool[(pool.indexOf(replyText) + 1) % pool.length];
    userSession.lastResponse = replyText;

    res.json({ reply: replyText, aura: newAura, color: auraColors[newAura], vector: v });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine running on port ${PORT}`));
