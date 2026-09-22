export interface PrayerTimeItem {
  name: string;
  arabic: string;
  malayalam: string;
  time: string;
  isNext?: boolean;
  isActive?: boolean;
}

export function getManoorPrayerTimes(): {
  prayers: PrayerTimeItem[];
  hijriDate: string;
  nextPrayer: { name: string; time: string; remainingMinutes: number };
} {
  // Typical Malappuram, Kerala coordinates (Latitude 11.05° N, Longitude 76.07° E)
  const prayers: PrayerTimeItem[] = [
    { name: 'Fajr', arabic: 'الفجر', malayalam: 'സുബ്ഹി', time: '05:08 AM' },
    { name: 'Sunrise', arabic: 'الشروق', malayalam: 'സൂര്യോദയം', time: '06:19 AM' },
    { name: 'Dhuhr', arabic: 'الظهر', malayalam: 'ളുഹ്‌ർ', time: '12:28 PM' },
    { name: 'Asr', arabic: 'العصر', malayalam: 'അസ്വർ', time: '04:46 PM' },
    { name: 'Maghrib', arabic: 'المغرب', malayalam: 'മഗ്‌രിബ്', time: '06:33 PM' },
    { name: 'Isha', arabic: 'العشاء', malayalam: 'ഇശാഅ്', time: '07:44 PM' },
  ];

  // Hijri date estimation for 2026 Ramadan / Shawwal season
  const hijriDate = '1447 Ramadan 24 (റമദാൻ 24, 1447)';

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Convert time string to minutes
  function parseTimeToMinutes(t: string): number {
    const [timePart, modifier] = t.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  let nextPrayer = { name: 'Fajr', time: '05:08 AM', remainingMinutes: 120 };
  let foundNext = false;

  for (let i = 0; i < prayers.length; i++) {
    const prayerMin = parseTimeToMinutes(prayers[i].time);
    if (prayerMin > currentMinutes && !foundNext) {
      prayers[i].isNext = true;
      nextPrayer = {
        name: prayers[i].name,
        time: prayers[i].time,
        remainingMinutes: prayerMin - currentMinutes,
      };
      foundNext = true;
      if (i > 0) {
        prayers[i - 1].isActive = true;
      }
    }
  }

  if (!foundNext) {
    prayers[0].isNext = true;
    const fajrMinutesTomorrow = 24 * 60 + parseTimeToMinutes(prayers[0].time);
    nextPrayer = {
      name: 'Fajr',
      time: '05:08 AM',
      remainingMinutes: fajrMinutesTomorrow - currentMinutes,
    };
    prayers[prayers.length - 1].isActive = true;
  }

  return { prayers, hijriDate, nextPrayer };
}
