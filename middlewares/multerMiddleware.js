import multer from "multer";
import path from "path";

// Set up Multer storage
const upload = multer({
  dest: "uploads/", // Temporary folder for storing images locally
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size: 50MB
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }
    cb(null, true); // Accept file
  },
});

export default upload;
