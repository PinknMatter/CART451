const { MongoClient } = require('mongodb');

async function runQueries() {
    const uri = "mongodb+srv://noahkornberg:Mey4VVyLS1I98lny@cluster0.nzqmezx.mongodb.net/"; 
    const client = new MongoClient(uri);

    await client.connect();

    const collection = client.db("Spotify").collection("Spotify");

    //Top 5 most streamed songs
    const topSongs = await collection.find().sort({ streams: -1 }).limit(5).toArray();
    console.log("Top 5 Streamed Songs:", topSongs);

    //Number of songs by a specific artist
    const edSheeranCount = await collection.countDocuments({ artist: 'Ed Sheeran' });
    console.log("Number of Songs by Ed Sheeran:", edSheeranCount);

    //top 10 songs released in January 2017
    const januarySongs = await collection.find({
        date: { $gte: new Date('2018-03-01'), $lt: new Date('2018-04-01') }
    }).sort({ streams: -1 }).limit(100).toArray();
    

    let uniqueSongs = [];
    let addedTitles = new Set();
    
    for (let song of januarySongs) {
        if (!addedTitles.has(song.title)) {
            uniqueSongs.push(song);
            addedTitles.add(song.title);
        }
        if (uniqueSongs.length === 10) break;
    }
    
    console.log("Top 10 Unique Songs from January 2017:", uniqueSongs);
    
    
  
    //Distinct artists in the top 100 streamed songs
    const topArtists = await collection.aggregate([
        { $sort: { streams: -1 } },
        { $limit: 100 },
        { $group: { _id: "$artist" } }
    ]).toArray();
    
   console.log("Top Artists in Top 100 Streamed Songs:", topArtists.map(artist => artist._id));

    //Average streams of top 10 songs
    const avgStreams = await collection.aggregate([
        { $sort: { streams: -1 } },
        { $limit: 10 },
        { $group: { _id: null, avgStreams: { $avg: "$streams" } } }
    ]).next();
    console.log("Average Streams of Top 10 Songs:", avgStreams.avgStreams);

    await client.close();
}

runQueries().catch(console.error);
