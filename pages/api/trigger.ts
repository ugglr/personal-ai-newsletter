import { NextApiRequest, NextApiResponse } from "next";
import { ReminderDto } from "./reminders";
import { PromptDto } from "./prompts";
import { openai } from "../../lib/openai";
import { sendEmail } from "@/lib/novu";

const loadData = async (path: "reminders" | "prompts"): Promise<unknown[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/${path}`, {
      method: "GET",
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    return [];
  } catch (err) {
    console.log("err", err);
    throw new Error(`Could not GET on ${path}`);
  }
};

type PostData = {
  success: boolean;
};
const handler = async (req: NextApiRequest, res: NextApiResponse<PostData>) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const reminders =
          ((await loadData("reminders")) as ReminderDto[]) ?? [];
        const prompts = ((await loadData("prompts")) as PromptDto[]) ?? [];

        let reminderlistElements = "";

        if (reminders.length > 0) {
          reminders.forEach(({ reminder }: ReminderDto) => {
            reminderlistElements += `<li>${reminder}</li>`;
          });
        }

        const htmlReminders = `<ul>${reminderlistElements}</ul>`;

        let chatGptResponseListElements = "";

        if (prompts.length > 0) {
          for (const { prompt } of prompts) {
            const chatResponse = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
            });

            const chatGptResponse =
              chatResponse.data.choices[0].message?.content;

            if (chatGptResponse) {
              chatGptResponseListElements += `<li>${chatGptResponse}</li>`;
            }
          }
        }

        const htmlPrompts = `<ul>${chatGptResponseListElements}</ul>`;

        await sendEmail("carl.igelstrom@gmail.com", {
          htmlReminders,
          htmlPrompts,
        });

        res.status(201).json({ success: true });
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
