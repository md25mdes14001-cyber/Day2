// MYDAY2 CALENDAR ICS EXPORT SYSTEM
// Generates RFC-compliant iCalendar files with recurrences, dates, and category tags.

class ICSGenerator {
    static formatDateTime(dateStr, timeStr = "09:00", durationMins = 30) {
        // Parse date
        const [year, month, day] = dateStr.split("-").map(Number);
        const [hour, min] = timeStr.split(":").map(Number);
        
        const start = new Date(year, month - 1, day, hour, min, 0);
        const end = new Date(start.getTime() + (durationMins * 60 * 1000));

        const pad = (num) => String(num).padStart(2, "0");

        const formatDate = (d) => {
            return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
        };

        return {
            start: formatDate(start),
            end: formatDate(end)
        };
    }

    static generate(events, tasks, habits, goals, timezone = "UTC") {
        let ics = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//MYDAY2//Life OS//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            `X-WR-TIMEZONE:${timezone}`
        ];

        const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "");

        // 1. Calendar events
        events.forEach(e => {
            const start = new Date(e.start_time).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            const end = new Date(e.end_time).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
            
            ics.push(
                "BEGIN:VEVENT",
                `UID:event_${e.id}@myday2.com`,
                `DTSTAMP:${todayStr}T000000Z`,
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `SUMMARY:${e.title}`,
                "DESCRIPTION:Synchronized from MYDAY2 Life Calendar",
                "END:VEVENT"
            );
        });

        // 2. Scheduled Tasks
        tasks.forEach(t => {
            if (t.date && t.time) {
                const duration = t.estimated_duration || 45;
                const times = this.formatDateTime(t.date, t.time, duration);
                
                ics.push(
                    "BEGIN:VEVENT",
                    `UID:task_${t.id}@myday2.com`,
                    `DTSTAMP:${todayStr}T000000Z`,
                    `DTSTART:${times.start}`,
                    `DTEND:${times.end}`,
                    `SUMMARY:[Task] ${t.title}`,
                    `DESCRIPTION:Category: ${t.category} | Priority: ${t.priority} | Status: ${t.status}`,
                    `CLASS:PRIVATE`
                );

                if (t.recurrence) {
                    ics.push(`RRULE:FREQ=${t.recurrence}`);
                }

                ics.push("END:VEVENT");
            }
        });

        // 3. Habits (represented as daily tasks)
        habits.forEach(h => {
            const startDay = h.created_at ? h.created_at.split("T")[0] : new Date().toISOString().split("T")[0];
            const time = h.reminder_time || "08:00";
            const times = this.formatDateTime(startDay, time, 15);

            ics.push(
                "BEGIN:VEVENT",
                `UID:habit_${h.id}@myday2.com`,
                `DTSTAMP:${todayStr}T000000Z`,
                `DTSTART:${times.start}`,
                `DTEND:${times.end}`,
                `SUMMARY:[Habit] ${h.title}`,
                `DESCRIPTION:Frequency: ${h.frequency} | Current Streak: ${h.streak}`,
                "RRULE:FREQ=DAILY",
                "END:VEVENT"
            );
        });

        // 4. Goals (milestone deadlines)
        goals.forEach(g => {
            if (g.date) {
                const times = this.formatDateTime(g.date, "09:00", 60);
                
                ics.push(
                    "BEGIN:VEVENT",
                    `UID:goal_${g.id}@myday2.com`,
                    `DTSTAMP:${todayStr}T000000Z`,
                    `DTSTART:${times.start}`,
                    `DTEND:${times.end}`,
                    `SUMMARY:[Goal Milestone] ${g.title}`,
                    `DESCRIPTION:Vision: ${g.vision} | Progress: ${g.progress}%`,
                    "END:VEVENT"
                );
            }
        });

        ics.push("END:VCALENDAR");

        // Format to string with correct carriage returns
        return ics.join("\r\n");
    }

    static download(icsContent, filename = "myday2_calendar.ics") {
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Global Export
window.icsEngine = ICSGenerator;
