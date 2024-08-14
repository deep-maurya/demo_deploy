const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudniary_upload = async (req) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "user_images",
    use_filename: true,
  });
  return result.secure_url;
};

module.exports = { cloudniary_upload };
