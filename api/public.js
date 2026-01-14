import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('queue_items')
      .select('id, display_name, display_role, site_url, consent_showcase')
      .eq('status', 'DELIVERED')
      .in('consent_showcase', ['PUBLIC', 'ANONYMIZED'])
      .order('delivered_at', { ascending: false });

    if (error) throw error;
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Error fetching public items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
