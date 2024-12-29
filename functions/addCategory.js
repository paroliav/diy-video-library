const { connectToDatabase } = require('./mongoClient');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name } = JSON.parse(event.body);
    
    if (!name || typeof name !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid category name' })
      };
    }

    const { db } = await connectToDatabase();

    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Category added successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add category' })
    };
  }
};