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
    await client.query("BEGIN");
    //  cek email apakah sudah  ada di  db atau belum
    const getUserByEmailResult = await userRepo.getSingleUserByEmail(
      user_email
    );

    // console.log(getUserByEmailResult.rows[0].user_password);

    if (getUserByEmailResult.rowCount !== 0) {
      // if (getUserByEmailResult.rows.length > 0) {
      console.log("err");
      throw new BadRequestError("Email is already in  use");
    }

    console.log("password proceed  to be hashed");
    // console.log("Service received password:", user_password);
    const hashedPassword = await hashPassword(user_password);

    // repo
    const result = await userRepo.insertUser(client, {
      user_name,
      user_email,
      user_password: hashedPassword,
    });

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const login = async ({ user_email, user_password }) => {
  const queryResult = await userRepo.getSingleUserByEmail(user_email);
  const dataUser = queryResult.rows[0];
  if (!dataUser) {
    throw new BadRequestError("Email or Password is invalid");
  }

  const isPasswordMatch = await bcrypt.compare(
    user_password,
    dataUser.user_password
  );

  if (!isPasswordMatch) {
    throw new UnauthorizedError("Email or Password is invalid");
  }

  const token = jwt.sign(
    {
      user_id: dataUser.user_id,
      user_email: dataUser.user_email,
      user_name: dataUser.user_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );

  return token;
};

export const getSingleUser = async (user_email) => {
  const queryResult = await userRepo.getSingleUserByEmail(user_email);
  const tagsResult = await userRepo.getTagsByUser(user_id);
  const data = queryResult.rows[0];

  const result = {
    user_id: data.user_id,
    user_email: data.user_email,
    user_name: data.user_name,
    user_biography: data.user_biography,
    user_country: data.user_country,
    user_photo_url: data.user_photo_url,
    user_interests: tagsResult,
  };

  return result;
};

export const updateUserProfile = async ({
  user_id,
  user_name,
  user_biography,
  user_country,
  user_interests,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await userRepo.updateUserProfile(client, {
      user_id,
      user_name,
      user_biography,
      user_country,
    });

    await userRepo.deleteUserInterests(client, user_id);

    for (tagName of user_interests) {
      // Cek udah ada belum di tabel Tags yang tag_name nya == tagName

      const existingId = await userRepo.getTagIdByName(client, tagName);

      if (existingId) {
        await userRepo.insertUserInterest(client, {
          user_id,
          tag_id: existingId,
        });
      } else {
        const newTagId = await userRepo.insertTags(client, {
          tag_name: tagName,
        });

        await userRepo.insertUserInterest(client, {
          user_id,
          tag_id: newTagId,
        });
      }
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

export const updatePhoto = async ({ user_id, user_photo_url }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await userRepo.updatePhoto(client, { user_id, user_photo_url });

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};
