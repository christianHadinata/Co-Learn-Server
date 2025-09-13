import * as userService from "../services/user.js";

export const getSingleUser = async (req, res) => {
  const { user_email } = req.user;

  const result = await userService.getSingleUser(user_email);

  return res.json({ success: true, data: result });
};

export const updateUserProfile = async (req, res) => {
  const { user_id } = req.user;
  const { user_name, user_biography, user_country, user_interests } = req.body;

  await userService.updateUserProfile({
    user_id,
    user_name,
    user_biography,
    user_country,
    user_interests,
  });

  return res.json({ success: true });
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
