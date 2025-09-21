import pool from "../db/db.js";

// mendapatkan semua space
export const getAllSpaces = async () => {
  //query ke db
  const queryText = `
    SELECT
        s.learning_space_id,
        s.space_title,
        s.space_photo_url,
        s.space_description,
        s.created_at,
        s.last_updated_at,
        COUNT(lsm.user_id) AS member_count
    FROM
        Learning_Spaces s
    LEFT JOIN
        Learning_Space_Member lsm
        ON s.learning_space_id = lsm.learning_space_id
    GROUP BY
        s.learning_space_id
    ORDER BY
        s.created_at DESC;
    `;

  // execute query
  const queryResult = await pool.query(queryText);

  //result
  return queryResult.rows;
};

export const getSingleSpace = async (learning_space_id) => {
  const queryText = `
    SELECT
        s.learning_space_id,
        s.space_title,
        s.space_photo_url,
        s.space_description,
        s.created_at,
        s.last_updated_at,
        u.user_name AS creator
    FROM
        Learning_Spaces s
    LEFT JOIN
        Learning_Space_Member lsm
        ON s.learning_space_id = lsm.learning_space_id
    LEFT JOIN
        Users u
        ON s.user_id = u.user_id
    WHERE
        s.learning_space_id = $1
    `;

  const values = [learning_space_id];

  //execute query
  const queryResult = await pool.query(queryText, values);

  //result
  return queryResult.rows[0];
};

export const getPrerequisites = async (learning_space_id) => {
  const queryText = `
  SELECT
    t.tag_name
  FROM
    Learning_Space_Prerequisites lsp
  JOIN
    Tags t
  ON
    lsp.tag_id = t.tag_id
  WHERE
    lsp.learning_space_id = $1;
  `;

  const values = [learning_space_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows.map((row) => row.tag_name);
};

export const getRelatedSpaces = async (learning_space_id) => {
  const queryText = `
    SELECT
      lsp2.learning_space_id,
      ls.space_title,
      ls.space_photo_url,
      ls.last_updated_at,
      COUNT(lsp2.tag_id) AS matching_tag_count,
      COUNT(lsm.user_id) AS member_count
    FROM
      Learning_Space_Prerequisites lsp1
    JOIN
      Learning_Space_Prerequisites lsp2 
      ON lsp1.tag_id = lsp2.tag_id
    JOIN
      Learning_Spaces ls 
      ON lsp2.learning_space_id = ls.learning_space_id
    LEFT JOIN
      Learning_Space_Member lsm
      ON lsp2.learning_space_id = lsm.learning_space_id
    WHERE
      lsp1.learning_space_id = $1
      AND lsp2.learning_space_id != $1
    GROUP BY
      lsp2.learning_space_id, ls.space_title, ls.space_photo_url, ls.last_updated_at
    ORDER BY
      matching_tag_count DESC
    LIMIT 5;
  `;
  const values = [learning_space_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows;
};

// Mendapatkan space berdasarkan space_title
export const getSingleSpaceByTitle = async (space_title) => {
  //  query ke db
  const queryText = `
    SELECT
        s.learning_space_id,
        s.space_title,
        s.space_photo_url,
        s.space_description,
        s.created_at,
        s.last_updated_at,
        s.user_id
    FROM
        Learning_Spaces s
    WHERE 
        s.space_title = $1
    `;

  const values = [space_title];

  //  execute query
  const queryResult = await pool.query(queryText, values);

  //  result
  return queryResult;
  // return queryResult.rows[0];
};

export const insertSpace = async (
  client,
  { space_title, space_photo_url, space_description, user_id }
) => {
  // query ke db
  const queryText = `
    INSERT INTO
        Learning_Spaces(space_title, space_photo_url, space_description, user_id)
    VALUES
        ($1, $2, $3, $4)
    RETURNING
        learning_space_id
    `;
  // value user_name,user_email, user_password
  const values = [space_title, space_photo_url, space_description, user_id];

  // execute query
  const queryResult = await client.query(queryText, values);

  // result
  return queryResult;
};

export const insertSpaceTag = async (client, { learning_space_id, tag_id }) => {
  const queryText = `
  INSERT INTO
    Learning_Space_Prerequisites(learning_space_id, tag_id)
  VALUES
    ($1, $2)
  `;

  const values = [learning_space_id, tag_id];

  const queryResult = await client.query(queryText, values);

  return queryResult.rowCount > 0;
};

export const getTagIdByName = async (client, tagName) => {
  const queryText = `
  SELECT
    t.tag_id
  FROM
    Tags t
  WHERE
    t.tag_name = $1
  `;

  const values = [tagName];

  const queryResult = await client.query(queryText, values);

  return queryResult.rows[0];
};

export const insertTags = async (client, { tag_name }) => {
  const queryText = `
  INSERT INTO
    Tags(tag_name)
  VALUES
    ($1)
  RETURNING
    tag_id
  `;

  const values = [tag_name];

  const queryResult = await client.query(queryText, values);

  return queryResult.rows[0].tag_id;
};
