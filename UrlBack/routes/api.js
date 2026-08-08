const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/url');
const dotenv = require('dotenv');
dotenv.config();

// Create a new post    
router.post('/', async (req, res) => {
    try {
        let { longURL } = req.body;
        if (!longURL) {
            return res.status(400).json({ error: 'longURL is required' });
        }

        // making google.com, https://google.com, http://google.com all same
        if (!/^https?:\/\//i.test(longURL)) {
            longURL = `https://${longURL}`;
        }

        //checking that the given longURL is already present in the database or not
        let existingUrl = await Url.findOne({ longURL: longURL });
        if (existingUrl) {
            return res.json({ shortUrl: existingUrl.shortUrl });
        }

        // manually creating url code and shorten url
        const urlCode = nanoid(8);
        const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

        const newUrl = new Url({
            longURL,
            urlCode,
            shortUrl
        });

        await newUrl.save()

        console.log("URL saved to database:", newUrl);
        return res.status(201).json({ shortUrl });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})




module.exports = router;