const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { analytic: 0.5, relational: 0.5, intensity: 0.5, expressiveness: 0.5 },
    step: 0
};

// KLIMATYCZNE SCENARIUSZE Z WYBOREM
const audit = [
    {
        question: "Wchodzisz do pełnego ludzi pomieszczenia. Co Twoja aura robi najpierw?",
        options: [
            { text: "SZUKA SPOKOJNEGO KĄTA I JEDNEJ CIEKAWEJ OSOBY", effect: { relational: 0.2, intensity: -0.1 } },
            { text: "ROZPŁYWA SIĘ W ENERGII GRUPY I CHŁONIE ATMOSFERĘ", effect: { relational: -0.1, intensity: 0.2 } }
        ]
    },
    {
        question: "Czym najchętniej karmisz swój umysł podczas rozmowy?",
        options: [
            { text: "LOGIKĄ, FAKTAMI I KONKRETNYM ROZWIĄZANIEM", effect: { analytic: 0.3 } },
            { text: "EMOCJAMI, NIUANSAMI I TYM, CO NIEWYPOWIEDZIANE", effect: { analytic: -0.2, relational: 0.2 } }
        ]
    },
    {
        question: "Ktoś bliski dzieli się z Tobą trudną historią. Twoja reakcja to:",
        options: [
            { text: "SZCZERA, NAWET JEŚLI BOLESNA ANALIZA SYTUACJI", effect: { expressiveness: 0.3, analytic: 0.1 } },
            { text: "CIEPŁA OBECNOŚĆ I PRÓBA POCZUCIA TEGO SAMEGO", effect: { expressiveness: -0.2, relational: 0.3 } }
        ]
    },
    {
        question: "Jaki rodzaj ciszy we dwoje jest Ci bliższy?",
        options: [
            { text: "CISZA PEŁNA NAPIĘCIA I NIEODKRYTYCH TAJEMNIC", effect: { intensity: 0.3 } },
            { text: "CISZA BEZPIECZNA, W KTÓREJ NIE MUSISZ NIC UDOWAĆ", effect: { intensity: -0.3, relational: 0.2 } }
        ]
    }
];

app.get('/init', (req, res) => {
    userSession.step = 0;
    res.json({
        type: "question",
        text: audit[0].question,
        options: audit[0].options.map(o => o.text),
        color: '#1b4d3e'
    });
});

app.post('/choice', (req, res) => {
    const { choiceIndex } = req.body;
    const currentStep = audit[userSession.step];
    const selectedOption = currentStep.options[choiceIndex];

    // Aktualizacja wektorów
    Object.keys(selectedOption.effect).forEach(key => {
        userSession.vector[key] += selectedOption.effect[key];
    });

    userSession.step++;

    if (userSession.step < audit.length) {
        res.json({
            type: "question",
            text: audit[userSession.step].question,
            options: audit[userSession.step].options.map(o => o.text),
            color: '#1b4d3e'
        });
    } else {
        // Obliczanie aury końcowej
        const v = userSession.vector;
        let auraName = "OBSERWATOR";
        if (v.relational > 0.6) auraName = "BEZPOŚREDNIA OBECNOŚĆ";
        if (v.intensity > 0.6) auraName = "ŻYWY UMYSŁ";

        res.json({
            type: "result",
            text: `Badanie ukończone. Twoja aura: ${auraName}. Profil został nastrojony.`,
            subtext: "Wieczorem (po 21:00) otworzymy dla Ciebie kanał szeptu z osobą o pasującym rezonansie.",
            color: '#3498db'
        });
    }
});

app.listen(3000);
