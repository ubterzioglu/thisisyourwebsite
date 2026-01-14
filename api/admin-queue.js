import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

// Simple auth check
function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Queue fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
