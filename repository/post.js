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

export const createComment = async ({ post_id, user_id, comment_body }) => {
  const queryText = `
  INSERT INTO
    Post_Comments(post_id, user_id, comment_body)
  VALUES
    ($1, $2, $3)
  RETURNING
    *
  `;

  const values = [post_id, user_id, comment_body];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows[0];
};

export const getAllComments = async (post_id) => {
  //query ke db
  const queryText = `
    SELECT
        c.comment_id,
        c.user_id,
        c.comment_body,
        c.created_at,
        u.user_name,
        u.user_photo_url,
        SUM(CASE WHEN cv.vote_type = 'upvote' THEN 1 ELSE 0 END) AS upvote_count,
        SUM(CASE WHEN cv.vote_type = 'downvote' THEN 1 ELSE 0 END) AS downvote_count
    FROM
        Post_Comments c
    JOIN
        Users u
        ON c.user_id = u.user_id
    LEFT JOIN
        Comment_Votes cv ON c.comment_id = cv.comment_id
    WHERE
        c.post_id = $1
    GROUP BY
      c.comment_id, c.user_id, u.user_name, u.user_photo_url
    ORDER BY
        c.created_at DESC;
    `;

  const values = [post_id];

  // execute query
  const queryResult = await pool.query(queryText, values);

  //result
  return queryResult.rows;
};
