const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// import uploading routes
const uploadingRoutes = require("./uploading");
app.use("/", uploadingRoutes);

// app.use("/", express.static(path.join(__dirname, "uploads")));
// Serve uploads under /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const transcodeRoute = require("./transcode");
const { json } = require("stream/consumers");
app.use("/",transcodeRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
