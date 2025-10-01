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

    // panggil service
    const result = await postService.getSinglePost(post_id);
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

    // panggil service
    const result = await postService.getAllComments(post_id);
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
