const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { analytic: 0.5, relational: 0.5, intensity: 0.5, expressiveness: 0.5 },
    step: 0
};

const audit = [
    {
        question: "Wchodzisz do pełnego ludzi pomieszczenia. Co Twoja aura robi najpierw?",
        options: [
            "SZUKA SPOKOJNEGO KĄTA I JEDNEJ OSOBY",
            "ROZPŁYWA SIĘ W ENERGII CAŁEJ GRUPY",
            "OBSERWUJE WSZYSTKO Z DYSTANSU",
            "NATYCHMIAST SZUKA PUNKTU ZACZEPIENIA"
        ]
    },
    {
        question: "Czym najchętniej karmisz swój umysł podczas rozmowy?",
        options: [
            "LOGIKĄ I KONKRETNYM ROZWIĄZANIEM",
            "EMOCJAMI I TYM, CO NIEWYPOWIEDZIANE",
            "FILOZOFIĄ I SZEROKIM SPOJRZENIEM",
            "CIEKAWOSTKAMI O DRUGIM CZŁOWIEKU"
        ]
    }
];

app.get('/init', (req, res) => {
    userSession.step = 0;
    res.json({
        type: "question",
        text: audit[0].question,
        options: audit[0].options,
        color: '#1b4d3e'
    });
});

app.post('/choice', (req, res) => {
    const { choiceIndex } = req.body;
    userSession.step++;

    if (userSession.step < audit.length) {
        res.json({
            type: "question",
            text: audit[userSession.step].question,
            options: audit[userSession.step].options,
            color: '#1b4d3e'
        });
    } else {
        res.json({
            type: "result",
            aura: "GŁĘBOKA OBECNOŚĆ",
            subtext: "Wieczorem (po 21:00) otworzymy kanał szeptu z pasującą osobą.",
            color: '#3498db'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serwer OTIUM działa.'));
