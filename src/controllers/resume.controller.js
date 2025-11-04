import Resume from "../models/resume.model.js";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Check if user already has a resume
    let resume = await Resume.findOne({ user: req.user.id });

    const fileData = {
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
    };

    if (resume) {
      // Delete old file
      try {
        await fs.unlink(path.join(__dirname, "../../uploads", resume.filename));
      } catch (err) {
        console.error("Error deleting old file:", err);
      }

      // Update existing resume
      resume = await Resume.findByIdAndUpdate(resume._id, fileData, {
        new: true,
      });
    } else {
      // Create new resume
      resume = await Resume.create(fileData);
    }

    // Mock AI analysis
    resume.analysis = {
      atsScore: Math.floor(Math.random() * 30) + 70,
      keywordsMatched: Math.floor(Math.random() * 10) + 8,
      suggestions: [
        { type: "warning", text: "Add more quantifiable achievements" },
        { type: "info", text: "Consider adding certifications" },
        { type: "success", text: "Skills section is well optimized" },
      ],
    };
    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: { resume },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get resume
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    res.status(200).json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // Delete file
    try {
      await fs.unlink(path.join(__dirname, "../../uploads", resume.filename));
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
