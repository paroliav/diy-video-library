const { connectToDatabase } = require('./mongoClient');

exports.handler = async function(event, context) {
  console.log('getVideos function called');
  
  try {
    const { db } = await connectToDatabase();
    const videos = await db.collection('videos').find({}).toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(videos),
    };
  } catch (error) {
    console.error('Full error object:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
        stack: error.stack,
      })
    };
  }
};


