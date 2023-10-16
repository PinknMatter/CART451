const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 3000;

const dbURL = "mongodb+srv://noahkornberg:Mey4VVyLS1I98lny@cluster0.nzqmezx.mongodb.net/";

let db;

// Connect to MongoDB
const connectToMongo = async () => {
    try {
        const client = await MongoClient.connect(dbURL);
        db = client.db("Spotify");
        console.log('Connected to MongoDB');

     
        startServer();

    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
};

// Start Express Server
const startServer = () => {
    app.use(express.static('public'));

   
    function formatDate(dateObj) {
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // months are 0-based in JS
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }
    
    // Handling search
    app.get('/search', async (req, res) => {
        try {
            const inputDate = req.query.date;
            console.log("Received date from user:", inputDate);
    
            const startDate = new Date(inputDate);
            const endDate = new Date(new Date(inputDate).setMonth(startDate.getMonth() + 1));
    
            
            const songs = await db.collection('Spotify').find({
                date: { $gte: new Date('2017-01-01'), $lt: new Date('2017-02-01') }
            }).sort({ streams: -1 }).limit(50).toArray();
            
            console.log(songs);
            console.log(startDate);  
            console.log(endDate);    
            res.json(songs);
          
        } catch(err) {
            console.error('Error while handling search:', err);
            res.status(500).send('Server Error');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

// Start the MongoDB connection process
connectToMongo();
