// 20 Soru Konfigürasyonu
export const QUESTIONS = [
  // Q1: Purpose (single)
  {
    id: 'q01',
    type: 'single',
    question: 'Web sitenizin ana amacı nedir?',
    options: ['CV/Özgeçmiş', 'Portföy', 'Link-in-Bio', 'Kişisel Blog', 'İş Profili'],
    summaryTemplate: (answer) => `Sitenin amacı: ${answer}`,
    promptTemplate: (answer) => `Purpose: ${answer === 'CV/Özgeçmiş' ? 'CV/Resume' : answer === 'Link-in-Bio' ? 'Link-in-Bio' : answer}`
  },
  
  // Q2: Name (text)
  {
    id: 'q02',
    type: 'text',
    question: 'Adınız ve Soyadınız?',
    summaryTemplate: (answer) => `İsim: ${answer}`,
    promptTemplate: (answer) => `Name: ${answer}`
  },
  
  // Q3: Headline (text)
  {
    id: 'q03',
    type: 'text',
    question: 'Profesyonel başlık/Unvanınız? (örn: Senior Developer, UX Designer)',
    summaryTemplate: (answer) => `Unvan: ${answer}`,
    promptTemplate: (answer) => `Headline: ${answer}`
  },
  
  // Q4: Language (multi)
  {
    id: 'q04',
    type: 'multi',
    question: 'Web sitesi hangi dillerde olsun?',
    options: ['Türkçe', 'İngilizce'],
    summaryTemplate: (answer) => `Dil: ${Array.isArray(answer) ? answer.join(' + ') : answer}`,
    promptTemplate: (answer) => `Languages: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  
  // Q5: Sections (multi)
  {
    id: 'q05',
    type: 'multi',
    question: 'Hangi bölümler olsun?',
    options: ['Hakkımda', 'Deneyim', 'Projeler', 'Eğitim', 'İletişim', 'Blog'],
    summaryTemplate: (answer) => `Bölümler: ${Array.isArray(answer) ? answer.join(', ') : answer}`,
    promptTemplate: (answer) => `Sections: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  
  // Q6: Contact methods (multi)
  {
    id: 'q06',
    type: 'multi',
    question: 'Hangi iletişim yöntemleri gösterilsin?',
    options: ['E-posta', 'Telefon', 'LinkedIn', 'Twitter/X', 'Instagram', 'GitHub'],
    summaryTemplate: (answer) => `İletişim: ${Array.isArray(answer) ? answer.join(', ') : answer}`,
    promptTemplate: (answer) => `Contact methods: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  
  // Q7: Social links (multi)
  {
    id: 'q07',
    type: 'multi',
    question: 'Hangi sosyal medya linklerini ekleyelim?',
    options: ['LinkedIn', 'Twitter/X', 'Instagram', 'GitHub', 'YouTube', 'Behance'],
    summaryTemplate: (answer) => `Sosyal medya: ${Array.isArray(answer) ? answer.join(', ') : 'Yok'}`,
    promptTemplate: (answer) => `Social links: ${Array.isArray(answer) ? answer.join(', ') : 'None'}`
  },
  
  // Q8: Photo (yesno)
  {
    id: 'q08',
    type: 'yesno',
    question: 'Profesyonel fotoğrafınız var mı?',
    summaryTemplate: (answer) => `Fotoğraf: ${answer === 'true' ? 'Var' : 'Yok'}`,
    promptTemplate: (answer) => `Photo: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q9: Theme vibe (single)
  {
    id: 'q09',
    type: 'single',
    question: 'Tasarım tarzı?',
    options: ['Minimal', 'Modern', 'Kreatif', 'Kurumsal', 'Kişisel'],
    summaryTemplate: (answer) => `Tasarım: ${answer}`,
    promptTemplate: (answer) => `Theme: ${answer}`
  },
  
  // Q10: Primary color (single)
  {
    id: 'q10',
    type: 'single',
    question: 'Ana renk tercihi?',
    options: ['Siyah/Beyaz', 'Mavi', 'Mor', 'Yeşil', 'Turuncu', 'Kırmızı', 'Pastel'],
    summaryTemplate: (answer) => `Renk: ${answer}`,
    promptTemplate: (answer) => `Primary color: ${answer}`
  },
  
  // Q11: CTA style (single)
  {
    id: 'q11',
    type: 'single',
    question: 'Ana çağrı butonu stili?',
    options: ['İletişime Geçin', 'Portföyü Görüntüle', 'CV İndir', 'Projeleri Keşfet', 'Blogu Oku'],
    summaryTemplate: (answer) => `Ana buton: ${answer}`,
    promptTemplate: (answer) => `CTA: ${answer}`
  },
  
  // Q12: Content tone (single)
  {
    id: 'q12',
    type: 'single',
    question: 'İçerik üslubu?',
    options: ['Profesyonel', 'Samimi', 'Yaratıcı', 'Resmi', 'Eğlenceli'],
    summaryTemplate: (answer) => `Üslup: ${answer}`,
    promptTemplate: (answer) => `Tone: ${answer}`
  },
  
  // Q13: Top 3 highlights (multi - max 3)
  {
    id: 'q13',
    type: 'multi',
    question: 'Öne çıkarılacak 3 özellik?',
    options: ['Deneyim', 'Beceriler', 'Projeler', 'Eğitim', 'Başarılar', 'Teknolojiler'],
    summaryTemplate: (answer) => `Öne çıkanlar: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`,
    promptTemplate: (answer) => `Highlights: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`
  },
  
  // Q14: Work status (single)
  {
    id: 'q14',
    type: 'single',
    question: 'Şu anki çalışma durumunuz?',
    options: ['Tam Zamanlı Çalışıyorum', 'Freelancer', 'İş Arıyorum', 'Öğrenci', 'Emekli', 'Diğer'],
    summaryTemplate: (answer) => `Durum: ${answer}`,
    promptTemplate: (answer) => `Work status: ${answer}`
  },
  
  // Q15: Location (yesno)
  {
    id: 'q15',
    type: 'yesno',
    question: 'Konum bilgisi gösterilsin mi?',
    summaryTemplate: (answer) => `Konum: ${answer === 'true' ? 'Göster' : 'Gizle'}`,
    promptTemplate: (answer) => `Show location: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q16: Testimonials (yesno)
  {
    id: 'q16',
    type: 'yesno',
    question: 'Referanslar/Testimonial eklenmeli mi?',
    summaryTemplate: (answer) => `Referanslar: ${answer === 'true' ? 'Evet' : 'Hayır'}`,
    promptTemplate: (answer) => `Testimonials: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q17: Projects count (single)
  {
    id: 'q17',
    type: 'single',
    question: 'Kaç proje gösterilsin?',
    options: ['3', '5', '10', 'Hepsi', 'Yok'],
    summaryTemplate: (answer) => `Proje sayısı: ${answer}`,
    promptTemplate: (answer) => `Projects: ${answer}`
  },
  
  // Q18: Blog (yesno)
  {
    id: 'q18',
    type: 'yesno',
    question: 'Blog bölümü olsun mu?',
    summaryTemplate: (answer) => `Blog: ${answer === 'true' ? 'Evet' : 'Hayır'}`,
    promptTemplate: (answer) => `Blog: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q19: Download CV (yesno)
  {
    id: 'q19',
    type: 'yesno',
    question: 'CV indirme butonu olsun mu?',
    summaryTemplate: (answer) => `CV indirme: ${answer === 'true' ? 'Evet' : 'Hayır'}`,
    promptTemplate: (answer) => `CV download: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q20: Domain/Username (single)
  {
    id: 'q20',
    type: 'single',
    question: 'Tercih ettiğiniz domain/username?',
    options: ['Adınız (örn: ahmet-yilmaz)', 'Unvan (örn: senior-developer)', 'İş adı', 'Fikir yok'],
    summaryTemplate: (answer) => `Domain tercihi: ${answer}`,
    promptTemplate: (answer) => `Domain preference: ${answer}`
  }
];

// User-friendly summary builder (Turkish, non-technical)
export function buildUserSummary(answers) {
  const lines = [];
  
  QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    if (answer !== undefined && answer !== null && answer !== '') {
      lines.push(q.summaryTemplate(answer));
    }
  });
  
  return lines.join('\n');
}

// AI prompt builder (deterministic compilation)
export function buildAiPrompt(answers, longText) {
  const parts = [];
  
  parts.push('Personal Website Requirements:\n');
  
  QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    if (answer !== undefined && answer !== null && answer !== '') {
      parts.push(q.promptTemplate(answer));
    }
  });
  
  if (longText && longText.trim()) {
    parts.push(`\nAdditional Notes:\n${longText}`);
  }
  
  return parts.join('\n');
}
