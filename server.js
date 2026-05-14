import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

console.log("OTIUM AI ONLINE");

// ROOT
app.get("/", (req, res) => {

  res.json({
    status: "OTIUM ONLINE"
  });

});

// GET TEST
app.get("/api/question", (req, res) => {

  res.json({
    status: "API WORKS"
  });

});

// AI FLOW
app.post("/api/question", (req, res) => {

  const memory =
    req.body.memory || [];

  const last =
    (
      memory[memory.length - 1] || ""
    ).toLowerCase();

  let question =
    "Co dziś najbardziej czujesz?";

  // =========================
  // DYNAMIC FLOW
  // =========================

  if (
    last.includes("zmęcz") ||
    last.includes("mam dość") ||
    last.includes("wyczerp")
  ) {

    question =
      "Co najmocniej odbiera Ci dziś energię?";
  }

  else if (
    last.includes("sam") ||
    last.includes("samot")
  ) {

    question =
      "Czy cisza pomaga Ci dziś, czy bardziej boli?";
  }

  else if (
    last.includes("spokój")
  ) {

    question =
      "Gdzie ostatnio poczułeś prawdziwy spokój?";
  }

  else if (
    last.includes("ludzie")
  ) {

    question =
      "Za czym najbardziej tęsknisz w rozmowach z ludźmi?";
  }

  else if (
    memory.length <= 1
  ) {

    question =
      "Co sprawiło, że zatrzymałeś się dziś właśnie tutaj?";
  }

  else if (
    memory.length === 2
  ) {

    question =
      "Jakiego rodzaju obecności dziś szukasz?";
  }

  else if (
    memory.length === 3
  ) {

    question =
      "Przy kim czujesz się najbardziej sobą?";
  }

  else {

    const pool = [

      "Co ostatnio było dla Ciebie zbyt ciężkie do wypowiedzenia?",

      "Czego najbardziej brakuje Ci w codziennych rozmowach?",

      "Czy łatwo pokazujesz innym swoje prawdziwe emocje?",

      "Za jakim spokojem najbardziej tęsknisz?",

      "Jak wyglądałby idealny wieczór rozmowy?"
    ];

    question =
      pool[
        Math.floor(
          Math.random() * pool.length
        )
      ];
  }

  res.json({
    question
  });

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "RUNNING ON PORT",
    PORT
  );

});
