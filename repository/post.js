import pool from "../db/db.js";

export const createPost = async (post_title, post_body) => {
  const queryText = `
  INSERT INTO
    Learning_Space_Posts(post_title, post_body)
  VALUES
    ($1, $2)
  RETURNING
    post_id
  `;

  const values = [post_title, post_body];

  const queryResult = await client.query(queryText, values);

  return queryResult.rows[0].post_id;
};

export const getSinglePostById = async (user_email) => {
  //  query ke db
  const queryText = `
    SELECT
        p.post_id,    
        p.post_title,
        p.post_body,
        p.created_at, 
        p.learning_space_id,
        p.user_id
    FROM
        Learning_Space_Posts p
    WHERE 
        p.post_id = $1
    `;

  const values = [post_id];

  //  execute query
  const queryResult = await pool.query(queryText, values);

  //  result
  return queryResult;
  // return queryResult.rows[0];
};
