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

export const getSinglePostById = async ({ post_id, user_id }) => {
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
        u.user_photo_url,
        SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END) AS upvote_count,
        SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END) AS downvote_count,
        pv_user.vote_type AS current_user_vote_type
    FROM
        Learning_Space_Posts lsp
    JOIN
        Users u
    ON
        lsp.user_id = u.user_id
    LEFT JOIN
        Post_Votes pv
    ON
      lsp.post_id = pv.post_id
    LEFT JOIN 
        Post_Votes pv_user
        ON lsp.post_id = pv_user.post_id 
        AND pv_user.user_id = $2
    WHERE 
        lsp.post_id = $1
    GROUP BY
      lsp.post_id, lsp.post_title, lsp.post_body, lsp.created_at, lsp.learning_space_id, lsp.user_id, u.user_name, u.user_photo_url, pv_user.vote_type;
    `;

  const values = [post_id, user_id];

  //  execute query
  const queryResult = await pool.query(queryText, values);

  //  result
  return queryResult;
};

export const createComment = async (
  client,
  { post_id, user_id, comment_body }
) => {
  const queryText = `
  INSERT INTO
    Post_Comments(post_id, user_id, comment_body)
  VALUES
    ($1, $2, $3)
  RETURNING
    comment_id
  `;

  const values = [post_id, user_id, comment_body];

  const queryResult = await client.query(queryText, values);

  return queryResult.rows[0].comment_id;
};

export const getAllComments = async ({ post_id, user_id }) => {
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
        SUM(CASE WHEN cv.vote_type = 'downvote' THEN 1 ELSE 0 END) AS downvote_count,
        cv_user.vote_type AS current_user_vote_type
    FROM
        Post_Comments c
    JOIN
        Users u
        ON c.user_id = u.user_id
    LEFT JOIN
        Comment_Votes cv ON c.comment_id = cv.comment_id
    LEFT JOIN 
        Comment_Votes cv_user 
        ON c.comment_id = cv_user.comment_id 
        AND cv_user.user_id = $2
    WHERE
        c.post_id = $1
    GROUP BY
      c.comment_id, c.user_id, c.comment_body, c.created_at, u.user_name, u.user_photo_url, cv_user.vote_type
    ORDER BY
        c.created_at DESC;
    `;

  const values = [post_id, user_id];

  // execute query
  const queryResult = await pool.query(queryText, values);

  //result
  return queryResult.rows;
};

export const getFullCommentDetails = async (client, comment_id) => {
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
            c.comment_id = $1
        GROUP BY 
            c.comment_id, c.user_id, c.comment_body, c.created_at, u.user_name, u.user_photo_url
    `;
  const queryResult = await client.query(queryText, [comment_id]);
  return queryResult.rows[0];
};

export const getUserVoteOnPost = async ({ post_id, user_id }) => {
  const queryText = `
  SELECT
    pv.vote_type
  FROM
    Post_Votes pv
  WHERE
    post_id = $1 AND user_id = $2
  `;
  const values = [post_id, user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows[0];
};

export const upsertPostVote = async ({ post_id, user_id, vote_type }) => {
  const queryText = `
  INSERT INTO Post_Votes (post_id, user_id, vote_type)
  VALUES ($1, $2, $3)
  ON CONFLICT (post_id, user_id) DO UPDATE SET vote_type = EXCLUDED.vote_type
  RETURNING *
  `;
  const values = [post_id, user_id, vote_type];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
};

export const removePostVote = async ({ post_id, user_id }) => {
  const queryText = `
  DELETE FROM
    Post_Votes
  WHERE
    post_id = $1 AND user_id = $2
  `;
  const values = [post_id, user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rowCount > 0;
};

export const getUserVoteOnComment = async ({ comment_id, user_id }) => {
  const queryText = `
  SELECT
    cv.vote_type
  FROM
    Comment_Votes cv
  WHERE
    comment_id = $1 AND user_id = $2
  `;
  const values = [comment_id, user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows[0];
};

export const upsertCommentVote = async ({ comment_id, user_id, vote_type }) => {
  const queryText = `
  INSERT INTO Comment_Votes (comment_id, user_id, vote_type)
  VALUES ($1, $2, $3)
  ON CONFLICT (comment_id, user_id) DO UPDATE SET vote_type = EXCLUDED.vote_type
  RETURNING *
  `;

  const values = [comment_id, user_id, vote_type];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
};

export const removeCommentVote = async ({ comment_id, user_id }) => {
  const queryText = `
  DELETE FROM
    Comment_Votes
  WHERE
    comment_id = $1 AND user_id = $2
  `;
  const values = [comment_id, user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rowCount > 0;
};

// annotations
export const getAnnotations = async ({ post_id, user_id }) => {
  const queryText = `
  SELECT
    a.annotation_id,
    a.post_id,
    a.highlighted_text,
    a.annotation_text,
    a.start_index,
    a.end_index,
    a.created_at,
    u.user_id,
    u.user_name,
    u.user_photo_url
  FROM
    annotations a
  JOIN
    Users u ON a.user_id = u.user_id
  WHERE
    a.post_id = $1 AND a.user_id = $2
  ORDER BY
    a.created_at ASC;
  `;
  const values = [post_id, user_id];

  const result = await pool.query(queryText, values);
  return result.rows;
};

export const createAnnotations = async ({
  post_id,
  user_id,
  highlighted_text,
  annotation_text,
  start_index,
  end_index,
}) => {
  const queryText = `
  INSERT INTO 
    annotations (post_id, user_id, highlighted_text, annotation_text, start_index, end_index)
  VALUES 
    ($1, $2, $3, $4, $5, $6)
  RETURNING 
    *;
  `;

  const values = [
    post_id,
    user_id,
    highlighted_text,
    annotation_text,
    start_index,
    end_index,
  ];

  const result = await pool.query(queryText, values);
  return result.rows[0];
};
