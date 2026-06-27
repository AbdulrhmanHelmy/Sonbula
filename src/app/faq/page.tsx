"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Leaf,
  Zap,
  Brain,
  HelpCircle,
  Lock,
  Stethoscope,
  Star,
  DollarSign,
  HeadphonesIcon,
  Share2,
  Smartphone,
  Maximize2,
  Sprout,
  Database,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// ─── Static Data (bilingual) ──────────────────────────────────────────────────

const getCategories = (isAr: boolean): string[] =>
  isAr
    ? [
        "الكل",
        "الدقة",
        "النباتات",
        "الأمان",
        "الاستخدام",
        "التقنية",
        "العلاج",
        "التجربة",
        "التسعير",
        "الدعم",
        "النطاق",
        "المنصة",
        "المشاركة",
        "الزراعة",
        "البيانات",
      ]
    : [
        "All",
        "Accuracy",
        "Plants",
        "Security",
        "Usage",
        "Technology",
        "Treatment",
        "Experience",
        "Pricing",
        "Support",
        "Scope",
        "Platform",
        "Sharing",
        "Agronomy",
        "Data",
      ];

const getCategoryMap = (isAr: boolean): Record<string, string> =>
  isAr
    ? {
        Accuracy: "الدقة",
        Plants: "النباتات",
        Security: "الأمان",
        Usage: "الاستخدام",
        Technology: "التقنية",
        Treatment: "العلاج",
        Experience: "التجربة",
        Pricing: "التسعير",
        Support: "الدعم",
        Scope: "النطاق",
        Platform: "المنصة",
        Sharing: "المشاركة",
        Agronomy: "الزراعة",
        Data: "البيانات",
      }
    : {
        Accuracy: "Accuracy",
        Plants: "Plants",
        Security: "Security",
        Usage: "Usage",
        Technology: "Technology",
        Treatment: "Treatment",
        Experience: "Experience",
        Pricing: "Pricing",
        Support: "Support",
        Scope: "Scope",
        Platform: "Platform",
        Sharing: "Sharing",
        Agronomy: "Agronomy",
        Data: "Data",
      };

