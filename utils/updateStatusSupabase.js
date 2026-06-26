const supabase = require('../config/supabase');

// Update status function for Supabase
async function updateStatus() {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Update events status
    const { error: eventsError } = await supabase
      .from('events')
      .update({ status: 'past' })
      .lt('deadlinedate', currentDate)
      .eq('status', 'active');

    if (eventsError) {
      console.error('Error updating events status:', eventsError);
      throw eventsError;
    }

    // Update hackathons status
    const { error: hackathonsError } = await supabase
      .from('hackathons')
      .update({ status: 'past' })
      .lt('deadlinedate', currentDate)
      .eq('status', 'active');

    if (hackathonsError) {
      console.error('Error updating hackathons status:', hackathonsError);
      throw hackathonsError;
    }

    console.log('Status updated successfully for both events and hackathons.');
  } catch (error) {
    console.error('Error in updateStatus:', error);
    throw error;
  }
}

module.exports = {
  updateStatus
};
