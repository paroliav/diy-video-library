const { connectToDatabase, ObjectId } = require('./mongoClient');

exports.handler = async function(event, context) {
  try {
    const { id } = JSON.parse(event.body);
    const { db } = await connectToDatabase();

    await db.collection('videos').deleteOne({ _id: new ObjectId(id) });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video deleted successfully' }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};