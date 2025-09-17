const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dvmokuxdn",
  api_key: "641753851691556",
  api_secret: "zdj1nsa_8eQuNA__gkUfPvHvUP0",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "misc";

    if (req.baseUrl.includes("/categories")) {
      folderName = "categories";
    } else if (req.baseUrl.includes("/subcategories")) {
      folderName = "subcategories";
    } else if (req.baseUrl.includes("/menu")) {
      folderName = "menu_items";
    } else if (req.baseUrl.includes("/chefs")) {
      folderName = "chefs";
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png"],
      public_id: file.originalname.split(".")[0],
    };
  },
});

module.exports = { cloudinary, storage };
