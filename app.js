const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());

// import uploading routes
const uploadingRoutes = require("./uploading");
app.use("/", uploadingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
