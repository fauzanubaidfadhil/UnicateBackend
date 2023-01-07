const express = require("express");
const { regisValidation, userRegis } = require("../controller/auth");
const routes = express();

routes.post("/user-register", [regisValidation, userRegis]);

module.exports = routes;
