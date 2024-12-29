const { connectToDatabase } = require('./mongoClient');

exports.handler = async function(event, context) {
  try {
    const { db } = await connectToDatabase();
    
    // Get distinct categories from videos collection
    const categories = await db.collection('videos')
      .distinct('category');
    
    return {
      statusCode: 200,
      body: JSON.stringify(categories.filter(category => category)) // Filter out null/empty categories
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch categories' })
    };
  }
};