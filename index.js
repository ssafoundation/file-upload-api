const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(cors());
// Connect to MongoDB (replace with your MongoDB connection URL)
mongoose.connect(
  "mongodb+srv://techMass:sabah@cluster0.vctvobn.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Define a MongoDB model for uploaded files
const File = mongoose.model("File", {
  name: String,
  data: Buffer,
});

// Upload route
app.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const files = req.files;

    // Store each uploaded file in MongoDB
    for (const file of files) {
      const newFile = new File({
        name: file.originalname,
        data: file.buffer,
      });
      await newFile.save();
    }

    res.status(200).send("File(s) uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("File upload failed.");
  }
});

// Route to get a list of all files
app.get("/files", async (req, res) => {
  try {
    // Find all files in MongoDB
    const files = await File.find({}, "name"); // Retrieve only the file names

    // Extract the file names from the query result
    const fileNames = files.map((file) => file.name);

    res.status(200).json(fileNames);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Failed to fetch files.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
