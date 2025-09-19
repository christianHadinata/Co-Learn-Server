import * as spaceService from "../services/space.js";
import { BadRequestError } from "../errors/badRequestError.js";

export const create_learning_space = async (req, res) => {
  //nerima input dari textfield FE
  const { space_title, space_description, learning_space_prerequisites } =
    req.body;

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
      space_description,
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

export const setPhoto = async (req, res) => {
  const { user_id } = req.user;

  if (!req.files || !req.files["space_photo"]) {
    return res
      .status(400)
      .json({ success: false, message: "Photo is Required" });
  }
  const space_photo_url = req.files["space_photo"][0].filename;

  await spaceService.updatePhoto({ user_id, space_photo_url });

  return res.json({
    success: true,
    data: {
      space_photo_url,
    },
  });
};