const FAQ_DATA = [
  {
    id: 1,
    category: "Accuracy",
    question_en: "How accurate is the AI diagnosis?",
    question_ar: "ما مدى دقة تشخيص الذكاء الاصطناعي؟",
    answer_en:
      "Our AI model achieves 99%+ accuracy on common plant diseases, trained on over 1.2 million plant images from diverse agricultural environments across Egypt and the Middle East.",
    answer_ar:
      "يحقق نموذج الذكاء الاصطناعي لدينا دقة تزيد على 99% في الأمراض الشائعة للنباتات، وقد دُرِّب على أكثر من 1.2 مليون صورة نباتية من بيئات زراعية متنوعة في مصر والشرق الأوسط.",
  },
  {
    id: 2,
    category: "Accuracy",
    question_en: "What image quality does the AI need?",
    question_ar: "ما جودة الصورة التي يحتاجها الذكاء الاصطناعي؟",
    answer_en:
      "For best results, upload clear, well-lit photos focusing on the affected leaf or stem. Blurry or dark images may reduce accuracy, though our system handles moderate variations well.",
    answer_ar:
      "للحصول على أفضل النتائج، ارفع صوراً واضحة وجيدة الإضاءة تُركّز على الورقة أو الساق المصابة. قد تُقلّل الصور الضبابية أو المظلمة من الدقة، وإن كان نظامنا يتعامل جيداً مع التفاوتات المعتدلة.",
  },
  {
    id: 3,
    category: "Plants",
    question_en: "Does the AI support indoor plants?",
    question_ar: "هل يدعم الذكاء الاصطناعي النباتات الداخلية؟",
    answer_en:
      "Yes! Sanbola supports both outdoor crops and indoor ornamental plants. Our database covers over 200 plant species including popular houseplants like pothos, ficus, and succulents.",
    answer_ar:
      "نعم! تدعم سنبلة المحاصيل الخارجية والنباتات الزينة الداخلية على حدٍّ سواء. تغطي قاعدة بياناتنا أكثر من 200 نوع نباتي بما فيها النباتات المنزلية الشائعة كالبوثوس والفيكوس والنباتات العصارية.",
  },
  {
    id: 4,
    category: "Plants",
    question_en: "Can I use Sanbola for beginner plant care?",
    question_ar: "هل يمكنني استخدام سنبلة للمبتدئين في رعاية النباتات؟",
    answer_en:
      "Absolutely. Sanbola is designed to be beginner-friendly with clear, actionable guidance. The AI explains results in simple language with step-by-step treatment plans.",
    answer_ar:
      "بالطبع. صُمِّمت سنبلة لتكون صديقةً للمبتدئين بإرشادات واضحة وقابلة للتنفيذ. يشرح الذكاء الاصطناعي النتائج بلغة بسيطة مع خطط علاجية خطوةً بخطوة.",
  },
  {
    id: 5,
    category: "Plants",
    question_en: "Does it work for all plant types?",
    question_ar: "هل يعمل مع جميع أنواع النباتات؟",
    answer_en:
      "We cover most common crops (tomatoes, wheat, corn, potatoes), fruit trees, herbs, and ornamental plants. We continuously expand our database based on user demand.",
    answer_ar:
      "نغطي معظم المحاصيل الشائعة (الطماطم والقمح والذرة والبطاطس) والأشجار المثمرة والأعشاب والنباتات الزينة. نوسّع قاعدة بياناتنا باستمرار بناءً على طلبات المستخدمين.",
  },
  {
    id: 6,
    category: "Plants",
    question_en: "Can the AI detect multiple diseases in one image?",
    question_ar: "هل يمكن للذكاء الاصطناعي اكتشاف أمراض متعددة في صورة واحدة؟",
    answer_en:
      "Yes. Our multi-label detection system can identify up to 3 simultaneous conditions in a single plant image, ranked by confidence level.",
    answer_ar:
      "نعم. يستطيع نظام الكشف متعدد التصنيفات تحديد ما يصل إلى 3 حالات متزامنة في صورة نبات واحدة، مرتبةً حسب مستوى الثقة.",
  },
  {
    id: 7,
    category: "Usage",
    question_en: "How does the AI analyze plant diseases?",
    question_ar: "كيف يحلل الذكاء الاصطناعي أمراض النبات؟",
    answer_en:
      "Our convolutional neural network (CNN) analyzes visual patterns in leaf textures, color variations, and spot morphology. It compares against a trained dataset of 50+ disease signatures to provide instant diagnosis.",
    answer_ar:
      "تحلل شبكتنا العصبية التلافيفية (CNN) الأنماط البصرية في نسيج الأوراق وتباينات الألوان وشكل البقع، وتقارنها بمجموعة بيانات مُدرَّبة تضم أكثر من 50 توقيعاً مرضياً لتقديم تشخيص فوري.",
  },
  {
    id: 8,
    category: "Usage",
    question_en: "How do I get started with Sanbola?",
    question_ar: "كيف أبدأ مع سنبلة؟",
    answer_en:
      "Simply create a free account, navigate to the analysis tool, upload a clear photo of your plant, and receive your AI diagnosis within seconds. No special equipment needed.",
    answer_ar:
      "أنشئ حساباً مجانياً، انتقل إلى أداة التحليل، ارفع صورة واضحة لنباتك، واحصل على تشخيص الذكاء الاصطناعي في ثوانٍ. لا تحتاج إلى أي معدات خاصة.",
  },
  {
    id: 9,
    category: "Usage",
    question_en: "Can I track my plant's health history?",
    question_ar: "هل يمكنني تتبع سجل صحة نباتي؟",
    answer_en:
      "Yes. Your diagnosis history is saved in your profile, allowing you to monitor disease progression, track treatment effectiveness, and receive personalized care recommendations over time.",
    answer_ar:
      "نعم. يُحفظ سجل تشخيصاتك في ملفك الشخصي، مما يتيح لك مراقبة تطور المرض وتتبع فعالية العلاج وتلقّي توصيات رعاية مخصصة بمرور الوقت.",
  },
  {
    id: 10,
    category: "Security",
    question_en: "Is my uploaded data secure?",
    question_ar: "هل بياناتي المرفوعة آمنة؟",
    answer_en:
      "All images are encrypted using AES-256 during upload and processing. We never sell or share your plant data with third parties. Images are automatically deleted from our servers after 30 days unless you choose to save them.",
    answer_ar:
      "تُشفَّر جميع الصور باستخدام AES-256 أثناء الرفع والمعالجة. لا نبيع بيانات نباتاتك أو نشاركها مع أطراف ثالثة أبداً. تُحذف الصور تلقائياً من خوادمنا بعد 30 يوماً ما لم تختر حفظها.",
  },
  {
    id: 11,
    category: "Security",
    question_en: "Do you store my personal information?",
    question_ar: "هل تخزنون معلوماتي الشخصية؟",
    answer_en:
      "We only store the minimum data needed (email and username). All plant images are processed ephemerally and are not linked to your identity unless you explicitly save them to your profile.",
    answer_ar:
      "نخزّن الحد الأدنى الضروري فقط من البيانات (البريد الإلكتروني واسم المستخدم). تُعالَج جميع صور النباتات بشكل مؤقت ولا تُرتبط بهويتك ما لم تختر حفظها صراحةً في ملفك الشخصي.",
  },
  {
    id: 12,
    category: "Technology",
    question_en: "What AI technology powers Sanbola?",
    question_ar: "ما تقنية الذكاء الاصطناعي التي تشغّل سنبلة؟",
    answer_en:
      "Sanbola uses custom-trained Convolutional Neural Networks (CNNs) built with PyTorch, hosted on GPU-accelerated cloud infrastructure. The frontend communicates with the AI via our Gradio API pipeline.",
    answer_ar:
      "تستخدم سنبلة شبكات عصبية تلافيفية (CNNs) مُدرَّبة خصيصاً ومبنية بـ PyTorch، ومستضافة على بنية تحتية سحابية مُسرَّعة بوحدات GPU. يتواصل الواجهة الأمامية مع الذكاء الاصطناعي عبر مسار Gradio API الخاص بنا.",
  },
  {
    id: 13,
    category: "Technology",
    question_en: "How fast is the analysis?",
    question_ar: "ما سرعة التحليل؟",
    answer_en:
      "Most analyses complete in under 2 seconds. Our edge-optimized pipeline ensures minimal latency regardless of your internet connection speed.",
    answer_ar:
      "تكتمل معظم التحليلات في أقل من ثانيتين. يضمن مسارنا المُحسَّن للطرف الأدنى من الشبكة زمن استجابة ضئيلاً بصرف النظر عن سرعة اتصالك بالإنترنت.",
  },
  {
    id: 14,
    category: "Technology",
    question_en: "Can I use Sanbola offline?",
    question_ar: "هل يمكنني استخدام سنبلة بدون إنترنت؟",
    answer_en:
      "Currently, Sanbola requires an internet connection for AI analysis. We are working on a lightweight offline mode for basic plant identification in areas with poor connectivity.",
    answer_ar:
      "تتطلب سنبلة حالياً اتصالاً بالإنترنت لإجراء تحليل الذكاء الاصطناعي. نعمل على وضع وضع غير متصل خفيف الوزن لتحديد النباتات الأساسية في المناطق ذات الاتصال الضعيف.",
  },
  {
    id: 15,
    category: "Treatment",
    question_en: "Does Sanbola suggest treatment plans and pesticides after disease detection?",
    question_ar: "هل تقترح منصة سنبلة خططاً علاجية ومبيدات بعد اكتشاف المرض؟",
    answer_en: "Yes, once a disease is accurately diagnosed, Sanbola provides a comprehensive treatment plan that includes suitable pesticide recommendations, optimal dosages, and safe application methods to ensure your crops recover effectively.",
    answer_ar: "نعم، بمجرد تشخيص المرض بدقة، تقدم سنبلة خطة علاجية متكاملة تتضمن أسماء المبيدات المناسبة، والجرعات الموصى بها، وطرق الاستخدام الآمنة لضمان تعافي النباتات بشكل فعال."
  },
  {
    id: 16,
    category: "Treatment",
    question_en: "Are the suggested solutions purely chemical, or do they include organic alternatives?",
    question_ar: "هل الحلول العلاجية المقترحة كيميائية فقط أم تتضمن حلولاً عضوية؟",
    answer_en: "Sanbola offers a diverse range of options. In addition to fast-acting chemical treatments, the platform provides eco-friendly, organic solutions and bio-pesticide alternatives to help maintain soil health and sustainable farming practices.",
    answer_ar: "توفر سنبلة خيارات متنوعة تناسب احتياجاتك. فإلى جانب الحلول الكيميائية سريعة الفعالية، تقترح المنصة بدائل عضوية وصديقة للبيئة للحفاظ على خصوبة التربة وضمان زراعة مستدامة وآمنة."
  },
  {
    id: 17,
    category: "Treatment",
    question_en: "Can the platform provide preventive guidelines to avoid disease recurrence?",
    question_ar: "هل يمكن للمنصة تقديم إرشادات وقائية لتجنب عودة المرض مرة أخرى؟",
    answer_en: "Absolutely. Treatment is only part of the solution. Sanbola delivers customized agricultural and preventive guidelines—such as optimizing irrigation, improving crop spacing for ventilation, and crop rotation advice—to protect your field from future outbreaks.",
    answer_ar: "بالتأكيد، العلاج هو نصف الحل فقط. تقدم المنصة إرشادات زراعية ووقائية مخصصة، مثل تنظيم أوقات الري، تحسين التهوية بين الشتلات، وتدوير المحاصيل، لمساعدتك على حماية حقلك ومنع تكرار الإصابة."
  },
  {
    id: 18,
    category: "Treatment",
    question_en: "How reliable is the treatment advice provided by the platform?",
    question_ar: "ما مدى موثوقية النصائح العلاجية التي تقدمها منصة سنبلة؟",
    answer_en: "The treatment advice is highly reliable, generated using advanced AI models backed by verified agricultural databases and expert knowledge. However, for highly complex or widespread infections, we always recommend consulting a local agricultural engineer.",
    answer_ar: "النصائح العلاجية لدينا موثوقة للغاية، حيث تعتمد على نماذج ذكاء اصطناعي متطورة مرتبطة بقواعد بيانات زراعية معتمدة عالمياً. ومع ذلك، ننصح دائماً باستشارة المهندس الزراعي المحلي في حالات الإصابة المعقدة أو واسعة النطاق لضمان أفضل النتائج الميدانية."
  },
  {
    id: 19,
    category: "Experience",
    question_en: "In what language does the AI interact with users?",
    question_ar: "بأي لغة يتفاعل الذكاء الاصطناعي مع المستخدمين؟",
    answer_en: "To ensure maximum clarity and accessibility, all AI interactions and generated responses within the Sonbula platform are exclusively in Arabic, tailoring the technical output specifically for Arab farmers.",
    answer_ar: "لضمان وصول المعلومة بكل وضوح وسهولة، تم تصميم منصة سنبلة بحيث تكون جميع تفاعلات وردود الذكاء الاصطناعي باللغة العربية حصراً، مما يوفر بيئة مريحة ومفهومة للمزارع العربي."
  },
  {
    id: 20,
    category: "Experience",
    question_en: "How does the platform personalize the user experience?",
    question_ar: "كيف توفر المنصة تجربة استخدام مخصصة وشخصية؟",
    answer_en: "The system enhances user engagement by dynamically extracting your preferred first name, greeting you personally (e.g., 'Welcome, Helmy'), and tailoring the interaction to provide a friendly, customized experience.",
    answer_ar: "يتعرف النظام على بياناتك ليستخرج اسمك الأول الذي تفضل مناداتك به، ليرحب بك بحرارة (مثل: 'مرحباً احمد ')، مما يضمن لك تجربة تفاعلية ودية ومخصصة تشعرك بالاهتمام."
  },
  {
    id: 21,
    category: "Experience",
    question_en: "How does Sonbula guarantee the accuracy of its agricultural advice?",
    question_ar: "كيف تضمن منصة سنبلة دقة وموثوقية الإرشادات الزراعية المقدمة؟",
    answer_en: "Sonbula utilizes Retrieval-Augmented Generation (RAG) architecture. Before formulating any response, the AI securely queries validated agricultural databases and scientific sources, ensuring all diagnostic advice is grounded in verified data rather than model approximation.",
    answer_ar: "نحن لا نعتمد على التخمين. تستخدم سنبلة تقنية التوليد المعزز بالاسترجاع (RAG)، مما يعني أن الذكاء الاصطناعي يعود أولاً إلى مصادر وقواعد بيانات زراعية موثوقة للتحقق من المعلومات قبل أن يقدم لك أي نصيحة، لتكون مطمئناً تماماً لقراراتك."
  },
  {
    id: 22,
    category: "Pricing",
    question_en: "Is the Sanbola app completely free, or do I have to pay?",
    question_ar: "هل تطبيق سنبلة مجاني بالكامل ولا فيه رسوم؟",
    answer_en: "Sanbola offers a completely free version that allows you to scan your plants and identify common diseases. We also offer affordable premium plans if you'd like to access advanced features like direct consultations with experts and detailed reports.",
    answer_ar: "تطبيق سنبلة بيقدم نسخة مجانية بالكامل بتسمح لك تفحص زرعك وتعرف الأمراض الأساسية. وعندنا كمان باقات مدفوعة بأسعار بسيطة لو حابب تستفيد من ميزات متقدمة زي التواصل المباشر مع الخبراء والتقارير التفصيلية."
  },
  {
    id: 23,
    category: "Pricing",
    question_en: "Is there a limit to how many pictures I can scan every day?",
    question_ar: "هل فيه عدد معين للصور اللي أقدر أفحصها كل يوم؟",
    answer_en: "On the free plan, you can scan a specific number of images daily to ensure a smooth experience for all our farmers. If you upgrade to a premium plan, you can enjoy unlimited daily scans anytime you need.",
    answer_ar: "في الخطة المجانية، تقدر تفحص عدد محدد من الصور يومياً عشان نضمن تقديم أفضل خدمة لكل المزارعين. أما لو اشتركت في الباقة المدفوعة، هتقدر تفحص عدد غير محدود من الصور براحتك وفي أي وقت."
  },
  {
    id: 24,
    category: "Support",
    question_en: "What should I do if the app doesn't recognize the disease or the result doesn't make sense?",
    question_ar: "أعمل إيه لو صورت النبات والتطبيق ما عرفش المرض أو النتيجة مش واضحة؟",
    answer_en: "Don't worry, it happens! If the result isn't clear, try taking another picture in good natural lighting, focusing closely on the affected leaf or area. If the issue persists, you can contact our support team directly from the app, and we'll help you diagnose your crop right away.",
    answer_ar: "ولا يهمك، بتحصل أحياناً! لو النتيجة مش واضحة، جرب تصور النبات مرة تانية في إضاءة كويسة وركز جداً على الجزء المصاب. ولو لسه المشكلة موجودة، تقدر تراسل فريق الدعم الفني من جوه التطبيق وهنساعدك فوراً في تشخيص حالة زرعتك."
  },
  {
    id: 25,
    category: "Support",
    question_en: "Can I talk to a real agricultural engineer through the app just to be sure?",
    question_ar: "هل ينفع أتكلم مع مهندس زراعي بجد من خلال التطبيق عشان أتأكد من المرض؟",
    answer_en: "Absolutely! We know that an expert's opinion brings peace of mind. Sanbola provides a feature to communicate directly with certified agricultural engineers. You can send them pictures and discuss the diagnosis to confirm the best treatment plan for your farm.",
    answer_ar: "أكيد! إحنا عارفين إن رأي الخبير بيطمن جداً. التطبيق بيوفر لك خاصية التواصل المباشر مع نخبة من المهندسين الزراعيين المعتمدين. تقدر تبعتلهم الصور وتتناقش معاهم عشان تتأكد من التشخيص وتعرف أفضل طرق العلاج لزرعتك."
  },
  {
    id: 26,
    category: "Scope",
    question_en: "Does the app detect insects and pests, or just fungal and bacterial diseases?",
    question_ar: "هل التطبيق يكتشف الحشرات والآفات الزراعية، ولا الأمراض الفطرية والبكتيرية بس؟",
    answer_en: "Sanbola is designed to be your expert eye in the field! The app can identify a wide range of fungal, bacterial, and viral diseases. It can also detect damage caused by insects and agricultural pests simply by analyzing a picture of the affected leaf or plant part.",
    answer_ar: "سنبلة مصمم عشان يكون عينك الخبيرة في الغيط! التطبيق بيقدر يتعرف على مجموعة واسعة من الأمراض الفطرية والبكتيرية والفيروسية، وكمان بيقدر يكتشف الإصابات الناتجة عن الحشرات والآفات الزراعية بمجرد ما تصور الورقة أو الجزء المصاب من النبات."
  },
  {
    id: 27,
    category: "Scope",
    question_en: "Can the app tell me if the plant needs fertilizer or is suffering from a lack of water?",
    question_ar: "هل يقدر التطبيق يعرفني لو النبات محتاج سماد أو عطشان وناقصه ميه؟",
    answer_en: "Currently, Sanbola primarily specializes in diagnosing diseases and pest damage. While some symptoms of nutrient deficiency or severe dehydration might be detected, the app is not built to provide precise fertilization or irrigation schedules. We always recommend monitoring your soil moisture and consulting your local agricultural engineer for proper nutrition programs.",
    answer_ar: "حالياً، تركيز سنبلة الأساسي هو تشخيص الأمراض والآفات. ممكن التطبيق يلاحظ بعض أعراض نقص العناصر الغذائية أو الجفاف الشديد، لكنه مش مخصص لتقديم جداول تسميد أو ري دقيقة. بننصحك دايماً تتابع رطوبة التربة وتستشير المهندس الزراعي عشان تعمل برنامج تسميد مناسب لمحصولك."
  },
  {
    id: 28,
    category: "Platform",
    question_en: "Can I download the app from Google Play or the App Store?",
    question_ar: "هل أقدر أحمل التطبيق من متجر جوجل بلاي للآندرويد أو الآب ستور للآيفون؟",
    answer_en: "Absolutely! The Sanbola app is available to download for free on both the Google Play Store for Android devices and the App Store for iOS devices. You can download it right now and start scanning your crops immediately.",
    answer_ar: "أكيد! تطبيق سنبلة متاح للتحميل مجاناً على متجر جوجل بلاي (Google Play) لأجهزة الأندرويد، وكمان على متجر الآب ستور (App Store) لأجهزة الآيفون. تقدر تنزله في ثواني وتبدأ تفحص زرعك في أي وقت."
  },
  {
    id: 29,
    category: "Sharing",
    question_en: "Can I print the scan result or send it on WhatsApp to the agricultural pharmacy engineer to get the right treatment?",
    question_ar: "هل ينفع أطبع نتيجة الفحص أو أبعتها على الواتساب لمهندس الصيدلية الزراعية عشان يصرفلي العلاج؟",
    answer_en: "Yes, this is one of Sanbola's most useful features! Once your result is ready, you can easily share the full report directly via WhatsApp or any other messaging app with your agricultural engineer or local pharmacy so they can prescribe the right pesticide. You can also print or save the report to keep a health record for your farm.",
    answer_ar: "طبعاً، دي من أهم ميزات سنبلة! بمجرد ما تطلع نتيجة الفحص، تقدر تشارك التقرير بضغطة زر على الواتساب أو أي تطبيق تاني وتبعته لمهندس الصيدلية الزراعية عشان يوصفلك المبيد أو العلاج المناسب بسرعة. وكمان تقدر تحفظ التقرير أو تطبعه عشان تتابع حالة محصولك أول بأول."
  },
  // ─── فئة: الزراعة (Agronomy) ─────────────────────────────────────────────
  {
    id: 30,
    category: "Agronomy",
    question_en: "What are the most common crops supported by Sanbola in Egypt?",
    question_ar: "ما أبرز المحاصيل المصرية التي تدعمها منصة سنبلة؟",
    answer_en: "Sanbola has been trained extensively on Egypt's major field crops, including wheat, cotton, sugarcane, tomatoes, potatoes, onions, and citrus fruits. Our agricultural database is continually updated to reflect local varieties and regional disease patterns prevalent across the Nile Delta and Upper Egypt.",
    answer_ar: "دُرِّبت منصة سنبلة على نطاق واسع لتشمل أبرز المحاصيل الزراعية المصرية، من بينها القمح والقطن وقصب السكر والطماطم والبطاطس والبصل والحمضيات. وتُحدَّث قاعدة بياناتنا الزراعية باستمرار لتعكس الأصناف المحلية وأنماط الأمراض السائدة في الدلتا وصعيد مصر."
  },
  {
    id: 31,
    category: "Agronomy",
    question_en: "Does Sanbola take seasonal and climatic conditions into account when providing recommendations?",
    question_ar: "هل تأخذ منصة سنبلة في الحسبان الظروف الموسمية والمناخية عند تقديم التوصيات؟",
    answer_en: "Yes. The recommendation engine integrates seasonal calendars and regional climatic data. Advice on pesticide timing, irrigation adjustments, and preventive measures is contextually adapted to the prevailing season and weather patterns in your area, reducing the risk of misapplication.",
    answer_ar: "نعم. يدمج محرك التوصيات لدينا التقويمات الموسمية وبيانات المناخ الإقليمية. وتُكيَّف النصائح المتعلقة بتوقيت رش المبيدات وضبط الري والتدابير الوقائية وفقاً للموسم السائد والأنماط المناخية في منطقتك، مما يُقلّل من مخاطر الاستخدام الخاطئ."
  },
  {
    id: 32,
    category: "Agronomy",
    question_en: "Can Sanbola help me plan a crop rotation schedule to prevent recurring soil diseases?",
    question_ar: "هل تساعدني سنبلة في وضع جدول تدوير محاصيل يحول دون تكرار الأمراض الأرضية؟",
    answer_en: "Sanbola provides evidence-based crop rotation guidance tailored to your field history and the pathogens previously detected. By alternating host and non-host crops, the system recommends rotation sequences that break disease cycles and help restore soil microbial balance over successive growing seasons.",
    answer_ar: "تُقدّم سنبلة إرشادات مستندة إلى الأدلة العلمية لتدوير المحاصيل، مُصمَّمة خصيصاً وفقاً لسجل حقلك والمسببات المرضية المكتشفة سابقاً. وعن طريق تناوب المحاصيل العائلة وغير العائلة للمرض، يُوصي النظام بتسلسلات تدوير تقطع دورات الإصابة وتُسهم في استعادة التوازن الميكروبي للتربة عبر مواسم زراعية متعاقبة."
  },
  // ─── فئة: البيانات (Data) ────────────────────────────────────────────────
  {
    id: 33,
    category: "Data",
    question_en: "How long does Sanbola retain my diagnosis records and field history?",
    question_ar: "كم تحتفظ منصة سنبلة بسجلات التشخيصات وتاريخ الحقل؟",
    answer_en: "By default, diagnosis records are retained for 12 months in your personal dashboard, allowing you to track seasonal disease trends over an entire crop cycle. You may export your full history at any time in PDF or CSV format, and permanently delete records upon request in accordance with our data privacy policy.",
    answer_ar: "تُحتفظ سجلات التشخيص بصورة افتراضية لمدة 12 شهراً في لوحة التحكم الشخصية، مما يتيح لك رصد اتجاهات الأمراض الموسمية على مدار دورة زراعية كاملة. ويمكنك تصدير سجلك الكامل في أي وقت بصيغة PDF أو CSV، وحذف السجلات نهائياً بناءً على طلبك وفقاً لسياسة خصوصية البيانات المعمول بها.",
  },
  {
    id: 34,
    category: "Data",
    question_en: "Does Sanbola use my field data to improve its AI models?",
    question_ar: "هل تستخدم منصة سنبلة بيانات حقلي لتحسين نماذجها الذكية؟",
    answer_en: "Only with your explicit consent. Users who opt in to our collaborative improvement programme contribute anonymised, aggregated image data that strengthens model accuracy for all farmers. Participants who choose not to opt in will never have their data used for model training, and this choice has no impact on the quality of service they receive.",
    answer_ar: "يجري ذلك فحسب بموافقتك الصريحة. يُسهم المستخدمون المنضمون إلى برنامج التحسين التشاركي لدينا ببيانات صور مجهّلة ومجمَّعة تُعزّز دقة النماذج لصالح جميع المزارعين. أما من يختارون عدم الانضمام، فلن تُستخدم بياناتهم في التدريب إطلاقاً، ولن يؤثر ذلك الاختيار على جودة الخدمة المقدَّمة إليهم.",
  },
  {
    id: 35,
    category: "Data",
    question_en: "Can I export a comprehensive health report for my entire farm to share with agricultural authorities?",
    question_ar: "هل يمكنني تصدير تقرير صحي شامل لمزرعتي بأكملها لمشاركته مع الجهات الزراعية المختصة؟",
    answer_en: "Yes. Sanbola's reporting module generates structured farm health reports covering all diagnosed conditions, treatment actions taken, and disease prevalence trends across your registered plots. Reports comply with standard agricultural documentation formats accepted by Egyptian and regional agricultural directorates, making it straightforward to submit them for subsidy applications or official inspections.",
    answer_ar: "نعم. يُولّد وحدة التقارير في سنبلة تقارير صحية هيكلية شاملة تغطي جميع الأمراض المشخَّصة والإجراءات العلاجية المُتّخذة واتجاهات انتشار الأمراض عبر القطع المسجّلة. وتتوافق هذه التقارير مع صيغ التوثيق الزراعي القياسية المعتمدة لدى مديريات الزراعة المصرية والإقليمية، مما يُيسّر تقديمها لطلبات الدعم أو عمليات التفتيش الرسمية.",
  },
];

