const supabase = require('./supabaseClient');

exports.handler = async function(event, context) {
  try {
    const { id } = JSON.parse(event.body);

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video deleted successfully' }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};