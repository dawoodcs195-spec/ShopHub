const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ===============================
// Upload Helper
// ===============================
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// ===============================
// Upload Product Image
// ===============================
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded.",
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "DiyaExpressions/Products"
        );

        return res.status(200).json({
            success: true,
            image: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Upload Avatar
// ===============================
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No avatar uploaded.",
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "DiyaExpressions/Avatars"
        );

        return res.status(200).json({
            success: true,
            avatar: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadImage,
    uploadAvatar,
};