const supabase = require('./supabaseClient');

exports.handler = async function(event, context) {
  console.log('getVideos function called');

  try {
    console.log('Attempting to query Supabase');
    const { data, error } = await supabase
      .from('videos')
      .select('*');

    if (error) throw error;

    console.log('Supabase query result:', JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({
        fullError: JSON.stringify(error, null, 2)
      })
    };
  }
};