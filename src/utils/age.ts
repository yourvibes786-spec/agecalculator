export interface ExactAge {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface NextBirthdayInfo {
  nextBirthdayDate: Date;
  daysRemaining: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TotalUnits {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ZodiacInfo {
  name: string;
  symbol: string;
  dates: string;
}

export interface ChineseZodiacInfo {
  name: string;
  symbol: string;
  element: string;
  traits: string;
}

export interface Milestone {
  label: string;
  targetValue: number;
  unit: "days" | "years";
  date: Date;
  isPast: boolean;
  daysDifference: number; // positive for future, negative for past
}

export interface InteractiveStats {
  heartbeats: number;
  breaths: number;
  moonOrbits: number;
  solarTravelKm: number;
}

/**
 * Calculates calendar-exact age difference between birthDate and now.
 */
export function calculateExactAge(birthDate: Date, now: Date): ExactAge {
  if (now.getTime() < birthDate.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  let hours = now.getHours() - birthDate.getHours();
  let minutes = now.getMinutes() - birthDate.getMinutes();
  let seconds = now.getSeconds() - birthDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    // Number of days in the previous month relative to `now`
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

/**
 * Calculates countdown details until the next birthday.
 */
export function calculateNextBirthday(birthDate: Date, now: Date): NextBirthdayInfo {
  const currentYear = now.getFullYear();
  let nextBDayYear = currentYear;

  let nextBDay = new Date(
    nextBDayYear,
    birthDate.getMonth(),
    birthDate.getDate(),
    birthDate.getHours(),
    birthDate.getMinutes(),
    birthDate.getSeconds()
  );

  // If birthday already happened or is happening right now, move to next year
  if (nextBDay.getTime() <= now.getTime()) {
    nextBDayYear++;
    nextBDay = new Date(
      nextBDayYear,
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes(),
      birthDate.getSeconds()
    );
  }

  const diffMs = nextBDay.getTime() - now.getTime();
  const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let months = nextBDay.getMonth() - now.getMonth();
  let days = nextBDay.getDate() - now.getDate();
  let hours = nextBDay.getHours() - now.getHours();
  let minutes = nextBDay.getMinutes() - now.getMinutes();
  let seconds = nextBDay.getSeconds() - now.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(nextBDay.getFullYear(), nextBDay.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
  }

  return {
    nextBirthdayDate: nextBDay,
    daysRemaining: totalDays,
    months,
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * Converted age into separate, flat single-unit measurements.
 */
export function calculateTotalUnits(birthDate: Date, now: Date): TotalUnits {
  const diffMs = Math.max(0, now.getTime() - birthDate.getTime());
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Number((diffMs / (1000 * 60 * 60 * 24 * 7)).toFixed(1));
  const months = Number((days / 30.4375).toFixed(1)); // Standard average days per month

  return {
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * Gets standard Western Zodiac sign.
 */
export function getZodiacSign(date: Date): ZodiacInfo {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19" };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20" };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20" };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22" };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22" };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22" };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22" };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21" };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21" };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19" };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18" };
  } else {
    return { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20" };
  }
}

/**
 * Gets Chinese Zodiac animal and properties.
 */
export function getChineseZodiac(year: number): ChineseZodiacInfo {
  const animals = [
    { name: "Rat", symbol: "🐀", traits: "Quick-witted, resourceful, versatile, and kind." },
    { name: "Ox", symbol: "🐂", traits: "Diligent, dependable, strong, and determined." },
    { name: "Tiger", symbol: "🐅", traits: "Brave, confident, competitive, and unpredictable." },
    { name: "Rabbit", symbol: "🐇", traits: "Quiet, elegant, kind, and responsible." },
    { name: "Dragon", symbol: "🐉", traits: "Confident, intelligent, and enthusiastic." },
    { name: "Snake", symbol: "🐍", traits: "Enigmatic, intelligent, and wise." },
    { name: "Horse", symbol: "🐎", traits: "Animated, active, and energetic." },
    { name: "Goat", symbol: "🐐", traits: "Calm, gentle, and sympathetic." },
    { name: "Monkey", symbol: "🐒", traits: "Sharp, smart, and curious." },
    { name: "Rooster", symbol: "🐓", traits: "Observant, hardworking, and courageous." },
    { name: "Dog", symbol: "🐕", traits: "Lovely, honest, and prudent." },
    { name: "Pig", symbol: "🐖", traits: "Compassionate, generous, and diligent." }
  ];

  const index = (year - 4) % 12;
  const resultIndex = index < 0 ? (index + 12) % 12 : index;
  const animal = animals[resultIndex];

  const lastDigit = year % 10;
  let element = "";
  if (lastDigit === 0 || lastDigit === 1) element = "Metal";
  else if (lastDigit === 2 || lastDigit === 3) element = "Water";
  else if (lastDigit === 4 || lastDigit === 5) element = "Wood";
  else if (lastDigit === 6 || lastDigit === 7) element = "Fire";
  else element = "Earth";

  return {
    name: animal.name,
    symbol: animal.symbol,
    element,
    traits: animal.traits
  };
}

/**
 * Compiles a sorted timeline list of life milestones.
 */
export function calculateMilestones(birthDate: Date, now: Date): Milestone[] {
  const dayMilestones = [1000, 5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000];
  const yearMilestones = [10, 18, 20, 21, 30, 40, 50, 60, 70, 80, 90, 100];

  const milestones: Milestone[] = [];

  // Day Milestones
  for (const days of dayMilestones) {
    const targetDate = new Date(birthDate.getTime() + days * 24 * 60 * 60 * 1000);
    const isPast = now.getTime() >= targetDate.getTime();
    const diffMs = targetDate.getTime() - now.getTime();
    const daysDifference = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    milestones.push({
      label: `${days.toLocaleString()} Days Lived`,
      targetValue: days,
      unit: "days",
      date: targetDate,
      isPast,
      daysDifference
    });
  }

  // Year Milestones
  for (const years of yearMilestones) {
    const targetDate = new Date(
      birthDate.getFullYear() + years,
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes(),
      birthDate.getSeconds()
    );
    const isPast = now.getTime() >= targetDate.getTime();
    const diffMs = targetDate.getTime() - now.getTime();
    const daysDifference = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    milestones.push({
      label: `${years} Years Old`,
      targetValue: years,
      unit: "years",
      date: targetDate,
      isPast,
      daysDifference
    });
  }

  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Calculates cosmic and biological stats.
 */
export function calculateStats(birthDate: Date, now: Date): InteractiveStats {
  const diffMs = Math.max(0, now.getTime() - birthDate.getTime());
  const minutes = diffMs / (1000 * 60);
  const days = diffMs / (1000 * 60 * 60 * 24);
  const seconds = diffMs / 1000;

  // Heartbeats: avg 80 beats per minute
  const heartbeats = Math.floor(minutes * 80);
  // Breaths: avg 16 breaths per minute
  const breaths = Math.floor(minutes * 16);
  // Moon orbits: orbital period is 27.3 days
  const moonOrbits = Number((days / 27.3).toFixed(2));
  // Solar travel: Earth orbits the Sun at ~29.78 km/s
  const solarTravelKm = Math.floor(seconds * 29.78);

  return {
    heartbeats,
    breaths,
    moonOrbits,
    solarTravelKm
  };
}
