

import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (file) =>
{
    return new Promise((resolve, reject) =>
    {
        const uploadStream = cloudinary.uploader.upload_stream(
        {
            folder: 'college-complaints',
            resource_type: 'auto'
        },
        (error, result) =>
        {
            if(error)
            {
                return reject(error);
            }

            resolve(
            {
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size
            });
        });

        uploadStream.end(file.buffer);
    });
};

export default uploadToCloudinary;
