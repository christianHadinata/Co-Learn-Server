import * as spaceRepo from "../repository/space.js";
import pool from "../db/db.js";

export const getAllSpaces = async () => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await spaceRepo.getAllSpaces(client);

        if (!result) {
            throw new Error("No learning spaces created");
        }

        await client.query("COMMIT");
        return result.rows;

    } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const getSingleSpace = async (learning_space_id) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await spaceRepo.getSingleSpace(learning_space_id);
        if (!result) {
            throw new Error("Learning space not found");
        }

        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}