import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new UnauthorizedError("authorization header must be provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("token not provided");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token expired");
    } else {
      throw new UnauthorizedError("invalid token");
    }
  }
};
