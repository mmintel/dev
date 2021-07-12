import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { refreshUserProfileUseCase } from "../../server";

const refreshProfileHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405);
    res.end();
    return;
  }

  const session = await getSession({ req });

  console.log("session", session);

  if (session) {
    await refreshUserProfileUseCase.execute(session.user.username);
    res.status(200);
  } else {
    res.status(401);
  }

  res.end();
};

export default refreshProfileHandler;
