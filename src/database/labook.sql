-- Active: 1694733332952@@127.0.0.1@3306



CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(6) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);
DROP TABLE users;

CREATE TABLE IF NOT EXISTS posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);

DROP TABLE posts;

CREATE TABLE IF NOT EXISTS likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO users(id, name, email, password, role)
VALUES  ('u001', 'Ana Catarina', 'titi@gmail.com', 'titi123!', 'ADMIN'),
        ('u002', 'Gabo Gabolino', 'gabo@gmail.com', 'gabo123!', 'USER');


INSERT INTO posts(id, creator_id, content, likes, dislikes)
VALUES ('4d2dd78a-2159-4edd-84a2-f86b0c879286', 'u001', 'This is the content of the post.', 0, 0);


DROP TABLE likes_dislikes;
DROP TABLE posts;
DROP TABLE users;

UPDATE users
SET role = 'ADMIN'
WHERE id = '4087224b-9127-4761-9ab6-3cda9b0742fb';

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES ('u001', '4d2dd78a-2159-4edd-84a2-f86b0c879286', 1); -- User 'u001' liked the post

UPDATE posts
SET likes = 1
WHERE id = '4d2dd78a-2159-4edd-84a2-f86b0c879286';