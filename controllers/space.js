import * as spaceService from "../services/space.js";
import { BadRequestError } from "../errors/badRequestError.js";

export const getAllSpaces = async (req, res) => {
  try {
    const result = await spaceService.getAllSpaces();

    if (!result) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getSingleSpace = async (req, res) => {
  try {
    //request parameter id space yang terpilih
    const { learning_space_id } = req.params;
    const user_id = req.user?.user_id;
    console.log("user_id: " + user_id);

    // panggil service
    const result = await spaceService.getSingleSpace(
      learning_space_id,
      user_id
    );

    console.log(result);
    if (!result) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createLearningSpace = async (req, res) => {
  const { user_id } = req.user;

  //nerima input dari textfield FE
  const { space_title, space_description } = req.body;

  let { learning_space_prerequisites } = req.body;

  learning_space_prerequisites = JSON.parse(learning_space_prerequisites);

  console.log({
    space_title,
    space_description,
    learning_space_prerequisites,
  });

  //cek apakah space title sudah diisi
  if (!space_title) {
    throw new BadRequestError("Space title is required");
  }
  // memastikan space description sudah diisi
  if (!space_description) {
    throw new BadRequestError("Space description is required");
  }
  //  memastikan prerequisite tag sudah diisi
  if (learning_space_prerequisites.length === 0) {
    throw new BadRequestError("Tag is required");
  }

  // foto thumbnail learning space
  if (!req.files || !req.files["space_photo"]) {
    return res
      .status(400)
      .json({ success: false, message: "Photo is Required" });
  }
  const space_photo_url = req.files["space_photo"][0].filename;

  // service
  // console.log("Controller received:", req.body);
  try {
    const result = await spaceService.createLearningSpace({
      space_title,
      space_photo_url,
      space_description,
      user_id,
      learning_space_prerequisites,
    });

    if (!result) {
      return res.status(400).json({ success: false });
    }

    console.log(result);

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log("heree");
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getRelatedSpaces = async (req, res) => {
  try {
    const { learning_space_id } = req.params;

    if (!learning_space_id) {
      throw new BadRequestError("Invalid learning space ID provided.");
    }

    const result = await spaceService.getRelatedSpaces(
      parseInt(learning_space_id)
    );

    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No related learning spaces found with matching tags.",
        data: [],
      });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { learning_space_id } = req.params;

    if (!learning_space_id) {
      throw new BadRequestError("Invalid learning space ID provided.");
    }

    const result = await spaceService.getAllPosts(learning_space_id);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const joinLearningSpace = async (req, res) => {
  const { user_id } = req.user;
  const { learning_space_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Login / Register is required" });
  }

  if (!learning_space_id) {
    return res
      .status(400)
      .json({ success: false, message: "Learning Space ID is invalid" });
  }

  try {
    const result = await spaceService.joinLearningSpace({
      user_id,
      learning_space_id,
    });

    return res.json({
      success: true,
      data: result,
      message: "Successfully joined the space",
    });
  } catch (error) {
    console.error("Error joining learning space:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to join the space" });
  }
};

export const leaveLearningSpace = async (req, res) => {
  const { user_id } = req.user;
  const { learning_space_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Login / Register is required" });
  }

  if (!learning_space_id) {
    return res
      .status(400)
      .json({ success: false, message: "Learning Space ID is invalid" });
  }

  try {
    await spaceService.leaveLearningSpace({
      user_id,
      learning_space_id,
    });

    return res.json({
      success: true,
      message: "Successfully left the space",
    });
  } catch (error) {
    console.error("Error leaving learning space:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to leave the space" });
  }
};

export const getIsJoinedStatusUser = async (req, res) => {
  const { user_id } = req.user;
  const { learning_space_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Login / Register is required" });
  }

  if (!learning_space_id) {
    return res
      .status(400)
      .json({ success: false, message: "Learning Space ID is invalid" });
  }

  try {
    const result = await spaceService.getIsJoinedStatusUser({
      user_id,
      learning_space_id,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error get status user is joined the space:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get status user is joined the space",
    });
  }
};
