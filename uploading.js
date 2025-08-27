const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    // const ext = path.extname(file.originalname);
    // const customName = req.body.filename || "uploaded_file";
    // const finalName = Date.now() + "-" + customName + ext;
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// POST /upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = path.resolve(req.file.path);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ message: "Uploaded file not found on server" });
  }

  // Windows-friendly ffprobe path
  const ffprobePath = "C:\\FFMPEG\\ffmpeg-2025-08-20-git-4d7c609be3-full_build\\bin\\ffprobe.exe";

  const cmd = `"${ffprobePath}" -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${filePath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("ffprobe error:", error.message);
      console.error(stderr);
      return res.status(500).json({ message: "Error analyzing video" });
    }

    // stdout contains the resolution, e.g., "1920x1080"
    const resolution = stdout.trim();

    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      path: req.file.path,
      resolution: resolution,
    });
  });
});



module.exports = router;
