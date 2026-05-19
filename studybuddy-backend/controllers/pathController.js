const LearningPath = require("../models/LearningPath");
const { generateLearningPath } = require("../services/aiService");

// ---------Generate a new learning path---------------------

const generatePath = async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const modules = await generateLearningPath(topic, level || "beginner");

    const learningPath = await LearningPath.create({
      userId: req.user._id,
      topic,
      level: level || "beginner",
      modules,
    });

    res.status(201).json({
      message: "Learning path generated successfully",
      learningPath,
    });
  } catch (error) {
    c;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ── Get all paths of logged-in student ───────

const getMyPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Learningj path fetched",
      count: paths.length,
      paths,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --------------------get single path by ID---------------------

const getPathById = async (req, res) => {
  try {
    const path = await LearningPath.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!path) {
      return res.status(404).json({ message: "Learning path noth found" });
    }
    res.status(200).json({ path });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//----------Update progress---------------------------

const updateProgress = async (req, res) => {
  try {
    const { moduleIndex } = req.body;

    const path = await LearningPath.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    // Mark module as completed
    path.modules[moduleIndex].isCompleted = true;

    //recalculate progress percentage
    const completedCount = path.modules.filter((m) => m.isCompleted).length;
    path.progress = Math.round((completedCount / path.modules.length) * 100);

    await path.save();

    res.status(200).json({
      message: "Progress updated",
      progress: path.progress,
      path,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { generatePath, getMyPaths, getPathById, updateProgress };
