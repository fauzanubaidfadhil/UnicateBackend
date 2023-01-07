const { createPool } = require("mysql2");

const conn = createPool({
  host: "localhost",
  database: "unicate",
  user: "root",
  password: "Developer2022`.",
});

async function query(query) {
  try {
    const [execute] = await conn.promise().query(query);
    return execute;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { query };
