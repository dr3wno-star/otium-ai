const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    step: 0
};

const questions = [
    {
        id: 0,
        text: "Cześć. Aby system wiedział, w którą stronę Cię prowadzić, musimy się nastroić. Na początek: wolisz spędzać czas w grupie ludzi, czy raczej szukasz kogoś do rozmowy tylko we dwoje?",
        trait: "relational"
    },
    {
        id: 1,
        text: "Rozumiem. A w rozmowie – wolisz konkretną wymianę zdań i faktów, czy raczej lubisz pogadać o emocjach i tym, co czujesz?",
        trait: "analytic" 
    },
    {
        id: 2,
        text: "Kiedy poznajesz kogoś nowego, jesteś osobą, która od razu mówi szczerze co myśli, czy raczej potrzebujesz czasu i spokoju, żeby się otworzyć?",
        trait: "expressiveness"
    },
    {
        id: 3,
        text: "Wyobraź sobie wieczór we dwoje. Wybierasz szaloną przygodę i dużo śmiechu, czy spokojny spacer i głębokie milczenie?",
        trait: "intensity"
    },
    {
        id: 4,
        text: "Ostatnia kwestia: szukasz tu kogoś, kto jest Twoim całkowitym przeciwieństwem, czy kogoś, kto myśli i żyje bardzo podobnie do Ciebie?",
        trait: "final"
    }
];

app.get('/init', (req, res) => {
    userSession.step = 0;
    res.json({
        reply: questions[0].text,
        color: '#1b4d3e'
    });
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    const text = message.toLowerCase();
    let step = userSession.step;

    // LOGIKA ANALIZY PROSTYCH ODPOWIEDZI
    if (step === 0) {
        if (text.includes('dwoje') || text.includes('sam') || text.includes('jeden')) userSession.vector.relational += 0.2;
        else userSession.vector.relational -= 0.1;
    } else if (step === 1) {
        if (text.includes('konkret') || text.includes('fakt') || text.includes('logik')) userSession.vector.analytic += 0.2;
        else userSession.vector.relational += 0.15;
    } else if (step === 2) {
        if (text.includes('szczer') || text.includes('od razu') || text.includes('mówię')) userSession.vector.expressiveness += 0.2;
        else userSession.vector.expressiveness -= 0.2;
    } else if (step === 3) {
        if (text.includes('przygoda') || text.includes('śmiech') || text.includes('szalon')) userSession.vector.intensity += 0.2;
        else userSession.vector.intensity -= 0.2;
    }

    userSession.step++;

    if (userSession.step < questions.length) {
        res.json({
            reply: questions[userSession.step].text,
            color: '#1b4d3e'
        });
    } else {
        const v = userSession.vector;
        const aura = (v.relational > 0.6) ? "BEZPOŚREDNIA OBECNOŚĆ" : (v.analytic > 0.6) ? "ŻYWY UMYSŁ" : "OBSERWATOR";
        
        res.json({
            reply: `Kalibracja zakończona. Twoja aura to ${aura}. System zapisał Twój wektor. Jesteś gotowy, by spotkać osobę, która pasuje do Twojego rytmu. Od czego chcesz zacząć?`,
            color: (aura === "BEZPOŚREDNIA OBECNOŚĆ") ? "#3498db" : "#2ecc71"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM v4.1 - Simple Language Active`));
