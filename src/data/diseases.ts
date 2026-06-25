export interface Disease {
  id: number;
  plant: string;
  disease: string;
  category: "Fungal" | "Bacterial" | "Viral" | "Pest";
  severity: "Low" | "Medium" | "High" | "Critical";
  symptoms: string;
  treatment: string;
  prevention: string;
  causes: string;
  emoji: string;
}

export const getDiseases = (isAr: boolean): Disease[] => [
  {
    id: 1,
    plant: isAr ? "تفاح" : "Apple",
    disease: isAr ? "جرب التفاح" : "Apple scab",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع قطيفة مخملية بلون أخضر زيتوني إلى أسود على الأوراق والثمار، وتصفر الأوراق وتسقط مبكراً."
      : "Olive-green to black velvety spots on leaves and fruit. Leaves yellow and drop early.",
    causes: isAr
      ? "ينتج عن فطر Venturia inaequalis في الظروف الرطبة والباردة في الربيع."
      : "Caused by Venturia inaequalis fungus in cool, wet spring conditions.",
    treatment: isAr
      ? "استخدام مبيدات الفطريات مثل الكابتان أو النحاس. تقليم الأشجار لزيادة تهوية المظلة الشجرية."
      : "Apply fungicides such as captan or copper sprays. Prune trees to open up the canopy.",
    prevention: isAr
      ? "جمع الأوراق المتساقطة وإتلافها في الخريف. زراعة أصناف تفاح مقاومة للجرب."
      : "Rake and destroy fallen leaves in autumn. Plant scab-resistant apple cultivars.",
    emoji: "🍎",
  },
  {
    id: 2,
    plant: isAr ? "تفاح" : "Apple",
    disease: isAr ? "العفن الأسود" : "Black rot",
    category: "Fungal",
    severity: "High",
    symptoms: isAr
      ? "بقع عين الضفدع على الأوراق ذات حواف أرجوانية، تعفن أسود على الثمار مع حلقات دائرية، وتقرحات على الفروع."
      : "Frogeye leaf spots with purple margins, black rot on fruit with concentric rings, and cankers on branches.",
    causes: isAr
      ? "ينشأ بسبب فطر Botryosphaeria obtusa الذي يستهدف الأخشاب الميتة والجروح."
      : "Caused by Botryosphaeria obtusa fungus, targeting dead wood and wounds.",
    treatment: isAr
      ? "تقليم وإزالة التقرحات والأغصان الميتة. استخدام مبيدات فطريات تعتمد على الكبريت أو النحاس."
      : "Prune out cankers and dead wood. Apply sulfur or copper-based fungicides.",
    prevention: isAr
      ? "إزالة الثمار المحنطة والميتة من الأشجار والأرض. الحفاظ على صحة الأشجار وتجنب جرحها."
      : "Remove mummified fruit from trees and ground. Maintain tree health and avoid wounding.",
    emoji: "🍏",
  },
  {
    id: 3,
    plant: isAr ? "تفاح" : "Apple",
    disease: isAr ? "صدأ تفاح الأرز" : "Cedar apple rust",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع برتقالية صفراء زاهية على الأوراق والثمار. تظهر هياكل أنبوبية أسفل الأوراق."
      : "Bright orange-yellow spots on leaves and fruit. Tubular structures (aecia) appear under leaves.",
    causes: isAr
      ? "فطر Gymnosporangium juniperi-virginianae الذي يحتاج عائلين (التفاح والعرعر) لإكمال دورة حياته."
      : "Gymnosporangium juniperi-virginianae fungus requiring two hosts (apple and juniper) to complete its lifecycle.",
    treatment: isAr
      ? "استخدام مبيدات فطريات وقائية في الربيع خلال فترة انتشار الأبواغ. تقليم أشجار العرعر المصابة القريبة."
      : "Apply preventive fungicides in spring during spore release. Prune nearby infected junipers.",
    prevention: isAr
      ? "زراعة أصناف تفاح مقاومة. تجنب زراعة التفاح بالقرب من أشجار العرعر أو الأرز الأحمر."
      : "Grow resistant apple varieties. Avoid planting apples near juniper or red cedar trees.",
    emoji: "🍂",
  },
  {
    id: 4,
    plant: isAr ? "كرز" : "Cherry",
    disease: isAr ? "البياض الدقيقي" : "Powdery mildew",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع فطرية بيضاء مسحوقية على الأوراق والأغصان. قد تلتف الأوراق لأعلى وتتشوه."
      : "White, powdery fungal patches on leaves and twigs. Leaves may curl upward and distort.",
    causes: isAr
      ? "فطر Podosphaera clandestina في الأجواء الدافئة والجافة مع رطوبة ليلية عالية."
      : "Podosphaera clandestina fungus in warm, dry day conditions with high night humidity.",
    treatment: isAr
      ? "رش الكبريت أو بيكربونات البوتاسيوم. التقليم لتحسين تدفق الهواء والتهوية."
      : "Spray sulfur or potassium bicarbonate. Prune to improve air circulation.",
    prevention: isAr
      ? "تجنب الري العلوي (فوق الأوراق). مباعدة الأشجار بشكل كافٍ. إزالة النموات المصابة في الشتاء."
      : "Avoid overhead watering. Space trees adequately. Remove infected shoots in winter.",
    emoji: "🍒",
  },
  {
    id: 5,
    plant: isAr ? "ذرة" : "Corn",
    disease: isAr ? "تبقع الأوراق السيركوسبوري (تبقع الأوراق الرمادي)" : "Cercospora leaf spot Gray leaf spot",
    category: "Fungal",
    severity: "High",
    symptoms: isAr
      ? "آفات مستطيلة بلون رمادي إلى بني تمتد بموازاة عروق الأوراق. قد تؤدي إلى رقاد شديد للمحصول."
      : "Rectangular, gray-to-brown lesions running parallel to leaf veins. Can lead to severe lodging.",
    causes: isAr
      ? "فطر Cercospora zeae-maydis في رطوبة عالية ودفء وبقاء بقايا المحصول المصاب."
      : "Cercospora zeae-maydis fungus favored by high relative humidity, warmth, and crop debris.",
    treatment: isAr
      ? "استخدام مبيدات الفطريات الورقية التي تحتوي على الستربيلورين أو التريازول عند اشتداد المرض."
      : "Apply foliar fungicides containing strobilurins or triazoles if disease pressure is high.",
    prevention: isAr
      ? "اتباع الدورة الزراعية وحرث بقايا المحاصيل. زراعة هجن ذات مقاومة عالية للمرض."
      : "Practice crop rotation and till crop residues. Plant hybrids with high resistance scores.",
    emoji: "🌽",
  },
  {
    id: 6,
    plant: isAr ? "ذرة" : "Corn",
    disease: isAr ? "الصدأ الشائع" : "Common rust",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بثور مسحوقية بلون بني محمر على السطحين العلوي والسفلي للأوراق."
      : "Powdery, reddish-brown pustules on both upper and lower leaf surfaces.",
    causes: isAr
      ? "ينتقل فطر Puccinia sorghi عبر الرياح في درجات حرارة معتدلة ورطوبة عالية."
      : "Puccinia sorghi fungus carried by wind in moderate temperatures and high humidity.",
    treatment: isAr
      ? "نادراً ما تدعو الحاجة لمبيدات الفطريات ولكن يمكن استخدامها لحقول تقاوي الذرة. استخدم مبيدات التريازول."
      : "Fungicides are rarely needed but can be applied to high-value seed corn. Use triazole fungicides.",
    prevention: isAr
      ? "زراعة هجن ذرة مقاومة. ضبط مواعيد الزراعة لتجنب فترات ذروة انتشار الأبواغ."
      : "Plant resistant corn hybrids. Manage planting dates to avoid peak spore periods.",
    emoji: "🌾",
  },
  {
    id: 7,
    plant: isAr ? "ذرة" : "Corn",
    disease: isAr ? "لفحة أوراق الذرة الشمالية" : "Northern Leaf Blight",
    category: "Fungal",
    severity: "High",
    symptoms: isAr
      ? "آفات طويلة تشبه شكل السيجار بلون أخضر رمادي إلى برونزي على الأوراق، تبدأ من الأوراق السفلية."
      : "Long, cigar-shaped, grayish-green to tan lesions on leaves, starting on lower leaves.",
    causes: isAr
      ? "فطر Exserohilum turcicum الذي ينشط في درجات حرارة معتدلة وأمطار ورطوبة مستمرة."
      : "Exserohilum turcicum fungus thriving in moderate temperatures and wet, humid weather.",
    treatment: isAr
      ? "استخدام مبيدات التريازول أو الستربيلورين عند بداية مرحلة التزهير (الشرابة) إذا ظهرت الأعراض."
      : "Apply triazole or strobilurin fungicides at early silking if disease symptoms appear.",
    prevention: isAr
      ? "تناوب المحاصيل (الدورة الزراعية). التخلص من بقايا المحصول للحد من بيات الفطر شتاءً. زراعة هجن مقاومة."
      : "Rotate crops. Manage crop residues to reduce fungal overwintering. Grow resistant hybrids.",
    emoji: "🍂",
  },
  {
    id: 8,
    plant: isAr ? "عنب" : "Grape",
    disease: isAr ? "العفن الأسود" : "Black rot",
    category: "Fungal",
    severity: "Critical",
    symptoms: isAr
      ? "بقع صغيرة بنية محمرة على الأوراق، وثمار عنب سوداء متجعدة ومحنطة تتساقط مبكراً."
      : "Tiny reddish-brown spots on leaves, and shriveled, black mummified berries that drop early.",
    causes: isAr
      ? "فطر Guignardia bidwellii الذي ينشط بشدة في فترات الدفء والرطوبة الطويلة."
      : "Guignardia bidwellii fungus, highly active during warm and prolonged wet periods.",
    treatment: isAr
      ? "رش النحاس أو المانكوزيب في وقت مبكر من الموسم. تقليم وإتلاف القصبات المصابة."
      : "Apply copper or mancozeb sprays early in the season. Prune and destroy infected canes.",
    prevention: isAr
      ? "المحافظة على نظافة الكرم من المخلفات. تقليم الكرمة لتعريضها لأشعة الشمس والرياح."
      : "Keep vineyard clean of debris. Prune vines to keep them open to sunlight and wind.",
    emoji: "🍇",
  },
  {
    id: 9,
    plant: isAr ? "عنب" : "Grape",
    disease: isAr ? "إسكا (الحصبة السوداء)" : "Esca (Black Measles)",
    category: "Fungal",
    severity: "High",
    symptoms: isAr
      ? "اصفرار وموت الأنسجة بين العروق (نمط خطوط النمر) على الأوراق. بقع داكنة على قشرة حبات العنب."
      : "Interveinal chlorosis and necrosis ('tiger-stripe' pattern) on leaves. Dark spots on berry skins.",
    causes: isAr
      ? "مجمع من الفطريات الخشبية مثل Phaeomoniella chlamydospora و Phaeoacremonium minimum."
      : "Complex of wood-rotting fungi including Phaeomoniella chlamydospora and Phaeoacremonium minimum.",
    treatment: isAr
      ? "لا يوجد علاج كيميائي مباشر. حماية جروح التقليم باستخدام مطهرات ومواد إغلاق الجروح."
      : "No direct chemical treatment. Protect pruning wounds using wound sealants.",
    prevention: isAr
      ? "التقليم أثناء الطقس الجاف. تعقيم الأدوات بين الكرمات. إزالة الأخشاب الميتة من الكرم."
      : "Prune during dry weather. Disinfect tools between vines. Remove dead wood from vineyard.",
    emoji: "🍇",
  },
  {
    id: 10,
    plant: isAr ? "عنب" : "Grape",
    disease: isAr ? "لفحة الأوراق (تبقع أوراق إيساريوبسيس)" : "Leaf blight (Isariopsis Leaf Spot)",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع حمراء باهتة إلى بنية على الأوراق، تصبح مغبرة بأبواغ الفطر على الجانب السفلي للأوراق."
      : "Dull red to brown spots on leaves, becoming dusty with fungal spores on the underside.",
    causes: isAr
      ? "فطر Pseudocercospora vitis في الأجواء الحارة والرطبة في أواخر الصيف."
      : "Pseudocercospora vitis fungus appearing in late summer under warm, humid conditions.",
    treatment: isAr
      ? "الرش بمبيدات النحاس أو مبيدات الفطريات العضوية القياسية. إزالة الأوراق المتساقطة."
      : "Spray with copper fungicides or standard organic vineyard fungicides. Remove fallen leaves.",
    prevention: isAr
      ? "تحسين تدفق الهواء من خلال إزالة الأوراق الكثيفة. الحفاظ على جذوع الكرمة جافة."
      : "Improve airflow through leaf pulling. Keep vine trunks dry.",
    emoji: "🍃",
  },
  {
    id: 11,
    plant: isAr ? "برتقال" : "Orange",
    disease: isAr ? "تخضير الحمضيات (الهونغلونغ بينغ)" : "Haunglongbing (Citrus greening)",
    category: "Bacterial",
    severity: "Critical",
    symptoms: isAr
      ? "تبقع أصفر غير متماثل على الأوراق، ثمار خضراء صغيرة مشوهة ذات طعم مر، وموت تراجعي للأغصان."
      : "Asymmetrical yellow mottling of leaves, small lopsided green fruits with bitter taste, and dieback.",
    causes: isAr
      ? "بكتيريا Candidatus Liberibacter asiaticus المنقولة بواسطة حشرة بسيلا الحمضيات الآسيوية."
      : "Candidatus Liberibacter asiaticus bacteria transmitted by the Asian citrus psyllid insect.",
    treatment: isAr
      ? "لا يوجد علاج. إزالة الأشجار المصابة وإتلافها لمنع الانتشار. مكافحة حشرة بسيلا الحمضيات الناقلة للمرض."
      : "No cure. Remove and destroy infected trees to prevent spreading. Control psyllid vectors.",
    prevention: isAr
      ? "استخدام شتلات معتمدة خالية من الأمراض. مكافحة حشرة البسيلا باستخدام المبيدات الحشرية المناسبة."
      : "Use certified disease-free nursery stock. Control Asian citrus psyllids using insecticides.",
    emoji: "🍊",
  },
  {
    id: 12,
    plant: isAr ? "خوخ" : "Peach",
    disease: isAr ? "التبقع البكتيري" : "Bacterial spot",
    category: "Bacterial",
    severity: "High",
    symptoms: isAr
      ? "آفات صغيرة داكنة بزوايا على الأوراق (مظهر ثقوب الطلق الناري) وبقع غائرة على ثمار الخوخ."
      : "Small, dark, angular lesions on leaves (shot-hole appearance) and sunken spots on peach fruit.",
    causes: isAr
      ? "بكتيريا Xanthomonas arboricola pv. pruni التي تنشط في الأجواء الدافئة والرياح الرطبة."
      : "Xanthomonas arboricola pv. pruni bacterium favoring warm, wet, and windy conditions.",
    treatment: isAr
      ? "رش الأوكسي تتراسيكلين أو المركبات النحاسية خلال موسم النمو."
      : "Apply oxytetracycline or copper-based sprays during the growing season.",
    prevention: isAr
      ? "اختيار أصناف خوخ مقاومة. تجنب التسميد النيتروجيني المفرط."
      : "Choose resistant peach varieties. Avoid excessive nitrogen applications.",
    emoji: "🍑",
  },
  {
    id: 13,
    plant: isAr ? "فلفل" : "Pepper",
    disease: isAr ? "التبقع البكتيري" : "Bacterial spot",
    category: "Bacterial",
    severity: "High",
    symptoms: isAr
      ? "بقع صغيرة مشبعة بالماء على الأوراق تتحول إلى البني الداكن. ثآليل بارزة على ثمار الفلفل."
      : "Small, water-soaked spots on leaves that turn dark brown. Raised warts on pepper fruits.",
    causes: isAr
      ? "بكتيريا Xanthomonas campestris pv. vesicatoria التي تنتقل بالبذور ورذاذ الماء."
      : "Xanthomonas campestris pv. vesicatoria bacterium, seedborne and spread by splashing water.",
    treatment: isAr
      ? "رش مبيدات النحاس المخلوطة بالمانكوزيب. تجنب العمل في الحقول الرطبة."
      : "Spray copper fungicides mixed with mancozeb. Avoid working in wet fields.",
    prevention: isAr
      ? "استخدام بذور خالية من مسببات الأمراض. تدوير المحاصيل مع نباتات غير باذنجانية. تجنب الري العلوي."
      : "Use pathogen-free seeds. Rotate crops with non-solanaceous hosts. Avoid overhead watering.",
    emoji: "🫑",
  },
  {
    id: 14,
    plant: isAr ? "بطاطس" : "Potato",
    disease: isAr ? "اللفحة المبكرة" : "Early blight",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع بنية داكنة مع حلقات دائرية متداخلة (نمط لوحة الهدف) تبدأ على الأوراق القديمة السفلية."
      : "Dark brown spots with concentric rings ('target board' pattern) starting on older lower leaves.",
    causes: isAr
      ? "فطر Alternaria solani الذي يصيب النباتات المجهدة في طقس دافئ وجاف بالتناوب مع الرطوبة."
      : "Alternaria solani fungus, targeting stressed plants in warm, alternating wet and dry weather.",
    treatment: isAr
      ? "استخدام الكلوروثالونيل، المانكوزيب، أو مبيدات النحاس الفطرية. ضمان التغذية المناسبة للمحصول."
      : "Apply chlorothalonil, mancozeb, or copper fungicides. Ensure proper crop nutrition.",
    prevention: isAr
      ? "استخدام درنات تقاوي معتمدة. تنظيف مخلفات المحصول بعد الحصاد. تجنب الري بالرشاشات العلوية."
      : "Use certified seed tubers. Clean up debris after harvest. Avoid overhead sprinkler irrigation.",
    emoji: "🥔",
  },
  {
    id: 15,
    plant: isAr ? "بطاطس" : "Potato",
    disease: isAr ? "اللفحة المتأخرة" : "Late blight",
    category: "Fungal",
    severity: "Critical",
    symptoms: isAr
      ? "بقع داكنة كبيرة مشبعة بالماء على الأوراق مع نمو فطر أبيض أسفلها في الطقس الرطب، وتعفن الدرنات."
      : "Large, water-soaked dark spots on leaves with white mold underneath in humid weather. Tuber rot.",
    causes: isAr
      ? "شبه الفطر Phytophthora infestans الذي يزدهر في الظروف الباردة الرطبة وينتشر بسرعة رهيبة."
      : "Phytophthora infestans oomycete, thriving in cool, wet conditions and spreading incredibly fast.",
    treatment: isAr
      ? "استخدام مبيدات فطرية جهازية مثل الميتالاكسيل. إتلاف النباتات المصابة فوراً."
      : "Apply systemic fungicides like metalaxyl. Destroy infected plants immediately.",
    prevention: isAr
      ? "زراعة أصناف بطاطس مقاومة. التخلص من نباتات البطاطس العشوائية النابتة تلقائياً. تأمين ردم التربة حول الساق."
      : "Plant resistant potato varieties. Destroy volunteer potato plants. Ensure soil hilling.",
    emoji: "🥔",
  },
  {
    id: 16,
    plant: isAr ? "كوسة" : "Squash",
    disease: isAr ? "البياض الدقيقي" : "Powdery mildew",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع بيضاء مسحوقية تشبه طلق التلك على الأوراق والسيقان. قد تذبل الأوراق المصابة وتموت."
      : "White talcum-like powdery spots on leaves and stems. Affected leaves may wither and die.",
    causes: isAr
      ? "فطريات Erysiphe cichoracearum أو Podosphaera xanthii في الرطوبة والظل والتهوية السيئة."
      : "Erysiphe cichoracearum or Podosphaera xanthii fungi, favored by humidity, shade, and poor airflow.",
    treatment: isAr
      ? "استخدام زيت النيم، أو رش الكبريت، أو بيكربونات البوتاسيوم. تقليم الأوراق المتداخلة."
      : "Apply neem oil, sulfur sprays, or potassium bicarbonate. Prune overlapping leaves.",
    prevention: isAr
      ? "اختيار أصناف كوسة مقاومة للبياض الدقيقي. مباعدة النباتات لتعريضها للشمس والهواء."
      : "Select powdery mildew-resistant squash varieties. Space plants for sun and air.",
    emoji: "🎃",
  },
  {
    id: 17,
    plant: isAr ? "فراولة" : "Strawberry",
    disease: isAr ? "لفحة الأوراق" : "Leaf scorch",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع أرجوانية على الأوراق تتسع وتتحول للون البني الداكن. تبدو الأوراق محروقة وجافة."
      : "Purplish spots on leaves that enlarge and turn dark brown. Leaves look scorched and dry.",
    causes: isAr
      ? "فطر Diplocarpon earlianum في ظل ظروف من الرطوبة الورقية المستمرة ودفء الطقس."
      : "Diplocarpon earlianum fungus active during periods of leaf wetness and warm temperatures.",
    treatment: isAr
      ? "استخدام مبيدات فطريات وقائية مثل الكابتان. إزالة الأوراق المصابة بشدة."
      : "Apply protective fungicides such as captan. Remove severely infected leaves.",
    prevention: isAr
      ? "الزراعة في أماكن مشمسة جيدة الصرف. تجنب الري العلوي. تنظيف المهاد القديم."
      : "Plant in sunny, well-drained spots. Avoid overhead watering. Clean old mulch.",
    emoji: "🍓",
  },
  {
    id: 18,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "التبقع البكتيري" : "Bacterial spot",
    category: "Bacterial",
    severity: "High",
    symptoms: isAr
      ? "بقع صغيرة داكنة دهنية على الأوراق والسيقان. بقع ثآليل سوداء على ثمار الطماطم."
      : "Small, dark, greasy spots on leaves and stems. Warty black spots on tomato fruits.",
    causes: isAr
      ? "بكتيريا Xanthomonas spp. التي تنتشر برذاذ المطر، الري بالرش، ولمس الأوراق الرطبة."
      : "Xanthomonas spp. bacteria spread by splashing rain, sprinkler irrigation, or handling wet plants.",
    treatment: isAr
      ? "رش المركبات النحاسية المخلوطة بالمانكوزيب. تقليم الأوراق السفلية لتقليل رذاذ الماء."
      : "Apply copper-based fungicides combined with mancozeb. Prune lower leaves to reduce splash.",
    prevention: isAr
      ? "شراء بذور/شتلات معتمدة خالية من الأمراض. تجنب العمل بين النباتات وهي مبللة."
      : "Buy certified disease-free seeds/transplants. Avoid working in plants when wet.",
    emoji: "🍅",
  },
  {
    id: 19,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "اللفحة المبكرة" : "Early blight",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع داكنة دائرية متداخلة (نمط يشبه الهدف) على الأوراق القديمة، وآفات على الساق وتعفن للثمار قرب العنق."
      : "Concentric dark spots (target-like pattern) on older leaves. Stem lesions and fruit rot near stem.",
    causes: isAr
      ? "فطر Alternaria solani الذي يصيب المجموع الخضري الضعيف في الرطوبة والحرارة المعتدلة."
      : "Alternaria solani fungus attacking weak foliage in high humidity and moderate temperatures.",
    treatment: isAr
      ? "استخدام مبيدات النحاس الفطرية أو الكلوروثالونيل. إزالة الأوراق السفلية المصابة."
      : "Use copper fungicides or chlorothalonil. Remove infected lower leaves.",
    prevention: isAr
      ? "اتباع الدورة الزراعية. وضع المهاد على التربة لمنع رذاذ الأبواغ. تجنب الري العلوي."
      : "Practice crop rotation. Mulch soil to prevent spore splash. Avoid overhead watering.",
    emoji: "🍅",
  },
  {
    id: 20,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "اللفحة المتأخرة" : "Late blight",
    category: "Fungal",
    severity: "Critical",
    symptoms: isAr
      ? "بقع داكنة كبيرة مشبعة بالماء على الأوراق والسيقان تتحول للبني. عفن أبيض أسفل الأوراق في الرطوبة."
      : "Large, dark, water-soaked patches on leaves and stems that turn brown. White mold under leaves in wet conditions.",
    causes: isAr
      ? "الفطر البيضي Phytophthora infestans الذي يزدهر في الجو البارد الرطب الماطر وينتشر بسرعة ريحية."
      : "Phytophthora infestans pathogen thriving in cool, wet, rainy weather, dispersing rapidly via wind.",
    treatment: isAr
      ? "رش الميتالاكسيل أو مبيدات النحاس فوراً. إتلاف المحاصيل المصابة لمنع انتشار العدوى."
      : "Apply metalaxyl or copper fungicides immediately. Destroy affected crops to prevent spread.",
    prevention: isAr
      ? "زراعة أصناف مقاومة. الحفاظ على جفاف المجموع الخضري. ضمان الدورة الزراعية."
      : "Grow resistant cultivars. Keep foliage dry. Ensure crop rotation.",
    emoji: "🍅",
  },
  {
    id: 21,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "عفن الأوراق" : "Leaf Mold",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع خضراء شاحبة أو صفراء على الأسطح العلوية للأوراق. عفن مخملي زيتوني اللون أسفل الأوراق."
      : "Pale green or yellow spots on upper leaf surfaces. Olive-green velvety mold on leaf undersides.",
    causes: isAr
      ? "فطر Passalora fulva الذي ينشط في ظروف الرطوبة النسبية الشديدة (أكثر من 85%) والحرارة المعتدلة."
      : "Passalora fulva fungus active under extremely high relative humidity (above 85%) and moderate temperatures.",
    treatment: isAr
      ? "استخدام مبيدات النحاس الفطرية. زيادة التهوية في البيوت المحمية. إزالة الأوراق السفلية."
      : "Apply copper fungicide. Increase ventilation in greenhouses. Remove lower leaves.",
    prevention: isAr
      ? "الحفاظ على رطوبة الصوبة أقل من 85%. زراعة أصناف مقاومة. مباعدة النباتات جيداً."
      : "Keep greenhouse humidity below 85%. Grow resistant cultivars. Space plants well.",
    emoji: "🍅",
  },
  {
    id: 22,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "تبقع أوراق السبتوريا" : "Septoria leaf spot",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع رمادية صغيرة دائرية عديدة ذات حواف داكنة ونقاط سوداء دقيقة في مركزها."
      : "Numerous small, circular gray spots with dark borders and tiny black specks in the center.",
    causes: isAr
      ? "فطر Septoria lycopersici الذي ينتشر من التربة للأوراق السفلية بواسطة رذاذ الماء."
      : "Septoria lycopersici fungus spreading from soil to lower leaves via water splashes.",
    treatment: isAr
      ? "استخدام الكلوروثالونيل أو رش النحاس. تقليم الأوراق السفلية. تجنب الري العلوي."
      : "Apply chlorothalonil or copper spray. Prune lower leaves. Avoid overhead watering.",
    prevention: isAr
      ? "تغطية التربة بالمهاد. مكافحة الأعشاب الباذنجانية الضارة. تنظيف أدوات الحديقة."
      : "Mulch the soil base. Control solanaceous weeds. Clean garden tools.",
    emoji: "🍅",
  },
  {
    id: 23,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "الإصابة بالعنكبوت الأحمر ذي البقعتين" : "Spider mites Two-spotted spider mite",
    category: "Pest",
    severity: "High",
    symptoms: isAr
      ? "نسيج عنكبوتي دقيق على الأوراق والسيقان، تنقيط أصفر على الأوراق، وتحول لون الأوراق للبرونزي."
      : "Fine webbing on leaves and stems, yellow speckled stippling on leaves, leaves turning bronze.",
    causes: isAr
      ? "عنكبوت Tetranychus urticae الصغير الذي يمتص عصارة الخلايا النباتية في الأجواء الحارة والجافة."
      : "Tetranychus urticae mites sucking plant cell sap under hot, dry, and dusty conditions.",
    treatment: isAr
      ? "الرش بالصابون الحشري أو الأبامكتين. إدخال الأكاروسات المفترسة النافعة."
      : "Spray with insecticidal soap or abamectin. Introduce predatory mites (Phytoseiulus persimilis).",
    prevention: isAr
      ? "الحفاظ على ري النباتات جيداً. تجنب الظروف المغبرة. رش الأوراق بالماء بانتظام."
      : "Keep plants well-watered. Avoid dusty conditions. Spray foliage with water regularly.",
    emoji: "🕷️",
  },
  {
    id: 24,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "التبقع المستهدف" : "Target Spot",
    category: "Fungal",
    severity: "Medium",
    symptoms: isAr
      ? "بقع بنية داكنة على الأوراق مع هالات صفراء ضيقة وحلقات دائرية متداخلة. آفات غائرة على الثمار."
      : "Dark brown spots on leaves with narrow yellow halos and concentric rings. Sunken lesions on fruits.",
    causes: isAr
      ? "فطر Corynespora cassiicola الذي يفضّل درجات حرارة معتدلة إلى دافئة ورطوبة عالية ورطوبة ورقية مستمرة."
      : "Corynespora cassiicola fungus, preferring moderate to warm temperatures, high humidity, and leaf wetness.",
    treatment: isAr
      ? "رش الكلوروثالونيل أو الأزوكسيستروبين. تقليم الأوراق السفلية لتحسين تدفق الهواء."
      : "Spray chlorothalonil or azoxystrobin fungicides. Prune lower leaves to improve airflow.",
    prevention: isAr
      ? "دوران المحاصيل. الحفاظ على جفاف المجموع الخضري. القضاء على الأعشاب الباذنجانية ونباتات الطماطم العشوائية."
      : "Rotate crops. Keep foliage dry. Eradicate solanaceous weeds and volunteer tomatoes.",
    emoji: "🍅",
  },
  {
    id: 25,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "فيروس تجعد أوراق الطماطم الأصفر" : "Tomato Yellow Leaf Curl Virus",
    category: "Viral",
    severity: "Critical",
    symptoms: isAr
      ? "تقزم شديد للنبات، تقعر الأوراق لأعلى واصفرار حوافها، وفشل عقد الثمار."
      : "Severe stunting, upward cupping and yellowing of leaf margins, and failure to set fruit.",
    causes: isAr
      ? "فيروس ينتقل عن طريق حشرة الذبابة البيضاء (Bemisia tabaci) من النباتات المصابة."
      : "Virus transmitted by the silverleaf whitefly (Bemisia tabaci) from infected hosts.",
    treatment: isAr
      ? "لا يوجد علاج. إزالة النباتات المصابة. استخدام المبيدات الحشرية لمكافحة الذبابة البيضاء الناقلة."
      : "No cure. Remove infected plants. Apply insecticides to control the whitefly vector.",
    prevention: isAr
      ? "زراعة أصناف مقاومة. استخدام المهاد الفضي العاكس. تغطية المحاصيل بشباك واقية من الحشرات."
      : "Plant resistant varieties. Use silver reflective mulches. Cover crops with insect nets.",
    emoji: "🦠",
  },
  {
    id: 26,
    plant: isAr ? "طماطم" : "Tomato",
    disease: isAr ? "فيروس موزاييك الطماطم" : "Tomato mosaic virus",
    category: "Viral",
    severity: "High",
    symptoms: isAr
      ? "تبقعات خضراء داكنة وفاتحة (موزاييك) على الأوراق، تشوه الأوراق (مظهر ورقة السرخس)، وانخفاض الإنتاج."
      : "Mottled dark and light green patches on leaves, leaf distortion (fern-leaf look), and reduced yield.",
    causes: isAr
      ? "فيروس معدي للغاية ينتشر ميكانيكياً عبر الأيدي الملوثة، الأدوات، والبذور المصابة."
      : "Highly contagious virus spread mechanically via contaminated hands, tools, or infected seed.",
    treatment: isAr
      ? "لا يوجد علاج. قلع وحرق النباتات المصابة. غسل الأيدي والأدوات بالصابون أو الحليب."
      : "No cure. Pull up and burn infected plants. Wash hands and tools with soap or milk.",
    prevention: isAr
      ? "استخدام بذور معتمدة خالية من الفيروس. تجنب استخدام أو تداول منتجات التبغ قرب نباتات الطماطم."
      : "Use certified virus-free seeds. Avoid handling tobacco products near tomato plants.",
    emoji: "🧬",
  },
];
