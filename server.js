const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OTIUM backend running");
});

app.post("/api/question", (req, res) => {

  const memory = req.body.memory || [];
  const last = (memory[memory.length - 1] || "").toLowerCase();

  let response = "Co teraz najbardziej zajmuje Twoje myśli?";

  if (last.includes("gra") || last.includes("craft")) {
    response = "Co w tej grze daje Ci największą satysfakcję?";
  }

  if (last.includes("relacj") || last.includes("osob")) {
    response = "Jakiej relacji teraz najbardziej szukasz?";
  }

  if (last.includes("wiar") || last.includes("duch")) {
    response = "Jaką rolę ma dla Ciebie duchowość w życiu?";
  }

  return res.json({ question: response });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("OTIUM running on port", PORT);
});
