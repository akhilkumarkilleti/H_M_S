function toMinutes(value, suffix) {
  const hour = Number(value);
  if (!Number.isFinite(hour) || hour > 23) return null;
  let normalizedHour = hour;
  if (suffix) {
    const meridiem = suffix.toLowerCase();
    if (hour < 1 || hour > 12) return null;
    normalizedHour = hour % 12 + (meridiem === "pm" ? 12 : 0);
  }
  return normalizedHour * 60;
}

function parseClock(value, suffix) {
  const match = String(value).trim().match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?$/);
  if (!match) return null;
  const minutes = toMinutes(match[1], suffix);
  const minutePart = Number(match[2] || 0);
  return minutes === null || minutePart > 59 ? null : minutes + minutePart;
}

export function getDoctorWorkingRanges(availability, profileTimings) {
  const startTime = availability?.startTime;
  const endTime = availability?.endTime;
  if (startTime && endTime) {
    const start = parseClock(startTime);
    const end = parseClock(endTime);
    if (start !== null && end !== null && end > start) return [{ start, end }];
  }

  const timings = String(availability?.availableTimings || profileTimings || "");
  const rangePattern = /(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*(?:-|–|—|\bto\b)\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/gi;
  const ranges = [];
  let match;
  while ((match = rangePattern.exec(timings))) {
    let startSuffix = match[2];
    const endSuffix = match[4];
    if (!startSuffix && endSuffix) {
      const startHour = Number(match[1].split(":")[0]);
      startSuffix = endSuffix.toLowerCase() === "pm" && startHour < 12 ? "am" : endSuffix;
    }
    const start = parseClock(match[1], startSuffix);
    const end = parseClock(match[3], endSuffix || startSuffix);
    if (start !== null && end !== null && end > start) ranges.push({ start, end });
  }

  if (ranges.length) return ranges;
  return timings.trim() ? [] : [{ start: 9 * 60, end: 17 * 60 }];
}

export function getAvailableAppointmentSlots(availability, profileTimings, bookedSlots = []) {
  if (availability?.active === false) return [];
  const ranges = getDoctorWorkingRanges(availability, profileTimings);
  const booked = new Set(bookedSlots.flatMap((slot) => [String(slot), String(slot).slice(0, 5)]));
  const slots = [];
  for (const { start, end } of ranges) {
    for (let minutes = Math.ceil(start / 30) * 30; minutes + 30 <= end; minutes += 30) {
      const slot = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
      if (!booked.has(slot) && !booked.has(`${slot}:00`) && !slots.includes(slot)) slots.push(slot);
    }
  }
  return slots.sort();
}
