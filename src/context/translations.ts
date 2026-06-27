export type Language = "ar" | "en";

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navbar
    "nav.home": "الرئيسية",
    "nav.assistant": "مساعد الذكاء",
    "nav.careGuide": "دليل العناية",
    "nav.diseases": "الأمراض",
    "nav.plants": "قاموس النباتات",
    "nav.weather": "الطقس",
    "nav.community": "المجتمع",
    "nav.faq": "الأسئلة الشائعة",
    "nav.support": "الدعم",
    "nav.more": "المزيد",
    "nav.login": "تسجيل الدخول",
    "nav.loginSignup": "تسجيل الدخول / إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "nav.myProfile": "ملفي الشخصي",
    "nav.settings": "الإعدادات",
    "nav.careGuideFull": "🌿 دليل رعاية النباتات",
    "nav.diseasesDb": "🔬 قاعدة بيانات الأمراض",
    "nav.weatherInsights": "🌤️ تحليل الطقس",
    "nav.communityFull": "👥 المجتمع",
    "nav.faqFull": "❓ الأسئلة الشائعة",
    "nav.supportFull": "🛟 الشكاوى والدعم",

    // Settings page
    "settings.title": "الإعدادات",
    "settings.subtitle": "قم بتعديل وتخصيص إعدادات الرعاية والنظام الذكي.",
    "settings.back": "رجوع",
    "settings.appearance": "المظهر واللغة",
    "settings.language": "لغة الواجهة",
    "settings.languageDesc": "اختر لغة التطبيق الرئيسية",
    "settings.theme": "سمة التطبيق",
    "settings.themeDesc": "تخصيص ألوان لوحة القيادة",
    "settings.fontSize": "حجم الخط",
    "settings.fontSizeDesc": "تعديل حجم خط القراءة",
    "settings.light": "فاتح",
    "settings.dark": "داكن",
    "settings.system": "النظام",
    "settings.small": "صغير",
    "settings.medium": "متوسط",
    "settings.large": "كبير",
    "settings.account": "المزارع الذكي",
    "settings.accountTier": "الحساب المجاني",
    "settings.memberSince": "تاريخ الانضمام: مايو 2026",
    "settings.editProfile": "تعديل الحساب",
    "settings.reset": "إعادة تعيين الإعدادات الافتراضية",
    "settings.resetConfirm": "هل أنت متأكد من إعادة تعيين كل الإعدادات الافتراضية؟",
    "settings.resetDone": "تمت إعادة الإعدادات الافتراضية",

    // Toast messages
    "toast.theme": "تم تحديث مظهر التطبيق",
    "toast.fontSize": "تم تغيير حجم الخط",
    "toast.language": "تم تحويل اللغة إلى العربية",
    "toast.saved": "تم الحفظ بنجاح",

    // Common
    "common.appName": "سنبلة",
    "common.version": "سنبلة v1.0.0 (العقدة المصرية)",

    // ─── Dashboard ────────────────────────────────────────────────────────

    // Sidebar
    "dashboard.sidebar.title": "لوحة التحكم",
    "dashboard.sidebar.overview": "نظرة عامة",
    "dashboard.sidebar.users": "المستخدمون",
    "dashboard.sidebar.posts": "المنشورات",
    "dashboard.sidebar.comments": "التعليقات",
    "dashboard.sidebar.complaints": "الشكاوى",
    "dashboard.sidebar.conversations": "المحادثات",
    "dashboard.sidebar.messages": "الرسائل",
    "dashboard.sidebar.diseaseScans": "فحوصات الأمراض",
    "dashboard.sidebar.logout": "تسجيل الخروج",
    "dashboard.sidebar.collapse": "طي",

    // Header
    "dashboard.header.search": "بحث...",
    "dashboard.header.admin": "مدير",
    "dashboard.header.profile": "الملف الشخصي",
    "dashboard.header.logout": "تسجيل الخروج",

    // Login
    "dashboard.login.title": "تسجيل دخول المدير",
    "dashboard.login.subtitle": "سجل دخولك للوصول إلى لوحة التحكم",
    "dashboard.login.email": "البريد الإلكتروني",
    "dashboard.login.password": "كلمة المرور",
    "dashboard.login.submit": "تسجيل الدخول",
    "dashboard.login.loading": "جاري تسجيل الدخول...",
    "dashboard.login.error": "بيانات غير صحيحة أو الحساب ليس مديراً",
    "dashboard.login.notAdmin": "هذا الحساب لا يملك صلاحيات المدير",

    // Table
    "dashboard.table.search": "بحث...",
    "dashboard.table.noResults": "لا توجد نتائج",
    "dashboard.table.showing": "عرض",
    "dashboard.table.of": "من",
    "dashboard.table.entries": "عنصر",
    "dashboard.table.prev": "السابق",
    "dashboard.table.next": "التالي",
    "dashboard.table.rowsPerPage": "صفوف لكل صفحة",
    "dashboard.table.exportCsv": "تصدير CSV",

    // Delete Dialog
    "dashboard.delete.title": "تأكيد الحذف",
    "dashboard.delete.message": "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
    "dashboard.delete.cancel": "إلغاء",
    "dashboard.delete.confirm": "حذف",

    // Status
    "dashboard.status.pending": "قيد الانتظار",
    "dashboard.status.reviewed": "تمت المراجعة",
    "dashboard.status.resolved": "تم الحل",

    // Common Actions
    "dashboard.common.actions": "إجراءات",
    "dashboard.common.view": "عرض",
    "dashboard.common.edit": "تعديل",
    "dashboard.common.delete": "حذف",
    "dashboard.common.save": "حفظ",
    "dashboard.common.cancel": "إلغاء",
    "dashboard.common.loading": "جاري التحميل...",
    "dashboard.common.close": "إغلاق",

    // Overview Page
    "dashboard.overview.title": "نظرة عامة على لوحة التحكم",
    "dashboard.overview.totalUsers": "إجمالي المستخدمين",
    "dashboard.overview.totalPosts": "إجمالي المنشورات",
    "dashboard.overview.totalScans": "إجمالي الفحوصات",
    "dashboard.overview.pendingComplaints": "شكاوى معلقة",
    "dashboard.overview.diseaseDistribution": "توزيع الأمراض",
    "dashboard.overview.governorateDistribution": "التوزيع الجغرافي",
    "dashboard.overview.recentComplaints": "أحدث الشكاوى",
    "dashboard.overview.recentPosts": "أحدث المنشورات",

    // Users Page
    "dashboard.users.title": "إدارة المستخدمين",
    "dashboard.users.username": "اسم المستخدم",
    "dashboard.users.email": "البريد الإلكتروني",
    "dashboard.users.governorate": "المحافظة",
    "dashboard.users.role": "الدور",
    "dashboard.users.createdAt": "تاريخ الانضمام",
    "dashboard.users.editRole": "تعديل الدور",

    // Posts Page
    "dashboard.posts.title": "إدارة المنشورات",
    "dashboard.posts.author": "الكاتب",
    "dashboard.posts.content": "المحتوى",
    "dashboard.posts.upvotes": "إعجابات",
    "dashboard.posts.createdAt": "التاريخ",

    // Comments Page
    "dashboard.comments.title": "إدارة التعليقات",
    "dashboard.comments.post": "المنشور",
    "dashboard.comments.author": "الكاتب",
    "dashboard.comments.content": "المحتوى",
    "dashboard.comments.votes": "الأصوات",
    "dashboard.comments.createdAt": "التاريخ",

    // Complaints Page
    "dashboard.complaints.title": "إدارة الشكاوى",
    "dashboard.complaints.user": "المستخدم",
    "dashboard.complaints.subject": "الموضوع",
    "dashboard.complaints.description": "الوصف",
    "dashboard.complaints.status": "الحالة",
    "dashboard.complaints.createdAt": "التاريخ",
    "dashboard.complaints.updateStatus": "تحديث الحالة",

    // Conversations Page
    "dashboard.conversations.title": "إدارة المحادثات",
    "dashboard.conversations.user": "المستخدم",
    "dashboard.conversations.titleField": "العنوان",
    "dashboard.conversations.createdAt": "التاريخ",
    "dashboard.conversations.updatedAt": "آخر تحديث",

    // Messages Page
    "dashboard.messages.title": "إدارة الرسائل",
    "dashboard.messages.conversation": "المحادثة",
    "dashboard.messages.role": "الدور",
    "dashboard.messages.type": "النوع",
    "dashboard.messages.content": "المحتوى",
    "dashboard.messages.source": "المصدر",
    "dashboard.messages.createdAt": "التاريخ",

    // Disease Scans Page
    "dashboard.scans.title": "إدارة فحوصات الأمراض",
    "dashboard.scans.user": "المستخدم",
    "dashboard.scans.governorate": "المحافظة",
    "dashboard.scans.disease": "المرض",
    "dashboard.scans.confidence": "الثقة",
    "dashboard.scans.severity": "الخطورة",
    "dashboard.scans.healthy": "سليم",
    "dashboard.scans.createdAt": "التاريخ",
  },

  en: {
    // Navbar
    "nav.home": "Home",
    "nav.assistant": "AI Assistant",
    "nav.careGuide": "Care Guide",
    "nav.diseases": "Diseases",
    "nav.plants": "Plant Dictionary",
    "nav.weather": "Weather",
    "nav.community": "Community",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "nav.more": "More",
    "nav.login": "Login",
    "nav.loginSignup": "Login / Sign Up",
    "nav.logout": "Logout",
    "nav.myProfile": "My Profile",
    "nav.settings": "Settings",
    "nav.careGuideFull": "🌿 Plant Care Guide",
    "nav.diseasesDb": "🔬 Disease Database",
    "nav.weatherInsights": "🌤️ Weather Insights",
    "nav.communityFull": "👥 Community",
    "nav.faqFull": "❓ FAQ",
    "nav.supportFull": "🛟 Complaints & Support",

    // Settings page
    "settings.title": "Settings",
    "settings.subtitle": "Personalize your plant care and AI preference models.",
    "settings.back": "Back",
    "settings.appearance": "Appearance & Interface",
    "settings.language": "Display Language",
    "settings.languageDesc": "Set main dashboard language",
    "settings.theme": "System Theme",
    "settings.themeDesc": "Configure theme layout options",
    "settings.fontSize": "Font Size Options",
    "settings.fontSizeDesc": "Set comfortable text sizes",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",
    "settings.small": "Small",
    "settings.medium": "Medium",
    "settings.large": "Large",
    "settings.account": "Smart Farmer",
    "settings.accountTier": "Farmer Free Tier",
    "settings.memberSince": "Member since: May 2026",
    "settings.editProfile": "Edit Profile",
    "settings.reset": "Reset Dashboard To Defaults",
    "settings.resetConfirm": "Are you sure you want to reset all settings to defaults?",
    "settings.resetDone": "Settings reset to default configurations",

    // Toast messages
    "toast.theme": "App appearance updated",
    "toast.fontSize": "Font size adjusted",
    "toast.language": "Language switched to English",
    "toast.saved": "Saved successfully",

    // Common
    "common.appName": "Sonbula",
    "common.version": "Sonbula v1.0.0 (Egypt Node)",

    // ─── Dashboard ────────────────────────────────────────────────────────

    // Sidebar
    "dashboard.sidebar.title": "Admin Dashboard",
    "dashboard.sidebar.overview": "Overview",
    "dashboard.sidebar.users": "Users",
    "dashboard.sidebar.posts": "Posts",
    "dashboard.sidebar.comments": "Comments",
    "dashboard.sidebar.complaints": "Complaints",
    "dashboard.sidebar.conversations": "Conversations",
    "dashboard.sidebar.messages": "Messages",
    "dashboard.sidebar.diseaseScans": "Disease Scans",
    "dashboard.sidebar.logout": "Logout",
    "dashboard.sidebar.collapse": "Collapse",

    // Header
    "dashboard.header.search": "Search...",
    "dashboard.header.admin": "Admin",
    "dashboard.header.profile": "Profile",
    "dashboard.header.logout": "Logout",

    // Login
    "dashboard.login.title": "Admin Login",
    "dashboard.login.subtitle": "Sign in to access the admin dashboard",
    "dashboard.login.email": "Email",
    "dashboard.login.password": "Password",
    "dashboard.login.submit": "Sign In",
    "dashboard.login.loading": "Signing in...",
    "dashboard.login.error": "Invalid credentials or not an admin account",
    "dashboard.login.notAdmin": "This account does not have admin privileges",

    // Table
    "dashboard.table.search": "Search...",
    "dashboard.table.noResults": "No results found",
    "dashboard.table.showing": "Showing",
    "dashboard.table.of": "of",
    "dashboard.table.entries": "entries",
    "dashboard.table.prev": "Previous",
    "dashboard.table.next": "Next",
    "dashboard.table.rowsPerPage": "Rows per page",
    "dashboard.table.exportCsv": "Export CSV",

    // Delete Dialog
    "dashboard.delete.title": "Confirm Delete",
    "dashboard.delete.message": "Are you sure you want to delete this item? This action cannot be undone.",
    "dashboard.delete.cancel": "Cancel",
    "dashboard.delete.confirm": "Delete",

    // Status
    "dashboard.status.pending": "Pending",
    "dashboard.status.reviewed": "Reviewed",
    "dashboard.status.resolved": "Resolved",

    // Common Actions
    "dashboard.common.actions": "Actions",
    "dashboard.common.view": "View",
    "dashboard.common.edit": "Edit",
    "dashboard.common.delete": "Delete",
    "dashboard.common.save": "Save",
    "dashboard.common.cancel": "Cancel",
    "dashboard.common.loading": "Loading...",
    "dashboard.common.close": "Close",

    // Overview Page
    "dashboard.overview.title": "Dashboard Overview",
    "dashboard.overview.totalUsers": "Total Users",
    "dashboard.overview.totalPosts": "Total Posts",
    "dashboard.overview.totalScans": "Total Scans",
    "dashboard.overview.pendingComplaints": "Pending Complaints",
    "dashboard.overview.diseaseDistribution": "Disease Distribution",
    "dashboard.overview.governorateDistribution": "Governorate Distribution",
    "dashboard.overview.recentComplaints": "Recent Complaints",
    "dashboard.overview.recentPosts": "Recent Posts",

    // Users Page
    "dashboard.users.title": "User Management",
    "dashboard.users.username": "Username",
    "dashboard.users.email": "Email",
    "dashboard.users.governorate": "Governorate",
    "dashboard.users.role": "Role",
    "dashboard.users.createdAt": "Joined",
    "dashboard.users.editRole": "Edit Role",

    // Posts Page
    "dashboard.posts.title": "Post Management",
    "dashboard.posts.author": "Author",
    "dashboard.posts.content": "Content",
    "dashboard.posts.upvotes": "Upvotes",
    "dashboard.posts.createdAt": "Date",

    // Comments Page
    "dashboard.comments.title": "Comment Management",
    "dashboard.comments.post": "Post",
    "dashboard.comments.author": "Author",
    "dashboard.comments.content": "Content",
    "dashboard.comments.votes": "Votes",
    "dashboard.comments.createdAt": "Date",

    // Complaints Page
    "dashboard.complaints.title": "Complaint Management",
    "dashboard.complaints.user": "User",
    "dashboard.complaints.subject": "Subject",
    "dashboard.complaints.description": "Description",
    "dashboard.complaints.status": "Status",
    "dashboard.complaints.createdAt": "Date",
    "dashboard.complaints.updateStatus": "Update Status",

    // Conversations Page
    "dashboard.conversations.title": "Conversation Management",
    "dashboard.conversations.user": "User",
    "dashboard.conversations.titleField": "Title",
    "dashboard.conversations.createdAt": "Date",
    "dashboard.conversations.updatedAt": "Last Updated",

    // Messages Page
    "dashboard.messages.title": "Message Management",
    "dashboard.messages.conversation": "Conversation",
    "dashboard.messages.role": "Role",
    "dashboard.messages.type": "Type",
    "dashboard.messages.content": "Content",
    "dashboard.messages.source": "Source",
    "dashboard.messages.createdAt": "Date",

    // Disease Scans Page
    "dashboard.scans.title": "Disease Scan Management",
    "dashboard.scans.user": "User",
    "dashboard.scans.governorate": "Governorate",
    "dashboard.scans.disease": "Disease",
    "dashboard.scans.confidence": "Confidence",
    "dashboard.scans.severity": "Severity",
    "dashboard.scans.healthy": "Healthy",
    "dashboard.scans.createdAt": "Date",
  },
};
