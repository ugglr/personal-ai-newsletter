import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY as string);

type Payload = {
  htmlReminders: string;
  htmlPrompts: string;
};
export const sendEmail = async (email: string, payload: Payload) => {
  if (!email) throw new Error("No email");

  novu.trigger("my-newsletter", {
    to: {
      subscriberId: email,
      email,
    },
    payload,
  });
};
