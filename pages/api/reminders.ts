import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import Reminder from "../../models/Reminder";

export type ReminderDto = {
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
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const { id } = JSON.parse(req.body);

        const deletedReminder = await Reminder.deleteOne({ _id: id });

        if (!deletedReminder.acknowledged) {
          res.status(200).json({ success: true });
        }
        res.status(400).json({ success: false });
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
        const reminder = await Reminder.create(req.body);
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
