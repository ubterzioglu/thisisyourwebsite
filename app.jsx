import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Smartphone, 
  Palette, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Star, 
  MessageSquare, 
  Send,
  ChevronDown,
  Mail,
  Edit,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Globe
} from 'lucide-react';

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentView, setCurrentView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [summaryData, setSummaryData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const controls = useAnimation();
  const formSectionRef = useRef(null);

  // SEO metadata setup - simplified for React compatibility
  useEffect(() => {
    const updateMetaTags = () => {
      // Basic meta tags that are safe to update in React
      document.title = "thisisyour.website | Affordable Personal Websites for Gen Z";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Get your custom personal website in 60 seconds. Affordable prices starting under $200. 24-hour quotes, 48-hour delivery for Gen Z creators.');
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = 'Get your custom personal website in 60 seconds. Affordable prices starting under $200. 24-hour quotes, 48-hour delivery for Gen Z creators.';
        document.head.appendChild(newMeta);
      }
    };

    updateMetaTags();
  }, [currentView, currentStep]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 100) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 20 });
    }
  }, [scrollY, controls]);

  // Form questions
  const questions = [
    {
      id: 1,
      text: "What's the primary purpose of your website?",
      type: "single",
      options: ["Personal Portfolio", "Business/Band", "Blog/Vlog", "Online Store", "Resume/CV"],
      required: true
    },
    {
      id: 2,
      text: "Which social media platforms do you use most?",
      type: "multiple",
      options: ["Instagram", "TikTok", "Twitter/X", "YouTube", "Discord", "Pinterest", "None"],
      required: true
    },
    {
      id: 3,
      text: "How would you describe your personal aesthetic?",
      type: "single",
      options: ["Minimal & Clean", "Bold & Colorful", "Dark Mode", "Vintage/Retro", "Abstract/Experimental"],
      required: true
    },
    {
      id: 4,
      text: "Do you need e-commerce functionality?",
      type: "single",
      options: ["Yes, full store", "Just donations/tips", "No, not needed"],
      required: true
    },
    {
      id: 5,
      text: "Which features are essential for you?",
      type: "multiple",
      options: ["Contact Form", "Photo Gallery", "Video Integration", "Blog Section", "Music Player", "Booking System"],
      required: true
    },
    {
      id: 6,
      text: "How tech-savvy are you?",
      type: "single",
      options: ["Total beginner", "Basic skills", "Comfortable with tech", "Developer-level"],
      required: true
    },
    {
      id: 7,
      text: "Preferred color palette?",
      type: "single",
      options: ["Neutrals (B&W/Grays)", "Pastels", "Vibrant/Neon", "Earthy Tones", "Let designer decide"],
      required: true
    },
    {
      id: 8,
      text: "Do you have existing brand assets?",
      type: "multiple",
      options: ["Logo", "Brand Colors", "Fonts", "Style Guide", "Nothing yet"],
      required: true
    },
    {
      id: 9,
      text: "What's your timeline?",
      type: "single",
      options: ["ASAP (1-3 days)", "1 week", "2-3 weeks", "1 month+", "Flexible"],
      required: true
    },
    {
      id: 10,
      text: "Which websites inspire you? (Share URLs or names)",
      type: "text",
      placeholder: "e.g., apple.com, your favorite artist's site, etc.",
      required: false
    },
    {
      id: 11,
      text: "How many pages do you need?",
      type: "single",
      options: ["1-3 pages", "4-6 pages", "7-10 pages", "10+ pages"],
      required: true
    },
    {
      id: 12,
      text: "Will you update content yourself?",
      type: "single",
      options: ["Yes, regularly", "Occasionally", "No, I'll hire someone"],
      required: true
    },
    {
      id: 13,
      text: "Target audience age group?",
      type: "multiple",
      options: ["Gen Z (13-24)", "Millennials (25-40)", "Gen X (41-56)", "Boomers (57+)", "All ages"],
      required: true
    },
    {
      id: 14,
      text: "Do you need mobile app integration?",
      type: "single",
      options: ["Yes, essential", "Nice to have", "No need"],
      required: true
    },
    {
      id: 15,
      text: "What's your budget range?",
      type: "single",
      options: ["Under $200", "$200-$500", "$500-$1000", "$1000+"],
      required: true
    },
    {
      id: 16,
      text: "Must-have animations/interactions?",
      type: "multiple",
      options: ["Page transitions", "Scroll effects", "Hover animations", "3D elements", "None preferred"],
      required: true
    },
    {
      id: 17,
      text: "Will you provide content (text/images)?",
      type: "single",
      options: ["Yes, all ready", "Partial content", "Need full content creation"],
      required: true
    },
    {
      id: 18,
      text: "Domain & hosting preference?",
      type: "single",
      options: ["I have both", "Need domain only", "Need hosting only", "Need both"],
      required: true
    },
    {
      id: 19,
      text: "SEO/social media optimization needed?",
      type: "single",
      options: ["Yes, critical", "Somewhat important", "Not needed"],
      required: true
    },
    {
      id: 20,
      text: "Where are you based? (This helps us optimize for local search)",
      type: "text",
      placeholder: "City, State/Province, Country (e.g., Los Angeles, California, USA)",
      required: true
    }
  ];

  const steps = [
    { number: 1, questions: questions.slice(0, 4) },
    { number: 2, questions: questions.slice(4, 8) },
    { number: 3, questions: questions.slice(8, 12) },
    { number: 4, questions: questions.slice(12, 16) },
    { number: 5, questions: questions.slice(16, 20) }
  ];

  // Form handling functions
  const handleAnswer = (questionId, answer) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const currentQuestions = steps.find(step => step.number === currentStep)?.questions || [];
    
    // Validate required questions
    const hasUnansweredRequired = isNextDisabled(currentQuestions, formData);
    
    if (hasUnansweredRequired) {
      // Show validation message or highlight missing fields
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      generateSummary();
      setCurrentView('summary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('landing');
    }
  };

  const generateSummary = () => {
    const completedQuestions = questions.map(q => ({
      ...q,
      answer: formData[q.id] || 'Not answered'
    }));
    
    // Generate AI-style summary based on answers
    const vibe = completedQuestions.find(q => q.id === 3)?.answer || "Minimal & Clean";
    const purpose = completedQuestions.find(q => q.id === 1)?.answer || "Personal Portfolio";
    const timeline = completedQuestions.find(q => q.id === 9)?.answer || "Flexible";
    const budget = completedQuestions.find(q => q.id === 15)?.answer || "Under $200";
    const location = completedQuestions.find(q => q.id === 20)?.answer || "United States";
    
    const aiSummary = `
      Based on your responses, we're designing a ${vibe.toLowerCase()} ${purpose.toLowerCase()} website that captures your unique digital identity.

      Key highlights:
      - Timeline: ${timeline} delivery
      - Budget-friendly solution in the ${budget.toLowerCase()} range
      - Features tailored for Gen Z engagement
      - Mobile-optimized with your preferred aesthetic
      - SEO optimized for search in ${location}

      This quote includes domain setup, responsive design, local SEO optimization, and 1-week support after launch. We'll email your custom quote within 24 hours!
    `;
    
    setSummaryData({
      questions: completedQuestions,
      aiSummary,
      location
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Question rendering helper
  const renderQuestion = (question) => {
    const answer = formData[question.id];
    
    switch(question.type) {
      case 'single':
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${question.id}`}>
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answer === option 
                    ? 'border-[#6366f1] bg-[#6366f1]/5' 
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
                aria-pressed={answer === option}
                aria-label={option}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );
        
      case 'multiple':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="group" aria-labelledby={`question-${question.id}`}>
            {question.options.map((option, index) => {
              const isSelected = Array.isArray(answer) && answer.includes(option);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newAnswer = isSelected 
                      ? answer.filter(item => item !== option)
                      : [...(answer || []), option];
                    handleAnswer(question.id, newAnswer);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-[#8b5cf6] bg-[#8b5cf6]/10' 
                      : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={option}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        );
        
      case 'text':
        return (
          <textarea
            value={answer || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 rounded-xl border-2 border-[#e2e8f0] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all min-h-[120px] resize-y"
            aria-label={question.text}
            aria-required={question.required}
          />
        );
        
      default:
        return null;
    }
  };

  // View handlers
  if (currentView === 'form') {
    const currentQuestions = steps.find(step => step.number === currentStep)?.questions || [];
    
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-6 overflow-x-hidden" ref={formSectionRef}>
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-12" aria-live="polite">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-[#6366f1]">{currentStep}/5</span>
              <span className="font-medium text-[#6366f1]">{Math.round((currentStep/5)*100)}%</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep/5)*100}%` }}
                transition={{ duration: 0.5 }}
                role="progressbar"
                aria-valuenow={Math.round((currentStep/5)*100)}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
          
          {/* Questions */}
          <motion.div 
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {currentQuestions.map((question, index) => (
              <motion.div 
                key={question.id} 
                variants={fadeInUp}
                className="bg-white p-6 md:p-8 rounded-2xl border border-[#e2e8f0] shadow-sm"
                id={`question-${question.id}`}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold mr-3 flex-shrink-0" aria-hidden="true">
                    {question.id}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b]">{question.text}</h3>
                </div>
                {renderQuestion(question)}
                {question.required && (
                  <span className="text-xs text-[#6366f1] mt-2 inline-block" aria-hidden="true">* Required</span>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-12 pt-8 border-t border-[#e2e8f0] gap-4">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={handleBack}
              className="flex items-center text-[#475569] hover:text-[#6366f1] transition-colors font-medium w-full sm:w-auto justify-center sm:justify-start"
              aria-label={currentStep === 1 ? "Back to home" : "Previous step"}
            >
              <ArrowLeft className="mr-2" size={20} />
              {currentStep === 1 ? "Back to home" : "Previous step"}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className={`bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center transition-all w-full sm:w-auto ${
                isNextDisabled(currentQuestions, formData) ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              aria-label={currentStep < 5 ? "Next step" : "Generate Quote"}
              disabled={isNextDisabled(currentQuestions, formData)}
            >
              {currentStep < 5 ? "Next step" : "Generate Quote"}
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </div>
        </div>
        
        {/* Floating decoration */}
        <div className="fixed bottom-8 right-8 w-32 h-32 bg-[#6366f1]/10 rounded-full blur-3xl" aria-hidden="true" />
      </div>
    );
  }
  
  if (currentView === 'summary') {
    if (!summaryData) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f8fafc] pt-24 pb-12 px-4 md:px-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 backdrop-blur-sm mb-4">
              <span className="text-[#8b5cf6] font-medium flex items-center justify-center">
                <Brain className="mr-2" size={16} aria-hidden="true" /> AI-Powered Quote Summary
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e293b] to-[#475569] bg-clip-text text-transparent">
              Your Custom Website Proposal
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Review your personalized quote before we finalize it. Make any adjustments below.
            </p>
          </motion.div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-[#e2e8f0] overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <MessageSquare className="mr-3" size={28} aria-hidden="true" />
                Your Website Vision
              </h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-8">
              <div className="prose prose-lg max-w-none">
                <div className="bg-[#f1f5f9] border-l-4 border-[#6366f1] p-5 rounded-r-lg mb-6">
                  <p className="text-[#1e293b] whitespace-pre-line">{summaryData.aiSummary}</p>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Detailed Responses</h3>
                
                {summaryData.questions.map((q, index) => (
                  <div key={q.id} className="mb-6 pb-6 border-b border-[#e2e8f0] last:border-b-0">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-1" aria-hidden="true">
                        {q.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#1e293b] mb-1">{q.text}</h4>
                        <div className="text-[#475569]">
                          {q.type === 'multiple' && Array.isArray(q.answer) 
                            ? q.answer.join(', ') 
                            : q.answer.toString()}
                        </div>
                        {q.id === 20 && summaryData.location && (
                          <div className="mt-2 flex items-center text-sm text-[#6366f1]">
                            <MapPin size={16} className="mr-1" aria-hidden="true" />
                            <span>SEO optimized for local search in {summaryData.location}</span>
                          </div>
                        )}
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            setCurrentStep(Math.ceil(q.id / 4));
                            setCurrentView('form');
                          }}
                          className="mt-2 text-sm text-[#6366f1] flex items-center hover:text-[#4f46e5] transition-colors"
                          aria-label={`Edit answer for question ${q.id}`}
                        >
                          <Edit className="mr-1" size={16} aria-hidden="true" />
                          Edit answer
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('form')}
              className="bg-white border-2 border-[#e2e8f0] text-[#475569] font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:border-[#cbd5e1] transition-all"
              aria-label="Make changes to your answers"
            >
              <RefreshCw className="mr-2" size={20} aria-hidden="true" />
              Make Changes
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-70"
              aria-label="Finalize and submit your quote request"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Send size={20} aria-hidden="true" />
                  </motion.div>
                  <span>Sending Quote...</span>
                </span>
              ) : (
                <span className="flex items-center">
                  Finalize Quote <ArrowRight className="ml-2" size={20} aria-hidden="true" />
                </span>
              )}
            </motion.button>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-[#e2e8f0]">
            <div className="flex items-start">
              <Mail className="text-[#6366f1] mr-4 mt-1 flex-shrink-0" size={24} aria-hidden="true" />
              <div>
                <h3 className="font-bold text-xl mb-2 text-[#1e293b]">What happens next?</h3>
                <ul className="space-y-2 text-[#475569]">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>We'll email your detailed quote within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Includes SEO optimization for your location ({summaryData.location || 'United States'})</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Launch your stunning website in just 48 hours after approval</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (currentView === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          role="alert"
          aria-labelledby="confirmation-title"
        >
          <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] p-8 text-center">
            <CheckCircle size={64} className="text-white mx-auto mb-4" aria-hidden="true" />
            <h1 id="confirmation-title" className="text-3xl font-bold text-white mb-2">Quote Sent!</h1>
            <p className="text-[#e0e7ff] text-lg">Check your inbox in the next 24 hours</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-green-50 rounded-full text-green-700 font-medium mb-4">
                <span className="flex items-center justify-center">
                  <Star className="mr-2" size={16} aria-hidden="true" /> Premium Gen Z Experience
                </span>
              </div>
              
              <p className="text-[#475569] text-lg mb-6">
                Your custom website quote is on its way! We've combined your answers with our AI-powered pricing to create the perfect solution for your digital presence.
              </p>
              
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 mb-6">
                <h3 className="font-bold text-xl text-[#1e293b] mb-3">What's included:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Custom domain setup (thisisyour.website)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Mobile-optimized responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Gen-Z friendly aesthetic with animations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>Local SEO optimization for your region</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                    <span>1-week post-launch support</span>
                  </li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentView('landing');
                  setCurrentStep(1);
                  setFormData({});
                  setSummaryData(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold w-full py-4 rounded-xl text-lg flex items-center justify-center hover:shadow-lg transition-all"
                aria-label="Return to homepage"
              >
                <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
                Back to Homepage
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Landing page view
  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <motion.nav 
        className="fixed w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300"
        style={{ 
          backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
          boxShadow: scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <motion.div 
          className="font-bold text-xl md:text-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          thisisyour.website
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('form')}
          className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
          aria-label="Start building your website"
        >
          Build Your Site
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} aria-hidden="true" />
        </motion.button>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 px-6 md:px-12 relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-[#8b5cf6] font-medium flex items-center justify-center">
              <Zap className="mr-2" size={16} aria-hidden="true" /> 
              Get your dream website in 60 seconds
            </span>
          </motion.div>
          
          <motion.h1 
            id="hero-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[#1e293b] to-[#475569] bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Your perfect website, <span className="relative">designed just for you</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-[#475569] max-w-3xl mx-auto mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Answer 20 quick questions and get a custom website quote in seconds. No hidden fees, no surprises.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentView('form');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              aria-label="Start building your website now"
            >
              Start Building <ArrowRight className="ml-3" size={24} aria-hidden="true" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#475569] font-medium text-lg px-8 py-4 rounded-xl border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all duration-300"
              aria-label="See example websites"
            >
              See Examples
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" aria-hidden="true"></div>
              <motion.div 
                className="relative bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-[#e2e8f0]"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                aria-label="Interactive website preview"
              >
                <div className="bg-gradient-to-r from-[#4f46e5]/10 to-[#7c3aed]/10 border border-[#e2e8f0] rounded-xl overflow-hidden">
                  <div className="h-12 bg-[#f8fafc] flex items-center px-4 border-b border-[#e2e8f0]">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" aria-label="Close button"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffd166]" aria-label="Minimize button"></div>
                      <div className="w-3 h-3 rounded-full bg-[#06d6a0]" aria-label="Maximize button"></div>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-2" aria-hidden="true">*</div>
                      <p className="text-xl font-medium">Your Future Website</p>
                      <p className="text-[#e0e7ff] mt-1">Personalized preview loading...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#6366f1]/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#8b5cf6]/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-[#0ea5e9]/10 rounded-full blur-2xl" aria-hidden="true"></div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-[#f8fafc]" aria-labelledby="value-heading">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="value-heading" className="text-3xl md:text-4xl font-bold mb-4 text-[#1e293b]">Why Gen Z loves us</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              We've reimagined web design for the digital native generation. No jargon, no complexity - just beautiful sites at prices that make sense.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Smartphone size={48} className="text-[#6366f1]" aria-hidden="true" />,
                title: "Mobile-First Magic",
                description: "Your site looks stunning on every device, especially phones where you spend most of your time."
              },
              {
                icon: <Palette size={48} className="text-[#6366f1]" aria-hidden="true" />,
                title: "Aesthetic Alchemy",
                description: "Choose from designer-curated templates or create your own unique visual identity."
              },
              {
                icon: <Zap size={48} className="text-[#6366f1]" aria-hidden="true" />,
                title: "Lightning Fast",
                description: "Blazing speed optimized for short attention spans and instant gratification."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e2e8f0] hover:border-[#cbd5e1] group"
                role="region"
                aria-labelledby={`feature-${index}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 id={`feature-${index}`} className="text-2xl font-bold mb-3 text-[#1e293b]">{item.title}</h3>
                <p className="text-[#475569] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 md:px-12 bg-white" aria-labelledby="process-heading">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="process-heading" className="text-3xl md:text-4xl font-bold mb-4 text-[#1e293b]">How it works</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Just 3 simple steps to get your dream website. Seriously, it's easier than ordering coffee.
            </p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Connection lines */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] transform -translate-x-1/2" aria-hidden="true"></div>
            
            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.7 }}
                className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                role="region"
                aria-labelledby={`step-${step}`}
              >
                <div className={`w-full md:w-5/12 mb-8 md:mb-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 border border-[#e2e8f0] rounded-2xl p-6 md:p-8 h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold mr-4 flex-shrink-0" aria-hidden="true">
                        {step}
                      </div>
                      <h3 id={`step-${step}`} className="text-2xl font-bold text-[#1e293b]">Step {step}</h3>
                    </div>
                    <p className="text-[#475569] text-lg">
                      {step === 1 && "Answer 20 super quick questions about your style, needs, and preferences."}
                      {step === 2 && "Get an instant price quote with zero hidden fees or surprises."}
                      {step === 3 && "Launch your beautiful new website in 48 hours flat."}
                    </p>
                  </div>
                </div>
                
                <div className="w-full md:w-2/12 flex justify-center mb-8 md:mb-0 z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white"
                    aria-label={`Step ${step} process`}
                  >
                    {step}
                  </motion.div>
                </div>
                
                <div className="w-full md:w-5/12">
                  <div className="h-64 md:h-80 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-2xl border border-[#e2e8f0] flex items-center justify-center overflow-hidden">
                    {step === 1 && (
                      <div className="text-center p-4">
                        <MessageSquare size={64} className="text-[#6366f1] mx-auto mb-4" aria-hidden="true" />
                        <p className="text-xl font-medium text-[#1e293b]">Intuitive Questionnaire</p>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="text-center p-4">
                        <Brain size={64} className="text-[#6366f1] mx-auto mb-4" aria-hidden="true" />
                        <p className="text-xl font-medium text-[#1e293b]">AI-Powered Pricing</p>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="text-center p-4">
                        <Send size={64} className="text-[#6366f1] mx-auto mb-4" aria-hidden="true" />
                        <p className="text-xl font-medium text-[#1e293b]">Instant Launch</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#f8fafc] to-white" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4 text-[#1e293b]">Trusted by digital natives</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Don't just take our word for it - here's what Gen Z creators are saying
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Alex Rivera",
                role: "Content Creator - 500K followers",
                content: "I got my portfolio site for less than my monthly coffee budget. Got hired by Nike the week after launching!",
                avatar: "https://placehold.co/80x80/6366f1/white?text=AR"
              },
              {
                name: "Maya Chen",
                role: "Digital Artist - NFT Creator",
                content: "The questionnaire actually understood my aesthetic. My site turned out better than ones I've paid $3k for.",
                avatar: "https://placehold.co/80x80/8b5cf6/white?text=MC"
              },
              {
                name: "Jordan Kim",
                role: "Student Entrepreneur",
                content: "As a broke college student, this was the only option that made sense. My startup site looks more expensive than it is.",
                avatar: "https://placehold.co/80x80/4f46e5/white?text=JK"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-md border border-[#e2e8f0] relative overflow-hidden group"
                role="region"
                aria-labelledby={`testimonial-${index}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-5">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex mb-1" aria-label="5 star rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} className="text-[#fbbf24]" fill="#fbbf24" aria-hidden="true" />
                        ))}
                      </div>
                      <h4 id={`testimonial-${index}`} className="font-bold text-xl text-[#1e293b]">{testimonial.name}</h4>
                      <p className="text-[#64748b]">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-[#475569] italic">"{testimonial.content}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-grid-white/[0.03]" aria-hidden="true"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20" aria-hidden="true"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ShieldCheck size={48} className="mx-auto mb-6 text-white" aria-hidden="true" />
            <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready for your digital home?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
              Join 15,000+ happy creators who launched their perfect website without breaking the bank
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentView('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-[#6366f1] font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
                aria-label="Start building your website"
              >
                Start My Website <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} aria-hidden="true" />
              </motion.button>
              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black/20 backdrop-blur-sm text-white font-medium text-lg px-8 py-4 rounded-xl hover:bg-black/30 transition-all duration-300"
                aria-label="Watch 30-second demo video"
              >
                Watch Demo (30 sec)
              </motion.button>
            </motion.div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center text-center gap-4 text-lg opacity-85">
              <div className="flex items-center">
                <CheckCircle className="text-white mr-2" size={20} aria-hidden="true" />
                <span>20 questions, 60 seconds</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full mx-4" aria-hidden="true"></div>
              <div className="flex items-center">
                <CheckCircle className="text-white mr-2" size={20} aria-hidden="true" />
                <span>Instant price quote</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full mx-4" aria-hidden="true"></div>
              <div className="flex items-center">
                <CheckCircle className="text-white mr-2" size={20} aria-hidden="true" />
                <span>No credit card needed</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" aria-hidden="true"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" aria-hidden="true"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        ></motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-[#f8fafc] border-t border-[#e2e8f0]" aria-label="Site footer">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-bold text-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
              thisisyour.website
            </div>
            <p className="text-[#475569] max-w-md mb-6">
              Creating affordable, beautiful websites for the next generation of creators, entrepreneurs, and dreamers.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Instagram', 'TikTok', 'Twitter', 'Discord'].map((platform, index) => (
                <motion.button
                  key={platform}
                  whileHover={{ y: -3 }}
                  className="px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg font-medium text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                  aria-label={`Follow us on ${platform}`}
                >
                  {platform}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#1e293b]">Company</h3>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#475569] hover:text-[#6366f1] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#1e293b]">Resources</h3>
            <ul className="space-y-3">
              {['Help Center', 'Community', 'Templates', 'Tutorials'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#475569] hover:text-[#6366f1] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#64748b]">
            (c) {new Date().getFullYear()} thisisyour.website. Made with love for Gen Z creators.
          </p>
          <div className="flex flex-wrap gap-6 text-[#475569]">
            {['Privacy Policy', 'Terms of Service', 'Cookies', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="hover:text-[#6366f1] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
        
        {/* GEO targeting information */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#e2e8f0] text-center text-[#64748b] text-sm">
          <div className="flex items-center justify-center gap-2">
            <Globe size={16} aria-hidden="true" />
            <span>Serving customers worldwide with localized SEO optimization for your region</span>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-xl z-40 flex items-center justify-center border-2 border-white"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        animate={controls}
        aria-label="Scroll to top"
      >
        <ChevronDown size={28} className="transform rotate-180" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

// Helper function to check if next button should be disabled
function isNextDisabled(questions, formData) {
  return questions.some(q => {
    const answer = formData?.[q.id];
    if (!q.required) {
      return false;
    }
    if (Array.isArray(answer)) {
      return answer.length === 0;
    }
    if (typeof answer === 'string') {
      return answer.trim().length === 0;
    }
    return !answer;
  });
}
