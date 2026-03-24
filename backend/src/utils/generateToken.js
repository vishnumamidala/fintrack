import jwt from "jsonwebtoken";

export const generateToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