const categoryIcon = (cat: string, size: number = 16) => {
  switch (cat) {
    case "Accuracy":
      return <Brain size={size} />;
    case "Plants":
      return <Leaf size={size} />;
    case "Security":
      return <Shield size={size} />;
    case "Usage":
      return <Zap size={size} />;
    case "Technology":
      return <HelpCircle size={size} />;
    case "Treatment":
      return <Stethoscope size={size} />;
    case "Experience":
      return <Star size={size} />;
    case "Pricing":
      return <DollarSign size={size} />;
    case "Support":
      return <HeadphonesIcon size={size} />;
    case "Scope":
      return <Maximize2 size={size} />;
    case "Platform":
      return <Smartphone size={size} />;
    case "Sharing":
      return <Share2 size={size} />;
    case "Agronomy":
      return <Sprout size={size} />;
    case "Data":
      return <Database size={size} />;
    default:
      return <HelpCircle size={size} />;
  }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

import type { Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const { language } = useSettings();
  const isAr = language === "ar";
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const categoryMap = getCategoryMap(isAr);
  const CATEGORIES = getCategories(isAr);
  const allKey = isAr ? "الكل" : "All";

  const activeCategoryEn = useMemo(() => {
    if (
      activeCategory === allKey ||
      activeCategory === "All" ||
      activeCategory === "الكل"
    )
      return "All";
    const entry = Object.entries(categoryMap).find(
      ([, v]) => v === activeCategory,
    );
    return entry ? entry[0] : activeCategory;
  }, [activeCategory, categoryMap, allKey]);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategoryEn === "All" || item.category === activeCategoryEn;
      const q = searchQuery.toLowerCase();
      const question = isAr ? item.question_ar : item.question_en;
      const answer = isAr ? item.answer_ar : item.answer_en;
      const matchesSearch =
        !q ||
        question.toLowerCase().includes(q) ||
        answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryEn, searchQuery, isAr]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const t = {
    badge: isAr ? "✦ لديك أسئلة؟" : "✦ Got Questions?",
    heading1: isAr ? "الأسئلة" : "Frequently Asked",
    headingGradient: isAr ? "الشائعة" : "Questions",
    subtitle: isAr
      ? "كل ما تحتاج معرفته عن منصة سنبلة لذكاء النباتات — من دقة التشخيص إلى خصوصية البيانات."
      : "Everything you need to know about the Sanbola AI plant intelligence platform — from diagnosis accuracy to data privacy.",
    searchPlaceholder: isAr ? "ابحث في الأسئلة…" : "Search questions…",
    noMatch: isAr
      ? "لا توجد أسئلة تطابق بحثك"
      : "No questions match your search",
    noMatchSub: isAr
      ? "جرّب كلمة مختلفة أو تصفح جميع الفئات."
      : "Try a different keyword or browse all categories.",
    clearFilters: isAr ? "مسح الفلاتر" : "Clear filters",
    stillQuestions: isAr ? "لا تزال لديك أسئلة؟" : "Still have questions?",
    contactSub: isAr
      ? "تواصل مع فريق دعم ذكاء النباتات — هنا لمساعدتك في تحقيق أقصى استفادة من سنبلة."
      : "Contact our plant AI support team — we're here to help you get the most out of Sanbola.",
    analyzePlant: isAr ? "حلّل نباتاً" : "Analyze a Plant",
    askAI: isAr ? "اسأل مساعد الذكاء الاصطناعي" : "Ask AI Assistant",
    privacy: isAr ? "الخصوصية" : "Privacy",
    terms: isAr ? "الشروط" : "Terms",
    faq: isAr ? "الأسئلة الشائعة" : "FAQ",
    copyright: isAr
      ? `© ${new Date().getFullYear()} سنبلة. جميع الحقوق محفوظة.`
      : `© ${new Date().getFullYear()} Sanbola AI. All rights reserved.`,
  };

  return (
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden relative"
      dir={isAr ? "rtl" : "ltr"}>
      {/* Full Page Background Image */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/QA.png')" }}
      />
      {/* Dark Gradient Overlay */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: "linear-gradient(to bottom, rgba(2,6,23,0.82) 0%, rgba(2,6,23,0.90) 60%, rgba(2,6,23,0.97) 100%)"
        }}
      />
      {/* Ambient orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-700/6 rounded-full blur-[130px] pointer-events-none" />
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35vw] max-w-[500px] h-[35vw] max-h-[500px] bg-emerald-700/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 mb-6">
            <span>{t.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            {t.heading1}{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              {t.headingGradient}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none`}
            />
            <motion.input
              whileFocus={{ boxShadow: "0 0 0 2px rgba(34,197,94,0.35)" }}
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenId(null);
              }}
              className={`w-full ${isAr ? "pr-11 pl-4" : "pl-11 pr-4"} py-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-200 text-sm`}
            />
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const catEn =
                Object.entries(categoryMap).find(([, v]) => v === cat)?.[0] ||
                cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenId(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-900/40 border-slate-700/50 text-slate-400 hover:border-slate-600/60 hover:text-slate-300"
                  }`}>
                  {cat !== allKey && (
                    <span
                      className={
                        isActive ? "text-emerald-400" : "text-slate-500"
                      }>
                      {categoryIcon(catEn, 13)}
                    </span>
                  )}
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center">
                <Leaf size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg font-medium">{t.noMatch}</p>
              <p className="text-slate-600 text-sm max-w-xs">{t.noMatchSub}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(allKey);
                }}
                className="mt-2 text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition-colors">
                {t.clearFilters}
              </button>
            </motion.div>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3">
              {filteredFAQs.map((item) => {
                const isOpen = openId === item.id;
                const question = isAr ? item.question_ar : item.question_en;
                const answer = isAr ? item.answer_ar : item.answer_en;
                const catLabel = categoryMap[item.category] || item.category;

                return (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}>
                    <div
                      className={`p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                        isOpen
                          ? "border-emerald-500/30"
                          : "border-slate-800/60 hover:border-slate-700/60"
                      }`}
                      onClick={() => toggle(item.id)}>
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center ${
                            isOpen
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800/60 text-slate-500"
                          } transition-colors duration-200`}>
                          {categoryIcon(item.category, 15)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug pr-6">
                            {question}
                          </p>
                          <span className="inline-block mt-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {catLabel}
                          </span>
                        </div>

                        <div
                          className={`flex-shrink-0 mt-0.5 transition-colors duration-200 ${
                            isOpen ? "text-emerald-400" : "text-slate-500"
                          }`}>
                          {isOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden">
                            <div className="mt-4 ml-0 sm:ml-11 pr-2 sm:pr-6">
                              <div className="h-px bg-slate-800/60 mb-4" />
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden p-6 sm:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/60 via-emerald-950/30 to-slate-900/60 backdrop-blur-md text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-700/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 mb-5">
                <HelpCircle size={26} className="text-emerald-400" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {t.stillQuestions}
              </h2>
              <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
                {t.contactSub}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/assistant"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors duration-200">
                  <Leaf size={16} />
                  {t.analyzePlant}
                </Link>
                <Link
                  href="/assistant"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-slate-100 font-semibold text-sm transition-colors duration-200">
                  <Brain size={16} />
                  {t.askAI}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Leaf size={14} className="text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-slate-200">
              {isAr ? "سنبلة" : "Sanbola"}
            </span>
          </div>

          <p className="text-xs text-slate-600 text-center">{t.copyright}</p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              <Lock size={11} />
              {t.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              <Shield size={11} />
              {t.terms}
            </Link>
            <Link
              href="/faq"
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
              <HelpCircle size={11} />
              {t.faq}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}