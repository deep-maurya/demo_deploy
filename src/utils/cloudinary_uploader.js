const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinary_upload = async (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "user_images", use_filename: true },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve(result.secure_url);
      }
    );

    // Check if req.file is defined and has a buffer
    if (req.file && req.file.buffer) {
      stream.end(req.file.buffer); // Stream the buffer to Cloudinary
    } else {
      reject(new Error("No file provided or file buffer is missing."));
    }
  });
};

module.exports = { cloudinary_upload };
