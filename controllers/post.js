import * as postService from "../services/post.js";
import { BadRequestError } from "../errors/badRequestError.js";

export const createPost = async (req, res) => {
  const { user_id } = req.user;
  const { learning_space_id } = req.params;
  const { post_title, post_body } = req.body;

  if (!post_title) {
    throw new BadRequestError("Post title cannot be empty.");
  }

  if (!post_body) {
    throw new BadRequestError("Post cannot be empty.");
  }

  try {
    const result = await postService.createPost({
      post_title,
      post_body,
      learning_space_id,
      user_id,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    //request parameter id space yang terpilih
    const { post_id } = req.params;
    const user_id = req.user ? req.user.user_id : null;

    // panggil service
    const result = await postService.getSinglePost({ post_id, user_id });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found." });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createComment = async (req, res) => {
  const { user_id } = req.user;
  const { post_id } = req.params;
  const { comment_body } = req.body;

  console.log({ post_id, user_id, comment_body });

  if (!comment_body) {
    throw new BadRequestError("Comment cannot be empty.");
  }

  try {
    const result = await postService.createComment({
      post_id,
      user_id,
      comment_body,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    //request parameter id space yang terpilih
    const { post_id } = req.params;
    const user_id = req.user ? req.user.user_id : null;

    // panggil service
    const result = await postService.getAllComments({
      post_id,
      user_id,
    });
    if (!result) {
      return res
        .status(200)
        .json({ success: true, message: "No Comment Here." });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const insertPostVote = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = req.user;
    const { vote_type } = req.body;

    if (!["upvote", "downvote"].includes(vote_type)) {
      throw new BadRequestError("Vote type must be 'upvote' or 'downvote'.");
    }

    const result = await postService.insertPostVote({
      post_id,
      user_id,
      vote_type,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const insertCommentVote = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { user_id } = req.user;
    const { vote_type } = req.body;

    console.log({ comment_id, user_id, vote_type });
    if (!["upvote", "downvote"].includes(vote_type)) {
      throw new BadRequestError("Vote type must be 'upvote' or 'downvote'.");
    }
    const result = await postService.insertCommentVote({
      comment_id,
      user_id,
      vote_type,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Annotations
export const getAnnotations = async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.user;

  try {
    const annotations = await postService.getAnnotations({ post_id, user_id });

    res.status(200).json({
      message: "Annotations retrieved successfully.",
      data: annotations,
    });
  } catch (error) {
    console.error("Error fetching annotations:", error);
    res.status(500).json({ message: "Failed to retrieve annotations." });
  }
};

export const createAnnotations = async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.user;
  const { highlighted_text, annotation_text, start_index, end_index } =
    req.body;

  console.log({ highlighted_text, annotation_text, start_index, end_index });
  if (!highlighted_text || !start_index || end_index === undefined) {
    return res
      .status(400)
      .json({ message: "Highlighted text and index are required." });
  }

  try {
    const newAnnotation = await postService.createAnnotations({
      post_id,
      user_id,
      highlighted_text,
      annotation_text,
      start_index,
      end_index,
    });
    res.status(201).json({
      message: "Annotation added successfully.",
      data: newAnnotation,
    });
  } catch (error) {
    console.error("Error adding annotation:", error);
    res.status(500).json({ message: "Failed to add annotation." });
  }
};
