const { supabase } = require('./config');
const cmd = process.argv[2];
(async () => {
  try {
    if (cmd === 'list') {
      const { data, error } = await supabase.from('fields').select('*, module:modules(id, name)').order('display_order');
      if (error) throw error;
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('Usage: node fields-api.js list');
      process.exit(1);
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
