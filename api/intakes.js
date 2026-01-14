// Wizard Intakes API - Turso
import { tursoClient, generateId } from '../lib/tursoClient.js';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  if (req.method === 'GET') {
    // Get intake by slug
    try {
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM intakes WHERE public_slug = ?',
        args: [slug]
      });
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Intake not found' });
      }
      
      const intake = result.rows[0];
      // Parse JSON fields
      return res.status(200).json({
        ...intake,
        answers: JSON.parse(intake.answers || '{}')
      });
    } catch (error) {
      console.error('Error fetching intake:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  if (req.method === 'POST') {
    // Create intake
    try {
      const { slug: newSlug } = req.body;
      const id = generateId();
      const now = new Date().toISOString();
      
      await tursoClient.execute({
        sql: `INSERT INTO intakes (id, public_slug, status, answers, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, newSlug, 'in_progress', '{}', now, now]
      });
      
      return res.status(200).json({ success: true, slug: newSlug });
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint')) {
        return res.status(200).json({ success: true }); // Already exists
      }
      console.error('Error creating intake:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  if (req.method === 'PUT') {
    // Update intake
    try {
      const { answers, long_text, user_summary, ai_prompt, status } = req.body;
      const now = new Date().toISOString();
      
      await tursoClient.execute({
        sql: `UPDATE intakes 
              SET answers = ?, long_text = ?, user_summary = ?, ai_prompt = ?, status = ?, updated_at = ?
              WHERE public_slug = ?`,
        args: [
          JSON.stringify(answers || {}),
          long_text || null,
          user_summary || null,
          ai_prompt || null,
          status || 'submitted',
          now,
          slug
        ]
      });
      
      // Email gönder (sadece status 'submitted' ise)
      if (status === 'submitted') {
        try {
          const { sendIntakeEmail } = await import('../lib/email.js');
          const intakeData = {
            public_slug: slug,
            user_summary,
            long_text,
            answers
          };
          await sendIntakeEmail(intakeData);
        } catch (emailError) {
          // Email hatası kritik değil, logla ama devam et
          console.error('Email send error (non-critical):', emailError);
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating intake:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
