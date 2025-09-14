import * as userService from "../services/user.js";
import { BadRequestError } from "../errors/badRequestError.js";

// req = nerima requst dari FE menuju BE
// res = mengirim respon / result dari BE menuju FE
export const register = async (req, res) => {
  //nerima input dari textfield FE
  const { user_name, user_email, user_password } = req.body;

  //cek apakah email sudah terdaftar
  if (!user_email) {
    throw new BadRequestError("Email is required");
  }
  // memastikan username tidak kosong
  if (!user_name) {
    throw new BadRequestError("Name is required");
  }
  //  memastikan password terisi
  if (!user_password) {
    throw new BadRequestError("Password is required");
  }

  // service
  // console.log("Controller received:", req.body);
  try {
    const result = await userService.register({
      user_name,
      user_email,
      user_password,
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

export const login = async (req, res) => {
  // nerima input dari textfield FE
  const { user_email, user_password } = req.body;
  // console.log(req.body);

  // memastikan email tidak kosong
  if (!user_email) {
    throw new BadRequestError("Email is required");
  }

  //  memastikan password terisi
  if (!user_password) {
    throw new BadRequestError("Password is required");
  }

  // redirect ke  service
  const token = await userService.login({ user_email, user_password });

  return res.json({ success: true, token });
};

export const getSingleUser = async (req, res) => {
  const { user_email } = req.user;

  const result = await userService.getSingleUser(user_email);

  return res.json({ success: true, data: result });
};

export const updateUserProfile = async (req, res) => {
  const { user_id } = req.user;
  const { user_name, user_biography, user_country, user_interests } = req.body;

  try {
    await userService.updateUserProfile({
      user_id,
      user_name,
      user_biography,
      user_country,
      user_interests,
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

export const updatePhoto = async (req, res) => {
  const { user_id } = req.user;

  if (!req.files || !req.files["user_photo"]) {
    return res
      .status(400)
      .json({ success: false, message: "Photo is Required" });
  }
  const user_photo_url = req.files["user_photo"][0].filename;

  await userService.updatePhoto({ user_id, user_photo_url });

  return res.json({ success: true });
};
