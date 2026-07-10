const pool = require("../db/pool");

async function getAllPosts() {
  const query = `
    SELECT
      posts.id,
      posts.title,
      posts.body,
      posts.created_at,
      posts.created_by_user_id,
      users.username,
      users.first_name,
      users.last_name
    FROM posts
    JOIN users
      ON users.id = posts.created_by_user_id
    ORDER BY posts.created_at DESC
  `;

  const { rows } = await pool.query(query);

  return rows;
}

async function createPost({ title, body, userId }) {
  const query = `
    INSERT INTO posts (
      title,
      body,
      created_by_user_id
    )
    VALUES ($1, $2, $3)
    RETURNING id, title, body, created_by_user_id, created_at
  `;

  const values = [title, body, userId];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

module.exports = {
  getAllPosts,
  createPost,
};
