import userRepo from "../repository/user.js";

export const getSingleUser = async(user_email) => {
    const queryResult = await userRepo.getSingleUserByEmail(user_email);
    const tagsResult = await userRepo.getTagsByUser(user_id)
    const data = queryResult.rows[0];


    const result = {
        user_id: data.user_id,
        user_email: data.user_email,
        user_name: data.user_name,
        user_biography: data.user_biography,
        user_country: data.user_country,
        user_photo_url: data.user_photo_url,
    }

    return result;
}

export const updateUserProfile = async({
    user_id,
    user_name,
    user_biography,
    user_country,
    user_interests,
}) => {
    const client = await pool.connect();

    try{
        await client.query("BEGIN");
        await userRepo.updateUserProfile(client, {
            user_id,
            user_name,
            user_biography,
            user_country,
            user_interests,
        });

        await client.query ("COMMIT");

    }catch(error){
        console.log(error);
        await client.query("ROLLBACK");

    }finally{
        client.release();
    }
}

export const updatePhoto = async({user_id, user_photo_url}) => {
    const client = await pool.connect();

    try{
        await client.query("BEGIN");
        await userRepo.updatePhoto(client, {user_id, user_photo_url});

        await client.query ("COMMIT");
        return true;

    }catch(error){
        console.log(error);
        await client.query("ROLLBACK");

    }finally{
        client.release();
    }
};