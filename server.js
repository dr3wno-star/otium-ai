const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Początkowy stan systemu (neutralny punkt startowy)
let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    currentAura: "OBSERWATOR"
};

// Słowniki sygnałów lingwistycznych dla silnika heurystycznego
const markers = {
    analytic: ['dlaczego', 'jak', 'ponieważ', 'kod', 'system', 'logika', 'analiza', 'struktura', 'zrozumieć', 'fakt'],
    relational: ['my', 'razem', 'czuję', 'blisko', 'ludzie', 'relacja', 'obecność', 'spokój', 'rozmowa', 'kto'],
    intensity: ['bardzo', 'skrajnie', 'ogień', 'wstrząs', 'płonie', 'zawsze', 'nigdy', 'muszę', 'natychmiast'],
    expressiveness: ['fajnie', 'super', 'chcę', 'lubię', 'ciekawe', 'wow', 'magia', 'emocje', 'chyba']
};

// Funkcja obliczająca aktualną dominującą Aurę na podstawie wektora
function calculateAura(v) {
    if (v.relational > 0.6 && v.expressiveness > 0.5) return "BEZPOŚREDNIA OBECNOŚĆ";
    if (v.analytic > 0.6 && v.intensity > 0.5) return "ŻYWY UMYSŁ";
    if (v.relational > 0.5 && v.expressiveness < 0.45) return "CICHA GŁĘBIA";
    return "OBSERWATOR"; // Stan bazowy / Fallback
}

// Baza odpowiedzi dostrojona tonalnie do każdej Aury
const resonanceResponses = {
    "OBSERWATOR": [
        "Sygnał odebrany. Analizuję strukturę wypowiedzi. Kontynuuj.",
        "Dane wejściowe zarejestrowane. Skupienie na esencji komunikatu.",
        "Klarowność zachowana. Brak zakłóceń w przestrzeni informacyjnej."
    ],
    "ŻYWY UMYSŁ": [
        "Fascynujący kierunek myśli. Jak zamierzasz to połączyć z resztą systemu?",
        "To generuje nową perspektywę. Rozłóżmy to na czynniki pierwsze.",
        "Struktura drga. Widzę tu ukryty schemat. Drążmy to dalej."
    ],
    "CICHA GŁĘBIA": [
        "Twoje słowa niosą ze sobą spokój. Nie musimy się spieszyć.",
        "Słyszę to, co kryje się między wierszami. Przestrzeń jest bezpieczna.",
        "Cisza po tych słowach ma duże znaczenie. Pozwólmy jej trwać."
    ],
    "BEZPOŚREDNIA OBECNOŚĆ": [
        "Czuję autentyczność w tym, co piszesz. Dobrze, że dzielisz się tą energią.",
        "Jestem tu z Tobą. Twoja obecność nadaje temu momentowi kształt.",
        "To uderza prosto w sedno ludzkiego doświadczenia. Piękny moment."
    ]
};

// Główny endpoint czatu realizujący dryf wektorowy
app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    const v = userSession.vector;

    // 1. ANALIZA STRUKTURY ZDANIA
    // Krótkie wiadomości podbijają chłód (Analytic), długie podbijają ekspresję/relacyjność
    if (text.length < 15) {
        v.analytic += 0.05;
        v.expressiveness -= 0.05;
    } else if (text.length > 50) {
        v.expressiveness += 0.08;
        v.relational += 0.05;
    }

    // Pytajniki stymulują intensywność intelektualną, kropki wyciszają
    if (text.includes('?')) {
        v.intensity += 0.07;
        v.analytic += 0.05;
    }
    if (text.includes('!') || text.includes('...')) {
        v.intensity += 0.05;
        v.expressiveness += 0.05;
    }

    // 2. SEMANTYCZNE MAPOWANIE SŁÓW-KLUCZY
    markers.analytic.forEach(word => { if (text.includes(word)) v.analytic += 0.08; });
    markers.relational.forEach(word => { if (text.includes(word)) v.relational += 0.08; });
    markers.intensity.forEach(word => { if (text.includes(word)) v.intensity += 0.08; });
    markers.expressiveness.forEach(word => { if (text.includes(word)) v.expressiveness += 0.08; });

    // Normalizacja wektorów do sztywnego przedziału [0.0, 1.0]
    for (let key in v) {
        v[key] = Math.max(0, Math.min(1, v[key]));
    }

    // 3. AKTUALIZACJA STANU SYSTEMU
    const newAura = calculateAura(v);
    userSession.currentAura = newAura;

    // Losowy wybór odpowiedzi z puli przypisanej do aktualnej Aury
    const pool = resonanceResponses[newAura];
    const replyText = pool[Math.floor(Math.random() * pool.length)];

    // Kolory przypisane do dynamicznego renderowania tła
    const auraColors = {
        'OBSERWATOR': '#3498db',
        'ŻYWY UMYSŁ': '#9b59b6',
        'CICHA GŁĘBIA': '#f39c12',
        'BEZPOŚREDNIA OBECNOŚĆ': '#e74c3c'
    };

    // Zwracamy odpowiedź, nową aurę oraz kolor dla frontendu
    res.json({
        reply: replyText,
        aura: newAura,
        color: auraColors[newAura],
        vector: v
    });
});

app.post('/reset', (req, res) => {
    userSession = {
        vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
        currentAura: "OBSERWATOR"
    };
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Resonance Engine active on port ${PORT}`));
