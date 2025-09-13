import bcrypt from "bcryptjs/dist/bcrypt.js";
import pool from "../db/db.js";
import { BadRequestError } from "../errors/badRequestError.js";
import * as userRepo from "../repository/user.js";
import { hashPassword } from "../utils/hashPassword.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken";

// import dotenv from "dotenv";

export const register = async ({ user_name, user_email, user_password }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        //  cek email apakah sudah  ada di  db atau belum
        const getUserByEmailResult = await userRepo.getSingleUserByEmail(
            user_email
        );

        // console.log(getUserByEmailResult.rows[0].user_password);

        if (getUserByEmailResult.rowCount !== 0) {
            // if (getUserByEmailResult.rows.length > 0) {
            console.log("err");
            throw new BadRequestError('Email  is already in  use');
        }

        console.log("password proceed  to be hashed");
        // console.log("Service received password:", user_password);
        const hashedPassword = await hashPassword(user_password);


        // repo
        const result = await userRepo.insertUser(client, {
            user_name,
            user_email,
            user_password: hashedPassword
        });

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        // throw error;
    } finally {
        client.release();
    }
}

export const login = async ({ user_email, user_password }) => {

    const queryResult = await userRepo.getSingleUserByEmail(user_email);
    const dataUser = queryResult.rows[0];
    // console.log(dataUser);

    const isPasswordMatch = await bcrypt.compare(
        user_password,
        dataUser.user_password
    );

    if (!isPasswordMatch) {
        throw new UnauthorizedError('Email or Password is invalid');
    }

    const token = jwt.sign({
        user_id: dataUser.user_id,
        user_email: dataUser.user_email,
        user_name: dataUser.user_name
    }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );

    return token;
}