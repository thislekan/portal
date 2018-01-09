const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary');

const { User } = require('./../models/user');
const { ObjectID } = require('mongodb');

const Storage = cloudinaryStorage({
    cloudinary,
    folder: 'ALC2.0 Development',
    allowedFormat: ['jpg', 'svg', 'png', 'jpeg', 'gif']
});

const newupload = multer({
    storage: Storage,
    limits: { fileSize: 1500000 }
}).single('image');

const uploadImage = function(req, res) {
    let id = req.params.id;
    let imageUrl = req.file.secure_url;

    User.findOneAndUpdate({
        _id: ObjectID(id)
    }, { $set: { imageUrl: imageUrl } }, { new: true }).then(user => {
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).redirect('../public/private/notify.html').send({ user });
    }).catch(e => res.status(400).send());
}


module.exports = { newupload, uploadImage }