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

export const getPostVotes = async (post_id) => {

  const result = await postRepo.getPostVotes(post_id);

  // console.log(result);

  if (result.length === 0) {
    //upvotes dan downvotes
    return [{ upvotes: 0, downvotes: 0 }];
  }

  return result;
}

export const insertPostVote = async ({ post_id, user_id, vote_type }) => {
  if (vote_type !== "upvote" && vote_type !== "downvote") {
    throw new BadRequestError("Invalid vote type. Must be 'upvote' or 'downvote'.");
  }

  const vote = await postRepo.getUserVoteOnPost(post_id, user_id);

  if (vote) {
    if (vote.vote_type === vote_type) {
      // User menghapus vote yang sama
      const result = await postRepo.removePostVote(post_id, user_id);
      console.log(result);
      return { message: "Vote removed." };
    } else {
      // User ganti vote
      const result = await postRepo.updatePostVote(post_id, user_id, vote_type);
      console.log(result);
      return { message: "Vote updated." };
    }
  } else {
    // user insert new vote
    const result = await postRepo.insertPostVote(post_id, user_id, vote_type);
    console.log(result);
    return { message: "Vote added." };
  }
}

export const getCommentVotes = async (comment_id) => {

  const result = await postRepo.getCommentVotes(comment_id);
  // console.log(result);
  if (result.length === 0) {
    //upvotes dan downvotes
    return [{ upvotes: 0, downvotes: 0 }];
  }
  return result;
}

export const insertCommentVote = async ({ comment_id, user_id, vote_type }) => {
  if (vote_type !== "upvote" && vote_type !== "downvote") {
    throw new BadRequestError("Invalid vote type. Must be 'upvote' or 'downvote'.");
  }

  const vote = await postRepo.getUserVoteOnComment(comment_id, user_id);

  if (vote) {
    if (vote.vote_type === vote_type) {
      // User menghapus vote yang sama
      const result = await postRepo.removeCommentVote(comment_id, user_id);
      console.log(result);
      return { message: "Vote removed." };
    } else {
      // User ganti vote
      const result = await postRepo.updateCommentVote(comment_id, user_id, vote_type);
      console.log(result);
      return { message: "Vote updated." };
    }
  } else {
    // user insert new vote
    const result = await postRepo.insertCommentVote(comment_id, user_id, vote_type);
    console.log(result);
    return { message: "Vote added." };
  }
}