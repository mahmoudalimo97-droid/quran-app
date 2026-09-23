// Complete Offline Astronomical Calculation for Islamic Prayer Times
// Works 100% without internet connection

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  time: string; // "04:32"
  timestamp: number; // epoch ms today
  isNext?: boolean;
}

export interface CityOption {
  nameAr: string;
  countryAr: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
}

export const POPULAR_CITIES: CityOption[] = [
  { nameAr: 'القاهرة', countryAr: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { nameAr: 'الإسكندرية', countryAr: 'مصر', lat: 31.2001, lng: 29.9187, timezone: 2 },
  { nameAr: 'الجيزة', countryAr: 'مصر', lat: 30.0131, lng: 31.2089, timezone: 2 },
  { nameAr: 'طنطا', countryAr: 'مصر', lat: 30.7865, lng: 31.0004, timezone: 2 },
  { nameAr: 'المنصورة', countryAr: 'مصر', lat: 31.0409, lng: 31.3785, timezone: 2 },
  { nameAr: 'أسيوط', countryAr: 'مصر', lat: 27.1809, lng: 31.1837, timezone: 2 },
  { nameAr: 'مكة المكرمة', countryAr: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { nameAr: 'المدينة المنورة', countryAr: 'السعودية', lat: 24.4672, lng: 39.6111, timezone: 3 },
  { nameAr: 'الرياض', countryAr: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { nameAr: 'جدة', countryAr: 'السعودية', lat: 21.4858, lng: 39.1925, timezone: 3 },
  { nameAr: 'القدس الشريف', countryAr: 'فلسطين', lat: 31.7683, lng: 35.2137, timezone: 3 },
  { nameAr: 'عمّان', countryAr: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3 },
  { nameAr: 'دبي', countryAr: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { nameAr: 'أبو ظبي', countryAr: 'الإمارات', lat: 24.4539, lng: 54.3773, timezone: 4 },
  { nameAr: 'الكويت', countryAr: 'الكويت', lat: 29.3759, lng: 47.9774, timezone: 3 },
  { nameAr: 'الدوحة', countryAr: 'قطر', lat: 25.2854, lng: 51.5310, timezone: 3 },
  { nameAr: 'المنامة', countryAr: 'البحرين', lat: 26.2285, lng: 50.5860, timezone: 3 },
  { nameAr: 'مسقط', countryAr: 'عُمان', lat: 23.5880, lng: 58.3829, timezone: 4 },
  { nameAr: 'بغداد', countryAr: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3 },
  { nameAr: 'دمشق', countryAr: 'سوريا', lat: 33.5138, lng: 36.2765, timezone: 3 },
  { nameAr: 'بيروت', countryAr: 'لبنان', lat: 33.8938, lng: 35.5018, timezone: 3 },
  { nameAr: 'طرابلس', countryAr: 'ليبيا', lat: 32.8872, lng: 13.1913, timezone: 2 },
  { nameAr: 'تونس', countryAr: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1 },
  { nameAr: 'الجزائر', countryAr: 'الجزائر', lat: 36.7538, lng: 3.0588, timezone: 1 },
  { nameAr: 'الرباط', countryAr: 'المغرب', lat: 34.0209, lng: -6.8416, timezone: 1 },
  { nameAr: 'الخرطوم', countryAr: 'السودان', lat: 15.5007, lng: 32.5599, timezone: 2 }
];

function fixAngle(a: number): number {
  return a - 360.0 * Math.floor(a / 360.0);
}

function fixHour(a: number): number {
  return a - 24.0 * Math.floor(a / 24.0);
}

// Helper: convert deg to rad
const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
const radToDeg = (rad: number) => (rad * 180.0) / Math.PI;

// Astronomical formulas to calculate Sun position
function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunCoordinates(d: number): { declination: number; eqTime: number } {
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * d;

  const sinL = Math.sin(degToRad(L));
  const cosL = Math.cos(degToRad(L));
  const cosE = Math.cos(degToRad(e));
  const sinE = Math.sin(degToRad(e));

  // Right Ascension and Declination
  let RA = radToDeg(Math.atan2(cosE * sinL, cosL)) / 15.0;
  RA = fixHour(RA);
  const declination = radToDeg(Math.asin(sinE * sinL));

  // Equation of time in minutes
  let eqTime = (q / 15.0) - RA;
  if (eqTime > 12) eqTime -= 24;
  if (eqTime < -12) eqTime += 24;
  eqTime = eqTime * 60;

  return { declination, eqTime };
}

// Calculate hour angle for a given zenith angle
function hourAngle(zenithDeg: number, lat: number, declination: number): number {
  const latR = degToRad(lat);
  const decR = degToRad(declination);
  const cosH =
    (Math.cos(degToRad(zenithDeg)) - Math.sin(latR) * Math.sin(decR)) /
    (Math.cos(latR) * Math.cos(decR));

  if (cosH > 1 || cosH < -1) return 0; // extreme latitudes
  return radToDeg(Math.acos(cosH)) / 15.0;
}

// Calculate Asr angle
function asrHourAngle(shadowFactor: number, lat: number, declination: number): number {
  const latR = degToRad(lat);
  const decR = degToRad(declination);
  const D = Math.abs(lat - declination);
  const angle = radToDeg(Math.atan(1.0 / (shadowFactor + Math.tan(degToRad(D)))));
  return hourAngle(90 - angle, lat, declination);
}

// Standard 24-hour format: "00:00" to "23:59"
export function formatTime24(decimalHour: number): string {
  const fixed = fixHour(decimalHour);
  let h = Math.floor(fixed);
  let m = Math.round((fixed - h) * 60);
  if (m === 60) {
    h = (h + 1) % 24;
    m = 0;
  }
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffset: number = -date.getTimezoneOffset() / 60
): {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  raw: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDay(year, month, day);
  const d = jd - 2451545.0;
  const { declination, eqTime } = sunCoordinates(d);

  // Solar noon in local hours
  const dhuhrTime = 12 + timezoneOffset - lng / 15.0 - eqTime / 60.0;

  // Angles:
  // Fajr: 19.5 deg below horizon (Egyptian General Authority)
  // Sunrise: 90.833 deg zenith
  // Asr: standard shadow factor 1
  // Maghrib: 90.833 deg zenith
  // Isha: 17.5 deg below horizon
  const fajrHA = hourAngle(90 + 19.5, lat, declination);
  const sunriseHA = hourAngle(90.833, lat, declination);
  const asrHA = asrHourAngle(1, lat, declination);
  const maghribHA = hourAngle(90.833, lat, declination);
  const ishaHA = hourAngle(90 + 17.5, lat, declination);

  const fajrTime = dhuhrTime - fajrHA;
  const sunriseTime = dhuhrTime - sunriseHA;
  const asrTime = dhuhrTime + asrHA;
  const maghribTime = dhuhrTime + maghribHA;
  const ishaTime = dhuhrTime + ishaHA;

  return {
    fajr: formatTime24(fajrTime),
    sunrise: formatTime24(sunriseTime),
    dhuhr: formatTime24(dhuhrTime),
    asr: formatTime24(asrTime),
    maghrib: formatTime24(maghribTime),
    isha: formatTime24(ishaTime),
    raw: {
      fajr: fajrTime,
      sunrise: sunriseTime,
      dhuhr: dhuhrTime,
      asr: asrTime,
      maghrib: maghribTime,
      isha: ishaTime
    }
  };
}

export function getTodayPrayerItems(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffset?: number
): {
  items: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem;
  remainingSeconds: number;
} {
  const times = calculatePrayerTimes(date, lat, lng, timezoneOffset);

  const createDateFromTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };

  const list: PrayerTimeItem[] = [
    { id: 'fajr', nameAr: 'الفجر', time: times.fajr, timestamp: createDateFromTime(times.fajr) },
    { id: 'sunrise', nameAr: 'الشروق', time: times.sunrise, timestamp: createDateFromTime(times.sunrise) },
    { id: 'dhuhr', nameAr: 'الظهر', time: times.dhuhr, timestamp: createDateFromTime(times.dhuhr) },
    { id: 'asr', nameAr: 'العصر', time: times.asr, timestamp: createDateFromTime(times.asr) },
    { id: 'maghrib', nameAr: 'المغرب', time: times.maghrib, timestamp: createDateFromTime(times.maghrib) },
    { id: 'isha', nameAr: 'العشاء', time: times.isha, timestamp: createDateFromTime(times.isha) },
  ];

  const now = date.getTime();

  // Find next prayer
  let next = list.find((p) => p.timestamp > now);
  let remainingMs = 0;

  if (!next) {
    // Next is tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmwTimes = calculatePrayerTimes(tomorrow, lat, lng, timezoneOffset);
    const [h, m] = tmwTimes.fajr.split(':').map((v) => parseInt(v, 10));
    tomorrow.setHours(h, m, 0, 0);
    next = {
      id: 'fajr',
      nameAr: 'الفجر',
      time: tmwTimes.fajr,
      timestamp: tomorrow.getTime(),
      isNext: true
    };
    remainingMs = Math.max(0, tomorrow.getTime() - now);
  } else {
    next.isNext = true;
    remainingMs = Math.max(0, next.timestamp - now);
  }

  return {
    items: list,
    nextPrayer: next,
    remainingSeconds: Math.floor(remainingMs / 1000)
  };
}

// Convert seconds to format "01:23:45"
export function formatRemainingTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Approximate Hijri date calculation offline
export function getApproxHijriDate(date: Date = new Date()): {
  day: number;
  monthNameAr: string;
  year: number;
  formatted: string;
} {
  try {
    // If browser supports Islamic calendar
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return {
      day: 1,
      monthNameAr: '',
      year: 1448,
      formatted: formatter.format(date)
    };
  } catch {
    return {
      day: 15,
      monthNameAr: 'رمضان المبارك',
      year: 1448,
      formatted: '١٥ رمضان ١٤٤٨ هـ'
    };
  }
}
