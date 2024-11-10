// csvToMongo.js
const fs = require('fs');
const csv = require('csv-parse');
const { MongoClient } = require('mongodb');
// require('dotenv').config();

const csvFilePath = './videos.csv'; // Update this to your CSV file path
const mongoUri = "mongodb+srv://gustavfl:5CRoUhjzuAz0qmxT@cluster0.i8dg7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'videodb';

async function convertAndImport() {
  const mongoClient = await MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const records = [];
    
    // Read and parse CSV
    const parser = fs
      .createReadStream(csvFilePath)
      .pipe(csv.parse({
        columns: true, // Use first row as headers
        skip_empty_lines: true
      }));

    console.log('Parsing CSV file...');
    
    for await (const record of parser) {
      // Transform data types appropriately
      const transformedRecord = {
        title: record.title || '',
        category: record.category || '',
        link: record.link || null,
        rating: record.rating ? parseInt(record.rating) : null,
        // Add any other fields you have in your CSV
        originalId: record.id || null, // Keep original ID for reference
      };
      
      records.push(transformedRecord);
    }

    console.log(`Parsed ${records.length} records from CSV`);

    // Bulk import to MongoDB
    const db = mongoClient.db(dbName);
    const collection = db.collection('videos');
    
    if (records.length > 0) {
      const result = await collection.insertMany(records);
      console.log(`Successfully imported ${result.insertedCount} documents to MongoDB`);
      
      // Print first few records for verification
      const sampleDocs = await collection.find().limit(3).toArray();
      console.log('Sample of imported data:', JSON.stringify(sampleDocs, null, 2));
    }

    // Optionally save the JSON file
    fs.writeFileSync(
      './videos.json', 
      JSON.stringify(records, null, 2), 
      'utf-8'
    );
    console.log('Saved JSON file as videos.json');

  } catch (error) {
    console.error('Error during conversion/import:', error);
  } finally {
    await mongoClient.close();
    console.log('Process completed');
  }
}

// Run the conversion and import
convertAndImport();