// Prompt.ts

import * as mongoose from "mongoose";

const PromptSchema = new mongoose.Schema({
  prompt: String,
});

export default mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
