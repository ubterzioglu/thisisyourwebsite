import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }
  
  try {
    const { data, error } = await supabase
      .from('queue_items')
      .select('id, display_name, status')
      .eq('token', token)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (data.status !== 'INVITED') {
      return res.status(400).json({ error: 'Token already used or invalid status' });
    }
    
    res.status(200).json({ 
      valid: true,
      preferred_language: 'tr'
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
