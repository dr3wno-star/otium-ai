const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OTIUM SERVER WORKING");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("OTIUM RUNNING ON", PORT);
});
