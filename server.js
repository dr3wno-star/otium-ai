const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    path: [], // Przechowuje wybory: 0 lub 1
    step: 0
};

const audit = [
    {
        id: "SOCIAL",
        question: "Wieczór nabiera barw. Gdzie Twoja aura czuje się bezpieczniej?",
        options: [
            "W CISZY I SPOKOJU, REGENERUJĄC SIĘ W SAMOTNOŚCI", // Introwertyk
            "WŚRÓD LUDZI, CZERPIĄC ENERGIĘ Z INTERAKCJI"     // Ekstrawertyk
        ]
    },
    {
        id: "MINDSET",
        question: "Gdy patrzysz w przyszłość, co widzisz najwyraźniej?",
        options: [
            "REALNE CELE, LOGIKĘ I TWARDE STĄPANIE PO ZIEMI", // Twardo stąpający
            "MARZENIA, IDEE I TO, CO JESZCZE NIEODKRYTE"      // Marzyciel
        ]
    },
    {
        id: "LIFE_GOAL",
        question: "Jaki fundament chcesz budować w najbliższych latach?",
        options: [
            "DOM, RODZINĘ I POCZUCIE PRZYNALEŻNOŚCI",         // Rodzina
            "WŁASNĄ DROGĘ, PODRÓŻE I NIEZALEŻNOŚĆ"           // Kariera/Wolność
        ]
    }
];

app.get('/init', (req, res) => {
    userSession.step = 0;
    userSession.path = [];
    res.json({
        type: "question",
        text: audit[0].question,
        options: audit[0].options
    });
});

app.post('/choice', (req, res) => {
    const { choiceIndex } = req.body;
    userSession.path.push(choiceIndex);
    userSession.step++;

    if (userSession.step < audit.length) {
        res.json({
            type: "question",
            text: audit[userSession.step].question,
            options: audit[userSession.step].options
        });
    } else {
        // GENEROWANIE WYNIKU ZERO-JEDYNKOWEGO
        const path = userSession.path;
        
        // Mapowanie ścieżki na konkretną aurę
        let resultAura = "";
        let description = "";
        let color = "";

        // Przykład: Introwertyk (0) + Realista (0) + Rodzina (0)
        if(path[0] === 0 && path[1] === 0 && path[2] === 0) {
            resultAura = "STOIK DOMATOR";
            description = "Cenisz spokój, realizm i budowanie trwałych fundamentów w zaciszu domowym.";
            color = "#1b4d3e"; // Głęboka zieleń
        } 
        // Przykład: Ekstrawertyk (1) + Marzyciel (1) + Wolność (1)
        else if(path[0] === 1 && path[1] === 1 && path[2] === 1) {
            resultAura = "WOLNY DUCH";
            description = "Twoja energia napędza świat. Szukasz przygód, idei i totalnej niezależności.";
            color = "#3498db"; // Błękit
        }
        else {
            resultAura = "ODKRYWCA REZONANSU";
            description = "Twoja aura jest unikalną mieszanką potrzeb. System szuka Twojego idealnego dopełnienia.";
            color = "#2ecc71";
        }

        res.json({
            type: "result",
            aura: resultAura,
            subtext: description,
            footer: "Kod Rezonansu zapisany. Wróć po 21:00 na Szept Wieczorny.",
            color: color
        });
    }
});

app.listen(3000);
