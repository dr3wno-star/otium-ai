import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM SERVER STARTED");

// ROOT TEST
app.get("/", (req, res) => {
  res.json({ status: "OTIUM OK" });
});

// API TEST (GET)
app.get("/api/question", (req, res) => {
  res.json({ status: "GET WORKS" });
});

// API (POST)
app.post("/api/question", (req, res) => {

  console.log("POST HIT");

  res.json({
    question: "OTIUM działa — testowe pytanie"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
