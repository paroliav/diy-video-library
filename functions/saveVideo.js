// const supabase = require('./supabaseClient');

// exports.handler = async function(event, context) {
//   try {
//     console.log('Received event:', event);

//     if (event.httpMethod !== 'POST') {
//       return { statusCode: 405, body: 'Method Not Allowed' };
//     }

//     const data = JSON.parse(event.body);
//     console.log('Parsed data:', data);

//     if (!data || typeof data !== 'object') {
//       throw new Error('Invalid or missing data in the request');
//     }

//     const videoData = {
//       title: data.title || '',
//       category: data.category || '',
//       link: data.link || null,
//       rating: data.rating ? parseInt(data.rating) : null,
//     };

//     console.log('Prepared video data:', videoData);

//     let result;
//     if (data.id) {
//       const { data: updateData, error } = await supabase
//         .from('videos')
//         .update(videoData)
//         .eq('id', data.id)
//         .single();

//       if (error) throw error;
//       result = updateData;
//     } else {
//       const { data: insertData, error } = await supabase
//         .from('videos')
//         .insert(videoData)
//         .single();

//       if (error) throw error;
//       result = insertData;
//     }

//     console.log('Supabase operation result:', result);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Video saved successfully', id: result.id }),
//     };
//   } catch (error) {
//     console.error('Error in saveVideo function:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: error.message,
//         details: error.stack
//       })
//     };
//   }
// };

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
      thumbnail: data.thumbnail || null  // Added thumbnail field
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