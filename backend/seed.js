import mongoose from "mongoose";
import dotenv from "dotenv";
import { Scheme } from "./models/scheme.model.js";
import { scholarships } from "./data/scholarships.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Scheme.deleteMany({});
    console.log("Cleared existing schemes");

    await Scheme.insertMany(scholarships);
    console.log(`Seeded ${scholarships.length} scholarships successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
