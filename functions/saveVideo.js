const { connectToDatabase } = require('./mongoClient');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);
    const { db } = await connectToDatabase();

    const videoData = {
      title: data.title || '',
      category: data.category || '',
      link: data.link || null,
      rating: data.rating ? parseInt(data.rating) : null,
      thumbnail: data.thumbnail || ""
    };

    let result;
    if (data.id) {
      result = await db.collection('videos').updateOne(
        { _id: new ObjectId(data.id) },
        { $set: videoData }
      );
    } else {
      result = await db.collection('videos').insertOne(videoData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Video saved successfully',
        id: data.id || result.insertedId 
      }),
    };
  } catch (error) {
    console.error('Error in saveVideo function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.stack
      })
    };
  }
};