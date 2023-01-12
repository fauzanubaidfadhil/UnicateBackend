const express = require("express");
const {
  regisValidation,
  userRegis,
  validationLogin,
  userLogin,
} = require("../controller/auth");
const routes = express();

routes.post("/user-register", [regisValidation, userRegis]);
routes.post("/user-login", [validationLogin, userLogin]);

module.exports = routes;
