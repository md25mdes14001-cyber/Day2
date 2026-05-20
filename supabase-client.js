// MYDAY2 SUPABASE CLIENT & DATA SYNCRONIZATION ENGINE
// Manages authentication, database updates, real-time subscriptions, and offline caching.

class SupabaseSyncEngine {
    constructor() {
        this.client = null;
        this.userId = null;
        this.isConnected = false;
        this.offlineQueue = [];
        
        // Load settings from localStorage
        this.url = localStorage.getItem("myday2_supabase_url") || "";
        this.anonKey = localStorage.getItem("myday2_supabase_key") || "";
        
        this.init();
        this.setupNetworkListeners();
    }

    init() {
        if (this.url && this.anonKey && window.supabase) {
            try {
                this.client = window.supabase.createClient(this.url, this.anonKey);
                this.isConnected = true;
                console.log("Supabase client initialized successfully.");
            } catch (err) {
                console.error("Failed to initialize Supabase client:", err);
                this.isConnected = false;
            }
        } else {
            console.log("Supabase URL or Key not set. Running in Local-Only Mode.");
            this.isConnected = false;
        }
    }

    updateConfig(url, key) {
        localStorage.setItem("myday2_supabase_url", url);
        localStorage.setItem("myday2_supabase_key", key);
        this.url = url;
        this.anonKey = key;
        this.init();
        return this.isConnected;
    }

    setupNetworkListeners() {
        window.addEventListener("online", () => {
            console.log("Network online. Processing offline queues...");
            this.processOfflineQueue();
        });
    }

    // --- AUTHENTICATION ---
    async signUp(email, password, name) {
        if (!this.isConnected) throw new Error("Database offline. Setup cloud backend first.");
        
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: { name: name }
            }
        });
        if (error) throw error;
        return data;
    }

    async signIn(email, password) {
        if (!this.isConnected) throw new Error("Database offline. Setup cloud backend first.");
        
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        this.userId = data.user?.id;
        return data;
    }

    async signOut() {
        if (this.isConnected) {
            await this.client.auth.signOut();
        }
        this.userId = null;
        localStorage.removeItem("myday2_auth_token");
    }

    async getCurrentUser() {
        if (!this.isConnected) return null;
        const { data: { user }, error } = await this.client.auth.getUser();
        if (error || !user) return null;
        this.userId = user.id;
        return user;
    }

    // --- OFFLINE AND CACHE HANDLING ---
    async queueOrExecute(table, action, data, id) {
        if (!this.isConnected || !navigator.onLine) {
            // Push to local storage queue
            this.offlineQueue.push({ table, action, data, id, timestamp: Date.now() });
            localStorage.setItem("myday2_offline_queue", JSON.stringify(this.offlineQueue));
            console.log(`Action [${action}] queued for offline sync on table [${table}].`);
            return data;
        }
        
        try {
            return await this.executeCloudQuery(table, action, data, id);
        } catch (err) {
            console.error("Cloud query failed. Queuing for retry:", err);
            this.offlineQueue.push({ table, action, data, id, timestamp: Date.now() });
            localStorage.setItem("myday2_offline_queue", JSON.stringify(this.offlineQueue));
            return data;
        }
    }

    async executeCloudQuery(table, action, data, id) {
        if (!this.client) return;

        if (action === "insert") {
            const { data: res, error } = await this.client.from(table).insert([data]).select();
            if (error) throw error;
            return res[0];
        } else if (action === "update") {
            const { data: res, error } = await this.client.from(table).update(data).eq("id", id).select();
            if (error) throw error;
            return res[0];
        } else if (action === "delete") {
            const { error } = await this.client.from(table).delete().eq("id", id);
            if (error) throw error;
            return { id };
        }
    }

    async processOfflineQueue() {
        const queueStr = localStorage.getItem("myday2_offline_queue");
        if (!queueStr) return;
        this.offlineQueue = JSON.parse(queueStr);
        if (this.offlineQueue.length === 0) return;

        console.log(`Found ${this.offlineQueue.length} operations to synchronize.`);

        const succeeded = [];
        for (let op of this.offlineQueue) {
            try {
                await this.executeCloudQuery(op.table, op.action, op.data, op.id);
                succeeded.push(op);
            } catch (err) {
                console.error("Failed to sync item in queue:", err);
                // Keep in queue for next retry
            }
        }

        // Clean out succeeded items
        this.offlineQueue = this.offlineQueue.filter(op => !succeeded.includes(op));
        localStorage.setItem("myday2_offline_queue", JSON.stringify(this.offlineQueue));
        console.log("Offline synchronization run complete.");
    }

    // --- REALTIME SUBSCRIPTIONS ---
    setupRealtimeSubscription(userId, onUpdateCallback) {
        if (!this.isConnected || !this.client) return null;

        console.log(`Subscribing to realtime updates for user ID: ${userId}`);

        const channel = this.client
            .channel('db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public' },
                (payload) => {
                    console.log('Realtime DB Change detected:', payload);
                    onUpdateCallback(payload);
                }
            )
            .subscribe();

        return channel;
    }

    // --- DATA FETCHER LOGIC ---
    async fetchUserData() {
        if (!this.isConnected || !this.client) return null;
        
        try {
            const user = await this.getCurrentUser();
            if (!user) return null;

            // Load all tables in parallel
            const [tasksRes, habitsRes, goalsRes, eventsRes, completionsRes, insightsRes] = await Promise.all([
                this.client.from("tasks").select("*"),
                this.client.from("habits").select("*"),
                this.client.from("goals").select("*"),
                this.client.from("calendar_events").select("*"),
                this.client.from("habit_completions").select("*"),
                this.client.from("ai_insights").select("*")
            ]);

            return {
                user: {
                    id: user.id,
                    name: user.user_metadata?.name || "User",
                    email: user.email
                },
                tasks: tasksRes.data || [],
                habits: habitsRes.data || [],
                goals: goalsRes.data || [],
                events: eventsRes.data || [],
                completions: completionsRes.data || [],
                insights: insightsRes.data || []
            };
        } catch (err) {
            console.error("Failed to fetch user cloud data:", err);
            return null;
        }
    }
}

// Global Export Singleton
window.dbEngine = new SupabaseSyncEngine();
