// Reminder.ts

import * as mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  reminder: String,
});

export default mongoose.models.Reminder ||
  mongoose.model("Reminder", ReminderSchema);
