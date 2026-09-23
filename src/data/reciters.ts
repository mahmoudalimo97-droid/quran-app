import { Reciter } from '../types/quran';

export const RECITERS: Reciter[] = [
  {
    id: 'hussary_murattal',
    name: 'الشيخ محمود خليل الحصري',
    subname: 'المصحف المرتل (برواية حفص عن عاصم)',
    bio: 'شيخ عموم المقارئ المصرية وأول من سجل المصحف المرتل في العالم الإسلامي. عُرف بإتقانه التام لأحكام التجويد ومخارج الحروف ودقة الوقف والابتداء.',
    style: 'murattal',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    everyAyahFolder: 'Husary_128kbps',
    serverUrl: 'https://server13.mp3quran.net/husr'
  },
  {
    id: 'minshawi_murattal',
    name: 'الشيخ محمد صديق المنشاوي',
    subname: 'المصحف المرتل (الصوت الباكي الخاشع)',
    bio: 'أحد أقطاب التلاوة الخالدين في العالم الإسلامي. لُقّب بـ "الصوت الباكي" لخشوعه الشديد وعذوبة صوته التي تمس القلوب وتأسر الوجدان.',
    style: 'murattal',
    avatar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=400&q=80',
    everyAyahFolder: 'Minshawy_Murattal_128kbps',
    serverUrl: 'https://server10.mp3quran.net/minsh'
  },
  {
    id: 'hussary_mujawwad',
    name: 'الشيخ محمود خليل الحصري',
    subname: 'المصحف المجوّد (روائع التجويد)',
    bio: 'تلاوات مجودة مدرسة في النغم الرصين والانضباط القرآني المهيب بدون تكلف، مرجع لكل قراء العالم الإسلامي.',
    style: 'mujawwad',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    everyAyahFolder: 'Husary_Mujawwad_128kbps',
    serverUrl: 'https://server13.mp3quran.net/husr'
  },
  {
    id: 'minshawi_mujawwad',
    name: 'الشيخ محمد صديق المنشاوي',
    subname: 'المصحف المجوّد (المقامات الشجية)',
    bio: 'تلاوات مجودة فريدة تسلب الألباب بخشوعها وحزنها الشجي ونبرتها العالية الصادقة.',
    style: 'mujawwad',
    avatar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=400&q=80',
    everyAyahFolder: 'Minshawy_Mujawwad_192kbps',
    serverUrl: 'https://server10.mp3quran.net/minsh'
  }
];

export function getAyahAudioUrl(reciterId: string, surahNumber: number, ayahNumber: number): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/${reciter.everyAyahFolder}/${sStr}${aStr}.mp3`;
}

export function getSurahAudioUrl(reciterId: string, surahNumber: number): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const sStr = String(surahNumber).padStart(3, '0');
  return `${reciter.serverUrl}/${sStr}.mp3`;
}
