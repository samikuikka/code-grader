CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    exercise TEXT NOT NULL,
    successful BOOLEAN NOT NULL,
    username TEXT NOT NULL
);