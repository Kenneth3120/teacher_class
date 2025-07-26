import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      // Navigation & Common
      "welcome": "Welcome back, {{name}}!",
      "dashboard": "Your Teaching Dashboard",
      "ready": "Ready to inspire minds today?",
      "allSystems": "All systems operational",
      "backToDashboard": "Back to Dashboard",
      "quickActions": "Quick Actions",
      "allFeatures": "All Features",
      
      // Features
      "alfredAI": "Alfred AI Assistant",
      "alfredDesc": "Your intelligent teaching companion for instant help and guidance",
      "lessonPlan": "Lesson Plan Generator",
      "lessonPlanDesc": "Create engaging, curriculum-aligned lesson plans with AI assistance",
      "quizGenerator": "Assessment & Quiz Generator",
      "quizDesc": "Design personalized quizzes and assessments for your students",
      "timeSplitter": "Smart Time Splitter",
      "timeDesc": "AI-powered schedule optimization for multigrade classrooms",
      "studentManager": "Student Management",
      "studentDesc": "Comprehensive student profiles, progress tracking, and analytics",
      "parentComm": "Parent Communication",
      "parentDesc": "Streamlined messaging and updates for parent engagement",
      "translator": "Multi-language Support",
      "translatorDesc": "Translate content and communicate in multiple languages",
      
      // Forms & Actions
      "topic": "Topic",
      "grade": "Grade Level",
      "language": "Language",
      "generate": "Generate",
      "copy": "Copy",
      "clear": "Clear",
      "translate": "Translate",
      "send": "Send",
      "loading": "Loading...",
      "generating": "Generating...",
      "translating": "Translating...",
      
      // Messages
      "noMessages": "No messages yet",
      "askAnything": "Ask anything about teaching...",
      "translationWillAppear": "Translation will appear here",
      "excellentWork": "Excellent work today",
      "goodMorning": "Good morning, students!",
      "submitHomework": "Please submit your homework",
      "anyQuestions": "Do you have any questions?",
      "reviewLesson": "Let's review the lesson",
      "timeForBreak": "Time for a break",
      "greatParticipation": "Great participation!",
      "seeTomorrow": "See you tomorrow",
      "raiseHand": "Please raise your hand"
    }
  },
  hi: {
    translation: {
      // Navigation & Common
      "welcome": "वापसी पर स्वागत है, {{name}}!",
      "dashboard": "आपका शिक्षण डैशबोर्ड",
      "ready": "आज मन को प्रेरित करने के लिए तैयार हैं?",
      "allSystems": "सभी सिस्टम चालू हैं",
      "backToDashboard": "डैशबोर्ड पर वापस जाएं",
      "quickActions": "त्वरित कार्य",
      "allFeatures": "सभी सुविधाएं",
      
      // Features
      "alfredAI": "अल्फ्रेड AI सहायक",
      "alfredDesc": "तत्काल सहायता और मार्गदर्शन के लिए आपका बुद्धिमान शिक्षण साथी",
      "lessonPlan": "पाठ योजना जेनरेटर",
      "lessonPlanDesc": "AI सहायता के साथ आकर्षक, पाठ्यक्रम-संरेखित पाठ योजनाएं बनाएं",
      "quizGenerator": "मूल्यांकन और प्रश्नोत्तरी जेनरेटर",
      "quizDesc": "अपने छात्रों के लिए व्यक्तिगत प्रश्नोत्तरी और मूल्यांकन डिज़ाइन करें",
      "timeSplitter": "स्मार्ट समय विभाजक",
      "timeDesc": "बहुश्रेणी कक्षाओं के लिए AI-संचालित समय सारिणी अनुकूलन",
      "studentManager": "छात्र प्रबंधन",
      "studentDesc": "व्यापक छात्र प्रोफाइल, प्रगति ट्रैकिंग, और विश्लेषण",
      "parentComm": "अभिभावक संचार",
      "parentDesc": "अभिभावक जुड़ाव के लिए सुव्यवस्थित संदेशन और अपडेट",
      "translator": "बहु-भाषा समर्थन",
      "translatorDesc": "सामग्री का अनुवाद करें और कई भाषाओं में संवाद करें",
      
      // Forms & Actions
      "topic": "विषय",
      "grade": "कक्षा स्तर",
      "language": "भाषा",
      "generate": "उत्पन्न करें",
      "copy": "कॉपी करें",
      "clear": "साफ़ करें",
      "translate": "अनुवाद करें",
      "send": "भेजें",
      "loading": "लोड हो रहा है...",
      "generating": "उत्पन्न हो रहा है...",
      "translating": "अनुवाद हो रहा है...",
      
      // Messages
      "noMessages": "अभी तक कोई संदेश नहीं",
      "askAnything": "शिक्षण के बारे में कुछ भी पूछें...",
      "translationWillAppear": "अनुवाद यहाँ दिखाई देगा",
      "excellentWork": "आज उत्कृष्ट काम",
      "goodMorning": "सुप्रभात, छात्रों!",
      "submitHomework": "कृपया अपना गृहकार्य जमा करें",
      "anyQuestions": "क्या आपके कोई प्रश्न हैं?",
      "reviewLesson": "आइए पाठ की समीक्षा करते हैं",
      "timeForBreak": "विश्राम का समय",
      "greatParticipation": "महान भागीदारी!",
      "seeTomorrow": "कल मिलते हैं",
      "raiseHand": "कृपया अपना हाथ उठाएं"
    }
  },
  ta: {
    translation: {
      // Navigation & Common
      "welcome": "வணக்கம், {{name}}!",
      "dashboard": "உங்கள் கற்பித்தல் டாஷ்போர்டு",
      "ready": "இன்று மனங்களை ஊக்குவிக்க தயாரா?",
      "allSystems": "அனைத்து அமைப்புகளும் செயல்படுகின்றன",
      "backToDashboard": "டாஷ்போர்டுக்கு திரும்பு",
      "quickActions": "விரைவு செயல்கள்",
      "allFeatures": "அனைத்து அம்சங்கள்",
      
      // Features
      "alfredAI": "ஆல்ஃப்ரெட் AI உதவியாளர்",
      "alfredDesc": "உடனடி உதவி மற்றும் வழிகாட்டுதலுக்கான உங்கள் அறிவார்ந்த கற்பித்தல் துணைவர்",
      "lessonPlan": "பாட திட்ட உருவாக்கி",
      "lessonPlanDesc": "AI உதவியுடன் ஈர்க்கக்கூடிய, பாடத்திட்ட-ஒத்த பாட திட்டங்களை உருவாக்குங்கள்",
      "quizGenerator": "மதிப்பீடு மற்றும் வினாடி வினா உருவாக்கி",
      "quizDesc": "உங்கள் மாணவர்களுக்கான தனிப்பயன் வினாடி வினாக்கள் மற்றும் மதிப்பீடுகளை வடிவமைக்கவும்",
      "timeSplitter": "ஸ்மார்ட் நேர பிரிப்பான்",
      "timeDesc": "பல தரவணி வகுப்பறைகளுக்கான AI-இயங்கும் அட்டவணை மேம்பாடு",
      "studentManager": "மாணவர் மேலாண்மை",
      "studentDesc": "விரிவான மாணவர் சுயவிவரங்கள், முன்னேற்ற கண்காணிப்பு மற்றும் பகுப்பாய்வு",
      "parentComm": "பெற்றோர் தொடர்பு",
      "parentDesc": "பெற்றோர் ஈடுபாட்டிற்கான நெறிப்படுத்தப்பட்ட செய்தி மற்றும் புதுப்பிப்புகள்",
      "translator": "பல மொழி ஆதரவு",
      "translatorDesc": "உள்ளடக்கத்தை மொழிபெயர்க்கவும் மற்றும் பல மொழிகளில் தொடர்பு கொள்ளவும்",
      
      // Forms & Actions
      "topic": "தலைப்பு",
      "grade": "வகுப்பு நிலை",
      "language": "மொழி",
      "generate": "உருவாக்கு",
      "copy": "நகலெடு",
      "clear": "அழி",
      "translate": "மொழிபெயர்",
      "send": "அனுப்பு",
      "loading": "ஏற்றுகிறது...",
      "generating": "உருவாக்குகிறது...",
      "translating": "மொழிபெயர்க்கிறது...",
      
      // Messages
      "noMessages": "இன்னும் செய்திகள் இல்லை",
      "askAnything": "கற்பித்தல் பற்றி எதுவும் கேளுங்கள்...",
      "translationWillAppear": "மொழிபெயர்ப்பு இங்கே தோன்றும்",
      "excellentWork": "இன்று சிறந்த வேலை",
      "goodMorning": "காலை வணக்கம், மாணவர்களே!",
      "submitHomework": "தயவுசெய்து உங்கள் வீட்டுப்பாடத்தை சமர்ப்பிக்கவும்",
      "anyQuestions": "உங்களுக்கு ஏதேனும் கேள்விகள் உள்ளதா?",
      "reviewLesson": "பாடத்தை மீள்பார்வை செய்வோம்",
      "timeForBreak": "ஓய்வு நேரம்",
      "greatParticipation": "சிறந்த பங்கேற்பு!",
      "seeTomorrow": "நாளை சந்திப்போம்",
      "raiseHand": "தயவுசெய்து உங்கள் கையை உயர்த்துங்கள்"
    }
  },
  te: {
    translation: {
      // Navigation & Common
      "welcome": "స్వాగతం, {{name}}!",
      "dashboard": "మీ బోధనా డ్యాష్‌బోర్డ్",
      "ready": "ఈరోజు మనస్సులను ప్రేరేపించడానికి సిద్ధంగా ఉన్నారా?",
      "allSystems": "అన్ని వ్యవస్థలు పనిచేస్తున్నాయి",
      "backToDashboard": "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
      "quickActions": "శీఘ్ర చర్యలు",
      "allFeatures": "అన్ని లక్షణాలు",
      
      // Features
      "alfredAI": "ఆల్ఫ్రెడ్ AI సహాయకుడు",
      "alfredDesc": "తక్షణ సహాయం మరియు మార్గదర్శనం కోసం మీ తెలివైన బోధనా భాగస్వామి",
      "lessonPlan": "పాఠ ప్రణాళిక నిర్మాత",
      "lessonPlanDesc": "AI సహాయంతో ఆకర్షణీయమైన, పాఠ్యాంశ-అనుగుణ పాఠ ప్రణాళికలను సృష్టించండి",
      "quizGenerator": "మూల్యాంకనం మరియు క్విజ్ నిర్మాత",
      "quizDesc": "మీ విద్యార్థుల కోసం వ్యక్తిగతీకరించిన క్విజ్‌లు మరియు మూల్యాంకనాలను డిజైన్ చేయండి",
      "timeSplitter": "స్మార్ట్ టైమ్ స్ప్లిటర్",
      "timeDesc": "బహుగ్రేడ్ తరగతి గదుల కోసం AI-శక్తితో కూడిన షెడ్యూల్ ఆప్టిమైజేషన్",
      "studentManager": "విద్యార్థి నిర్వహణ",
      "studentDesc": "సమగ్ర విద్యార్థి ప్రొఫైల్‌లు, పురోగతి ట్రాకింగ్ మరియు విశ్లేషణలు",
      "parentComm": "తల్లిదండ్రుల కమ్యూనికేషన్",
      "parentDesc": "తల్లిదండ్రుల నిమగ్నత కోసం క్రమబద్ధీకరించిన సందేశం మరియు అప్‌డేట్‌లు",
      "translator": "బహుభాషా మద్దతు",
      "translatorDesc": "కంటెంట్‌ను అనువదించండి మరియు బహుళ భాషలలో కమ్యూనికేట్ చేయండి",
      
      // Forms & Actions
      "topic": "అంశం",
      "grade": "తరగతి స్థాయి",
      "language": "భాష",
      "generate": "రూపొందించు",
      "copy": "కాపీ చేయి",
      "clear": "క్లియర్ చేయి",
      "translate": "అనువదించు",
      "send": "పంపు",
      "loading": "లోడ్ అవుతోంది...",
      "generating": "రూపొందిస్తోంది...",
      "translating": "అనువదిస్తోంది...",
      
      // Messages
      "noMessages": "ఇంకా సందేశాలు లేవు",
      "askAnything": "బోధన గురించి ఏదైనా అడగండి...",
      "translationWillAppear": "అనువాదం ఇక్కడ కనిపిస్తుంది",
      "excellentWork": "ఈరోజు అద్భుతమైన పని",
      "goodMorning": "శుభోదయం, విద్యార్థులారా!",
      "submitHomework": "దయచేసి మీ ఇంటి పనిని సమర్పించండి",
      "anyQuestions": "మీకు ఏవైనా ప్రశ్నలు ఉన్నాయా?",
      "reviewLesson": "పాఠాన్ని సమీక్షించుకుందాం",
      "timeForBreak": "విరామం కోసం సమయం",
      "greatParticipation": "గొప్ప భాగస్వామ్యం!",
      "seeTomorrow": "రేపు కలుద్దాం",
      "raiseHand": "దయచేసి మీ చేతిని పైకెత్తండి"
    }
  },
  bn: {
    translation: {
      // Navigation & Common
      "welcome": "স্বাগতম, {{name}}!",
      "dashboard": "আপনার শিক্ষণ ড্যাশবোর্ড",
      "ready": "আজ মন অনুপ্রাণিত করতে প্রস্তুত?",
      "allSystems": "সমস্ত সিস্টেম চালু",
      "backToDashboard": "ড্যাশবোর্ডে ফিরে যান",
      "quickActions": "দ্রুত কর্ম",
      "allFeatures": "সমস্ত বৈশিষ্ট্য",
      
      // Features
      "alfredAI": "আলফ্রেড AI সহায়ক",
      "alfredDesc": "তাৎক্ষণিক সহায়তা এবং দিকনির্দেশনার জন্য আপনার বুদ্ধিমান শিক্ষণ সঙ্গী",
      "lessonPlan": "পাঠ পরিকল্পনা জেনারেটর",
      "lessonPlanDesc": "AI সহায়তায় আকর্ষণীয়, পাঠ্যক্রম-সামঞ্জস্যপূর্ণ পাঠ পরিকল্পনা তৈরি করুন",
      "quizGenerator": "মূল্যায়ন এবং কুইজ জেনারেটর",
      "quizDesc": "আপনার শিক্ষার্থীদের জন্য ব্যক্তিগতকৃত কুইজ এবং মূল্যায়ন ডিজাইন করুন",
      "timeSplitter": "স্মার্ট টাইম স্প্লিটার",
      "timeDesc": "বহুশ্রেণীর শ্রেণীকক্ষের জন্য AI-চালিত সময়সূচী অপ্টিমাইজেশন",
      "studentManager": "ছাত্র ব্যবস্থাপনা",
      "studentDesc": "বিস্তৃত ছাত্র প্রোফাইল, অগ্রগতি ট্র্যাকিং এবং বিশ্লেষণ",
      "parentComm": "অভিভাবক যোগাযোগ",
      "parentDesc": "অভিভাবক সম্পৃক্ততার জন্য সুশৃঙ্খল বার্তা এবং আপডেট",
      "translator": "বহুভাষিক সহায়তা",
      "translatorDesc": "সামগ্রী অনুবাদ করুন এবং একাধিক ভাষায় যোগাযোগ করুন",
      
      // Forms & Actions
      "topic": "বিষয়",
      "grade": "শ্রেণী স্তর",
      "language": "ভাষা",
      "generate": "তৈরি করুন",
      "copy": "কপি করুন",
      "clear": "পরিষ্কার করুন",
      "translate": "অনুবাদ করুন",
      "send": "পাঠান",
      "loading": "লোড হচ্ছে...",
      "generating": "তৈরি হচ্ছে...",
      "translating": "অনুবাদ হচ্ছে...",
      
      // Messages
      "noMessages": "এখনও কোন বার্তা নেই",
      "askAnything": "শিক্ষণ সম্পর্কে যে কোনো কিছু জিজ্ঞাসা করুন...",
      "translationWillAppear": "অনুবাদ এখানে প্রদর্শিত হবে",
      "excellentWork": "আজ চমৎকার কাজ",
      "goodMorning": "সুপ্রভাত, ছাত্রছাত্রীরা!",
      "submitHomework": "অনুগ্রহ করে আপনার বাড়ির কাজ জমা দিন",
      "anyQuestions": "আপনার কি কোন প্রশ্ন আছে?",
      "reviewLesson": "আসুন পাঠ পর্যালোচনা করি",
      "timeForBreak": "বিরতির সময়",
      "greatParticipation": "দুর্দান্ত অংশগ্রহণ!",
      "seeTomorrow": "আগামীকাল দেখা হবে",
      "raiseHand": "অনুগ্রহ করে আপনার হাত তুলুন"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;