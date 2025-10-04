import pool from "../db/db.js";

export const createPost = async ({
  post_title,
  post_body,
  learning_space_id,
  user_id,
}) => {
  const queryText = `
  INSERT INTO
    Learning_Space_Posts(post_title, post_body, learning_space_id, user_id)
  VALUES
    ($1, $2, $3, $4)
  RETURNING
    *
  `;

  const values = [post_title, post_body, learning_space_id, user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows[0];
};

export const updateLastUpdateLearningSpace = async (learning_space_id) => {
  const queryText = `
  UPDATE
    Learning_Spaces
  SET
    last_updated_at = NOW()
  WHERE
    learning_space_id = $1
  `;

  const values = [learning_space_id];

  await pool.query(queryText, values);
};

export const getSinglePostById = async (post_id) => {
  //  query ke db
  const queryText = `
    SELECT
        lsp.post_id,    
        lsp.post_title,
        lsp.post_body,
        lsp.created_at, 
        lsp.learning_space_id,
        lsp.user_id,
        u.user_name,
        u.user_photo_url
    FROM
        Learning_Space_Posts lsp
    JOIN
        Users u
    ON
        lsp.user_id = u.user_id
    WHERE 
        lsp.post_id = $1
    `;

  const values = [post_id];

  //  execute query
  const queryResult = await pool.query(queryText, values);

  //  result
  return queryResult;
};

export const getPostVotes = async (post_id) => {
  const queryText = `
  SELECT
    (SELECT COUNT(*) FROM Post_Votes WHERE post_id = $1 AND vote_type = 'upvote') AS upvotes,
    (SELECT COUNT(*) FROM Post_Votes WHERE post_id = $1 AND vote_type = 'downvote') AS downvotes
  FROM
    Post_Votes
  WHERE
    post_id = $1
  `
  const values = [post_id];
  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
};

export const insertPostVote = async ({ post_id, user_id, vote_type }) => {
  const queryText = `
  INSERT INTO Post_Votes (post_id, user_id, vote_type)
  VALUES ($1, $2, $3)
  ON CONFLICT (post_id, user_id) DO UPDATE SET vote_type = EXCLUDED.vote_type
  RETURNING *
  `
  const values = [post_id, user_id, vote_type];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
}

export const getCommentVotes = async (comment_id) => {
  const queryText = `
  SELECT
    (SELECT COUNT(*) FROM Comment_Votes CV WHERE CV.comment_id = $1 AND CV.vote_type = 'upvote') AS upvotes,
    (SELECT COUNT(*) FROM Comment_Votes CV WHERE CV.comment_id = $1 AND CV.vote_type = 'downvote') AS downvotes
  FROM
    Comment_Votes CV
  WHERE
    CV.comment_id = $1
  `

  const values = [comment_id];
  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
}

export const insertCommentVote = async ({ comment_id, user_id, vote_type }) => {
  const queryText = `
  INSERT INTO Comment_Votes (comment_id, user_id, vote_type)
  VALUES ($1, $2, $3)
  ON CONFLICT (comment_id, user_id) DO UPDATE SET vote_type = EXCLUDED.vote_type
  RETURNING *
  `

  const values = [comment_id, user_id, vote_type];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
}