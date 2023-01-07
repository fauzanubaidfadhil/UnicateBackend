const bcrypt = require("bcryptjs");
const { query } = require("../database/config");
const { date } = require("../utils/tools");

async function regisValidation(req, res, next) {
  let errorMessage = "";
  let errorActive = false;
  const { username, fullname, email, password, confPassword } = req.body;

  // validation
  if (password === "" || password === null) {
    errorMessage = "Password is required!";
    errorActive = true;
  }

  if (confPassword === "" || confPassword === null) {
    errorMessage = "Confirm Password is required!";
    errorActive = true;
  }

  if (password !== confPassword) {
    errorMessage = "Password and confirm password not match!";
    errorActive = true;
  }

  if (errorActive) return res.status(400).json({ message: errorMessage });

  next();
}

async function userRegis(req, res) {
  const { username, fullname, email, password } = req.body;

  try {
    const checkUser = await query(`
        SELECT id FROM users WHERE email = '${email}' OR username = '${username}';
    `);

    if (checkUser.length !== 0)
      return res.status(400).json({ message: "User already exists!" });

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const userData = await query(`
        INSERT INTO users (
            username, fullname, email, phonenumber, password, created_by, created_at, updated_by, updated_at
        ) VALUES (
            '${username}', '${fullname}', '${email}', null, '${hash}', 0, '${date()}', 0, '${date()}'
        );
    `);

    const [{ id }] = await query(` SELECT MAX(id) as id FROM users;`);
    console.log(id);

    //

    return res.status(200).json({ message: "Register successfully!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}

// login dan validattion login

module.exports = { userRegis, regisValidation };
