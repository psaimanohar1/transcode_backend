const express = require("express");
const { exec } = require("child_process");

const router = express.Router();

// Make sure to parse JSON
router.use(express.json());

router.post("/transcode", (req, res) => {
  const resolution = req.body.resolution;

  if (!resolution) {
    return res.status(400).json({ message: "Resolution is required" });
  }

  console.log("Transcoding to resolution:", resolution);

  // Here you can call ffmpeg to transcode the already available file
  // Example:
  // const inputPath = "uploads/myfile.mp4";
  // const outputPath = `uploads/myfile_${resolution}.mp4`;
  // exec(`ffmpeg -i "${inputPath}" -vf "scale=-2:${height}" "${outputPath}"`, ...);

  res.json({
    message: `Transcode request received for resolution ${resolution}`,
  });
});

module.exports = router;
