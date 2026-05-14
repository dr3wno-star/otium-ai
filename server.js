const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let userSession = {
    vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 },
    aura: "OBSERWATOR" // Domyślna dla testów
};

app.post('/chat', (req, res) => {
    const { message } = req.body;
    // Tutaj w przyszłości wejdzie logika adaptacji stylu OTIUM
    res.json({ 
        reply: `[RESONANCE: ${userSession.aura}] Otrzymałem: "${message}". System analizuje dryf wektorowy.`,
        vector: userSession.vector 
    });
});

app.post('/reset', (req, res) => {
    userSession = { vector: { intensity: 0.5, expressiveness: 0.5, analytic: 0.5, relational: 0.5 }, aura: "OBSERWATOR" };
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OTIUM Engine running on port ${PORT}`));
