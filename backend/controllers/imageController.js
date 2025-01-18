// imageController.js
const Patient = require("../models/patientModel");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const path = require('path');
require("dotenv").config();
const {cloudinaryConnect} = require("../utils/cloudinary");
cloudinaryConnect();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('file');

async function uploadFileToCloudinary(filepath, folder) {
    const options = {folder}
    return await cloudinary.uploader.upload(filepath, options);
}

exports.uploadImage = async(req, res) => {
    upload(req, res, async function(err) {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: "Multer error: " + err.message
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            const response = await uploadFileToCloudinary(req.file.path, "UserImages");
            console.log("Cloudinary response:", response);

            const updatedUser = await Patient.findByIdAndUpdate(
                req.body.userId,
                { image: response.secure_url },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Image successfully uploaded",
                imageUrl: response.secure_url
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    });
};
