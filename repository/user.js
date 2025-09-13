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
    `

    const values = [user_email];

    //  execute query
    const queryResult = await pool.query(queryText, values);

    //  result
    return queryResult;
    // return queryResult.rows[0];
}

// insert user saat register
export const insertUser = async (
    client,
    { user_name, user_email, user_password }) => {
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
}