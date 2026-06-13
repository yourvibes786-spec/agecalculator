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
  unit: "years";
  date: Date;
  isPast: boolean;
  daysDifference: number;
}

export interface InteractiveStats {
  heartbeats: number;
  breaths: number;
  solarTravelKm: number;
}

export interface LifeProgressInfo {
  expectancyYears: number;
  expectancyDate: Date;

  yearsRemaining: number;
  monthsRemaining: number;
  weeksRemaining: number;
  daysRemaining: number;

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

  /**
   * 0..100 remaining percent
   */
  remainingPercent: number;
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
 * Focuses on meaningful life landmarks rather than duplicate day counts.
 */
export function calculateMilestones(birthDate: Date, now: Date): Milestone[] {
  // Year milestones focus on meaningful life landmarks (ages)
  const yearMilestones = [10, 18, 20, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100];

  const milestones: Milestone[] = [];

  // Year Milestones - meaningful life landmarks
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
  leapYearsWitnessed: number;
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
      leapYearsWitnessed: 0,
      moonCyclesCompleted: 0,
      earthOrbitsCompleted: 0,
    };
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const totalDaysLived = Math.floor((nowMs - birthMs) / dayMs);

  // --- Leap years witnessed ---
  const leapYearsWitnessed = (() => {
    const startY = birthDate.getFullYear();
    const endY = now.getFullYear();
    let count = 0;
    for (let y = startY; y <= endY; y++) {
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      if (!isLeap) continue;
      const leapStart = new Date(y, 1, 29, 0, 0, 0).getTime();
      const leapEnd = new Date(y, 1, 29, 23, 59, 59, 999).getTime();
      if (birthMs <= leapEnd && nowMs >= leapStart) count++;
    }
    return count;
  })();

  // --- Moon cycles completed (synodic month) ---
  const synodicMonthDays = 29.530588;
  const moonCyclesCompleted = Math.floor(totalDaysLived / synodicMonthDays);

  // --- Earth orbits completed (tropical year) ---
  const earthOrbitDays = 365.25636;
  const earthOrbitsCompleted = Math.floor(totalDaysLived / earthOrbitDays);

