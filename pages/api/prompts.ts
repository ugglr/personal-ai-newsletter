import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import Prompt from "../../models/Prompt";

export type PromptDto = {
  _id: string;
  prompt: string;
};
type PostData = {
  success: boolean;
  data?: PromptDto;
};
type GetData = {
  success: boolean;
  data?: PromptDto[];
};
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PostData | GetData>
) => {
  const { method, body, headers } = req;

  if (headers.authorization !== process.env.NEXT_PUBLIC_API_KEY) {
    res.status(401).json({ success: false });
  }

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const { id } = body;

        const deletedPrompt = await Prompt.deleteOne({ _id: id });

        if (!deletedPrompt.acknowledged) {
          res.status(200).json({ success: true });
        }
        res.status(400).json({ success: false });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "GET":
      try {
        const prompts = await Prompt.find();

        res.status(200).json({ success: true, data: prompts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const prompt = await Prompt.create(body);
        res.status(200).json({ success: true, data: prompt });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
