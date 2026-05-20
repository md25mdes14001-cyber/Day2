// MYDAY2 GEMINI AI PLANNING AND RECOMMENDATION ENGINE
// Handles goal decomposition, daily time-blocking, subtask generation, and weekly evaluations.

class GeminiPlanner {
    constructor() {
        this.apiKey = localStorage.getItem("myday2_gemini_key") || "";
        this.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    }

    updateConfig(key) {
        localStorage.setItem("myday2_gemini_key", key);
        this.apiKey = key;
    }

    async queryGemini(prompt, systemInstruction = "", formatJson = true) {
        if (!this.apiKey) {
            console.log("No Gemini API Key found. Running local mock planner.");
            return this.getMockFallback(prompt);
        }

        const url = `${this.endpoint}?key=${this.apiKey}`;
        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: formatJson ? { responseMimeType: "application/json" } : {}
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API Error (${response.status}): ${errText}`);
        }

        const result = await response.json();
        const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (formatJson) {
            try {
                return JSON.parse(outputText);
            } catch (e) {
                console.error("Failed to parse Gemini output as JSON:", outputText);
                throw new Error("Invalid structured JSON returned from AI.");
            }
        }
        
        return outputText;
    }

    // --- MOCK PLANNER FALLBACKS FOR INSTANT OUT-OF-BOX TRIAL ---
    getMockFallback(prompt) {
        const lower = prompt.toLowerCase();
        
        if (lower.includes("decompose") || lower.includes("fit")) {
            return {
                milestones: ["Cardio building & base metrics", "Strength development & diet config", "Peak cardiovascular testing"],
                habits: ["Drink 3L of water", "Morning walk (20m)", "Strength workout"],
                tasks: ["Audit running shoes", "Plan weekly meal splits", "Cardio capacity test"],
                schedule_suggestions: ["Schedule morning cardio at 08:00 AM", "Block strength workouts on Mon/Wed/Fri at 05:00 PM"]
            };
        }
        
        if (lower.includes("subtask") || lower.includes("split")) {
            return {
                subtasks: ["Initial information discovery", "Outline core outline slide decks", "Draft slides", "Team final alignment"],
                estimated_duration: 90
            };
        }
        
        if (lower.includes("daily") || lower.includes("schedule")) {
            return {
                schedule: [
                    { time: "09:00", title: "Morning Deep Work slot", duration: 90 },
                    { time: "11:00", title: "Sync call & administrative clears", duration: 45 },
                    { time: "15:00", title: "Afternoon work blocks", duration: 60 }
                ],
                focusPriorities: ["Strategic outline cleardown", "Client strategy deck updates"]
            };
        }

        if (lower.includes("review") || lower.includes("weekly")) {
            return {
                summary: "Overall stable execution. Balanced streaks on routine habits.",
                consistencyScore: 82,
                burnoutWarning: "Safe cognitive load. Sleep hours align with focus sessions.",
                improvements: ["Protect 9 AM deep work slot", "Move administrative syncs to late afternoon"]
            };
        }
        
        return {
            text: "Please enter your Google Gemini API Key in System Preferences to unlock real-time intelligence algorithms."
        };
    }

    // --- AI ACTIONS HANDLERS ---
    async decomposeGoal(goalTitle, timeline) {
        const prompt = `Decompose this goal: "${goalTitle}" with a timeline of "${timeline}". 
        Return a JSON object containing:
        - "milestones" (array of strings, exactly 3 milestones)
        - "habits" (array of strings, e.g. "Meditation 10m")
        - "tasks" (array of strings, immediate actionable tasks)
        - "schedule_suggestions" (array of strings, scheduling slot times)`;
        
        const system = "You are a professional life operating planner. Output strictly structured JSON conforming to the request.";
        return await this.queryGemini(prompt, system);
    }

    async splitTask(taskTitle) {
        const prompt = `Split this task: "${taskTitle}" into smaller executable parts. 
        Return a JSON object with:
        - "subtasks" (array of strings, max 5 items)
        - "estimated_duration" (integer in minutes)`;

        const system = "Act as an executive task balancer. Output structured JSON.";
        return await this.queryGemini(prompt, system);
    }

    async suggestDailyTimeline(tasks, habits, focusWindow) {
        const prompt = `Plan a daily schedule. Focus window is ${focusWindow}. 
        Tasks to schedule: ${JSON.stringify(tasks)}. 
        Habits to stack: ${JSON.stringify(habits)}.
        Return a JSON object containing:
        - "schedule" (array of objects with "time" e.g. "09:00", "title" e.g. "Task title", "duration" in minutes)
        - "focusPriorities" (array of strings, max 3 main priorities)`;

        const system = "Generate an optimized chronological calendar block. Output structured JSON.";
        return await this.queryGemini(prompt, system);
    }

    async calculateBurnoutIndex(tasks, sleepHours) {
        const prompt = `Assess cognitive strain for a user who sleeps ${sleepHours} hours and has these active tasks: ${JSON.stringify(tasks)}. 
        Return a JSON object containing:
        - "burnoutIndex" (integer between 0 and 100)
        - "burnoutStatus" (string, either 'Safe', 'Moderate', or 'High Risk')
        - "advice" (string, short actionable recovery recommendation)`;

        const system = "Analyze workload strain and fatigue indicators. Output structured JSON.";
        return await this.queryGemini(prompt, system);
    }

    async generateWeeklyReview(completions, tasks, goals) {
        const prompt = `Perform a weekly performance review. Completed habits logs: ${JSON.stringify(completions)}. Tasks: ${JSON.stringify(tasks)}. Goals: ${JSON.stringify(goals)}.
        Return a JSON object containing:
        - "summary" (string summary of performance)
        - "consistencyScore" (integer 0-100)
        - "burnoutWarning" (string warning description)
        - "improvements" (array of strings of suggested adjustments)`;

        const system = "Synthesize performance metrics into clean action pointers. Output structured JSON.";
        return await this.queryGemini(prompt, system);
    }
}

// Global Export Singleton
window.aiEngine = new GeminiPlanner();