  return {
    leapYearsWitnessed,
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
  const remainingPercent = Math.round(remainingRatio * 100);

  // Remaining breakdown until expectancyDate
  let yearsRemaining = 0;
  let monthsRemaining = 0;
  let weeksRemaining = 0;
  let daysRemaining = 0;

  if (now.getTime() < expectancyDate.getTime()) {
    const remainingAge = calculateExactAge(now, expectancyDate);
    yearsRemaining = remainingAge.years;
    monthsRemaining = remainingAge.months;
    daysRemaining = remainingAge.days;
    weeksRemaining = Math.floor(daysRemaining / 7);
  }

  return {
    expectancyYears: expectancyYearsClamped,
    expectancyDate,
    yearsRemaining,
    monthsRemaining,
    weeksRemaining,
    daysRemaining,
    completionRatio,
    completionPercent,
    remainingRatio,
    remainingPercent,
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
  // Solar travel: Earth orbits the Sun at ~29.78 km/s
  const solarTravelKm = Math.floor(seconds * 29.78);

  return {
    heartbeats,
    breaths,
    solarTravelKm,
  };
}

// ------------------------------
// Phase 3 — Premium extensions
// ------------------------------

export type ComparisonKind =
  | "olderBy"
  | "youngerBy"
  | "witnessed"
  | "leapYearsLived";

export interface AgeComparisonCard {
  id: string;
  title: string;
  subtitle?: string;
  kind: ComparisonKind;
  valueText: string;
}

const clampNonNegativeInt = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
};

function makeReferenceDateFromYear(year: number): Date {
  // Deterministic: choose a stable reference month/day/time.
  // We use UTC-ish safe local date by using Date constructor with numbers.
  // (Still local-time but deterministic across runs.)
  return new Date(year, 0, 1, 0, 0, 0);
}

function formatAgeDiffParts(diff: ExactAge): string {
  // Use only non-zero parts, fall back to days.
  const parts: string[] = [];
  if (diff.years) parts.push(`${diff.years} year${diff.years === 1 ? "" : "s"}`);
  if (diff.months) parts.push(`${diff.months} month${diff.months === 1 ? "" : "s"}`);
  if (diff.days) parts.push(`${diff.days} day${diff.days === 1 ? "" : "s"}`);
  if (parts.length === 0) return `${diff.days} days`;
  return parts.join(", ");
}

/**
 * Age Comparison Engine
 *
 * References are approximations using known-ish public launch/birth years.
 * Deterministic local/offline.
 */
export function calculateAgeComparisonCards(
  birthDate: Date,
  now: Date,
): AgeComparisonCard[] {
  // Reference dates (approx):
  // ChatGPT launch ~ 2022 (system/beta around Nov 2022).
  // Google: 1998 (Sep 4, 1998 approx).
  // YouTube: 2005 (Feb 14 2005 approx).
  // Instagram: 2010 (Oct 2010 approx).
  // TikTok: 2016 (Sep 2016 approx) — musical.ly merger/brand.
  // Facebook: 2004 (Feb 2004 approx).
  // We use Jan 1 of the year for determinism.
  const refs: Array<{
    id: string;
    label: string;
    year: number;
  }> = [
      { id: "chatgpt", label: "ChatGPT", year: 2022 },
      { id: "google", label: "Google", year: 1998 },
      { id: "youtube", label: "YouTube", year: 2005 },
      { id: "instagram", label: "Instagram", year: 2010 },
      { id: "tiktok", label: "TikTok", year: 2016 },
      { id: "facebook", label: "Facebook", year: 2004 },
    ];

  const result: AgeComparisonCard[] = [];

  for (const r of refs) {
    const refDate = makeReferenceDateFromYear(r.year);
    const refDays = calculateTotalUnits(refDate, now).days;
    const myDays = calculateTotalUnits(birthDate, now).days;

    const diffDays = Math.abs(myDays - refDays);
    const diffAgeApprox: ExactAge = {
      years: clampNonNegativeInt(diffDays / 365.25),
      months: clampNonNegativeInt((diffDays % 365.25) / 30.4375),
      days: clampNonNegativeInt(diffDays % 30.4375),
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const youAreOlder = myDays >= refDays;

    result.push({
      id: `cmp-${r.id}`,
      title: youAreOlder
        ? `You are older than ${r.label}`
        : `You are younger than ${r.label}`,
      kind: youAreOlder ? "olderBy" : "youngerBy",
      valueText: `by ${formatAgeDiffParts(diffAgeApprox)}`,
      subtitle: youAreOlder ? "Living on a longer timeline." : "Still catching up in the calendar.",
    });
  }

  return result;
}

export interface HistoricalContextCard {
  id: string;
  title: string;
  date: Date;
  description: string;
}

export function calculateHistoricalContext(
  birthDate: Date,
  now: Date,
): HistoricalContextCard[] {
  // Timeline events (approx years/dates), deterministic.
  const events: Array<{
    id: string;
    title: string;
    year: number;
    description: string;
  }> = [
      // Internet milestones
      {
        id: "internet-essentials",
        title: "Internet enters everyday life",
        year: 1995,
        description: "Dial-up era accelerates and web browsing goes mainstream.",
      },
      {
        id: "google-launch",
        title: "Google becomes a search default",
        year: 1998,
        description: "Search quality improves and the web gets indexed at scale.",
      },
      // Smartphone era
      {
        id: "smartphone-era",
        title: "Smartphone era deepens",
        year: 2007,
        description: "Modern smartphones reshape communication and media.",
      },
      // Social media launches
      {
        id: "facebook-launch",
        title: "Social networking expands",
        year: 2004,
        description: "Platforms turn browsing into social connection.",
      },
      {
        id: "youtube-launch",
        title: "Video-sharing becomes global",
        year: 2005,
        description: "Online video shifts from niche to mainstream.",
      },
      {
        id: "instagram-launch",
        title: "Photo-first social media rises",
        year: 2010,
        description: "Visual sharing becomes a daily habit.",
      },
      {
        id: "whatsapp-launch",
        title: "Messaging goes mobile",
        year: 2009,
        description: "Chat turns into an always-on communication layer.",
      },
      {
        id: "tiktok-launch",
        title: "Short-form video takes over feeds",
        year: 2016,
        description: "Algorithmic discovery boosts creativity at speed.",
      },
      // AI milestones
      {
        id: "ai-research-catchup",
        title: "Generative AI era accelerates",
        year: 2017,
        description: "Transformers and modern architectures unlock new capabilities.",
      },
      {
        id: "chatgpt-launch",
        title: "Chatbots become conversational",
        year: 2022,
        description: "AI assistants turn demos into tools for everyday users.",
      },
      // Technology milestones (iPhone era requested)
      {
        id: "iphone-era",
        title: "The iPhone experience reshapes tech",
        year: 2007,
        description: "Touch-first design and app ecosystems spread quickly.",
      },
    ];

  // Entity contextual cards requested
  const entities: Array<{
    id: string;
    title: string;
    year: number;
    description: string;
  }> = [
      {
        id: "entity-google",
        title: "Google",
        year: 1998,
        description: "Search, ads, and information systems at web scale.",
      },
      {
        id: "entity-youtube",
        title: "YouTube",
        year: 2005,
        description: "Video publishing + discovery communities.",
      },
      {
        id: "entity-facebook",
        title: "Facebook",
        year: 2004,
        description: "Social graphs and the era of online communities.",
      },
      {
        id: "entity-instagram",
        title: "Instagram",
        year: 2010,
        description: "Photo and creator culture becomes mainstream.",
      },
      {
        id: "entity-whatsapp",
        title: "WhatsApp",
        year: 2009,
        description: "Private messaging on mobile.",
      },
      {
        id: "entity-tiktok",
        title: "TikTok",
        year: 2016,
        description: "Short-form video and algorithmic entertainment.",
      },
      {
        id: "entity-chatgpt",
        title: "ChatGPT",
        year: 2022,
        description: "Conversational AI for writing, learning, and planning.",
      },
      {
        id: "entity-iphone",
        title: "iPhone",
        year: 2007,
        description: "Touch computing + app ecosystems for the world.",
      },
    ];

  const all = [...events, ...entities];

  const filtered = all
    .map((e) => ({
      ...e,
      date: makeReferenceDateFromYear(e.year),
    }))
    .filter((e) => e.date.getTime() >= birthDate.getTime() && e.date.getTime() <= now.getTime());

  // Sort by date and cap to keep layout tidy
  filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  const capped = filtered.slice(-12);

  return capped.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    description: e.description,
  }));
}

