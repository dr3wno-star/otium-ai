import express from "express";

console.log("OTIUM STARTING");

const app = express();

app.get("/", (req, res) => {
  res.send("OTIUM OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING ON PORT", PORT);
});
