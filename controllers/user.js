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

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false });
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
