// 20 Soru Konfigürasyonu - Yeni Liste
export const QUESTIONS = [
  // Q1: Site amacı
  {
    id: 'q01',
    type: 'single',
    question: 'Bu site senin için ne yapsın?',
    options: ['İş bulmama yardım etsin', 'Bana müşteri getirsin', 'Kişisel markamı güçlendirsin', 'Dijital kartvizitim olsun', 'Hepsinden biraz'],
    summaryTemplate: (answer) => `Site amacı: ${answer}`,
    promptTemplate: (answer) => `Site purpose: ${answer}`
  },
  
  // Q2: Algı
  {
    id: 'q02',
    type: 'single',
    question: 'Siteye giren biri seni nasıl algılasın?',
    options: ['Profesyonel', 'Güven veren', 'Yaratıcı', 'Samimi', 'Güçlü'],
    summaryTemplate: (answer) => `Algı: ${answer}`,
    promptTemplate: (answer) => `Perception: ${answer}`
  },
  
  // Q3: Hedef kitle
  {
    id: 'q03',
    type: 'single',
    question: 'Site en çok kime hitap etsin?',
    options: ['İşveren / HR', 'Müşteri', 'Teknik insanlar', 'Teknik olmayan insanlar', 'Herkes'],
    summaryTemplate: (answer) => `Hedef kitle: ${answer}`,
    promptTemplate: (answer) => `Target audience: ${answer}`
  },
  
  // Q4: Genel tasarım hissi
  {
    id: 'q04',
    type: 'single',
    question: 'Genel tasarım hissi',
    options: ['Sade & net', 'Modern & şık', 'Cesur & farklı', 'Kurumsal', 'Kişisel'],
    summaryTemplate: (answer) => `Genel tasarım hissi: ${answer}`,
    promptTemplate: (answer) => `General design vibe: ${answer}`
  },
  
  // Q5: Tasarımda öne çıkan
  {
    id: 'q05',
    type: 'single',
    question: 'Tasarımda ne öne çıksın?',
    options: ['Metin ağırlıklı', 'Görsel ağırlıklı', 'Dengeli', 'Minimum her şey'],
    summaryTemplate: (answer) => `Tasarımda öne çıkan: ${answer}`,
    promptTemplate: (answer) => `Design focus: ${answer}`
  },
  
  // Q6: Ziyaretçi tüketim şekli
  {
    id: 'q06',
    type: 'single',
    question: 'Ziyaretçi siteyi nasıl tüketsin?',
    options: ['Hızlıca göz atsın', 'Detaylı incelesin', 'Aşağı doğru akıp gitsin', 'Sadece önemli başlıklar'],
    summaryTemplate: (answer) => `Ziyaretçi tüketim şekli: ${answer}`,
    promptTemplate: (answer) => `Visitor consumption pattern: ${answer}`
  },
  
  // Q7: Sayfa yapısı
  {
    id: 'q07',
    type: 'single',
    question: 'Sayfa yapısı nasıl olsun?',
    options: ['Tek sayfa (one-page)', 'Bölümlere ayrılmış', 'Kısa ama vurucu', 'Detaylı ama düzenli'],
    summaryTemplate: (answer) => `Sayfa yapısı: ${answer}`,
    promptTemplate: (answer) => `Page structure: ${answer}`
  },
  
  // Q8: Öne çıkan bölümler (multi, max 3)
  {
    id: 'q08',
    type: 'multi',
    question: 'Hangi bölümler özellikle öne çıksın?',
    options: ['Deneyim', 'Projeler', 'Beceriler', 'Eğitim', 'İletişim'],
    summaryTemplate: (answer) => `Öne çıkan bölümler: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`,
    promptTemplate: (answer) => `Highlighted sections: ${Array.isArray(answer) ? answer.slice(0, 3).join(', ') : answer}`
  },
  
  // Q9: Proje sunumu
  {
    id: 'q09',
    type: 'single',
    question: 'Projeler nasıl sunulsun?',
    options: ['Kart kart', 'Liste halinde', 'Az ama seçilmiş', 'Hepsi ama sade'],
    summaryTemplate: (answer) => `Proje sunumu: ${answer}`,
    promptTemplate: (answer) => `Project display: ${answer}`
  },
  
  // Q10: Ana sayfada ilk görünen
  {
    id: 'q10',
    type: 'single',
    question: 'Ana sayfada ilk ne görülsün?',
    options: ['Güçlü bir giriş alanı', 'Net bir çağrı butonu', 'Görsel ağırlıklı alan', 'Kısa özet + devamı'],
    summaryTemplate: (answer) => `Ana sayfada ilk görünen: ${answer}`,
    promptTemplate: (answer) => `First thing on homepage: ${answer}`
  },
  
  // Q11: Renk yaklaşımı
  {
    id: 'q11',
    type: 'single',
    question: 'Renk yaklaşımı',
    options: ['Siyah / Beyaz', 'Soğuk tonlar', 'Sıcak tonlar', 'Pastel', 'Sürprize açığım'],
    summaryTemplate: (answer) => `Renk yaklaşımı: ${answer}`,
    promptTemplate: (answer) => `Color approach: ${answer}`
  },
  
  // Q12: Yazı dili hissi
  {
    id: 'q12',
    type: 'single',
    question: 'Yazı dili hissi',
    options: ['Resmi', 'Profesyonel ama sıcak', 'Samimi', 'Yaratıcı', 'Minimal'],
    summaryTemplate: (answer) => `Yazı dili hissi: ${answer}`,
    promptTemplate: (answer) => `Writing tone: ${answer}`
  },
  
  // Q13: Site duygusu
  {
    id: 'q13',
    type: 'single',
    question: 'Site hangi duyguyu versin?',
    options: ['"Bu kişi işini biliyor"', '"Bununla çalışılır"', '"Bu farklı"', '"Güvenilir biri"'],
    summaryTemplate: (answer) => `Site duygusu: ${answer}`,
    promptTemplate: (answer) => `Site feeling: ${answer}`
  },
  
  // Q14: Ana aksiyon
  {
    id: 'q14',
    type: 'single',
    question: 'Ana aksiyon ne olsun?',
    options: ['İletişime geç', 'CV indir', 'Projeleri gör', 'Sadece incelensin'],
    summaryTemplate: (answer) => `Ana aksiyon: ${answer}`,
    promptTemplate: (answer) => `Main CTA: ${answer}`
  },
  
  // Q15: Site dili
  {
    id: 'q15',
    type: 'multi',
    question: 'Site dili',
    options: ['Türkçe', 'İngilizce'],
    summaryTemplate: (answer) => `Site dili: ${Array.isArray(answer) ? answer.join(' + ') : answer}`,
    promptTemplate: (answer) => `Languages: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  
  // Q16: Konum bilgisi
  {
    id: 'q16',
    type: 'single',
    question: 'Konum bilgisi',
    options: ['Gösterilsin', 'Gösterilmesin'],
    summaryTemplate: (answer) => `Konum bilgisi: ${answer}`,
    promptTemplate: (answer) => `Show location: ${answer === 'Gösterilsin' ? 'Yes' : 'No'}`
  },
  
  // Q17: Sosyal bağlantılar
  {
    id: 'q17',
    type: 'multi',
    question: 'Sosyal bağlantılar',
    options: ['LinkedIn', 'GitHub', 'Instagram', 'X / Twitter', 'YouTube', 'Behance'],
    summaryTemplate: (answer) => `Sosyal bağlantılar: ${Array.isArray(answer) ? answer.join(', ') : 'Yok'}`,
    promptTemplate: (answer) => `Social links: ${Array.isArray(answer) ? answer.join(', ') : 'None'}`
  },
  
  // Q18: Site karakteri
  {
    id: 'q18',
    type: 'single',
    question: 'Site karakteri',
    options: ['Düz & ciddi', 'Hafif esprili', 'Net & direkt', 'Yumuşak & akıcı'],
    summaryTemplate: (answer) => `Site karakteri: ${answer}`,
    promptTemplate: (answer) => `Site character: ${answer}`
  },
  
  // Q19: İçerik yoğunluğu
  {
    id: 'q19',
    type: 'single',
    question: 'İçerik yoğunluğu',
    options: ['Az ama vurucu', 'Dengeli', 'Detaylı'],
    summaryTemplate: (answer) => `İçerik yoğunluğu: ${answer}`,
    promptTemplate: (answer) => `Content density: ${answer}`
  },
  
  // Q20: Genel yaklaşım
  {
    id: 'q20',
    type: 'single',
    question: 'Genel yaklaşım',
    options: ['Klasik', 'Modern', 'Deneysel', 'Güvenli tarafta'],
    summaryTemplate: (answer) => `Genel yaklaşım: ${answer}`,
    promptTemplate: (answer) => `General approach: ${answer}`
  },
  
  // Q21: İletişim kanalları
  {
    id: 'q21',
    type: 'multi',
    question: 'Aşağıdaki kanallardan hangileriyle size ulaşabiliriz?',
    options: ['WhatsApp (Hızlı)', 'LinkedIn (Normal)', 'Mail (Yavaş)', 'Duman (Çok Yavaş)'],
    summaryTemplate: (answer) => `İletişim kanalları: ${Array.isArray(answer) ? answer.join(', ') : answer}`,
    promptTemplate: (answer) => `Contact channels: ${Array.isArray(answer) ? answer.join(', ') : answer}`
  },
  
  // Q22: Portfolyo izni
  {
    id: 'q22',
    type: 'yesno',
    question: 'Sayfanızı bitirdikten sonra portfolyomuza ekleyebilir miyiz?',
    options: ['Evet', 'Hayır'],
    summaryTemplate: (answer) => `Portfolyoya ekleme izni: ${answer === 'true' ? 'Evet' : 'Hayır'}`,
    promptTemplate: (answer) => `Portfolio permission: ${answer === 'true' ? 'Yes' : 'No'}`
  },
  
  // Q23: Tavsiye etme
  {
    id: 'q23',
    type: 'yesno',
    question: 'Sayfanızı beğendiğiniz takdirde bizi arkadaşlarınıza tavsiye eder misiniz?',
    options: ['Evet', 'Hayır'],
    summaryTemplate: (answer) => `Tavsiye etme: ${answer === 'true' ? 'Evet' : 'Hayır'}`,
    promptTemplate: (answer) => `Recommendation: ${answer === 'true' ? 'Yes' : 'No'}`
  },

  // Q24: Ad Soyad
  {
    id: 'q24',
    type: 'text',
    question: 'Adınız Soyadınız',
    options: [],
    summaryTemplate: (answer) => `Ad Soyad: ${answer}`,
    promptTemplate: (answer) => `Full name: ${answer}`
  }

  // Fotoğraf ve CV yükleme adımları wizard.js'de ayrı adımlar olarak zaten var
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
