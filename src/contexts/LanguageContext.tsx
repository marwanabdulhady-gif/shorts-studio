import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.create': { en: 'Create Short', ar: 'إنشاء فيديو قصير' },
  'nav.topics': { en: 'Topics', ar: 'المواضيع' },
  'nav.templates': { en: 'Templates', ar: 'القوالب' },
  'nav.providers': { en: 'Providers', ar: 'الموفرون' },
  'nav.channels': { en: 'Channels', ar: 'القنوات' },
  'nav.library': { en: 'Library', ar: 'المكتبة' },
  'nav.jobs': { en: 'Jobs', ar: 'المهام' },
  'nav.settings': { en: 'Settings', ar: 'الإعدادات' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'dashboard.welcome': { en: 'Welcome back', ar: 'مرحباً بعودتك' },
  'dashboard.totalVideos': { en: 'Total Videos', ar: 'إجمالي الفيديوهات' },
  'dashboard.published': { en: 'Published', ar: 'تم النشر' },
  'dashboard.scheduled': { en: 'Scheduled', ar: 'مجدولة' },
  'dashboard.inProgress': { en: 'In Progress', ar: 'قيد التنفيذ' },
  'dashboard.recentJobs': { en: 'Recent Jobs', ar: 'المهام الأخيرة' },
  'dashboard.viewAll': { en: 'View All', ar: 'عرض الكل' },
  'dashboard.createShort': { en: 'Create Short', ar: 'إنشاء فيديو' },

  // Create Short Wizard
  'wizard.step1': { en: 'Topic', ar: 'الموضوع' },
  'wizard.step2': { en: 'Script', ar: 'النص' },
  'wizard.step3': { en: 'Voice', ar: 'الصوت' },
  'wizard.step4': { en: 'Visuals', ar: 'المرئيات' },
  'wizard.step5': { en: 'Captions', ar: 'الترجمات' },
  'wizard.step6': { en: 'Publish', ar: 'النشر' },
  'wizard.step7': { en: 'Preview', ar: 'المعاينة' },
  'wizard.next': { en: 'Next', ar: 'التالي' },
  'wizard.back': { en: 'Back', ar: 'رجوع' },
  'wizard.generate': { en: 'Generate', ar: 'توليد' },
  'wizard.selectLanguage': { en: 'Content Language', ar: 'لغة المحتوى' },
  'wizard.english': { en: 'English', ar: 'إنجليزي' },
  'wizard.arabic': { en: 'Arabic', ar: 'عربي' },

  // Topics
  'topics.title': { en: 'Topics', ar: 'المواضيع' },
  'topics.add': { en: 'Add Topic', ar: 'إضافة موضوع' },
  'topics.import': { en: 'Import CSV', ar: 'استيراد CSV' },
  'topics.placeholder': { en: 'Enter a topic...', ar: 'أدخل موضوعًا...' },

  // Providers
  'providers.title': { en: 'Providers', ar: 'الموفرون' },
  'providers.add': { en: 'Add Provider', ar: 'إضافة موفر' },
  'providers.test': { en: 'Test', ar: 'اختبار' },
  'providers.llm': { en: 'LLM', ar: 'نموذج لغوي' },
  'providers.tts': { en: 'TTS', ar: 'تحويل النص إلى صوت' },
  'providers.image': { en: 'Image', ar: 'صور' },
  'providers.video': { en: 'Video', ar: 'فيديو' },

  // Jobs
  'jobs.title': { en: 'Jobs', ar: 'المهام' },
  'jobs.status.draft': { en: 'Draft', ar: 'مسودة' },
  'jobs.status.scripted': { en: 'Scripted', ar: 'مكتوب' },
  'jobs.status.voiced': { en: 'Voiced', ar: 'مسجل' },
  'jobs.status.asseted': { en: 'Assets Ready', ar: 'الأصول جاهزة' },
  'jobs.status.edited': { en: 'Edited', ar: 'تم التعديل' },
  'jobs.status.captioned': { en: 'Captioned', ar: 'مترجم' },
  'jobs.status.thumbnailed': { en: 'Thumbnail Ready', ar: 'الصورة المصغرة جاهزة' },
  'jobs.status.uploading': { en: 'Uploading', ar: 'جاري الرفع' },
  'jobs.status.published': { en: 'Published', ar: 'تم النشر' },
  'jobs.rerun': { en: 'Rerun Stage', ar: 'إعادة المرحلة' },

  // Channels
  'channels.title': { en: 'YouTube Channels', ar: 'قنوات يوتيوب' },
  'channels.connect': { en: 'Connect Channel', ar: 'ربط القناة' },
  'channels.status.connected': { en: 'Connected', ar: 'متصل' },
  'channels.status.expired': { en: 'Token Expired', ar: 'انتهت صلاحية الرمز' },

  // Common
  'common.save': { en: 'Save', ar: 'حفظ' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.delete': { en: 'Delete', ar: 'حذف' },
  'common.edit': { en: 'Edit', ar: 'تعديل' },
  'common.search': { en: 'Search...', ar: 'بحث...' },
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.noData': { en: 'No data available', ar: 'لا توجد بيانات' },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
