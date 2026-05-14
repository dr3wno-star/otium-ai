import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("OTIUM TEST BACKEND RUNNING");

// TEST ROUTE
app.post("/api/question", (req, res) => {

  console.log("BODY:", req.body);

  return res.json({
    question: "TEST: backend działa poprawnie"
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON", PORT);
});
