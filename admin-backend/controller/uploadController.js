const uploadImage = async (req, res) => {
  try {
    const imageUrl = req.file.path; 
    return res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = { uploadImage };
