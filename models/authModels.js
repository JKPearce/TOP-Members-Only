const pool = require("../db/pool");

async function createUser({
  firstName,
  lastName,
  username,
  email,
  passwordHash,
}) {
  console.log(passwordHash);

  const query = `
    INSERT INTO users (
      first_name,
      last_name,
      username,
      email,
      password_hash
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name, username, email, is_member, is_admin, created_at
  `;

  const values = [firstName, lastName, username, email, passwordHash];

  const { rows } = await pool.query(query, values);

  return rows[0];
}

module.exports = {
  createUser,
};
