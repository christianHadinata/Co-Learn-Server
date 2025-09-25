import * as postService from "../services/post.js";
import { BadRequestError } from "../errors/badRequestError.js";

export const createPost = async (req, res) => {
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
    const result = await spaceService.getSinglePost(post_id);
    if (!result) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
