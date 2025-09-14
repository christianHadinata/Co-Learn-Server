import pool from "../db/db.js";

// Mendapatkan  email  user berdasarkan user_email
export const getSingleUserByEmail = async (user_email) => {
  //  query ke db
  const queryText = `
    SELECT
        u.user_id,    
        u.user_email,
        u.user_password,
        u.user_name,
        u.user_role,
        u.user_biography,
        u.user_country,
        u.user_photo_url
    FROM
        Users u
    WHERE 
        u.user_email = $1
    `;

  const values = [user_email];

  //  execute query
  const queryResult = await pool.query(queryText, values);

  //  result
  return queryResult;
  // return queryResult.rows[0];
};

// insert user saat register
export const insertUser = async (
  client,
  { user_name, user_email, user_password }
) => {
  // query ke db
  const queryText = `
    INSERT INTO
        Users(user_name, user_email, user_password)
    VALUES
        ($1, $2, $3)
    RETURNING
        user_id
    `;
  // value user_name,user_email, user_password
  const values = [user_name, user_email, user_password];

  // execute query
  const queryResult = await client.query(queryText, values);

  // result
  return queryResult;
};

export const updateUserProfile = async (
  client,
  { user_id, user_name, user_biography, user_country }
) => {
  console.log({ user_id, user_name, user_biography, user_country });
  const queryText = `
        UPDATE
            Users
        SET
            user_name = $1,
            user_biography = $2,
            user_country = $3
        WHERE
            user_id = $4
        `;

  const values = [user_name, user_biography, user_country, user_id];

  const queryResult = await client.query(queryText, values);

  return queryResult.rowCount > 0;
};

export const deleteUserInterests = async (client, user_id) => {
  const queryText = `
  DELETE FROM 
    User_Interests
  WHERE
    user_id = $1
  `;

  const values = [user_id];

  await client.query(queryText, values);
};

export const insertUserInterest = async (client, { user_id, tag_id }) => {
  const queryText = `
  INSERT INTO
    User_Interests(user_id, tag_id)
  VALUES
    ($1, $2)
  `;

  const values = [user_id, tag_id];

  const queryResult = await client.query(queryText, values);

  return queryResult.rowCount > 0;
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

export const getTagsByUser = async (user_id) => {
  const queryText = `
    SELECT
        t.tag_name
    FROM
        User_interests ui
    JOIN
        Tags t
    ON
        ui.tag_id = t.tag_id
    WHERE
        ui.user_id = $1
    `;

  const values = [user_id];

  const queryResult = await pool.query(queryText, values);

  return queryResult.rows.map((row) => row.tag_name);
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

export const updatePhoto = async (client, { user_id, user_photo_url }) => {
  const queryText = `
    UPDATE
        Users
    SET
        user_photo_url = $1
    WHERE
        user_id = $2
    `;

  const values = [user_photo_url, user_id];

  const queryResult = await client.query(queryText, values);

  return queryResult.rowCount > 0;
};
