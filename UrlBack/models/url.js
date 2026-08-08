


const mongoose = require('mongoose');
const {nanoid} = require("nanoid") //this is a package that generates unique IDs for us

const urlSchema = new mongoose.Schema({
    longURL: {
        type: String,
        required: true},
    urlCode: {
        type: String,
        unique: true,
        default: () => nanoid(8)
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 21600 // 6 hours in seconds, this will automatically delete the document after 6 hours
    }
});

const urlModel = mongoose.model('Url', urlSchema);

module.exports = urlModel;