import { NextApiHandler } from "next";
import { getUserProfileUseCase } from "../../../server";

const profileHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") throw new Error("Only GET requests allowed.");

  const username = Array.isArray(req.query.username)
    ? req.query.username[0]
    : req.query.username;

  const userProfile = await getUserProfileUseCase.execute(username);

  res.json(userProfile);
};

export default profileHandler;
