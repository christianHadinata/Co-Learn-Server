import * as spaceRepo from "../repository/space.js";
import pool from "../db/db.js";

export const getAllSpaces = async () => {
  const result = await spaceRepo.getAllSpaces();

  if (!result) {
    throw new Error("No learning spaces created");
  }

  return result.rows;
};

export const getSingleSpace = async (learning_space_id) => {
  const result = await spaceRepo.getSingleSpace(learning_space_id);
  if (!result) {
    throw new Error("Learning space not found");
  }

  return result.rows[0];
};
