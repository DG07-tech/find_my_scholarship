import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Government",
      trim: true,
    },
    sourceName: {
      type: String,
      default: "",
      trim: true,
    },
    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    benefits: {
      type: String,
      required: true,
      trim: true,
    },
    eligibilitySummary: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    states: {
      type: [String],
      default: ["All"],
    },
    genders: {
      type: [String],
      default: ["All"],
    },
    casteCategories: {
      type: [String],
      default: ["All"],
    },
    religions: {
      type: [String],
      default: ["All"],
    },
    residenceAreas: {
      type: [String],
      default: ["All"],
    },
    educationLevels: {
      type: [String],
      default: ["All"],
    },
    courseTypes: {
      type: [String],
      default: ["All"],
    },
    maxAnnualIncome: {
      type: Number,
      default: null,
    },
    minTenthMarks: {
      type: Number,
      default: null,
    },
    minTwelfthMarks: {
      type: Number,
      default: null,
    },
    requiresMinority: {
      type: Boolean,
      default: false,
    },
    requiresDisability: {
      type: Boolean,
      default: false,
    },
    requiresBpl: {
      type: Boolean,
      default: false,
    },
    requiresSingleGirlChild: {
      type: Boolean,
      default: false,
    },
    requiresFirstYear: {
      type: Boolean,
      default: false,
    },
    applicationMode: {
      type: String,
      default: "Online",
      trim: true,
    },
    detailsUrl: {
      type: String,
      default: "",
      trim: true,
    },
    applicationUrl: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
      trim: true,
    },
    sourceVerified: {
      type: Boolean,
      default: true,
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      default: "Both",
      trim: true,
    },
    state: {
      type: String,
      default: "All",
      trim: true,
    },
    areaOfResidence: {
      type: String,
      default: "Both",
      trim: true,
    },
    casteCategory: {
      type: String,
      default: "All",
      trim: true,
    },
    annualIncome: {
      type: Number,
      default: 0,
    },
    religion: {
      type: String,
      default: "All",
      trim: true,
    },
    schemeDocuments: {
      type: String,
      default: "",
      trim: true,
    },
    siteLink: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export const Scheme = mongoose.model("Scheme", schemeSchema);
