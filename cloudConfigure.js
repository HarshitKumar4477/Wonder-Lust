const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_PASSWORD
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderLUst_DEV',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    //   public_id:(req,file)=>'computed-filename-using-request',
    },
  });
  

// const upload = multer({ storage: storage });

// module.exports = upload;

module.exports={
    cloudinary,
    storage
}