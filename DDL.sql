-- DDL

CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL, 
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL DEFAULT 'member',
  user_biography TEXT ,
  user_country VARCHAR(50),
  user_photo_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE Tags (
  tag_id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE User_Interests (
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  tag_id INT REFERENCES Tags(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, tag_id)
);

CREATE TABLE Learning_Spaces (
  learning_space_id SERIAL PRIMARY KEY,
  space_title VARCHAR(255) NOT NULL,
  space_photo_url VARCHAR(255) NOT NULL,
  space_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_updated_at TIMESTAMP DEFAULT NOW(),
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Learning_Space_Prerequisites (
  learning_space_id INT REFERENCES Learning_Spaces(learning_space_id) ON DELETE CASCADE,
  tag_id INT REFERENCES Tags(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (learning_space_id, tag_id)
);

CREATE TABLE Learning_Space_Member (
  learning_space_id INT REFERENCES Learning_Spaces(learning_space_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (learning_space_id, user_id)
);

CREATE TABLE Learning_Space_Visitors (
  learning_space_id INT REFERENCES Learning_Spaces(learning_space_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  visited_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (learning_space_id, user_id)
);

CREATE TABLE Learning_Space_Posts (
  post_id SERIAL PRIMARY KEY,
  post_title VARCHAR(255) NOT NULL,
  post_body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  learning_space_id INT REFERENCES Learning_Spaces(learning_space_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

CREATE TABLE Post_Votes (
  post_id INT REFERENCES Learning_Space_Posts(post_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  PRIMARY KEY(post_id, user_id)
);

CREATE TABLE Post_Comments (
  comment_id SERIAL PRIMARY KEY,
  post_id INT REFERENCES Learning_Space_Posts(post_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  comment_body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Comment_Votes (
  comment_id INT REFERENCES Post_Comments(comment_id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  PRIMARY KEY(comment_id, user_id)
);

CREATE TABLE annotations (
    annotation_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES Learning_Space_Posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    highlighted_text TEXT NOT NULL,
    annotation_text TEXT, -- ini isinya catetan user ttg annotation
    start_index INT NOT NULL,
    end_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

