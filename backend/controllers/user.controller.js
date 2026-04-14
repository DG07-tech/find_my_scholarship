import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Scheme } from "../models/scheme.model.js";
import { Question } from "../models/question.model.js";
import { AdminSettings } from "../models/adminSettings.model.js";
import { sendAdminNotification } from "../utils/email.js";
import { evaluateSchemeEligibility } from "../utils/eligibility.js";

const vulgarWords = [
  "fuck",
  "shit",
  "asshole",
  "bitch",
  "cunt",
  "dick",
  "pussy",
  "bastard",
  "motherfucker",
  "whore",
  "slut",
  "dickhead",
  "cock",
  "prick",
  "twat",
  "wanker",
  "cocksucker",
  "fucker",
  "shithead",
  "ass",
  "arse",
  "arsehole",
  "bollocks",
  "bugger",
  "bloody",
  "choad",
  "crikey",
  "crap",
  "damn",
  "darn",
  "dick",
  "dickhead",
  "dildo",
  "dyke",
  "fag",
  "faggot",
  "fuck",
  "goddamn",
  "godsdamn",
  "hell",
  "holy shit",
  "horseshit",
  "jesus christ",
  "jesus",
  "jesus h. christ",
  "jesus harold christ",
  "jesus wept",
  "jesus, mary and joseph",
  "kike",
  "mother fucker",
  "motherfucker",
  "motherfucking",
  "nigga",
  "nigger",
  "piss",
  "pissed",
  "pissed off",
  "prick",
  "pussy",
  "shit",
  "shit ass",
  "shitass",
  "shitbag",
  "shitbagger",
  "shitbrains",
  "shitbreath",
  "shitcanned",
  "shitcunt",
  "shitdick",
  "shite",
  "shiteater",
  "shited",
  "shitey",
  "shitface",
  "shitfaced",
  "shithead",
  "shitheads",
  "shithole",
  "shithouse",
  "shiting",
  "shitings",
  "shits",
  "shitspitter",
  "shitstain",
  "shitt",
  "shitted",
  "shitter",
  "shitters",
  "shittier",
  "shittiest",
  "shitting",
  "shittings",
  "shitty",
  "tit",
  "tits",
  "titties",
  "titty",
  "twat",
  "twathead",
  "twatty",
  "twunt",
  "wank",
  "wanker",
  "wanky",
  "whore",
  "whoreface",
  "whorehole",
  "whores",
  "whoring",
];

export const checkEligibility = async (req, res) => {
  try {
    const userId = req.user?._id;
    const {
      fullName,
      dateOfBirth,
      parentName,
      mobileNumber,
      parentMobileNumber,

      // Personal Details
      annualIncome,
      profession,
      caste,
      gender,
      religion,
      state,
      minorityStatus,
      bplStatus,
      singleParent,
      disabledStatus,

      // Education Details
      tenthMarks,
      twelfthMarks,
      collegeName,
      courseName,
      currentEducationLevel,
      courseType,
      yearOfStudy,
      scholarshipCriteria,
      areaOfResidence,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (
      !fullName ||
      !dateOfBirth ||
      !parentName ||
      !mobileNumber ||
      !parentMobileNumber ||
      // Personal Details
      !annualIncome ||
      !profession ||
      !caste ||
      !gender ||
      !religion ||
      !state ||
      // Education Details
      !tenthMarks ||
      !twelfthMarks ||
      !collegeName ||
      !courseName ||
      !currentEducationLevel ||
      !courseType ||
      !yearOfStudy ||
      !scholarshipCriteria ||
      !areaOfResidence
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const updatedData = {
      fullName,
      dateOfBirth,
      parentName,
      mobileNumber,
      parentMobileNumber,

      // Personal Details
      annualIncome,
      profession,
      caste,
      gender,
      religion,
      state,
      minorityStatus,
      bplStatus,
      singleParent,
      disabledStatus,

      // Education Details
      tenthMarks,
      twelfthMarks,
      collegeName,
      courseName,
      currentEducationLevel,
      courseType,
      yearOfStudy,
      scholarshipCriteria,
      areaOfResidence,
    };
    await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    const schemes = await Scheme.find({ status: { $ne: "Archived" } });
    const profile = {
      annualIncome: Number(annualIncome),
      caste,
      gender,
      religion,
      state,
      minorityStatus,
      bplStatus,
      singleParent,
      disabledStatus,
      tenthMarks: Number(tenthMarks),
      twelfthMarks: Number(twelfthMarks),
      currentEducationLevel,
      courseType,
      yearOfStudy,
      areaOfResidence,
    };

    const evaluatedSchemes = schemes
      .map((scheme) => ({
        ...scheme.toObject(),
        eligibility: evaluateSchemeEligibility(scheme, profile),
      }))
      .sort((a, b) => b.eligibility.score - a.eligibility.score);

    const eligibleSchemes = evaluatedSchemes.filter(
      (scheme) => scheme.eligibility.isEligible
    );
    const nearMissSchemes = evaluatedSchemes
      .filter((scheme) => !scheme.eligibility.isEligible)
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      eligibleSchemes,
      nearMissSchemes,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error creating account",
    });
  }
};

export const getProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User profile retrieved successfully.",
    user,
  });
};

export const sendQuestion = async (req, res) => {
  try {
    const { question, visibility } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Check for vulgar words
    const questionLower = question.toLowerCase();
    const containsVulgarWord = vulgarWords.some((word) =>
      questionLower.includes(word.toLowerCase())
    );

    if (containsVulgarWord) {
      return res.status(400).json({
        success: false,
        message:
          "Your question contains inappropriate language. Please rephrase it.",
      });
    }

    const user = req.user;
    let userInfo = {
      username: "Anonymous",
      email: "anonymous@example.com",
    };

    if (user) {
      userInfo = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
    }

    const newQuestion = new Question({
      question,
      user: userInfo,
      status: "Pending",
      visibility: visibility || "public",
    });

    await newQuestion.save();

    // Check admin settings for email notifications
    const adminSettings = await AdminSettings.findOne({});

    if (
      adminSettings &&
      adminSettings.emailNotifications &&
      adminSettings.notifications.userQueries
    ) {
      // Find admin user to get email
      const admin = await User.findOne({ role: "admin" });

      if (admin && admin.email) {
        // Send email notification to admin
        const subject = "New User Question";
        const content = `
          <p><strong>User:</strong> ${userInfo.username}</p>
          <p><strong>Email:</strong> ${userInfo.email}</p>
          <p><strong>Question:</strong> ${question}</p>
          <p><strong>Visibility:</strong> ${visibility || "public"}</p>
          <p><a href="${
            process.env.FRONTEND_URL
          }/admin/dashboard?section=questions" style="display: inline-block; background-color: #002b4d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Question</a></p>
        `;

        await sendAdminNotification(admin.email, subject, content);
      }
    }

    res.status(201).json({
      success: true,
      message: "Question submitted successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error submitting question:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getUserQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const questions = await Question.find({ "user.id": userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching user questions:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getPublicQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      visibility: "public",
      status: { $ne: "Deleted" },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching public questions:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if the user is the owner of the question
    if (question.user.id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this question",
      });
    }

    // Delete the question from the database
    await Question.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};
