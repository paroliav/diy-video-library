// const supabase = require('./supabaseClient');

// exports.handler = async function(event, context) {
//   console.log('getVideos function called');

//   try {
//     console.log('Attempting to query Supabase');
//     const { data, error } = await supabase
//       .from('videos')
//       .select('*');

//     if (error) {
//       console.error('Supabase query error:', error);
//       throw error;
//     }

//     console.log('Supabase query result:', JSON.stringify(data, null, 2));

//     return {
//       statusCode: 200,
//       body: JSON.stringify(data),
//     };
//   } catch (error) {
//     console.error('Full error object:', JSON.stringify(error, null, 2));
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Internal server error',
//         error: error.message,
//         stack: error.stack,
//       })
//     };
//   }
// };

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