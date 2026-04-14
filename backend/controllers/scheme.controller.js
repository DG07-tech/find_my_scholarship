import { Scheme } from "../models/scheme.model.js";

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const matchesArrayFilter = (items = [], value) => {
  if (!value) return true;
  if (!items.length || items.includes("All")) return true;

  const target = normalize(value);
  return items.some((item) => normalize(item) === target);
};

export const getSchemes = async (req, res) => {
  try {
    const { search = "", state = "", gender = "", caste = "", level = "" } = req.query;
    const schemes = await Scheme.find({ status: { $ne: "Archived" } }).sort({
      sourceVerified: -1,
      schemeName: 1,
    });

    const filtered = schemes.filter((scheme) => {
      const haystack = [
        scheme.schemeName,
        scheme.provider,
        scheme.summary,
        scheme.benefits,
        ...(scheme.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || haystack.includes(search.toString().trim().toLowerCase());

      return (
        matchesSearch &&
        matchesArrayFilter(scheme.states, state) &&
        matchesArrayFilter(scheme.genders, gender) &&
        matchesArrayFilter(scheme.casteCategories, caste) &&
        matchesArrayFilter(scheme.educationLevels, level)
      );
    });

    return res.status(200).json({
      success: true,
      message: "Scholarships fetched successfully",
      data: filtered,
      meta: {
        total: filtered.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
