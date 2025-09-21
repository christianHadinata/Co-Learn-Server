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

    // panggil service
    const result = await spaceService.getSingleSpace(learning_space_id);
    if (!result) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const create_learning_space = async (req, res) => {
  const { user_id } = req.user;

  //nerima input dari textfield FE
  const { space_title, space_description, learning_space_prerequisites } =
    req.body;

  // foto thumbnail learning space
  if (!req.files || !req.files["space_photo"]) {
    return res
      .status(400)
      .json({ success: false, message: "Photo is Required" });
  }
  const space_photo_url = req.files["space_photo"][0].filename;

  //cek apakah space title sudah diisi
  if (!space_title) {
    throw new BadRequestError("Space title is required");
  }
  // memastikan space description sudah diisi
  if (!space_description) {
    throw new BadRequestError("Space description is required");
  }
  //  memastikan prerequisite tag sudah diisi
  if (!learning_space_prerequisites) {
    throw new BadRequestError("Tag is required");
  }

  // service
  // console.log("Controller received:", req.body);
  try {
    const result = await spaceService.create_learning_space({
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
