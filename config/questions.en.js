// English question set (same IDs as TR so we can store in the same DB)
export const QUESTIONS = [
  {
    id: 'q01',
    type: 'single',
    question: 'What should this site do for you?',
    options: ['Help me get a job', 'Bring me clients', 'Strengthen my personal brand', 'Be my digital business card', 'A bit of everything'],
    summaryTemplate: (answer) => `Goal: ${answer}`,
    promptTemplate: (answer) => `Site purpose: ${answer}`
  },
  {
    id: 'q02',
    type: 'single',
    question: 'How should a visitor perceive you?',
    options: ['Professional', 'Trustworthy', 'Creative', 'Friendly', 'Strong'],
    summaryTemplate: (answer) => `Perception: ${answer}`,
    promptTemplate: (answer) => `Perception: ${answer}`
  },
  {
    id: 'q03',
    type: 'single',
    question: 'Who should the site primarily speak to?',
    options: ['Employer / HR', 'Client', 'Technical people', 'Non-technical people', 'Everyone'],
    summaryTemplate: (answer) => `Target audience: ${answer}`,
    promptTemplate: (answer) => `Target audience: ${answer}`
  },
  {
    id: 'q04',
    type: 'single',
    question: 'Overall design vibe',
    options: ['Simple & clear', 'Modern & sleek', 'Bold & different', 'Corporate', 'Personal'],
    summaryTemplate: (answer) => `Design vibe: ${answer}`,
    promptTemplate: (answer) => `General design vibe: ${answer}`
  },
  {
    id: 'q05',
    type: 'single',
    question: 'What should stand out in the design?',
    options: ['Text-first', 'Visual-first', 'Balanced', 'Minimal everything'],
    summaryTemplate: (answer) => `Design focus: ${answer}`,
    promptTemplate: (answer) => `Design focus: ${answer}`
  },
  {
    id: 'q06',
    type: 'single',
    question: 'How should the visitor consume the page?',
    options: ['Quick scan', 'Read in detail', 'Smooth scroll story', 'Only key headings'],
    summaryTemplate: (answer) => `Consumption: ${answer}`,
    promptTemplate: (answer) => `Visitor consumption pattern: ${answer}`
  },
  {
    id: 'q07',
    type: 'single',
    question: 'How should the page be structured?',
    options: ['One-page', 'Sectioned', 'Short but punchy', 'Detailed but organized'],
    summaryTemplate: (answer) => `Structure: ${answer}`,
    promptTemplate: (answer) => `Page structure: ${answer}`
  },
  {
    id: 'q08',
    type: 'multi',
    question: 'Which sections should be highlighted? (max 3)',
    options: ['Experience', 'Projects', 'Skills', 'Education', 'Contact'],
    summaryTemplate: (answer) => `Highlights: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`,
    promptTemplate: (answer) => `Highlighted sections: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`
  },
  {
    id: 'q09',
    type: 'single',
    question: 'How should projects be presented?',
    options: ['Cards', 'List', 'Few selected', 'All but minimal'],
    summaryTemplate: (answer) => `Projects: ${answer}`,
    promptTemplate: (answer) => `Project display: ${answer}`
  },
  {
    id: 'q10',
    type: 'single',
    question: 'What should be seen first on the homepage?',
    options: ['A strong hero section', 'A clear CTA button', 'A visual-heavy section', 'Short summary + more below'],
    summaryTemplate: (answer) => `First view: ${answer}`,
    promptTemplate: (answer) => `First thing on homepage: ${answer}`
  },
  {
    id: 'q11',
    type: 'single',
    question: 'Color approach',
    options: ['Black / White', 'Cool tones', 'Warm tones', 'Pastel', 'Surprise me'],
    summaryTemplate: (answer) => `Colors: ${answer}`,
    promptTemplate: (answer) => `Color approach: ${answer}`
  },
  {
    id: 'q12',
    type: 'single',
    question: 'Writing tone',
    options: ['Formal', 'Professional but warm', 'Friendly', 'Creative', 'Minimal'],
    summaryTemplate: (answer) => `Tone: ${answer}`,
    promptTemplate: (answer) => `Writing tone: ${answer}`
  },
  {
    id: 'q13',
    type: 'single',
    question: 'What feeling should the site convey?',
    options: ['“They know their craft”', '“I’d work with them”', '“They’re different”', '“They’re reliable”'],
    summaryTemplate: (answer) => `Feeling: ${answer}`,
    promptTemplate: (answer) => `Site feeling: ${answer}`
  },
  {
    id: 'q14',
    type: 'single',
    question: 'What should be the main call-to-action?',
    options: ['Contact me', 'Download CV', 'See projects', 'Just browse'],
    summaryTemplate: (answer) => `Main CTA: ${answer}`,
    promptTemplate: (answer) => `Main CTA: ${answer}`
  },
  {
    id: 'q15',
    type: 'multi',
    question: 'Site language',
    options: ['Turkish', 'English'],
    summaryTemplate: (answer) => `Language: ${Array.isArray(answer) ? answer.join(' + ') : answer}`,
    promptTemplate: (answer) => `Languages: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  {
    id: 'q16',
    type: 'single',
    question: 'Show location?',
    options: ['Show', 'Hide'],
    summaryTemplate: (answer) => `Location: ${answer}`,
    promptTemplate: (answer) => `Show location: ${answer === 'Show' ? 'Yes' : 'No'}`
  },
  {
    id: 'q17',
    type: 'multi',
    question: 'Social links',
    options: ['LinkedIn', 'GitHub', 'Instagram', 'X / Twitter', 'YouTube', 'Behance'],
    summaryTemplate: (answer) => `Social: ${Array.isArray(answer) ? answer.join(', ') : 'None'}`,
    promptTemplate: (answer) => `Social links: ${Array.isArray(answer) ? answer.join(', ') : 'None'}`
  },
  {
    id: 'q18',
    type: 'single',
    question: 'Site personality',
    options: ['Straight & serious', 'Lightly humorous', 'Clear & direct', 'Soft & smooth'],
    summaryTemplate: (answer) => `Personality: ${answer}`,
    promptTemplate: (answer) => `Site character: ${answer}`
  },
  {
    id: 'q19',
    type: 'single',
    question: 'Content density',
    options: ['Short but impactful', 'Balanced', 'Detailed'],
    summaryTemplate: (answer) => `Density: ${answer}`,
    promptTemplate: (answer) => `Content density: ${answer}`
  },
  {
    id: 'q20',
    type: 'single',
    question: 'Overall approach',
    options: ['Classic', 'Modern', 'Experimental', 'Safe choice'],
    summaryTemplate: (answer) => `Approach: ${answer}`,
    promptTemplate: (answer) => `General approach: ${answer}`
  },
  {
    id: 'q21',
    type: 'multi',
    question: 'How can we reach you?',
    options: ['WhatsApp (Fast)', 'LinkedIn (Normal)', 'Email (Slow)', 'Smoke signals (Very slow)'],
    summaryTemplate: (answer) => `Contact channels: ${Array.isArray(answer) ? answer.join(', ') : answer}`,
    promptTemplate: (answer) => `Contact channels: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  {
    id: 'q22',
    type: 'yesno',
    question: 'After we finish your page, can we add it to our portfolio?',
    options: ['Yes', 'No'],
    summaryTemplate: (answer) => `Portfolio permission: ${answer === 'true' ? 'Yes' : 'No'}`,
    promptTemplate: (answer) => `Portfolio permission: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  {
    id: 'q23',
    type: 'yesno',
    question: 'If you like your page, would you recommend us to your friends?',
    options: ['Yes', 'No'],
    summaryTemplate: (answer) => `Recommendation: ${answer === 'true' ? 'Yes' : 'No'}`,
    promptTemplate: (answer) => `Recommendation: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  {
    id: 'q24',
    type: 'text',
    question: 'Your full name',
    options: [],
    summaryTemplate: (answer) => `Full name: ${answer}`,
    promptTemplate: (answer) => `Full name: ${answer}`
  }
];

export function buildUserSummary(answers) {
  const lines = [];
  QUESTIONS.forEach(q => {
    const answer = answers?.[q.id];
    if (answer !== undefined && answer !== null && answer !== '') {
      lines.push(q.summaryTemplate(answer));
    }
  });
  return lines.join('\n');
}

