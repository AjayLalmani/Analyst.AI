require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/docs", require("./routes/file"));
app.use("/api/analysis", require("./routes/chat"));

app.listen(PORT, () => {
  console.log(`Listening on 3000`);
});
