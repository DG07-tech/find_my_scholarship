import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    // Contact Details
    fullName: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    parentName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    parentMobileNumber: {
      type: String,
    },

    // Personal Details
    annualIncome: {
      type: String,
    },
    profession: {
      type: String,
    },
    caste: {
      type: String,
    },
    religion: {
      type: String,
    },
    state: {
      type: String,
    },
    minorityStatus: {
      type: Boolean,
    },
    bplStatus: {
      type: Boolean,
    },
    singleParent: {
      type: Boolean,
    },
    disabledStatus: {
      type: Boolean,
    },

    // Education Details
    tenthMarks: {
      type: String,
    },
    twelfthMarks: {
      type: String,
    },
    collegeName: {
      type: String,
    },
    courseName: {
      type: String,
    },
    currentEducationLevel: {
      type: String,
    },
    courseType: {
      type: String,
    },
    yearOfStudy: {
      type: String,
    },
    scholarshipCriteria: {
      type: String,
    },
    areaOfResidence: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
