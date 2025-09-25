import pool from "../db/db.js";
import { BadRequestError } from "../errors/badRequestError.js";
import * as postRepo from "../repository/post.js";

export const createPost = async (post_title, post_body) => {
  const result = await postRepo.getRelatedSpaces(post_title, post_body);

  return result;
};

export const getSinglePost = async (post_id) => {
  const queryResult = await userRepo.getSinglePostById(post_id);
  const data = queryResult.rows[0];

  const result = {
    post_id: data.post_id,
    post_title: data.post_title,
    post_body: data.post_body,
    created_at: data.created_at,
    learning_space_id: data.learning_space_id,
    user_id: data.user_id,
  };
  console.log(result);

  return result;
};
