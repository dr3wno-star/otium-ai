const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory store dla sesji
let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    step: 0
};

// Matryca pytań i ich wpływu na wektory
const questions = [
    {
        id: 0,
        text: "Świat płonie od emocji czy panuje w nim chłodny porządek?",
        options: [
            { text: "Ogień", impact: { intensity: 0.3, expressiveness: 0.2, analytic: -0.2 } },
            { text: "Porządek", impact: { intensity: -0.2, analytic: 0.4, expressiveness: -0.2 } }
        ]
    },
    {
        id: 1,
        text: "Ważniejsze jest KTO mówi, czy CO dokładnie ma do przekazania?",
        options: [
            { text: "KTO", impact: { relational: 0.4, expressiveness: 0.2, analytic: -0.2 } },
            { text: "CO", impact: { analytic: 0.4, relational: -0.2, intensity: 0.1 } }
        ]
    },
    {
        id: 2,
        text: "Twoje wnętrze to otwarta księga czy strzeżony ogród?",
        options: [
            { text: "Księga", impact: { expressiveness: 0.5, relational: 0.2 } },
            { text: "Ogród", impact: { intensity: 0.3, expressiveness: -0.4, analytic: 0.1 } }
        ]
    },
    {
        id: 3,
        text: "Szukasz momentów, które wyrywają z butów czy dają oparcie?",
        options: [
            { text: "Wstrząs", impact: { intensity: 0.4, analytic: 0.2, relational: -0.2 } },
            { text: "Oparcie", impact: { relational: 0.4, intensity: -0.3, expressiveness: 0.1 } }
        ]
    },
    {
        id: 4,
        text: "Chcesz coś zrozumieć, czy po prostu nie być samemu?",
        options: [
            { text: "Zrozumieć", impact: { analytic: 0.4, intensity: 0.1, relational: -0.3 } },
            { text: "Nie być samemu", impact: { relational: 0.5, expressiveness: 0.2, analytic: -0.2 } }
        ]
    }
];

app.get('/question', (req, res) => {
    if (userSession.step < questions.length) {
        res.json(questions[userSession.step]);
    } else {
        res.json({ end: true });
    }
});

app.post('/answer', (req, res) => {
    const { optionIndex } = req.body;
    const currentQuestion = questions[userSession.step];
    if (!currentQuestion) return res.status(400).json({ error: "Brak pytania" });
    
    const impact = currentQuestion.options[optionIndex].impact;

    for (let key in impact) {
        userSession.vector[key] = Math.max(0, Math.min(1, userSession.vector[key] + impact[key]));
    }

    userSession.step++;
    res.json({ success: true });
});

app.get('/result', (req, res) => {
    const v = userSession.vector;
    let aura = "OBSERWATOR";

    if (v.relational > 0.6 && v.expressiveness > 0.6) aura = "BEZPOŚREDNIA OBECNOŚĆ";
    else if (v.analytic > 0.6 && v.intensity > 0.5) aura = "ŻYWY UMYSŁ";
    else if (v.relational > 0.6 && v.expressiveness < 0.5) aura = "CICHA GŁĘBIA";

    const messages = {
        "OBSERWATOR": "System ustabilizowany. Parametry ustawione na klarowność. Słucham konkretów.",
        "ŻYWY UMYSŁ": "Przestrzeń otwarta na idee. Łączymy kropki. Co dziś rozłożymy na części pierwsze?",
        "CICHA GŁĘBIA": "Zwolnij. Tu nie musisz nic udowadniać. Twoje myśli mają czas, by wybrzmieć.",
        "BEZPOŚREDNIA OBECNOŚĆ": "Dobrze, że jesteś. Czuję Twoją energię. O czym dziś szepcze Twoje serce?"
    };

    res.json({
        aura: aura,
        vector: v,
        firstMessage: messages[aura]
    });
});

app.post('/reset', (req, res) => {
    userSession = { vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 }, step: 0 };
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Backend na porcie ${PORT}`));
