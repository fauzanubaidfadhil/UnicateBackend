require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const cors = require("cors");
const api = require("./routes");

const app = express();
const PORT = process.env.PORT;
const server = createServer(app);

app.use(cors());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(api);

// http:localhost:5500
// app.get("/", (req, res) => {
//   return res.send("Hello world!");
// });

server.listen(PORT, () =>
  console.log(`Server start in http://localhost:${PORT}`)
);
