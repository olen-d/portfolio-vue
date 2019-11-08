// Middleware
const multer = require("multer");

// Set Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images");
  }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
  filename: (req, file, cb) => {
    cb(null, "fsf" + "-" + Date.now() + "-" + file.originalname);
  }
});

module.exports = (req, res, next) => {
  const upload = multer({ storage: storage });
  upload.single("file")(req, res, err => {
    if (err) {
      return err;
    } else {
      next();
    }
  });
};
