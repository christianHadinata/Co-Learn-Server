import pool from "../db/db.js";
import { BadRequestError } from "../errors/badRequestError.js";
import * as postRepo from "../repository/post.js";

export const createPost = async ({
  post_title,
  post_body,
  learning_space_id,
  user_id,
}) => {
  const result = await postRepo.createPost({
    post_title,
    post_body,
    learning_space_id,
    user_id,
  });

  await postRepo.updateLastUpdateLearningSpace(learning_space_id);

  return result;
};

export const getSinglePost = async (post_id) => {
  const queryResult = await postRepo.getSinglePostById(post_id);
  const data = queryResult.rows[0];

  const result = {
    post_id: data.post_id,
    post_title: data.post_title,
    post_body: data.post_body,
    created_at: data.created_at,
    learning_space_id: data.learning_space_id,
    user_id: data.user_id,
    user_name: data.user_name,
    user_photo_url: data.user_photo_url,
  };
  console.log(result);

  return result;
};

export const createComment = async ({ post_id, user_id, comment_body }) => {
  const result = await postRepo.createComment({
    post_id,
    user_id,
    comment_body,
  });

  return result;
};

export const getAllComments = async (post_id) => {
  const result = await spaceRepo.getAllComments(post_id);
  console.log(result);

  if (!result) {
    throw new Error("No Comment Here");
  }

  return result;
};
