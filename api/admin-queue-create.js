import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

function generateToken() {
  return randomBytes(18).toString('base64url'); // ~24 chars
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { display_name, display_role, consent_showcase } = req.body;
  
  if (!display_name) {
    return res.status(400).json({ error: 'Display name required' });
  }
  
  try {
    // Get max order index
    const { data: maxData, error: maxError } = await supabase
      .from('queue_items')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);
      
    if (maxError && maxError.code !== 'PGRST116') throw maxError;
    
    const newOrderIndex = (maxData?.[0]?.order_index || 0) + 1;
    const token = generateToken();
    
    const { data, error } = await supabase
      .from('queue_items')
      .insert({
        display_name,
        display_role: display_role || null,
        token,
        status: 'INVITED',
        consent_showcase: consent_showcase || 'PRIVATE',
        order_index: newOrderIndex,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
