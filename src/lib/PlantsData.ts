import { Plant } from "@/lib/types";

export const plantsData: Plant[] = [
  {
    id: "tomato",
    name: "الطماطم",
    nameEn: "Tomato",
    emoji: "🍅",
    category: "خضروات",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/400px-Tomato_je.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/400px-Image_created_with_a_mobile_phone.png",
    description:
      "من أكثر المحاصيل زراعةً في مصر، يُزرع طوال العام في معظم المحافظات.",
    season: "طوال العام",
    region: "البحيرة، الشرقية، الفيوم",
    diseases: [
      {
        name: "اللفحة المبكرة",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع بنية على الأوراق السفلية",
          "حلقات متحدة المركز حول البقع",
          "اصفرار وسقوط الأوراق",
        ],
        causes: "فطر Alternaria solani ينشط في الطقس الرطب والحار",
        treatment: "رش Chlorothalonil أو Mancozeb، إزالة الأوراق المصابة فوراً",
        prevention: "دورة زراعية، تجنب رش الماء على الأوراق مباشرةً",
      },
      {
        name: "فيروس التجعد TYLCV",
        type: "فيروسي",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "تجعد وتصغر الأوراق",
          "اصفرار حواف الأوراق",
          "عدم اكتمال الثمار",
          "توقف النمو",
        ],
        causes: "فيروس تنقله الذبابة البيضاء Bemisia tabaci",
        treatment:
          "اقتلاع النباتات المصابة وإتلافها فوراً — لا يوجد علاج كيميائي",
        prevention: "مكافحة الذبابة البيضاء، شباك واقية، أصناف مقاومة",
      },
      {
        name: "تعفن الثمار",
        type: "فطري",
        affectsLeaf: false,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "تعفن أسفل الثمرة (تعفن الطرف الزهري)",
          "لون بني داكن في القاعدة",
          "تساقط الثمار مبكراً",
        ],
        causes: "نقص الكالسيوم أو عدم انتظام الري",
        treatment: "رش كالسيوم على الأوراق، انتظام الري",
        prevention: "ري منتظم، تحسين بنية التربة، إضافة الجبس الزراعي",
      },
    ],
  },
  {
    id: "mango",
    name: "المانجو",
    nameEn: "Mango",
    emoji: "🥭",
    category: "فاكهة",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/400px-Hapus_Mango.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mangifera_indica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-095.jpg/400px-Mangifera_indica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-095.jpg",
    description:
      "من أشهر الفواكه الاستوائية في مصر، تُزرع في الإسماعيلية وسيناء وأسوان.",
    season: "يونيو – سبتمبر",
    region: "الإسماعيلية، سيناء، أسوان",
    diseases: [
      {
        name: "مرض الأنثراكنوز",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "بقع داكنة على الأوراق",
          "تعفن وتلون الثمار",
          "سقوط الأزهار المبكر",
        ],
        causes: "فطر Colletotrichum gloeosporioides في الطقس الرطب",
        treatment: "رش Mancozeb أو Copper hydroxide، إزالة الأجزاء المصابة",
        prevention: "تجنب الري الزائد، تهوية جيدة، رش وقائي قبل الأمطار",
      },
      {
        name: "البياض الدقيقي",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "مسحوق أبيض على الأوراق الصغيرة",
          "تشوه الأزهار",
          "جفاف الأوراق",
        ],
        causes: "فطر Oidium mangiferae في الطقس الجاف الدافئ",
        treatment: "رش الكبريت الوتاب أو مبيدات فطرية مخصصة",
        prevention: "تقليم الأشجار، رش وقائي في بداية التزهير",
      },
    ],
  },
  {
    id: "wheat",
    name: "القمح",
    nameEn: "Wheat",
    emoji: "🌾",
    category: "حبوب",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pita_quinua-trigo.jpg/400px-Pita_quinua-trigo.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Wheat_close-up.jpg/400px-Wheat_close-up.jpg",
    description:
      "المحصول الاستراتيجي الأول في مصر، يُزرع في الدلتا والوجه البحري.",
    season: "نوفمبر – مايو",
    region: "الدلتا، الوجه البحري، الصعيد",
    diseases: [
      {
        name: "الصدأ الأصفر",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "شديد",
        symptoms: [
          "خطوط صفراء على الأوراق",
          "بثرات صفراء تحتوي على بويغات",
          "جفاف الأوراق التدريجي",
        ],
        causes: "فطر Puccinia striiformis في الطقس البارد الرطب",
        treatment: "رش Propiconazole أو Tebuconazole عند أول ظهور",
        prevention: "أصناف مقاومة، متابعة دورية، رش وقائي",
      },
      {
        name: "التفحم السائب",
        type: "فطري",
        affectsLeaf: false,
        affectsFruit: true,
        severity: "متوسط",
        symptoms: [
          "تحول السنابل إلى كتلة سوداء",
          "تطاير غبار أسود من السنبلة",
          "عدم تكوين حبوب",
        ],
        causes: "فطر Ustilago tritici ينتقل بالبذور",
        treatment: "معاملة البذور بمبيدات فطرية قبل الزراعة",
        prevention: "استخدام بذور معتمدة ومعقمة، تنظيف معدات الحصاد",
      },
    ],
  },
  {
    id: "citrus",
    name: "الليمون البلدي",
    nameEn: "Lemon",
    emoji: "🍋",
    category: "فاكهة",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Lemon-Whole-Split.jpg/400px-Lemon-Whole-Split.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Lemon_Leaves.jpg/400px-Lemon_Leaves.jpg",
    description:
      "من أكثر الحمضيات زراعةً في مصر، تُصدَّر بكميات كبيرة لأوروبا.",
    season: "طوال العام",
    region: "البحيرة، الإسكندرية، بني سويف",
    diseases: [
      {
        name: "اخضرار الحمضيات HLB",
        type: "بكتيري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "اصفرار غير منتظم للأوراق",
          "ثمار صغيرة مشوهة",
          "تيبس الأغصان",
          "موت الشجرة تدريجياً",
        ],
        causes: "بكتيريا Candidatus Liberibacter تنقلها حشرة البسيلا",
        treatment: "لا علاج — اقتلاع الأشجار المصابة وإتلافها",
        prevention: "مكافحة حشرة البسيلا، شتلات معتمدة خالية من الأمراض",
      },
      {
        name: "الجرب الحمضي",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "متوسط",
        symptoms: [
          "بثرات على الأوراق والثمار",
          "تشوه الثمار",
          "قشور بارزة على القشرة",
        ],
        causes: "فطر Elsinoe fawcettii في الجو الرطب",
        treatment: "رش مركبات النحاس أو Carbendazim",
        prevention: "تقليم جيد، تجنب الري بالرش على الأوراق",
      },
    ],
  },
  {
    id: "grape",
    name: "العنب",
    nameEn: "Grape",
    emoji: "🍇",
    category: "فاكهة",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wine_grapes03.jpg/400px-Wine_grapes03.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Grapevine_leaves.jpg/400px-Grapevine_leaves.jpg",
    description:
      "يُزرع في مصر منذ آلاف السنين، أهم مناطقه الإسكندرية والفيوم وأسوان.",
    season: "يوليو – سبتمبر",
    region: "الإسكندرية، الفيوم، أسوان",
    diseases: [
      {
        name: "البياض الزغبي",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "بقع زيتية على الأوراق",
          "نمو أبيض على الجانب السفلي",
          "تعفن الثمار وتلونها",
        ],
        causes: "فطريات Plasmopara viticola تنشط في الرطوبة",
        treatment: "رش مركبات النحاس أو Metalaxyl عند أول أعراض",
        prevention: "تقليم لتحسين التهوية، تجنب الري الزائد",
      },
    ],
  },
  {
    id: "olive",
    name: "الزيتون",
    nameEn: "Olive",
    emoji: "🫒",
    category: "أشجار",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Olives_in_bowl.jpg/400px-Olives_in_bowl.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Olea_europaea_subsp_europaea_leaves.jpg/400px-Olea_europaea_subsp_europaea_leaves.jpg",
    description: "شجرة مقدسة تُزرع في سيناء ومطروح، تعيش مئات السنين.",
    season: "أكتوبر – ديسمبر",
    region: "سيناء، مطروح، الفيوم",
    diseases: [
      {
        name: "تبقع الأوراق",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع دائرية على الأوراق",
          "هالة صفراء حول البقع",
          "سقوط مبكر للأوراق",
        ],
        causes: "فطر Spilocea oleaginea في الطقس الرطب البارد",
        treatment: "رش مركبات النحاس في الخريف والربيع",
        prevention: "تقليم سنوي، إزالة الأوراق الساقطة المصابة",
      },
    ],
  },
  {
    id: "potato",
    name: "البطاطس",
    nameEn: "Potato",
    emoji: "🥔",
    category: "خضروات",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Potato-Schwede-1.jpg/400px-Potato-Schwede-1.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Potato_plant.jpg/400px-Potato_plant.jpg",
    description: "من أهم محاصيل الخضر اقتصادياً، تُصدَّر بكميات كبيرة لأوروبا.",
    season: "أكتوبر – مايو",
    region: "البحيرة، الإسكندرية، الشرقية",
    diseases: [
      {
        name: "اللفحة المتأخرة",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "بقع مائية سريعة الانتشار",
          "عفن بني على الدرنات",
          "رائحة كريهة",
          "نمو أبيض على الأوراق",
        ],
        causes: "Phytophthora infestans في الطقس البارد الرطب",
        treatment: "رش Metalaxyl + Mancozeb عند ظهور الأعراض",
        prevention: "تقاوي معتمدة، دورة زراعية، مراقبة الطقس",
      },
    ],
  },
  {
    id: "onion",
    name: "البصل",
    nameEn: "Onion",
    emoji: "🧅",
    category: "خضروات",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Onions.jpg/400px-Onions.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Onion_on_white_background.jpg/400px-Onion_on_white_background.jpg",
    description: "مصر من أكبر مصدري البصل في العالم، يُزرع في الوادي والدلتا.",
    season: "أكتوبر – مارس",
    region: "الوادي الجديد، الشرقية، الفيوم",
    diseases: [
      {
        name: "العفن الأرجواني",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع بيضاء تتحول إلى أرجوانية",
          "جفاف القمة",
          "انكماش الأوراق",
        ],
        causes: "فطر Alternaria porri في الجو الرطب",
        treatment: "رش Iprodione أو Mancozeb",
        prevention: "دورة زراعية، تجنب الكثافة الزراعية العالية",
      },
      {
        name: "العفن الأبيض",
        type: "فطري",
        affectsLeaf: false,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "اصفرار وذبول الأوراق",
          "نمو أبيض حول قاعدة البصلة",
          "تعفن البصلة كاملاً",
        ],
        causes: "فطر Sclerotium cepivorum يبقى في التربة سنوات",
        treatment: "لا علاج كيميائي فعال، تجنب الزراعة في الأرض المصابة",
        prevention: "دورة زراعية طويلة، تعقيم التربة",
      },
    ],
  },
  {
    id: "strawberry",
    name: "الفراولة",
    nameEn: "Strawberry",
    emoji: "🍓",
    category: "فاكهة",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/400px-PerfectStrawberry.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Strawberry_leaves.jpg/400px-Strawberry_leaves.jpg",
    description:
      "مصر من أكبر منتجي الفراولة المصدرة في العالم، تُزرع في الإسكندرية والبحيرة.",
    season: "نوفمبر – إبريل",
    region: "الإسكندرية، البحيرة، الإسماعيلية",
    diseases: [
      {
        name: "العفن الرمادي Botrytis",
        type: "فطري",
        affectsLeaf: false,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "تعفن ناعم رمادي على الثمار",
          "غطاء رمادي كثيف على الثمرة",
          "انهيار الثمرة سريعاً",
        ],
        causes: "فطر Botrytis cinerea في الطقس البارد الرطب",
        treatment: "رش Iprodione أو Fenhexamid، إزالة الثمار المصابة",
        prevention: "تهوية جيدة، رفع الثمار عن التراب، تغطية بالبلاستيك",
      },
      {
        name: "بقعة الأوراق",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع حمراء إلى بنية على الأوراق",
          "مركز بني فاتح للبقعة",
          "جفاف وسقوط الأوراق",
        ],
        causes: "فطر Mycosphaerella fragariae",
        treatment: "رش مركبات النحاس أو Captan",
        prevention: "إزالة الأوراق القديمة، تجنب الري المفرط",
      },
    ],
  },
  {
    id: "corn",
    name: "الذرة",
    nameEn: "Corn",
    emoji: "🌽",
    category: "حبوب",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Corncobs_-_whole_and_cut.jpg/400px-Corncobs_-_whole_and_cut.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Maize_field.jpg/400px-Maize_field.jpg",
    description: "ثاني أهم محصول حبوب في مصر بعد القمح، يُزرع في الصيف.",
    season: "إبريل – سبتمبر",
    region: "الوجه البحري، الصعيد، الجيزة",
    diseases: [
      {
        name: "لفحة الأوراق الشمالية",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع طويلة رمادية على الأوراق",
          "تجف الأوراق من الحواف",
          "تقليل الإنتاج",
        ],
        causes: "فطر Exserohilum turcicum في الجو الرطب",
        treatment: "رش Propiconazole أو Mancozeb",
        prevention: "أصناف مقاومة، تجنب الزراعة الكثيفة",
      },
    ],
  },
  {
    id: "fig",
    name: "التين",
    nameEn: "Fig",
    emoji: "🫐",
    category: "فاكهة",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Fresh_Figs.jpg/400px-Fresh_Figs.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Ficus_carica_leaf.jpg/400px-Ficus_carica_leaf.jpg",
    description:
      "شجرة تاريخية في مصر، تُزرع في الوجه القبلي وسيناء وتتحمل الجفاف.",
    season: "يونيو – أكتوبر",
    region: "الصعيد، سيناء، البحيرة",
    diseases: [
      {
        name: "صدأ التين",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: false,
        severity: "متوسط",
        symptoms: [
          "بقع صفراء على السطح العلوي",
          "بثرات برتقالية على السطح السفلي",
          "سقوط مبكر للأوراق",
        ],
        causes: "فطر Cerotelium fici في فترات الرطوبة",
        treatment: "رش مركبات النحاس أو Mancozeb",
        prevention: "تقليم وإزالة الأوراق المصابة",
      },
    ],
  },
  {
    id: "pepper",
    name: "الفلفل",
    nameEn: "Pepper",
    emoji: "🫑",
    category: "خضروات",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Capsicum_annuum_2.jpg/400px-Capsicum_annuum_2.jpg",
    leafImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Capsicum_annuum_leaves.jpg/400px-Capsicum_annuum_leaves.jpg",
    description:
      "محصول مهم في مصر للاستهلاك المحلي والتصدير، يُزرع في الصيف والخريف.",
    season: "مارس – أكتوبر",
    region: "الشرقية، الدقهلية، الغربية",
    diseases: [
      {
        name: "اللفحة الفطرية Phytophthora",
        type: "فطري",
        affectsLeaf: true,
        affectsFruit: true,
        severity: "شديد",
        symptoms: [
          "ذبول مفاجئ للنبات",
          "تعفن القاعدة والجذور",
          "تعفن الثمار من الداخل",
        ],
        causes: "Phytophthora capsici في التربة الثقيلة ذات الصرف السيئ",
        treatment: "رش Metalaxyl، تحسين الصرف الزراعي",
        prevention: "تربة جيدة الصرف، دورة زراعية، عدم الإفراط في الري",
      },
    ],
  },
];
