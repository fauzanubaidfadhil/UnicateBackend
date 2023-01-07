const express = require("express");
const authApi = require("./auth");

const app = express();

// http:localhost:5500 /api/v1
const api = "/api/v1";

app.use(api, authApi); // auth api

module.exports = app;
