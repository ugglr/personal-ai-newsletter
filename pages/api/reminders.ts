import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import Reminder from "../../models/Reminder";

export type ReminderDto = {
  _id: string;
  reminder: string;
};
type PostData = {
  success: boolean;
  data?: ReminderDto;
};
type GetData = {
  success: boolean;
  data?: ReminderDto[];
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
        await Reminder.deleteOne({ _id: body.id });

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "GET":
      try {
        const reminders = await Reminder.find();
        res.status(200).json({ success: true, data: reminders });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const reminder = await Reminder.create(body);
        res.status(201).json({ success: true, data: reminder });
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
