import { getSingleSpace } from "../controllers/space.js";
import pool from "../db/db.js";


// mendapatkan semua space
export const getAllSpaces = async () => {
    //query ke db
    const queryText = `
    SELECT
        s.space_id,
        s.space.title,
        s.space_description,
        s.last_updated_at,
        s.space_photo_url
    FROM
        Learning_Spaces s
    LEFT JOIN
        Learning_Space_Member lsm
        ON s.space_id = lsm.space_id
    GROUP BY
        s.space_id,
        s.space_title,
        s.space_description,
        s.last_updated_at,
        s.space_photo_url
    `;

    // execute query
    const queryResult = await pool.query(queryText);

    //result
    return queryResult;
};

export const getSingleSpace = async (learning_space_id) => {
    const queryText = `
    SELECT
        s.space_id,
        s.space_title,
        s.space_description,
        s.last_updated_at,
        s.space_photo_url
    FROM
        Learning_Spaces s
    LEFT JOIN
        Learning_Space_Member lsm
        ON s.space_id = lsm.space_id
    WHERE
        s.space_id = $1
    `

    const values = [learning_space_id];

    //execute query
    const queryResult = await pool.query(queryText, values);

    //result
    return queryResult;

}