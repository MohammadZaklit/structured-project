const { supabase } = require('./config');
const cmd = process.argv[2];
const args = process.argv.slice(3);

(async () => {
  try {
    switch(cmd) {
      case 'list': {
        const { data, error } = await supabase.from('projects').select('*').order('name');
        if (error) throw error;
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      case 'get': {
        const { data, error } = await supabase.from('projects').select('*').eq('id', args[0]).single();
        if (error) throw error;
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      case 'create': {
        const { data, error } = await supabase.from('projects').insert([{ name: args[0] }]).select().single();
        if (error) throw error;
        console.log('Created:', JSON.stringify(data, null, 2));
        break;
      }
      case 'update': {
        const { data, error } = await supabase.from('projects').update({ name: args[1] }).eq('id', args[0]).select().single();
        if (error) throw error;
        console.log('Updated:', JSON.stringify(data, null, 2));
        break;
      }
      case 'delete': {
        const { error } = await supabase.from('projects').delete().eq('id', args[0]);
        if (error) throw error;
        console.log('Deleted successfully');
        break;
      }
      default:
        console.error('Usage: node projects-api.js [list|get|create|update|delete] [args]');
        process.exit(1);
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
