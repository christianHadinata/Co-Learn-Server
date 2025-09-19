import pool from "../db/db.js";
import { BadRequestError } from "../errors/badRequestError.js";
import * as spaceRepo from "../repository/space.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken";

export const create_learning_space = async ({
  space_title,
  space_description,
  learning_space_prerequisites,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    //  cek space_title apakah sudah  ada di  db atau belum
    const getSpaceByTitleResult = await spaceRepo.getSingleSpaceByTitle(
      space_title
    );

    if (getSpaceByTitleResult.rowCount !== 0) {
      // if (getSpaceByTitleResult.rows.length > 0) {
      console.log("err");
      throw new BadRequestError("Title is already in  use");
    }

    // repo
    const result = await spaceRepo.insertSpace(client, {
      space_title,
      space_description,
    });

    const existingId = await spaceRepo.getTagIdByName(client, tagName);
    console.log(existingId);

    if (existingId) {
      await spaceRepo.insertSpaceTag(client, {
        learning_space_id,
        tag_id: existingId.tag_id,
      });
    } else {
      const newTagId = await spaceRepo.insertTags(client, {
        tag_name: tagName,
      });

      await spaceRepo.insertSpaceTag(client, {
        learning_space_id,
        tag_id: existingId.tag_id,
      });
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
};

export const setPhoto = async ({ user_id, space_photo_url }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await spaceRepo.setPhoto(client, { user_id, space_photo_url });

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};
