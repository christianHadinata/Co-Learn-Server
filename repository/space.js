import pool from "../db/db.js";

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
  { space_title, space_description, learning_space_prerequisites }
) => {
  // query ke db
  const queryText = `
    INSERT INTO
        Learning_Spaces(space_title, space_description, learning_space_prerequisites)
    VALUES
        ($1, $2, $3)
    RETURNING
        learning_space_id
    `;
  // value user_name,user_email, user_password
  const values = [space_title, space_description, learning_space_prerequisites];

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

export const updatePhoto = async (
  client,
  { learning_space_id, space_photo_url }
) => {
  const queryText = `
    UPDATE
        Learning_Spaces
    SET
        space_photo_url = $1
    WHERE
        learning_space_id = $2
    `;

  const values = [learning_space_id, space_photo_url];

  const queryResult = await client.query(queryText, values);

  return queryResult.rowCount > 0;
};
