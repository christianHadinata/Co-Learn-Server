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

export const getSinglePost = async ({ post_id, user_id }) => {
  const queryResult = await postRepo.getSinglePostById({ post_id, user_id });
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
    upvote_count: data.upvote_count,
    downvote_count: data.downvote_count,
    current_user_vote_type: data.current_user_vote_type,
  };
  console.log(result);

  return result;
};

export const createComment = async ({ post_id, user_id, comment_body }) => {
  const client = await pool.connect();

  console.log({ post_id, user_id, comment_body });

  try {
    await client.query("BEGIN");
    const comment_id = await postRepo.createComment(client, {
      post_id,
      user_id,
      comment_body,
    });

    const result = await postRepo.getFullCommentDetails(client, comment_id);

    console.log(result);

    await client.query("COMMIT");
    return result;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllComments = async ({ post_id, user_id }) => {
  const result = await postRepo.getAllComments({ post_id, user_id });
  console.log(result);

  return result;
};

export const insertPostVote = async ({ post_id, user_id, vote_type }) => {
  const vote = await postRepo.getUserVoteOnPost({ post_id, user_id });

  if (vote) {
    if (vote.vote_type === vote_type) {
      // User menghapus vote yang sama
      const result = await postRepo.removePostVote({ post_id, user_id });
      console.log(result);
      return { message: "Vote removed." };
    } else {
      // User ganti vote (upsert)
      const result = await postRepo.upsertPostVote({
        post_id,
        user_id,
        vote_type,
      });
      console.log(result);
      return { message: "Vote updated." };
    }
  } else {
    // user insert new vote (upsert)
    const result = await postRepo.upsertPostVote({
      post_id,
      user_id,
      vote_type,
    });
    console.log(result);
    return { message: "Vote added." };
  }
};

export const insertCommentVote = async ({ comment_id, user_id, vote_type }) => {
  const vote = await postRepo.getUserVoteOnComment({ comment_id, user_id });

  if (vote) {
    if (vote.vote_type === vote_type) {
      // User menghapus vote yang sama
      const result = await postRepo.removeCommentVote({ comment_id, user_id });
      console.log(result);
      return { message: "Vote removed." };
    } else {
      // User ganti vote
      const result = await postRepo.upsertCommentVote({
        comment_id,
        user_id,
        vote_type,
      });
      console.log(result);
      return { message: "Vote updated." };
    }
  } else {
    // user insert new vote
    const result = await postRepo.upsertCommentVote({
      comment_id,
      user_id,
      vote_type,
    });
    console.log(result);
    return { message: "Vote added." };
  }
};
