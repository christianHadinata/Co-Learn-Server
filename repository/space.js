import { getSingleSpace } from "../controllers/space.js";
import pool from "../db/db.js";

// mendapatkan semua space
export const getAllSpaces = async () => {
  //query ke db
  const queryText = `
    SELECT
        s.learning_space_id,
        s.space.title,
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
        s.learning_space_id,
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
        u.user_name
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
  return queryResult;
};
