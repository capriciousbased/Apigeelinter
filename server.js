const path = require("path");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const AdmZip = require("adm-zip")
const port = process.env.PORT || 5000;

const app = express();

// This middleware is used to enable Cross Origin Resource Sharing This sets Headers to allow access to our client application
app.use(cors());

// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./documents"); //important this is a direct path from our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});


// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

// Route To Load Index.html page to browser
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// Single File Route Handler
app.post("/single", upload.single("document"), (req, res) => {

  // const uploadedFile = req.file;
  const uploadFilePath = req.file.path;
  const unZipped = new AdmZip(uploadFilePath)
  unZipped.extractAllTo("./")

  res.send(`${req.file.filename} FIle upload and unzipped success!! `);
});

// Multiple Files Route Handler
app.post("/multiple", upload.array("documents", 3), (req, res) => {
  console.log(req.files);
  res.send("Multiple Files Upload Success");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});