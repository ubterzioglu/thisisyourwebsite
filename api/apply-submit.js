import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

// Simple summary generator (Türkçe)
function generateSummary(answers) {
  const name = answers.q15 || 'Profesyonel';
  const title = answers.q16 || 'Uzman';
  const industry = answers.q6 || 'çeşitli alanlar';
  const skills = Array.isArray(answers.q11) ? answers.q11 : (answers.q11 ? [answers.q11] : []);
  const summaryText = answers.q20 || 'Geniş deneyime sahip adanmış bir profesyonel.';
  
  // Map skill values to readable names
  const skillNames = {
    'coding': 'Kodlama',
    'design': 'UI/UX Tasarımı',
    'writing': 'İçerik Yazımı',
    'strategy': 'Strateji',
    'leadership': 'Liderlik'
  };
  
  const skillLabels = skills.map(s => skillNames[s] || s).join(', ');
  
  const summary = `${name}, ${title} olarak ${industry} alanında uzmanlaşmış bir profesyoneldir. ${summaryText} Ana yetenekleri arasında ${skillLabels || 'çeşitli alanlar'} bulunmaktadır.`;
  
  return summary;
}

// AI payload generator
function generateAIPayload(answers, summary) {
  return {
    meta: {
      name: answers.q15,
      role: answers.q16,
      languages: Array.isArray(answers.q14) ? answers.q14 : (answers.q14 ? [answers.q14] : ['tr']),
      tone: answers.q9 || 'professional',
      location: answers.q18,
      email: answers.q17,
      company: answers.q19
    },
    sections: {
      about: true,
      experience: answers.q13?.includes('experience') || false,
      projects: answers.q13?.includes('projects') || false,
      contact: answers.q13?.includes('contact') || false,
      portfolio: answers.q4 === 'true',
      testimonials: answers.q5 === 'true',
      socialLinks: answers.q3 === 'true'
    },
    content: {
      tr: {
        hero: `${answers.q15} - ${answers.q16}`,
        about: summary,
        highlights: Array.isArray(answers.q11) ? answers.q11 : [],
        goals: answers.q10 ? [answers.q10] : [],
        cta: answers.q10 || 'contact'
      }
    },
    raw: answers,
    constraints: {
      design: 'minimal premium',
      colorScheme: answers.q7 || 'minimal',
      claims: 'grounded',
      exaggeration: false
    }
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { token, answers } = req.body;
  
  if (!token || !answers) {
    return res.status(400).json({ error: 'Token and answers required' });
  }
  
  try {
    // Get queue item
    const { data: queueItem, error: queueError } = await supabase
      .from('queue_items')
      .select('id')
      .eq('token', token)
      .single();
      
    if (queueError || !queueItem) {
      return res.status(404).json({ error: 'Invalid token' });
    }
    
    // Generate summaries
    const summaryTr = generateSummary(answers);
    const aiPayload = generateAIPayload(answers, summaryTr);
    
    // Upsert submission
    const { error: submitError } = await supabase
      .from('submissions')
      .upsert({
        queue_item_id: queueItem.id,
        preferred_language: 'tr',
        answers_json: answers,
        customer_summary_tr: summaryTr,
        ai_payload_json: aiPayload,
        submitted_at: new Date().toISOString()
      }, {
        onConflict: 'queue_item_id'
      });
      
    if (submitError) throw submitError;
    
    // Update queue status
    const { error: updateError } = await supabase
      .from('queue_items')
      .update({ 
        status: 'SUBMITTED',
        updated_at: new Date().toISOString()
      })
      .eq('id', queueItem.id);
      
    if (updateError) throw updateError;
    
    res.status(200).json({
      success: true,
      customer_summary_tr: summaryTr
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
