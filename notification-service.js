// MYDAY2 NOTIFICATION & REMINDER SERVICE
// Registers HTML5 Web Notifications, schedules local alerts, and integrates with service workers.

class LocalNotificationService {
    constructor() {
        this.permissionGranted = false;
        this.activeTimers = [];
        this.checkPermission();
    }

    async checkPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notifications.");
            return;
        }
        if (Notification.permission === "granted") {
            this.permissionGranted = true;
        }
    }

    async requestPermission() {
        if (!("Notification" in window)) return false;
        
        try {
            const permission = await Notification.requestPermission();
            this.permissionGranted = (permission === "granted");
            console.log("Notification permission state:", permission);
            return this.permissionGranted;
        } catch (err) {
            console.error("Failed to request notification permission:", err);
            return false;
        }
    }

    // Schedule a reminder
    scheduleNotification(id, title, body, triggerTime) {
        const now = new Date().getTime();
        const trigger = new Date(triggerTime).getTime();
        const delay = trigger - now;

        if (delay <= 0) {
            console.log("Reminder time is in the past. Skipping schedule.");
            return;
        }

        // Cancel existing timer for this item if duplicates
        this.cancelNotification(id);

        console.log(`Scheduling reminder [${title}] in ${Math.round(delay / 1000 / 60)} minutes.`);

        const timer = setTimeout(() => {
            this.triggerBrowserAlert(title, body);
            this.removeTimer(id);
        }, delay);

        this.activeTimers.push({ id, timer });
    }

    cancelNotification(id) {
        const itemIndex = this.activeTimers.findIndex(t => t.id === id);
        if (itemIndex > -1) {
            clearTimeout(this.activeTimers[itemIndex].timer);
            this.activeTimers.splice(itemIndex, 1);
            console.log(`Cancelled scheduled reminder ID: ${id}`);
        }
    }

    removeTimer(id) {
        this.activeTimers = this.activeTimers.filter(t => t.id !== id);
    }

    triggerBrowserAlert(title, body) {
        if (!this.permissionGranted) {
            console.log(`Notification blocked (no permission). Content: ${title} - ${body}`);
            // Fallback: show inside local custom state banners if page is active
            if (window.appState && typeof window.addNotification === "function") {
                window.addNotification(`[Alert] ${title}: ${body}`);
            }
            return;
        }

        // Try service worker background trigger first
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: "/icon-192.png", // fallback placeholder path
                    badge: "/icon-192.png",
                    vibrate: [200, 100, 200]
                });
            });
        } else {
            // Standard client-side fallback
            try {
                new Notification(title, { body });
            } catch (e) {
                console.error("Notification trigger error, fallback alert:", e);
            }
        }
    }

    // Resynchronize all active tasks & habits reminders
    syncAllReminders(tasks, habits) {
        // Clear all active timers
        this.activeTimers.forEach(t => clearTimeout(t.timer));
        this.activeTimers = [];

        const todayStr = new Date().toISOString().split("T")[0];

        // 1. Schedule Task reminders
        tasks.forEach(t => {
            if (t.status !== "Completed" && t.date === todayStr && t.time) {
                const [hour, min] = t.time.split(":");
                const trigger = new Date();
                trigger.setHours(parseInt(hour), parseInt(min), 0, 0);
                
                // Trigger 5 minutes prior
                const reminderTime = new Date(trigger.getTime() - (5 * 60 * 1000));
                this.scheduleNotification(
                    `task_${t.id}`,
                    `Upcoming Task: ${t.title}`,
                    `Priority: ${t.priority}. Starting in 5 minutes.`,
                    reminderTime
                );
            }
        });

        // 2. Schedule Habit reminders
        habits.forEach(h => {
            const todayCompleted = h.history && h.history.includes(todayStr);
            if (!todayCompleted && h.reminder_time) {
                const [hour, min] = h.reminder_time.split(":");
                const trigger = new Date();
                trigger.setHours(parseInt(hour), parseInt(min), 0, 0);

                this.scheduleNotification(
                    `habit_${h.id}`,
                    `Habit Reminder: ${h.title}`,
                    `Time to check in on your consistency habits.`,
                    trigger
                );
            }
        });
    }
}

// Global Export Singleton
window.notifier = new LocalNotificationService();
