const MINORITY_RELIGIONS = [
  "Muslim",
  "Sikh",
  "Christian",
  "Buddhist",
  "Jain",
  "Parsi",
  "Zoroastrian",
];

const FIRST_YEAR_LEVELS = new Set(["first year", "1st year", "year 1"]);

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const matchesAny = (criteria = [], value) => {
  if (!criteria.length || criteria.includes("All")) return true;
  const normalizedValue = normalize(value);
  return criteria.some((item) => normalize(item) === normalizedValue);
};

const inferMinority = (religion, minorityStatus) =>
  Boolean(minorityStatus) || MINORITY_RELIGIONS.includes(religion);

export const evaluateSchemeEligibility = (scheme, profile) => {
  const failures = [];
  const matches = [];

  if (!matchesAny(scheme.genders, profile.gender)) {
    failures.push(`Open to ${scheme.genders.join(", ")} applicants only`);
  } else if (scheme.genders?.length && !scheme.genders.includes("All")) {
    matches.push(`Gender matched: ${profile.gender}`);
  }

  if (!matchesAny(scheme.states, profile.state)) {
    failures.push(`Available for ${scheme.states.join(", ")} only`);
  } else if (scheme.states?.length && !scheme.states.includes("All")) {
    matches.push(`State matched: ${profile.state}`);
  }

  if (!matchesAny(scheme.casteCategories, profile.caste)) {
    failures.push(`Reserved for ${scheme.casteCategories.join(", ")}`);
  } else if (
    scheme.casteCategories?.length &&
    !scheme.casteCategories.includes("All")
  ) {
    matches.push(`Category matched: ${profile.caste}`);
  }

  if (!matchesAny(scheme.religions, profile.religion)) {
    failures.push(`Open to ${scheme.religions.join(", ")} applicants`);
  }

  if (!matchesAny(scheme.residenceAreas, profile.areaOfResidence)) {
    failures.push(`Residence area must be ${scheme.residenceAreas.join(", ")}`);
  }

  if (!matchesAny(scheme.educationLevels, profile.currentEducationLevel)) {
    failures.push(`Intended for ${scheme.educationLevels.join(", ")} students`);
  } else if (
    scheme.educationLevels?.length &&
    !scheme.educationLevels.includes("All")
  ) {
    matches.push(`Education level matched: ${profile.currentEducationLevel}`);
  }

  if (
    scheme.courseTypes?.length &&
    !scheme.courseTypes.includes("All") &&
    !matchesAny(scheme.courseTypes, profile.courseType)
  ) {
    failures.push(`Course type must be ${scheme.courseTypes.join(", ")}`);
  }

  if (
    typeof scheme.maxAnnualIncome === "number" &&
    scheme.maxAnnualIncome > 0 &&
    Number(profile.annualIncome) > scheme.maxAnnualIncome
  ) {
    failures.push(
      `Family income must be at most Rs. ${scheme.maxAnnualIncome.toLocaleString("en-IN")}`
    );
  } else if (scheme.maxAnnualIncome) {
    matches.push("Income within limit");
  }

  if (
    typeof scheme.minTenthMarks === "number" &&
    Number(profile.tenthMarks) < scheme.minTenthMarks
  ) {
    failures.push(`Minimum 10th marks required: ${scheme.minTenthMarks}%`);
  }

  if (
    typeof scheme.minTwelfthMarks === "number" &&
    Number(profile.twelfthMarks) < scheme.minTwelfthMarks
  ) {
    failures.push(`Minimum 12th marks required: ${scheme.minTwelfthMarks}%`);
  }

  if (scheme.requiresMinority && !inferMinority(profile.religion, profile.minorityStatus)) {
    failures.push("Applicant must belong to a notified minority community");
  }

  if (scheme.requiresDisability && !profile.disabledStatus) {
    failures.push("Applicant must be a person with disability");
  }

  if (scheme.requiresBpl && !profile.bplStatus) {
    failures.push("Applicant must belong to a BPL household");
  }

  if (scheme.requiresSingleGirlChild && profile.gender !== "Female") {
    failures.push("Scheme is intended for girl students");
  }

  if (
    scheme.requiresFirstYear &&
    !FIRST_YEAR_LEVELS.has(normalize(profile.yearOfStudy))
  ) {
    failures.push("Applicant must be in the first year");
  }

  return {
    isEligible: failures.length === 0,
    matchedReasons: matches,
    missingCriteria: failures,
    score: matches.length - failures.length,
  };
};