export function getGenerationLabel(birthYear: number): string {
  if (birthYear >= 2013) return "Gen Alpha";
  if (birthYear >= 1997) return "Gen Z";
  if (birthYear >= 1981) return "Millennial";
  if (birthYear >= 1965) return "Gen X";
  if (birthYear >= 1946) return "Boomer";
  if (birthYear >= 1928) return "Silent";
  return "Greatest";
}

export interface BornInSnapshot {
  birthYear: number;
  generation: string;
  notableEvents: string[];
}

export function calculateBornInSnapshot(birthDate: Date): BornInSnapshot {
  const year = birthDate.getFullYear();
  const generation = getGenerationLabel(year);

  const notableEvents: Record<number, string[]> = {
    2022: ["ChatGPT launches — generative AI goes mainstream", "NASA's Artemis I Moon mission launches"],
    2021: ["COVID-19 vaccines reach global distribution", "James Webb Space Telescope launches"],
    2020: ["Global COVID-19 pandemic begins", "Joe Biden elected US President"],
    2019: ["COVID-19 pandemic begins", "First image of a black hole captured"],
    2018: ["SpaceX Falcon Heavy maiden flight", "GDPR takes effect in Europe"],
    2017: ["#MeToo movement goes viral", "Total solar eclipse across North America"],
    2016: ["TikTok launches globally", "AlphaGo beats world Go champion Lee Sedol"],
    2015: ["Paris Agreement on climate change adopted", "Instagram rolls out algorithmic feed"],
    2014: ["Ice Bucket Challenge goes viral", "Malaysia Airlines MH370 disappears"],
    2013: ["Snowden NSA revelations", "Pope Francis elected"],
    2012: ["Instagram acquired by Facebook for $1B", "Felix Baumgartner jumps from stratosphere"],
    2011: ["Steve Jobs passes away", "Arab Spring uprisings reshape Middle East"],
    2010: ["Instagram launches", "iPad launches — the modern tablet era begins"],
    2009: ["WhatsApp launches", "Bitcoin whitepaper published"],
    2008: ["Barack Obama elected US President", "iPhone App Store launches"],
    2007: ["iPhone announced — smartphone era begins", "Amazon Kindle launches"],
    2006: ["Twitter launches", "Pluto reclassified as dwarf planet"],
    2005: ["YouTube launches", "Reddit launches"],
    2004: ["Facebook launches — social media era begins", "Indian Ocean tsunami devastates Southeast Asia"],
    2003: ["Human Genome Project completed", "Space Shuttle Columbia disaster"],
    2002: ["Euro becomes physical currency", "An Inconvenient Truth sparks climate debate"],
    2001: ["Wikipedia launches", "9/11 attacks reshape global politics"],
    2000: ["Y2K bug passes without major incident", "Human Genome Project draft published"],
    1999: ["Napster launches — file-sharing era begins", "Euro introduced as virtual currency"],
    1998: ["Google founded", "iMac G3 signals Apple's comeback"],
    1997: ["Deep Blue beats Kasparov at chess", "Harry Potter and the Philosopher's Stone published", "Tiger Woods wins first Masters"],
    1996: ["First DVD players go on sale", "Dolly the sheep cloned"],
    1995: ["Internet enters everyday life (dial-up era)", "Windows 95 launches with Start Menu", "Java 1.0 released"],
    1994: ["Netscape Navigator launches", "First online pizza order on PizzaNet"],
    1993: ["World Wide Web becomes public domain", "Mosaic browser released", "Jurassic Park redefines CGI in film"],
    1992: ["First SMS text message sent", "Earth Summit in Rio de Janeiro"],
    1991: ["World Wide Web goes live (first website)", "Soviet Union dissolves", "Linux kernel announced"],
    1990: ["World Wide Web invented by Tim Berners-Lee", "Hubble Space Telescope launched", "Nelson Mandela freed from prison"],
    1989: ["Fall of the Berlin Wall", "World Wide Web invented by Tim Berners-Lee", "Exxon Valdez oil spill"],
    1988: ["First transatlantic fiber-optic cable", "NASA resumes space shuttle flights after Challenger"],
    1987: ["World population reaches 5 billion", "First Nintendo Entertainment System hits US", "Black Monday stock market crash"],
    1986: ["Space Shuttle Challenger disaster", "Chernobyl nuclear disaster", "Oprah Winfrey Show goes national"],
    1985: ["Bitcoin whitepaper published — wait, that's later", "Live Aid concert raises millions for famine relief", "Microsoft Windows 1.0 released"],
    1984: ["Apple Macintosh launched", "First commercial cell phone (Motorola DynaTAC)", "Circle K fuel station brand established"],
    1983: ["Internet Protocol (TCP/IP) established", "First mobile phone call (Motorola DynaTAC)", "CD players go on sale"],
    1982: ["First artificial heart transplant", "Time names 'The Computer' Machine of the Year", "CD players introduced"],
    1981: ["IBM PC launched — personal computing goes mainstream", "MTV launches (\"Video Killed the Radio Star\")", "First reported cases of AIDS"],
    1980: ["CNN launches — 24-hour news cycle begins", "Mount St. Helens erupts", "Pac-Man released"],
    1979: ["Sony Walkman introduced — personal audio revolution", "Margaret Thatcher becomes UK Prime Minister", "Three Mile Island nuclear accident"],
    1978: ["First test-tube baby (Louise Brown) born", "Star Wars mania sweeps the world"],
    1977: ["Apple II computer introduced", "Star Wars released (May 25)", "Elvis Presley passes away"],
    1976: ["Apple Computer founded by Jobs, Wozniak, and Wayne", "Concorde begins commercial supersonic flights"],
    1975: ["Microsoft founded by Bill Gates and Paul Allen", "Vietnam War ends"],
    1974: ["Rubik's Cube invented", "Nixon resigns as US President", "Dungeons & Dragons published"],
    1973: ["First mobile phone call (Martin Cooper, Motorola)", "Oil crisis reshapes global economy", "Skylab space station launched"],
    1972: ["Last Apollo Moon mission (Apollo 17)", "Pong released — video game industry begins", "Watergate scandal begins"],
    1971: ["Intel 4004 — first microprocessor released", "Greenpeace founded", "Walt Disney World opens"],
    1970: ["Earth Day first celebrated", "Apollo 13 mission (\"Houston, we have a problem\")"],
    1969: ["Apollo 11 Moon landing (July 20)", "Woodstock music festival", "Internet's precursor (ARPANET) goes live"],
    1968: ["Martin Luther King Jr. and Robert F. Kennedy assassinated", "Intel founded", "Apollo 8 orbits the Moon"],
    1967: ["First heart transplant (Dr. Christiaan Barnard)", "Summer of Love in San Francisco", "First Super Bowl (Super Bowl I)"],
    1966: ["Star Trek original series premieres", "China's Cultural Revolution begins"],
    1965: ["Medicare established in the US", "Malcolm X assassinated", "The Sound of Music wins Best Picture"],
    1964: ["Civil Rights Act passed in the US", "Tokyo Summer Olympics (first in Asia)", "Ford Mustang introduced"],
    1963: ["JFK assassinated in Dallas", "Martin Luther King Jr.'s \"I Have a Dream\" speech", "Beatlemania sweeps the world"],
    1962: ["Cuban Missile Crisis", "First US orbital flight (John Glenn)", "The Beatles release first single"],
    1961: ["Yuri Gagarin becomes first human in space", "Bay of Pigs invasion", "Berlin Wall erected"],
    1960: ["First televised US Presidential debate (Kennedy-Nixon)", "OPEC founded"],
    1959: ["Alaska and Hawaii become US states", "Xerox 914 — first plain-paper copier"],
    1958: ["NASA founded", "LEGO brick patented", "Modem invented (Bell 103)"],
    1957: ["Sputnik 1 — first artificial satellite launched", "Treaty of Rome establishes European Economic Community"],
    1956: ["First transatlantic telephone cable (TAT-1)", "Elvis Presley's first #1 hit song"],
    1955: ["Walt Disney's Disneyland opens", "Rosa Parks refuses to give up her bus seat", "Jonas Salk develops polio vaccine"],
    1954: ["First nuclear submarine (USS Nautilus) commissioned", "Brown v. Board of Education ends school segregation", "Food Stamps program introduced"],
    1953: ["DNA double helix structure discovered (Watson & Crick)", "Mount Everest first conquered (Hillary & Tenzing)", "Queen Elizabeth II crowned"],
    1952: ["First commercial jet (de Havilland Comet) enters service", "Dwight D. Eisenhower elected US President"],
    1951: ["First commercial computer (UNIVAC I) delivered", "Color television introduced commercially"],
    1950: ["First modern credit card (Diners Club) launched", "Korean War begins"],
  };

  const events = notableEvents[year] ?? [];

  return {
    birthYear: year,
    generation,
    notableEvents: events.slice(0, 3),
  };
}

