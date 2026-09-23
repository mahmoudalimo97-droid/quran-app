import React, { useState, useEffect } from 'react';
import {
  Droplets,
  BookOpen,
  RotateCw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  Check,
  Eye,
  Shuffle
} from 'lucide-react';
import { toArabicDigits } from '../utils/quranService';

export interface FlashCardItem {
  id: number;
  category: 'wudu' | 'prayer' | 'prayers_info';
  title: string;
  ruling: 'ركن' | 'واجب' | 'سنة مؤكدة' | 'سنة مستحبة' | 'شرط صحة';
  repeat: string;
  frontAction: string;
  frontDetails: string[];
  backSupplicationTitle?: string;
  backSupplication?: string;
  backSunnahNotes?: string;
  backCommonMistake?: string;
}

export const KidsWuduAndPrayerLearning: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'wudu' | 'prayer' | 'prayers_info'>('wudu');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [masteredCards, setMasteredCards] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mastered_flashcards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ==========================================
  // 1. بطاقات الوضوء الشرعي (9 بطاقات فلاش كارد)
  // ==========================================
  const wuduCards: FlashCardItem[] = [
    {
      id: 101,
      category: 'wudu',
      title: 'النية وتسمية الله تعالى',
      ruling: 'شرط صحة',
      repeat: 'مرة واحدة',
      frontAction: 'ينوي المسلم بقلبه رفع الحدث والطهارة لأداء الصلاة، ثم يسمي الله تعالى قائلاً: «بِسْمِ اللَّهِ».',
      frontDetails: [
        'النية محلها القلب الخالص لله ولا يجوز التلفظ بها جهراً.',
        'التسمية تكون عند ابتداء الوضوء (باسم الله).',
        'استحضار طهارة الباطن والظاهر للمثول بين يدي الله عز وجل.'
      ],
      backSupplicationTitle: 'ما يقال عند ابتداء الوضوء',
      backSupplication: '«بِسْمِ اللَّهِ»',
      backSunnahNotes: 'من نسي التسمية في أول الوضوء فليقل حين يذكر: «بسم الله أوله وآخره».',
      backCommonMistake: 'التلفظ بالنية جهراً كقول: (نويت أن أتوضأ)، فالنية عمل قلبي محض لم يرد التلفظ به عن النبي ﷺ.'
    },
    {
      id: 102,
      category: 'wudu',
      title: 'غسل الكفين ثلاثاً',
      ruling: 'سنة مؤكدة',
      repeat: '٣ مرات',
      frontAction: 'غسل الكفين من أطراف الأصابع إلى الرسغين ثلاث مرات مع تخليل الأصابع.',
      frontDetails: [
        'غسل الكف اليمنى أولاً ثم الكف اليسرى.',
        'تخليل ما بين أصابع اليدين بالماء النقي.',
        'التأكد من إزالة أي حائل يمنع وصول الماء للبشرة كالدهان أو المناكير.'
      ],
      backSupplicationTitle: 'السنن والآداب المستحبة',
      backSupplication: 'يستحب استخدام السواك أو تنظيف الأسنان في بداية الوضوء مع غسل الكفين.',
      backSunnahNotes: 'قال النبي ﷺ: «لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ وُضُوءٍ».',
      backCommonMistake: 'عدم غسل الكفين مع اليدين لاحقاً عند غسل الساعدين إلى المرفقين، ظناً أن غسلهما في البداية يجزئ.'
    },
    {
      id: 103,
      category: 'wudu',
      title: 'المضمضة والاستنشاق والاستنثار',
      ruling: 'واجب',
      repeat: '٣ مرات',
      frontAction: 'أخذ غرفة ماء باليد اليمنى، يتمضمض ببعضها ويستنشق بالباقي، ثم يستنثر بيده اليسرى ثلاثاً.',
      frontDetails: [
        'المضمضة: إدخال الماء في الفم وإدارته ثم طرحه.',
        'الاستنشاق: جذب الماء بنَفَس خفيف إلى داخل الأنف باليد اليمنى.',
        'الاستنثار: إخراج الماء من الأنف باليد اليسرى برفق.'
      ],
      backSupplicationTitle: 'الهدي النبوي في المضمضة والاستنشاق',
      backSupplication: 'كان ﷺ يجمع بين المضمضة والاستنشاق من كف واحدة، يفعل ذلك ثلاث مرات.',
      backSunnahNotes: 'المبالغة في الاستنشاق مستحبة لغير الصائم؛ لقوله ﷺ: «وَبَالِغْ فِي الِاسْتِنْشَاقِ إِلَّا أَنْ تَكُونَ صَائِمًا».',
      backCommonMistake: 'أخذ الماء باليسار للاستنشاق أو الاستنثار باليمين، فالسنة أخذ الماء باليمين والاستنثار باليسار.'
    },
    {
      id: 104,
      category: 'wudu',
      title: 'غسل الوجه كاملاً',
      ruling: 'ركن',
      repeat: '٣ مرات',
      frontAction: 'غسل الوجه كاملاً بالماء من منبت شعر الرأس المعتاد إلى أسفل الذقن طولاً، ومن الأذن إلى الأذن عرضاً.',
      frontDetails: [
        'استيعاب جميع مساحة الوجه بالماء دون إغفال أي موضع.',
        'تخليل اللحية الكثيفة بالماء بأصابع اليد، وغسل اللحية الخفيفة.',
        'غسل ما بين شحمة الأذن والعذار.'
      ],
      backSupplicationTitle: 'الضابط الشرعي لغسل الوجه',
      backSupplication: 'قال الله تعالى: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ﴾ [المائدة: ٦]',
      backSunnahNotes: 'السنة أن يغرف بيديه معاً ماءً ثم يغسل بهما وجهه كاملاً بهدوء ورفق دون لطم.',
      backCommonMistake: 'لطم الوجه بالماء بقوة، أو ترك جانبي الوجه بجوار الأذنين جافين دون ماء.'
    },
    {
      id: 105,
      category: 'wudu',
      title: 'غسل اليدين مع المرفقين',
      ruling: 'ركن',
      repeat: '٣ مرات لكل يد',
      frontAction: 'غسل اليد اليمنى من رؤوس الأصابع حتى تشمل المرفق ثلاثاً، ثم اليد اليسرى كذلك ثلاثاً.',
      frontDetails: [
        'البدء باليد اليمنى من أطراف الأصابع مروراً بالساعد حتى استيعاب المرفق.',
        'إدخال المرفق كاملاً في الغسل (المرفق هو المفصل الجامع بين الساعد والعضد).',
        'تكرار الغسل ثلاثاً لليمنى، ثم الانتقال لغسل اليسرى ثلاثاً بنفس الكيفية.'
      ],
      backSupplicationTitle: 'بيان دخول المرفقين في الفريضة',
      backSupplication: 'قال تعالى: ﴿وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ﴾ أي: مع المرافق وداخلة فيها.',
      backSunnahNotes: 'إسباغ الوضوء وإطالة الغرة والتحجيل، بأن يشرع في العضد يسيراً تحصيلاً للأجر.',
      backCommonMistake: 'البدء من الرسغ إلى المرفق وإهمال الكف اكتفاءً بغسلها أول الوضوء؛ وهذا يبطل الوضوء لأن غسل الكف هنا فرض.'
    },
    {
      id: 106,
      category: 'wudu',
      title: 'مسح الرأس مع الأذنين',
      ruling: 'ركن',
      repeat: 'مرة واحدة',
      frontAction: 'بل اليدين بماء جديد، وإمرارهما من مقدمة الرأس إلى قفاه ثم الرجوع بهما، ومسح الأذنين ظاهراً وباطناً.',
      frontDetails: [
        'يبدأ بمقدم الرأس بيديه مبلولتين حتى يذهب بهما إلى قفاه ثم يردهما إلى المكان الذي بدأ منه.',
        'يدخل السبابتين في صماخي الأذنين ويمسح بإبهاميه ظاهر الأذنين.',
        'مسح الرأس يكون مرة واحدة فقط لا يكرر ثلاثاً على الراجح من السنة.'
      ],
      backSupplicationTitle: 'حكم مسح الأذنين مع الرأس',
      backSupplication: 'قال رسول الله ﷺ: «الأُذُنَانِ مِنَ الرَّأْسِ» [رواه أبو داود والترمذي].',
      backSunnahNotes: 'المرأة تمسح رأسها من مقدمه إلى أصل شعرها عند القفا دون نقض ضفائرها.',
      backCommonMistake: 'غسل الرأس كأنه صب ماء، أو تكرار المسح ثلاثاً، أو مسح الرقبة حيث لم يثبت في مسح الرقبة حديث صحيح.'
    },
    {
      id: 107,
      category: 'wudu',
      title: 'غسل الرجلين مع الكعبين',
      ruling: 'ركن',
      repeat: '٣ مرات لكل رجل',
      frontAction: 'غسل الرجل اليمنى مع الكعبين ثلاثاً مع تخليل أصابعها، ثم غسل الرجل اليسرى كذلك ثلاثاً.',
      frontDetails: [
        'الكعبان هما العظمان الناتئان عند مفصل الساق مع القدم ويجب إدخالهما في الغسل.',
        'تخليل ما بين أصابع القدمين بخنصر اليد اليسرى.',
        'الاعتناء بغسل العرقوب (مؤخرة القدم وأسفل الكعب) لضمان وصول الماء إليه.'
      ],
      backSupplicationTitle: 'التحذير من إهمال الأعقاب',
      backSupplication: 'قال رسول الله ﷺ: «وَيْلٌ لِلْأَعْقَابِ مِنَ النَّارِ» [متفق عليه].',
      backSunnahNotes: 'تقديم الرجل اليمنى على اليسرى في الغسل سنة ثابتة.',
      backCommonMistake: 'عدم وصول الماء إلى الكعبين أو بطون الأصابع أو مؤخرة القدم (العرقوب)، خصوصاً في أيام البرد.'
    },
    {
      id: 108,
      category: 'wudu',
      title: 'الترتيب والموالاة بين الأعضاء',
      ruling: 'ركن',
      repeat: 'شرط لازم',
      frontAction: 'غسل الأعضاء بالترتيب المذكور في القرآن الكريم، وتتابع الغسل بحيث لا يجف عضو قبل غسل الذي يليه.',
      frontDetails: [
        'الترتيب: الوجه، ثم اليدين للمرفقين، ثم مسح الرأس، ثم غسل الرجلين.',
        'الموالاة: ألا يؤخر غسل عضو حتى يجف العضو الذي قبله في الزمن المعتدل.',
        'إذا طال الفصل وجف العضو لغير ضرورة لزم إعادة الوضوء من أوله.'
      ],
      backSupplicationTitle: 'دليل الترتيب في كتاب الله',
      backSupplication: '﴿إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ﴾',
      backSunnahNotes: 'الترتيب ركن عند جمهور الفقهاء تأسياً بفعل النبي ﷺ الذي لم يتوضأ إلا مرتباً.',
      backCommonMistake: 'تقديم غسل اليدين على الوجه أو غسل الرجلين قبل مسح الرأس نسياناً أو استعجالاً.'
    },
    {
      id: 109,
      category: 'wudu',
      title: 'الدعاء بعد الفراغ من الوضوء',
      ruling: 'سنة مستحبة',
      repeat: 'مرة واحدة',
      frontAction: 'قول الأذكار النبوية المأثورة عقب إتمام الوضوء، مع استحباب صلاة ركعتين خاشعتين.',
      frontDetails: [
        'استقبال القبلة عند الذكر والدعاء.',
        'النطق بالشهادتين وسؤال الله التوبة والطهارة.',
        'استحضار فضيلة فتح أبواب الجنة الثمانية للمتطهر.'
      ],
      backSupplicationTitle: 'الذكر الصحيح بعد الوضوء كاملاً',
      backSupplication: '«أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ».',
      backSunnahNotes: 'قال ﷺ: «مَا مِنْكُمْ مِنْ أَحَدٍ يَتَوَضَّأُ فَيُبْلِغُ الْوُضُوءَ ثُمَّ يَقُولُ... إِلَّا فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ يَدْخُلُ مِنْ أَيِّهَا شَاءَ».',
      backCommonMistake: 'قول أدعية مبتدعة عند غسل كل عضو (كدعاء: اللهم بيض وجهي يوم تسود الوجوه)؛ فلم يثبت منها شيء عن النبي ﷺ.'
    }
  ];

  // ==========================================
  // 2. بطاقات صفة الصلاة النبوية (12 بطاقة فلاش كارد)
  // ==========================================
  const prayerCards: FlashCardItem[] = [
    {
      id: 201,
      category: 'prayer',
      title: 'استقبال القبلة وتكبيرة الإحرام',
      ruling: 'ركن',
      repeat: 'مرة واحدة',
      frontAction: 'يقف المسلم مستقبلاً القبلة بنية الصلاة، ويرفع يديه حذو منكبيه أو أذنيه قائلاً: «اللَّهُ أَكْبَرُ».',
      frontDetails: [
        'القيام في الفرض للقادر عليه ركن لا تصح الصلاة بدونه.',
        'رفع اليدين مضمومة الأصابع ممدودة نحو القبلة حذو المنكبين أو شحمتي الأذنين.',
        'لا تنعقد الصلاة إلا بلفظ: «اللَّهُ أَكْبَرُ» ولا يجزئ غيره.'
      ],
      backSupplicationTitle: 'لفظ تكبيرة الإحرام وحكمها',
      backSupplication: '«اللَّهُ أَكْبَرُ»',
      backSunnahNotes: 'تحريم الصلاة التكبير وتحليلها التسليم. رفع اليدين سنة وتكبيرة الإحرام ركن.',
      backCommonMistake: 'مد همزة لفظ الجلالة كقول (آلله أكبر) أو مد الباء كقول (أكبار)؛ فهذا لحن يغير المعنى ويبطل الصلاة.'
    },
    {
      id: 202,
      category: 'prayer',
      title: 'دعاء الاستفتاح والاستعاذة والبسملة',
      ruling: 'سنة مستحبة',
      repeat: 'في الركعة الأولى',
      frontAction: 'يضع كفه اليمنى على ظهر كفه ورسغه الأيسر على الصدر، ويقرأ دعاء الاستفتاح سراً ثم يستعيذ ويبسمل.',
      frontDetails: [
        'وضع اليد اليمنى فوق اليسرى على الصدر أو فوق السرة.',
        'النظر إلى موضع السجود بخشوع وسكينة دون التفات.',
        'قراءة دعاء الاستفتاح سراً، ثم التعوذ من الشيطان والبسملة.'
      ],
      backSupplicationTitle: 'دعاء الاستفتاح المأثور',
      backSupplication: '«سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ».',
      backSunnahNotes: 'ويجوز أيضاً: «اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ...».',
      backCommonMistake: 'الجهر بدعاء الاستفتاح أو الاستعاذة؛ فالسنة الإسرار بهما دائماً.'
    },
    {
      id: 203,
      category: 'prayer',
      title: 'قراءة سورة الفاتحة وما تيسر',
      ruling: 'ركن',
      repeat: 'في كل ركعة',
      frontAction: 'قراءة سورة الفاتحة كاملة بآياتها السبع مرتبة مع البسملة، ثم قراءة ما تيسر من القرآن في الأوليين.',
      frontDetails: [
        'قراءة الفاتحة ركن في كل ركعة للإمام والمنفرد (وعلى المأموم في السرية).',
        'التأني والترتيل والوقوف عند رؤوس الآيات.',
        'قول «آمِينَ» عقب الفراغ من الفاتحة (جهراً في الجهرية وسراً في السرية).'
      ],
      backSupplicationTitle: 'حكم قراءة الفاتحة في الصلاة',
      backSupplication: 'قال رسول الله ﷺ: «لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ» [متفق عليه].',
      backSunnahNotes: 'يقرأ بعدها سورة أو آيات في الركعتين الأولى والثانية، ويكتفي بالفاتحة في الركعات الباقية.',
      backCommonMistake: 'إسقاط آية من الفاتحة أو قراءتها بسرعة بالغة تسقط حروفها أو تخل بتشديداتها.'
    },
    {
      id: 204,
      category: 'prayer',
      title: 'الركوع وتعظيم الرب سبحانه',
      ruling: 'ركن',
      repeat: 'مرة في كل ركعة',
      frontAction: 'يرفع يديه مكبراً وينحني حتى يستوي ظهره مستوياً ويقبض بيديه على ركبتيه مفرجتي الأصابع.',
      frontDetails: [
        'استواء الظهر بحيث لو صب عليه الماء لاستقر، ولا يشخص رأسه ولا يصوبه بل بين ذلك.',
        'تمكين الكفين من الركبتين كأنه قابض عليهما وتفريج أصابع اليدين.',
        'الطمأنينة ركن، وأقلها سكون الأعضاء لحظة في وضع الركوع.'
      ],
      backSupplicationTitle: 'الذكر المشروع في الركوع',
      backSupplication: '«سُبْحَانَ رَبِّيَ الْعَظِيمِ» (٣ مرات أو أكثر). ويستحب زيادة: «سُبُّوحٌ قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ».',
      backSunnahNotes: 'قال ﷺ: «فَأَمَّا الرُّكُوعُ فَعَظِّمُوا فِيهِ الرَّبَّ عَزَّ وَجَلَّ». ويحرم قراءة القرآن راكعاً.',
      backCommonMistake: 'تقويس الظهر، أو عدم استقرار الأعضاء (نقرة الغراب)، أو عدم بسط اليدين على الركبتين.'
    },
    {
      id: 205,
      category: 'prayer',
      title: 'الرفع من الركوع والاعتدال قائماً',
      ruling: 'ركن',
      repeat: 'مرة في كل ركعة',
      frontAction: 'يرفع رأسه وظهره من الركوع رافعاً يديه حذو منكبيه قائلاً: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ» حتى يستوي قائماً.',
      frontDetails: [
        'يقول الإمام والمنفرد حال الرفع: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ».',
        'يقول المأموم حال رفعه: «رَبَّنَا وَلَكَ الْحَمْدُ».',
        'الاطمئنان في القيام بعد الركوع حتى يرجع كل عظم ومفصل إلى موضعه.'
      ],
      backSupplicationTitle: 'الذكر بعد استواء القيام',
      backSupplication: '«رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ، وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ».',
      backSunnahNotes: 'رأى النبي ﷺ بضعة وثلاثين ملكاً يبتدرون كتابة هذا الذكر لعظم ثوابه.',
      backCommonMistake: 'الاستعجال في الهوي للسجود قبل اكتمال الاعتدال والاطمئنان قائماً؛ وهذا يبطل الركعة.'
    },
    {
      id: 206,
      category: 'prayer',
      title: 'السجود الأول على الأعضاء السبعة',
      ruling: 'ركن',
      repeat: 'في كل ركعة',
      frontAction: 'يهوي للسجود مكبراً على سبعة أعضاء: الجبهة مع الأنف، والكفين، والركبتين، وأطراف القدمين.',
      frontDetails: [
        'مباشرة الأعضاء السبعة للأرض بتمكين واستقرار كاملين.',
        'توجيه أصابع اليدين والقدمين نحو القبلة ورص القدمين وتفريج الفخذين.',
        'رفع المرفقين عن الأرض ومجافاة العضدين عن الجنبين والبطن عن الفخذين (للرجال).'
      ],
      backSupplicationTitle: 'الذكر والدعاء في السجود',
      backSupplication: '«سُبْحَانَ رَبِّيَ الْأَعْلَى» (٣ مرات أو أكثر). «سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي».',
      backSunnahNotes: 'أقرب ما يكون العبد من ربه وهو ساجد فأكثروا فيه من الدعاء المستجاب.',
      backCommonMistake: 'بسط الذراعين وإلصاقهما بالأرض كافتراش الكلب (وهو منهي عنه)، أو رفع إحدى القدمين عن الأرض أثناء السجود.'
    },
    {
      id: 207,
      category: 'prayer',
      title: 'الرفع من السجود والجلوس بين السجدتين',
      ruling: 'ركن',
      repeat: 'في كل ركعة',
      frontAction: 'يرفع رأسه مكبراً ويجلس مفترشاً رجله اليسرى وناصباً رجله اليمنى، ويضع كفيه على فخذيه ويطمئن.',
      frontDetails: [
        'الافتراش: فرش القدم اليسرى والجلوس عليها، ونصب القدم اليمنى موجهاً أصابعها للقبلة.',
        'وضع اليدين مبسوطتين على الفخذين قرب الركبتين.',
        'السكون والاطمئنان في الجلسة بمقدار الذكر المشروع.'
      ],
      backSupplicationTitle: 'دعاء الجلوس بين السجدتين',
      backSupplication: '«رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي، اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي».',
      backSunnahNotes: 'يجوز أحياناً الإقعاء المسنون: وهو نصب القدمين معاً والجلوس على العقبين بين السجدتين.',
      backCommonMistake: 'النقر السريع دون اطمئنان أو ترك الدعاء بالمغفرة في هذا الموضع العظيم.'
    },
    {
      id: 208,
      category: 'prayer',
      title: 'السجود الثاني والنهوض للركعة التالية',
      ruling: 'ركن',
      repeat: 'في كل ركعة',
      frontAction: 'يكبر ويسجد السجدة الثانية كالأولى تماماً بجميع شروطها وأذكارها وطمأنينتها، ثم ينهض قائماً.',
      frontDetails: [
        'تأدية السجدة الثانية بنفس الخشوع والذكر والطمأنينة كالسجدة الأولى.',
        'جلسة الاستراحة: يستحب الجلوس خفيفاً بعد السجدة الثانية قبل النهوض للركعة التالية.',
        'ينهض قائماً للركعة التالية معتمداً على ركبتيه أو يديه مكبراً.'
      ],
      backSupplicationTitle: 'ذكر السجدة الثانية',
      backSupplication: '«سُبْحَانَ رَبِّيَ الْأَعْلَى» (٣ مرات)، مع الإكثار من خيري الدنيا والآخرة.',
      backSunnahNotes: 'الركعة الثانية تؤدى مثل الأولى تماماً في الأفعال عدا تكبيرة الإحرام والاستفتاح.',
      backCommonMistake: 'الاستعجال في السجدة الثانية والنهوض قبل استقرار الأعضاء السبعة على الأرض.'
    },
    {
      id: 209,
      category: 'prayer',
      title: 'التشهد الأول (للصلوات الثلاثية والرباعية)',
      ruling: 'واجب',
      repeat: 'في الركعة الثانية',
      frontAction: 'يجلس مفترشاً بعد الركعة الثانية، ويقبض خنصر وبنصر يده اليمنى ويحلق بالإبهام والوسطى ويشير بالسبابة.',
      frontDetails: [
        'الإشارة بالسبابة اليمنى نحوَ القبلة وتحريكها خفيفاً عند الدعاء وذكر الله.',
        'قراءة ألفاظ التشهد الأول سراً دون زيادة الصلاة الإبراهيمية (على الأرجح في التشهد الأول).',
        'النهوض بعده للركعة الثالثة مع رفع اليدين مكبراً.'
      ],
      backSupplicationTitle: 'لفظ التشهد الأول الصحيح (ابن مسعود)',
      backSupplication: '«التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ».',
      backSunnahNotes: 'إذا نسي المصلي التشهد الأول ونهض قائماً سجد سجدتي السهو قبل السلام.',
      backCommonMistake: 'ترك الإشارة بالسبابة، أو إطالة الجلوس في التشهد الأول كأنه التشهد الأخير.'
    },
    {
      id: 210,
      category: 'prayer',
      title: 'التشهد الأخير والصلاة الإبراهيمية',
      ruling: 'ركن',
      repeat: 'في الركعة الأخيرة',
      frontAction: 'يجلس متوركاً في الصلاة الرباعية أو الثلاثية، ويقرأ التشهد كاملاً ويعقبه بالصلاة الإبراهيمية.',
      frontDetails: [
        'التورّك: إخراج القدم اليسرى من جهة اليمين والجلوس بإليته على الأرض ونصب القدم اليمنى.',
        'قراءة التشهد ثم الصلاة على النبي ﷺ وآله بألفاظ الصلاة الإبراهيمية.',
        'الاستمرار بالإشارة بالسبابة والنظر إليها بخشوع.'
      ],
      backSupplicationTitle: 'نص الصلاة الإبراهيمية الصحيح',
      backSupplication: '«اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ».',
      backSunnahNotes: 'الصلاة الإبراهيمية ركن من أركان الصلاة عند الحنابلة والشافعية لا تصح الصلاة بدونها.',
      backCommonMistake: 'إضافة ألفاظ لم ترد في الأحاديث الصحيحة، أو إهمال الصلاة على النبي ﷺ في التشهد الأخير.'
    },
    {
      id: 211,
      category: 'prayer',
      title: 'التعوذ من الأربع قبل السلام',
      ruling: 'سنة مؤكدة',
      repeat: 'قبل التسليم',
      frontAction: 'يستعيذ المسلم بالله من أربع فتن عظيمة بعد الفراغ من الصلاة الإبراهيمية وقبل أن يسلّم.',
      frontDetails: [
        'التعوذ من عذاب جهنم، وعذاب القبر، وفتنة المحيا والممات، وفتنة المسيح الدجال.',
        'الدعاء بما أحب من خيري الدنيا والآخرة ومأثور الأدعية.',
        'أكد بعض العلماء وجوب هذا التعوذ لأمر النبي ﷺ الصريح به.'
      ],
      backSupplicationTitle: 'الدعاء النبوي المؤكد قبل السلام',
      backSupplication: '«اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ».',
      backSunnahNotes: 'كان النبي ﷺ يداوم على هذا الدعاء قبل السلام، ويستحب زيادة: «اللهم أعني على ذكرك وشكرك وحسن عبادتك».',
      backCommonMistake: 'الاستعجال في التسليم فور نهاية الصلاة الإبراهيمية وترك هذه السنن النبوية المؤكدة.'
    },
    {
      id: 212,
      category: 'prayer',
      title: 'التسليمتان عن اليمين والشمال',
      ruling: 'ركن',
      repeat: 'ختام الصلاة',
      frontAction: 'يلتفت برأسه عن يمينه حتى يُرى بياض خده قائلاً: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»، ثم عن يساره كذلك.',
      frontDetails: [
        'التسليمة الأولى ركن يخرج به المصلي من الصلاة وتحل به محظوراتها.',
        'التسليمة الثانية سنة مؤكدة في المذاهب الأربعة.',
        'استحضار نية السلام على الملائكة الحفظة والمصلين معه.'
      ],
      backSupplicationTitle: 'صيغة التسليم المأثورة',
      backSupplication: 'عن اليمين: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»\nعن اليسار: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»',
      backSunnahNotes: 'عقب السلام مباشرة يستغفر الله ثلاثاً: «أستغفر الله، أستغفر الله، أستغفر الله. اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام».',
      backCommonMistake: 'تحريك اليدين أو مسح الوجه أثناء التسليم؛ فالسلام بالرأس فقط دون إشارة باليدين.'
    }
  ];

  // ==========================================
  // 3. بطاقات مواقيت وركعات الصلوات الخمس (5 بطاقات فلاش كارد)
  // ==========================================
  const prayersInfoCards: FlashCardItem[] = [
    {
      id: 301,
      category: 'prayers_info',
      title: 'صلاة الفجر (الصبح)',
      ruling: 'ركن',
      repeat: 'ركعتان جهريتان',
      frontAction: 'ركعتان مفروضتان تؤديان جهراً من طلوع الفجر الصادق حتى طلوع الشمس.',
      frontDetails: [
        'عدد الركعات: ركعتان فقط بصوت مسموع (جهرياً).',
        'وقتها: من تبين الفجر الصادق إلى قبيل شروق الشمس.',
        'سنة الفجر القبلية: ركعتان خفيفتان قبلهما خير من الدنيا وما فيها.'
      ],
      backSupplicationTitle: 'فضل صلاة الفجر وسنتها',
      backSupplication: 'قال رسول الله ﷺ: «رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا» [رواه مسلم]. وقال: «مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ».',
      backSunnahNotes: 'يقرأ في سنة الفجر القبلية سورة (الكافرون) في الركعة الأولى وسورة (الإخلاص) في الثانية.',
      backCommonMistake: 'تأخير الصلاة حتى تطلع الشمس أو النوم عنها بغير عذر شرعي.'
    },
    {
      id: 302,
      category: 'prayers_info',
      title: 'صلاة الظهر',
      ruling: 'ركن',
      repeat: '٤ ركعات سرية',
      frontAction: 'أربع ركعات سرية (همساً) تؤدى عند زوال الشمس عن كبد السماء حتى يصير ظل الشيء مثله.',
      frontDetails: [
        'عدد الركعات: ٤ ركعات سرية بجلوسين (تشهد أول بعد الثانية وتشهد أخير بعد الرابعة).',
        'وقتها: من زوال الشمس عن منتصف السماء إلى مصير ظل الشيء مثله.',
        'السنن الرواتب: ٤ ركعات قبلها (بتسليمتين) وركعتان بعدها.'
      ],
      backSupplicationTitle: 'فضل رواتب الظهر',
      backSupplication: 'قال ﷺ: «مَنْ حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ» [رواه الترمذي].',
      backSunnahNotes: 'الركعات الأربع سرية يقرأ فيها سراً حتى في صلاة الجماعة.',
      backCommonMistake: 'الجهر بالقراءة في صلاة الظهر أو السرعة الزائدة في الركعتين الأخيرتين.'
    },
    {
      id: 303,
      category: 'prayers_info',
      title: 'صلاة العصر (الصلاة الوسطى)',
      ruling: 'ركن',
      repeat: '٤ ركعات سرية',
      frontAction: 'أربع ركعات سرية تؤدى من مصير ظل الشيء مثله حتى اصفرار الشمس وغروبها.',
      frontDetails: [
        'عدد الركعات: ٤ ركعات سرية بجلوسين كصلاة الظهر تماماً.',
        'مكانتها: هي الصلاة الوسطى التي نص القرآن على عظيم العناية بها.',
        'سنتها القبلية: يستحب صلاة ٤ ركعات قبلها لقوله ﷺ: «رَحِمَ اللَّهُ امْرَأً صَلَّى قَبْلَ الْعَصْرِ أَرْبَعًا».'
      ],
      backSupplicationTitle: 'الوعيد في ترك صلاة العصر',
      backSupplication: 'قال رسول الله ﷺ: «مَنْ تَرَكَ صَلَاةَ الْعَصْرِ حَبِطَ عَمَلُهُ» [رواه البخاري].',
      backSunnahNotes: 'يكره تأخير صلاة العصر إلى وقت الاصفرار قبيل الغروب بغير ضرورة وتلك صلاة المنافقين.',
      backCommonMistake: 'تأخيرها حتى تصفر الشمس وتدنو من الغروب.'
    },
    {
      id: 304,
      category: 'prayers_info',
      title: 'صلاة المغرب',
      ruling: 'ركن',
      repeat: '٣ ركعات',
      frontAction: 'ثلاث ركعات: الركعتان الأوليان جهريتان، والركعة الثالثة سرية، ووقتها يبدأ من مغيب قرص الشمس.',
      frontDetails: [
        'عدد الركعات: ٣ ركعات (أول ركعتين جهريتان بالفاتحة وسورة، والثالثة سرية بالفاتحة فقط).',
        'وقتها: من مغيب كامل قرص الشمس إلى مغيب الشفق الأحمر.',
        'سنتها الراتبة: ركعتان بعد الفريضة تؤديان سراً.'
      ],
      backSupplicationTitle: 'وقت المغرب والمبادرة بها',
      backSupplication: 'قال النبي ﷺ: «لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا لَمْ يُؤَخِّرُوا الْمَغْرِبَ حَتَّى تَشْتَبِكَ النُّجُومُ».',
      backSunnahNotes: 'يستحب في سنة المغرب البعدية قراءة سورتي الكافرون والإخلاص.',
      backCommonMistake: 'الجهر بالقراءة في الركعة الثالثة من المغرب؛ فالجهر يكون في الأولى والثانية فقط.'
    },
    {
      id: 305,
      category: 'prayers_info',
      title: 'صلاة العشاء والوتر',
      ruling: 'ركن',
      repeat: '٤ ركعات فريضة + الوتر',
      frontAction: 'أربع ركعات: الأوليان جهريتان والأخيرتان سريتان، ويعقبها سنة العشاء ثم صلاة الوتر.',
      frontDetails: [
        'عدد الركعات: ٤ ركعات فريضة بجلوسين (الأولى والثانية جهراً، والثالثة والرابعة سراً).',
        'وقتها: من مغيب الشفق الأحمر إلى منتصف الليل الشرعي.',
        'السنن التابعة: ركعتان راتبة العشاء، ثم ركعات الوتر (من ركعة إلى إحدى عشرة ركعة).'
      ],
      backSupplicationTitle: 'فضل صلاة العشاء في جماعة',
      backSupplication: 'قال رسول الله ﷺ: «مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ» [رواه مسلم].',
      backSunnahNotes: 'صلاة الوتر سنة مؤكدة حث عليها النبي ﷺ وكان لا يدعها في حضر ولا سفر.',
      backCommonMistake: 'تأخير صلاة العشاء إلى ما بعد منتصف الليل؛ فوقتها الاختياري ينتهي بنصف الليل الشرعي.'
    }
  ];

  // Active list based on selected category
  const currentCardList =
    activeCategory === 'wudu'
      ? wuduCards
      : activeCategory === 'prayer'
      ? prayerCards
      : prayersInfoCards;

  const currentCard = currentCardList[currentCardIndex] || currentCardList[0];

  // Flip card handler
  const handleToggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Navigation handlers
  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < currentCardList.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(currentCardList.length - 1);
    }
  };

  const handleToggleMastered = (cardId: number) => {
    let updated: number[];
    if (masteredCards.includes(cardId)) {
      updated = masteredCards.filter((id) => id !== cardId);
    } else {
      updated = [...masteredCards, cardId];
    }
    setMasteredCards(updated);
    try {
      localStorage.setItem('mastered_flashcards', JSON.stringify(updated));
    } catch {}
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNextCard();
      } else if (e.key === 'ArrowRight') {
        handlePrevCard();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, currentCardList.length]);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 max-w-5xl mx-auto pb-36 text-slate-100 animate-in fade-in">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-2 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>بطاقات فلاش كارد التعليمية التفاعلية • Flash Cards</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 font-['Amiri',serif] mb-2 leading-tight">
          بطاقات تعليم صفة الوضوء والصلاة
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          دليل فقهي وتطبيقي ميسر لتعلم صفة طهارة وصلاة النبي ﷺ عبر بطاقات مكتوبة ومفصلة؛ وجه البطاقة لصفة الأداء وظهرها للأذكار والأدعية والسنن.
        </p>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => {
            setActiveCategory('wudu');
            setCurrentCardIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === 'wudu'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-950/80 border border-teal-400/50 scale-105'
              : 'bg-[#09151e] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4 text-cyan-300" />
          <span>بطاقات صفة الوضوء ({toArabicDigits(wuduCards.length)})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('prayer');
            setCurrentCardIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === 'prayer'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-105'
              : 'bg-[#09151e] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>بطاقات صفة الصلاة ({toArabicDigits(prayerCards.length)})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('prayers_info');
            setCurrentCardIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === 'prayers_info'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black shadow-lg shadow-amber-950/80 border border-amber-300/60 scale-105'
              : 'bg-[#09151e] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>الصلوات الخمس ومواقيتها ({toArabicDigits(prayersInfoCards.length)})</span>
        </button>
      </div>

      {/* Flashcard Header Controls: View mode toggle & mastered counter */}
      <div className="flex items-center justify-between gap-3 bg-[#08131b] border border-slate-800 rounded-2xl p-3 mb-6 max-w-3xl mx-auto text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="text-amber-400 font-bold font-mono">
            بطاقة {toArabicDigits(currentCardIndex + 1)} من {toArabicDigits(currentCardList.length)}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">
            المُتقن: {toArabicDigits(masteredCards.filter((id) => currentCardList.some((c) => c.id === id)).length)} / {toArabicDigits(currentCardList.length)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to Grid view or Flashcard view */}
          <button
            onClick={() => setViewMode(viewMode === 'flashcard' ? 'grid' : 'flashcard')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {viewMode === 'flashcard' ? <Layers className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <span>{viewMode === 'flashcard' ? 'عرض شبكة البطاقات' : 'وضع البطاقة الواحدة'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌟 VIEW MODE 1: SINGLE INTERACTIVE 3D FLASH CARD 🌟 */}
      {/* ======================================================== */}
      {viewMode === 'flashcard' ? (
        <div className="max-w-2xl mx-auto">
          {/* Main Flashcard Container with Flip Animation */}
          <div
            onClick={handleToggleFlip}
            className="cursor-pointer group relative min-h-[380px] sm:min-h-[420px] rounded-3xl bg-gradient-to-b from-[#0b1b26] to-[#061017] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400/60 hover:shadow-emerald-950/60 flex flex-col justify-between"
          >
            {/* Corner Decorative Islamic Pattern / Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none blur-xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-tr-full pointer-events-none blur-xl" />

            {/* Top Bar of the Flash Card */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-900 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  بطاقة رقم {toArabicDigits(currentCardIndex + 1)}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold ${
                    currentCard.ruling === 'ركن'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : currentCard.ruling === 'واجب' || currentCard.ruling === 'شرط صحة'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {currentCard.ruling}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  {currentCard.repeat}
                </span>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-[spin_10s_linear_infinite]" />
                  <span>{isFlipped ? 'ظهر البطاقة' : 'وجه البطاقة'}</span>
                </span>
              </div>
            </div>

            {/* Flash Card Body: Front vs Back */}
            <div className="relative z-10 my-4 flex-1 flex flex-col justify-center">
              {!isFlipped ? (
                /* ================= FRONT OF CARD ================= */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center">
                    <span className="text-[11px] text-emerald-400 font-bold tracking-wider">
                      الخطوة والكيفية العملية
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 font-['Amiri',serif] mt-1">
                      {currentCard.title}
                    </h2>
                  </div>

                  <div className="bg-[#081621] border border-emerald-500/25 rounded-2xl p-4 sm:p-5 text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
                    {currentCard.frontAction}
                  </div>

                  {/* Bullet points for exact execution */}
                  <div className="space-y-2 bg-[#050d14]/70 rounded-2xl p-3.5 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      الضوابط والشروط:
                    </span>
                    {currentCard.frontDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="text-emerald-400 mt-1 text-xs">◆</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ================= BACK OF CARD ================= */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center">
                    <span className="text-[11px] text-amber-400 font-bold tracking-wider">
                      الذكر المشروع والسنن النبوية
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-amber-200 font-['Amiri',serif] mt-1">
                      {currentCard.backSupplicationTitle || 'الذكر والدعاء المشروع'}
                    </h2>
                  </div>

                  {/* Supplication Box */}
                  {currentCard.backSupplication && (
                    <div className="bg-gradient-to-r from-[#0d261d] to-[#071714] border border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center shadow-inner">
                      <div className="text-base sm:text-xl font-['Amiri',serif] text-amber-100 font-bold leading-relaxed whitespace-pre-line">
                        {currentCard.backSupplication}
                      </div>
                    </div>
                  )}

                  {/* Sunnah Notes */}
                  {currentCard.backSunnahNotes && (
                    <div className="bg-[#06121a] p-3.5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-300 block mb-0.5">من فقه السنة:</span>
                        <span>{currentCard.backSunnahNotes}</span>
                      </div>
                    </div>
                  )}

                  {/* Common Mistake to Avoid */}
                  {currentCard.backCommonMistake && (
                    <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                      <span className="font-bold text-rose-400 shrink-0">تنبيه فقهي:</span>
                      <span>{currentCard.backCommonMistake}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Flip Prompt */}
            <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {isFlipped ? 'انقر للعودة إلى صفة الأداء' : 'انقر على البطاقة أو الزر لقلبها وقراءة الذكر والسنة'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFlip();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'اقلب إلى الوجه' : 'اقلب إلى الظهر'}</span>
              </button>
            </div>
          </div>

          {/* Flashcard Navigation and Mastery Toolbar */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2.5 rounded-2xl bg-[#09151e] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
              <span>البطاقة السابقة</span>
            </button>

            <button
              onClick={() => handleToggleMastered(currentCard.id)}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                masteredCards.includes(currentCard.id)
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>{masteredCards.includes(currentCard.id) ? 'تم إتقان البطاقة ✓' : 'تحديد كمُتقَن'}</span>
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>البطاقة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick-Jump Card Carousel Pointers */}
          <div className="mt-6 flex items-center justify-center gap-1.5 flex-wrap">
            {currentCardList.map((c, idx) => {
              const isSelected = idx === currentCardIndex;
              const isDone = masteredCards.includes(c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentCardIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-lg scale-110 font-black'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={c.title}
                >
                  {toArabicDigits(idx + 1)}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 🌟 VIEW MODE 2: ALL CARDS EXPANDED GRID VIEW 🌟 */
        /* ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {currentCardList.map((card, idx) => {
            const isDone = masteredCards.includes(card.id);

            return (
              <div
                key={card.id}
                className="bg-gradient-to-b from-[#0a1721] to-[#060e15] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-900 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                        بطاقة {toArabicDigits(idx + 1)}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {card.ruling}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleMastered(card.id)}
                      className={`text-xs p-1.5 rounded-lg transition-colors ${
                        isDone ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isDone ? 'مُتقن' : 'تحديد كمتقن'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-amber-200 font-['Amiri',serif] mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                    {card.frontAction}
                  </p>

                  {card.backSupplication && (
                    <div className="bg-[#081923] border border-amber-500/25 rounded-xl p-3 mb-3 text-xs sm:text-sm text-amber-100 font-['Amiri',serif] leading-relaxed font-bold">
                      {card.backSupplication}
                    </div>
                  )}

                  {card.backSunnahNotes && (
                    <p className="text-[11px] text-slate-400 leading-normal">
                      <span className="text-emerald-400 font-semibold">السنة: </span>
                      {card.backSunnahNotes}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>التكرار: {card.repeat}</span>
                  <button
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setViewMode('flashcard');
                      setIsFlipped(false);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>فتح كبطاقة فلاش</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Fiqh Tip Banner */}
      <div className="mt-12 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs sm:text-sm mb-1 font-['Amiri',serif]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>حديث شريف: «صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي» [رواه البخاري]</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          جميع بطاقات هذا الدليل الفقهي محررة وفق السنة النبوية الشريفة الثابتة عن رسول الله ﷺ في صفة الطهارة والصلاة.
        </p>
      </div>
    </div>
  );
};
