require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query } = require("../database/config");
const { date } = require("../utils/tools");
const jwt = require("jsonwebtoken");

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

    await query(`
        INSERT INTO users (
            username, fullname, email, phonenumber, password, created_by, created_at, updated_by, updated_at
        ) VALUES (
            '${username}', '${fullname}', '${email}', null, '${hash}', 0, '${date()}', 0, '${date()}'
        );
    `);

    const [{ id }] = await query(` SELECT MAX(id) as id FROM users;`);

    await query(`
      UPDATE users SET
      created_by = ${id},
      updated_by = ${id}
      WHERE id = ${id};
    `);

    const [userData] = await query(`
      SELECT id, username, fullname, email FROM users WHERE id = ${id} 
    `);

    jwt.sign(userData, process.env.privateKey, (err, token) => {
      if (err) throw err;

      return res.status(200).json({
        message: "Register successfully!",
        Authorization: `bearer ${token}`,
      });
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}

// login dan validattion login
async function validationLogin(req, res, next) {
  const { email, password } = req.body;
  try {
    if (email === undefined)
      return res.status(400).json({ message: "Email required!" });
    if (password === undefined)
      return res.status(400).json({ message: "Password required!" });

    // next is used for go to the next middleware
    next();
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body;
  try {
    const [checkUser] = await query(`
      SELECT id, password FROM users WHERE email = '${email}';
    `);

    if (checkUser === undefined)
      return res.status(400).json({ message: "User not exists!" });

    const matchPassword = await bcrypt.compare(password, checkUser.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Invalid email/password!" });

    const [userData] = await query(`
      SELECT id, username, fullname, email FROM users WHERE id = ${checkUser.id} 
    `);

    jwt.sign(userData, process.env.privateKey, (err, token) => {
      if (err) throw err;

      return res.status(200).json({
        Authorization: `bearer ${token}`,
      });
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}

module.exports = { userRegis, regisValidation, validationLogin, userLogin };

// const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);

// // username already taken
// User.findOne({ username: username }, (err, user) => {
//   if (err) {
//     return res.status(500).json({ message: "Error on the server" });
//   }
//   if (user) {
//     return res.status(409).json({ message: "Username already exist" });
//   }

//   // send token
//   const payload = {
//     username,
//   };
//   const token = jwt.sign(payload, secretKey);
//   res.status(200).json({ token });
// });
