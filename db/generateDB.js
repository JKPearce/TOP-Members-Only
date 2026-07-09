require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  username VARCHAR(12) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_member BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users 
  (first_name, last_name, username, email, password_hash, is_member, is_admin)
VALUES
  ('John', 'Member', 'johnmember', 'john@example.com', 'hashed_password_placeholder', true, false),
  ('Jane', 'Member', 'janemember', 'jane@example.com', 'hashed_password_placeholder', true, false),
  ('Bob', 'Visitor', 'bobvisitor', 'bob@example.com', 'hashed_password_placeholder', false, false);

INSERT INTO posts 
  (title, body, created_by_user_id)
VALUES
  ('Welcome to the club', 'This is the first members only post.', 1),
  ('Members only gossip', 'The secret passcode is definitely not taped under the keyboard.', 2),
  ('Outside looking in', 'I am not a member yet, but I can still post.', 3);
`;

async function main() {
  console.log("Seeding database...");

  const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.end();
  }
}

main();
