import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    notifications: {
      userQueries: {
        type: Boolean,
        default: true,
      },
      newUsers: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const AdminSettings = mongoose.model(
  "AdminSettings",
  adminSettingsSchema
);
