export const getSingleUserByEmail = async(user_email) => {
    const queryText = `
        SELECT
            u.user_id,
            u.user_email,
            u.user_password,
            u.user_name,
            u.user_role,
            u.user_biography,
            u.user_country,
            u.user_photo_url,
        FROM
            Users u
        WHERE
            u.user_email = $1
        `;
    const values = [user_email];

    const queryResult = await pool.query(queryText, values);

    return queryResult;
}

export const updateUserProfile = async(client, {
        user_id,
        user_name,
        user_biography,
        user_country,
        user_interests,
    }) => {
        const queryText = `
        UPDATE
            Users
        SET
            user_name = $1,
            user_biography = $2,
            user_country = $3,
        WHERE
            user_id = $4
        `;

        const values = [user_name, user_biography, user_country, user_id];

        const queryResult = await client.query(queryText, values);

        return queryResult.rowCount > 0;
    }

export const getTagsByUser = async(user_id) => {
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

    const values = {user_id};

    const queryResult = await pool.query(queryText, values);

    return queryResult.rows.map((row) => row.tag_name);
}

export const updatePhoto = async (client, {user_id, user_photo_url}) => {
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
}