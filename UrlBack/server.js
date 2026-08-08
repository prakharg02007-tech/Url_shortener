const express = require('express');
const connectDB = require('./db/db');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

app.use('/api/shorten', require('./routes/api'));

// Redirect to the original URL
app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const Url = require('./models/url');

        const url = await Url.findOne({ urlCode : code });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.redirect(url.longURL);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})