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

export interface LifeProgressInfo {
  expectancyYears: number;
  expectancyDate: Date;

  yearsRemaining: number;
  monthsRemaining: number;
  weeksRemaining: number;

  /**
   * 0..1 progress through expected lifespan
   */
  completionRatio: number;

  /**
   * 0..100 progress through expected lifespan
   */
  completionPercent: number;

  /**
   * 0..1 remaining ratio (1 - completionRatio)
   */
  remainingRatio: number;
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
    birthDate.getSeconds(),
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
      birthDate.getSeconds(),
    );
  }

  const diffMs = nextBDay.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Breakdown calculation: advance a cursor from `now` towards `nextBDay`
  // to keep the result consistent with the actual computed `nextBirthdayDate`.
  // Note: month increments must clamp the day to the last valid day of the target month.
  const cursorStart = new Date(now.getTime());
  const cursor = new Date(cursorStart.getTime());

  const clampDayToMonth = (year: number, monthIndex: number, day: number) => {
    // monthIndex: 0-11
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    return Math.min(day, lastDay);
  };

  const addOneMonthClamped = (d: Date) => {
    const year = d.getFullYear();
    const monthIndex = d.getMonth(); // 0-11
    const nextMonthIndex = monthIndex + 1; // JS Date handles year rollover

    const clampedDay = clampDayToMonth(
      year,
      nextMonthIndex,
      d.getDate(),
    );

    return new Date(
      year,
      nextMonthIndex,
      clampedDay,
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
    );
  };

  // Months (full month steps that do not pass nextBDay)
  let months = 0;
  while (true) {
    const candidate = addOneMonthClamped(cursor);
    if (candidate.getTime() <= nextBDay.getTime()) {
      cursor.setTime(candidate.getTime());
      months++;
      continue;
    }
    break;
  }

  // Days (full 24h steps that do not pass nextBDay)
  let days = 0;
  while (true) {
    const candidate = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    if (candidate.getTime() <= nextBDay.getTime()) {
      cursor.setTime(candidate.getTime());
      days++;
      continue;
    }
    break;
  }

  // Hours (full 60m steps)
  let hours = 0;
  while (true) {
    const candidate = new Date(cursor.getTime() + 60 * 60 * 1000);
    if (candidate.getTime() <= nextBDay.getTime()) {
      cursor.setTime(candidate.getTime());
      hours++;
      continue;
    }
    break;
  }

  // Minutes (full 60s steps)
  let minutes = 0;
  while (true) {
    const candidate = new Date(cursor.getTime() + 60 * 1000);
    if (candidate.getTime() <= nextBDay.getTime()) {
      cursor.setTime(candidate.getTime());
      minutes++;
      continue;
    }
    break;
  }

  // Seconds
  let seconds = 0;
  while (true) {
    const candidate = new Date(cursor.getTime() + 1000);
    if (candidate.getTime() <= nextBDay.getTime()) {
      cursor.setTime(candidate.getTime());
      seconds++;
      continue;
    }
    break;
  }

  return {
    nextBirthdayDate: nextBDay,
    daysRemaining,
    months,
    days,
    hours,
    minutes,
    seconds,
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
export interface PlanetaryAgeInfo {
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
}

export interface LifeStatisticsInfo {
  weekendsLived: number;
  leapYearsWitnessed: number;

  olympicsSeen: number;
  worldCupsSeen: number;

  moonCyclesCompleted: number;
  earthOrbitsCompleted: number;
}

export function calculatePlanetaryAges(
  birthDate: Date,
  now: Date,
): PlanetaryAgeInfo {
  const diffMs = Math.max(0, now.getTime() - birthDate.getTime());
  const earthYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

  // Orbital periods relative to Earth years
  // Source: commonly used approximate orbital periods in astronomy.
  const mercuryYears = 0.2408467;
  const venusYears = 0.61519726;
  const marsYears = 1.8808158;
  const jupiterYears = 11.862615;
  const saturnYears = 29.447498;

  return {
    mercury: earthYears / mercuryYears,
    venus: earthYears / venusYears,
    mars: earthYears / marsYears,
    jupiter: earthYears / jupiterYears,
    saturn: earthYears / saturnYears,
  };
}

export function calculateLifeStatistics(
  birthDate: Date,
  now: Date,
): LifeStatisticsInfo {
  const birthMs = birthDate.getTime();
  const nowMs = now.getTime();

  // If input is inverted, return zeros (no time lived yet).
  if (nowMs <= birthMs) {
    return {
      weekendsLived: 0,
      leapYearsWitnessed: 0,
      olympicsSeen: 0,
      worldCupsSeen: 0,
      moonCyclesCompleted: 0,
      earthOrbitsCompleted: 0,
    };
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const totalDaysLived = Math.floor((nowMs - birthMs) / dayMs);

  // --- Weekends lived (Sat/Sun) ---
  // Count day boundaries from birth date day to now day, local-time based.
  let weekendsLived = 0;
  const cursor = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  for (let i = 0; i <= totalDaysLived; i++) {
    const dow = cursor.getDay(); // 0=Sun, 6=Sat
    if (dow === 0 || dow === 6) weekendsLived++;

    cursor.setDate(cursor.getDate() + 1);
  }

  // --- Leap years witnessed ---
  // Count leap years that have at least one moment overlapping (birth..now).
  const leapYearsWitnessed = (() => {
    const startY = birthDate.getFullYear();
    const endY = now.getFullYear();
    let count = 0;

    for (let y = startY; y <= endY; y++) {
      const isLeap =
        (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);

      if (!isLeap) continue;

      // Leap day window: Feb 29 at start of day to end of day
      const leapStart = new Date(y, 1, 29, 0, 0, 0).getTime(); // monthIndex 1 = Feb
      const leapEnd = new Date(y, 1, 29, 23, 59, 59, 999).getTime();

      // Overlap if [birth..now] intersects [leapDay..leapDayEnd]
      if (birthMs <= leapEnd && nowMs >= leapStart) count++;
    }

    return count;
  })();

  // --- Olympics seen (Summer Olympics, approx every 4 years) ---
  // Starting 1896 (common convention). This is approximate.
  const olympicsSeen = (() => {
    const startYear = 1896;
    const bY = birthDate.getFullYear();
    const nY = now.getFullYear();

    let count = 0;
    for (let y = startYear; y <= nY; y += 4) {
      if (y < bY) continue;
      // Use year overlap approximation: if the event year is within the lifetime span
      // (This intentionally stays simple and local/offline.)
      if (y >= bY) count++;
    }
    return count;
  })();

  // --- World Cups seen (FIFA Men's World Cup, approx every 4 years from 1930) ---
  // Approximate and ignores real schedule irregularities/cancellations.
  const worldCupsSeen = (() => {
    const startYear = 1930;
    const bY = birthDate.getFullYear();
    const nY = now.getFullYear();

    let count = 0;
    for (let y = startYear; y <= nY; y += 4) {
      if (y < bY) continue;
      if (y >= bY) count++;
    }
    return count;
  })();

  // --- Moon cycles completed (synodic month) ---
  const synodicMonthDays = 29.530588; // average
  const moonCyclesCompleted = Math.floor(
    totalDaysLived / synodicMonthDays,
  );

  // --- Earth orbits completed (tropical year) ---
  const earthOrbitDays = 365.25636;
  const earthOrbitsCompleted = Math.floor(
    totalDaysLived / earthOrbitDays,
  );

  return {
    weekendsLived,
    leapYearsWitnessed,
    olympicsSeen,
    worldCupsSeen,
    moonCyclesCompleted,
    earthOrbitsCompleted,
  };
}

/**
 * Life Progress Dashboard.
 */
export function calculateLifeProgress(
  birthDate: Date,
  now: Date,
  expectancyYears: number,
): LifeProgressInfo {
  const expectancyYearsClamped = Math.max(0, Math.floor(expectancyYears));

  // Expectancy date keeps the same month/day/time as the birthdate.
  // If day doesn't exist in target year (e.g., Feb 29), JS Date will roll;
  // acceptable for a "premium" UI as long as we stay consistent.
  const expectancyDate = new Date(
    birthDate.getFullYear() + expectancyYearsClamped,
    birthDate.getMonth(),
    birthDate.getDate(),
    birthDate.getHours(),
    birthDate.getMinutes(),
    birthDate.getSeconds(),
  );

  const totalLifespanMs =
    expectancyDate.getTime() - birthDate.getTime();
  const completedMs = now.getTime() - birthDate.getTime();

  const completionRatio =
    totalLifespanMs <= 0 ? 1 : Math.min(1, Math.max(0, completedMs / totalLifespanMs));
  const completionPercent = Math.round(completionRatio * 100);
  const remainingRatio = 1 - completionRatio;

  // Remaining breakdown until expectancyDate
  let yearsRemaining = 0;
  let monthsRemaining = 0;
  let weeksRemaining = 0;

  if (now.getTime() < expectancyDate.getTime()) {
    const remainingAge = calculateExactAge(now, expectancyDate);
    yearsRemaining = remainingAge.years;
    monthsRemaining = remainingAge.months;

    const remainingDaysFloat = remainingAge.days;
    weeksRemaining = Math.floor(remainingDaysFloat / 7);
  }

  return {
    expectancyYears: expectancyYearsClamped,
    expectancyDate,
    yearsRemaining,
    monthsRemaining,
    weeksRemaining,
    completionRatio,
    completionPercent,
    remainingRatio,
  };
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
    solarTravelKm,
  };
}
