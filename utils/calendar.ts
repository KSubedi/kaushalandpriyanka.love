export function generateCalendarUrl() {
  const event = {
    title: "Kaushal & Priyanka's Wedding",
    description: "Join us as we begin our journey together as the Subedis",
    location: "Houston, TX",
    startDate: "20250306T000000",
    endDate: "20250307T000000",
  };

  const url = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${event.startDate}
DTEND:${event.endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  return encodeURI(url.replace(/\s+/g, " "));
}
