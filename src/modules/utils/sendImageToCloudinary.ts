import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import config from "../../app/config";
export const sendImageToCloudinary = async (
  imageName: string,
  pathName: string
) => {
  cloudinary.config({
    cloud_name: config?.cloudinary_cloud_name,
    api_key: config?.cloudinary_api_key,
    api_secret: config?.cloudinary_api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(pathName, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Delete file named 'exampleFile.txt'
  fs.unlink(pathName, (err) => {
    if (err) {
      console.error("An error occurred:", err);
    } else {
      console.log("File deleted successfully!");
    }
  });
  return uploadResult;
};
// upload file into server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
