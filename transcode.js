const express = require("express");
const { exec } = require("child_process");
const { error } = require("console");
const { stdout, stderr } = require("process");
const path = require("path");

const router = express.Router();

// Make sure to parse JSON
router.use(express.json());

router.post("/transcode", (req, res) => {
  const resolution = req.body.resolution;
  const selected_filename = req.body.file_name;


  if (!resolution) {
    return res.status(400).json({ message: "Resolution is required" });
  }

  console.log("Transcoding to resolution:", resolution);
  console.log(`file to be transcoded ${selected_filename}`);
  

  // Here you can call ffmpeg to transcode the already available file
  // Example:
  // const inputPath = "uploads/myfile.mp4";
  // const outputPath = `uploads/myfile_${resolution}.mp4`;
  // exec(`ffmpeg -i "${inputPath}" -vf "scale=-2:${height}" "${outputPath}"`, ...);

  const inputPath = `uploads/${selected_filename}`;
  const outputPath = `uploads/${Date.now()}-${resolution}-${selected_filename}`;


  const ffmpegPath = "C:\\FFMPEG\\ffmpeg-2025-08-20-git-4d7c609be3-full_build\\bin\\ffmpeg.exe";

   const cmd = `"${ffmpegPath}" -i "${inputPath}" \
  -c:v libx264 -preset slow -crf 23 \
  -vf "scale=-2:${resolution}:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2" \
  -c:a aac -b:a 128k \
  -movflags +faststart "${outputPath}"`;
;

  exec(cmd, (error,stdout, stderr) => {
    if (error){
      console.log(`ffmpeg error while transcoding ${error.message}`);
      console.log(stderr);
      return res.status(500).json({message: "Error while transcoding"})
    }

    console.log(`Transcoding completed for the resolution ${resolution}`);

    res.json({
    message: `Transcode request received for resolution ${resolution}`,
    output_url_backend :  `/uploads/${path.basename(outputPath)}`
    });
});

})

module.exports = router;
